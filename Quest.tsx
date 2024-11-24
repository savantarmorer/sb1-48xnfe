import React from 'react';
import { Quest, QuestStatus, QuestType } from '../types/game';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const QuestCard = styled(Card)<{ status: QuestStatus }>(({ theme, status }) => ({
  border: `2px solid ${
    {
      available: theme.palette.info.main,
      in_progress: theme.palette.warning.main,
      completed: theme.palette.success.main,
      failed: theme.palette.error.main,
      expired: theme.palette.grey[500],
    }[status]
  }`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StatusChip = styled(Chip)<{ status: QuestStatus }>(({ theme, status }) => ({
  backgroundColor: {
    available: theme.palette.info.main,
    in_progress: theme.palette.warning.main,
    completed: theme.palette.success.main,
    failed: theme.palette.error.main,
    expired: theme.palette.grey[500],
  }[status],
  color: theme.palette.getContrastText(
    {
      available: theme.palette.info.main,
      in_progress: theme.palette.warning.main,
      completed: theme.palette.success.main,
      failed: theme.palette.error.main,
      expired: theme.palette.grey[500],
    }[status]
  ),
}));

interface QuestProgressProps {
  current: number;
  target: number;
}

const QuestProgress: React.FC<QuestProgressProps> = ({ current, target }) => {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {current}/{target}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

interface QuestRewardsProps {
  xp: number;
  coins: number;
}

const QuestRewards: React.FC<QuestRewardsProps> = ({ xp, coins }) => (
  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
    <Chip
      label={`${xp} XP`}
      size="small"
      color="primary"
    />
    <Chip
      label={`${coins} Coins`}
      size="small"
      color="secondary"
    />
  </Stack>
);

interface QuestComponentProps {
  quest: Quest;
  onAccept?: (quest: Quest) => void;
  onAbandon?: (quest: Quest) => void;
}

export const QuestComponent: React.FC<QuestComponentProps> = ({
  quest,
  onAccept,
  onAbandon,
}) => {
  const totalProgress = quest.requirements.reduce(
    (acc, req) => acc + (req.current / req.target) * 100,
    0
  ) / quest.requirements.length;

  return (
    <QuestCard status={quest.status}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            {quest.title}
          </Typography>
          <StatusChip
            label={quest.status.replace('_', ' ')}
            size="small"
            status={quest.status}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {quest.description}
        </Typography>

        <Stack spacing={2}>
          {quest.requirements.map((req, index) => (
            <Box key={index}>
              <Typography variant="body2" color="text.secondary">
                {req.type === QuestType.BATTLE && 'Win Battles'}
                {req.type === QuestType.STUDY && 'Study Time'}
                {req.type === QuestType.ACHIEVEMENT && 'Unlock Achievements'}
                {req.type === QuestType.STREAK && 'Maintain Streak'}
                {req.type === QuestType.COLLECTION && 'Collect Items'}
                {req.type === QuestType.SOCIAL && 'Social Actions'}
              </Typography>
              <QuestProgress current={req.current} target={req.target} />
            </Box>
          ))}
        </Stack>

        <QuestRewards xp={quest.rewards.xp} coins={quest.rewards.coins} />

        {quest.status === QuestStatus.AVAILABLE && onAccept && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => onAccept(quest)}
          >
            Accept Quest
          </Button>
        )}

        {quest.status === QuestStatus.IN_PROGRESS && onAbandon && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => onAbandon(quest)}
          >
            Abandon Quest
          </Button>
        )}

        {quest.expiresAt && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Expires: {new Date(quest.expiresAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </QuestCard>
  );
};
