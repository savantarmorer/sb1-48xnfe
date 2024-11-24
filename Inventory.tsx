import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { GameItem, ItemType, ItemRarity } from '../types/items';
import { Box, Grid, Typography, Button, Card, CardContent, CardActions, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const RarityChip = styled(Chip)<{ rarity: ItemRarity }>(({ theme, rarity }) => ({
  backgroundColor: {
    common: theme.palette.grey[300],
    uncommon: theme.palette.success.light,
    rare: theme.palette.info.light,
    epic: theme.palette.warning.light,
    legendary: theme.palette.error.light,
  }[rarity],
  color: theme.palette.getContrastText(
    {
      common: theme.palette.grey[300],
      uncommon: theme.palette.success.light,
      rare: theme.palette.info.light,
      epic: theme.palette.warning.light,
      legendary: theme.palette.error.light,
    }[rarity]
  ),
}));

const ItemCard = styled(Card)<{ rarity: ItemRarity }>(({ theme, rarity }) => ({
  border: `2px solid ${
    {
      common: theme.palette.grey[300],
      uncommon: theme.palette.success.light,
      rare: theme.palette.info.light,
      epic: theme.palette.warning.light,
      legendary: theme.palette.error.light,
    }[rarity]
  }`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

interface ItemCardProps {
  item: GameItem;
  quantity: number;
  isEquipped?: boolean;
  onUse: (item: GameItem) => void;
  onEquip: (item: GameItem) => void;
  onUnequip: (item: GameItem) => void;
}

const InventoryItemCard: React.FC<ItemCardProps> = ({
  item,
  quantity,
  isEquipped,
  onUse,
  onEquip,
  onUnequip,
}) => {
  return (
    <ItemCard rarity={item.rarity}>
      <CardContent>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>
        <Box display="flex" gap={1} mb={1}>
          <RarityChip label={item.rarity} size="small" rarity={item.rarity} />
          <Chip label={item.type} size="small" />
          {isEquipped && <Chip label="Equipped" color="primary" size="small" />}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Quantity: {quantity}
        </Typography>
      </CardContent>
      <CardActions>
        {item.type === ItemType.CONSUMABLE && (
          <Button size="small" onClick={() => onUse(item)}>
            Use
          </Button>
        )}
        {(item.type === ItemType.EQUIPMENT || item.type === ItemType.COSMETIC) && (
          isEquipped ? (
            <Button size="small" onClick={() => onUnequip(item)}>
              Unequip
            </Button>
          ) : (
            <Button size="small" onClick={() => onEquip(item)}>
              Equip
            </Button>
          )
        )}
      </CardActions>
    </ItemCard>
  );
};

export const Inventory: React.FC = () => {
  const {
    inventory,
    activeEffects,
    useItem,
    equipItem,
    unequipItem,
  } = useInventory();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      
      {activeEffects.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Active Effects
          </Typography>
          <Box display="flex" gap={1}>
            {activeEffects.map((effect, index) => (
              <Chip
                key={index}
                label={`${effect.type}: ${effect.value}x`}
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}

      <Grid container spacing={2}>
        {inventory.map(({ item, quantity, isEquipped }) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <InventoryItemCard
              item={item}
              quantity={quantity}
              isEquipped={isEquipped}
              onUse={useItem}
              onEquip={equipItem}
              onUnequip={unequipItem}
            />
          </Grid>
        ))}
      </Grid>

      {inventory.length === 0 && (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Your inventory is empty
        </Typography>
      )}
    </Box>
  );
};
