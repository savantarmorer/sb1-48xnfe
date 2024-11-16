import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Timer, Trophy, XCircle } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import Confetti from 'react-confetti';

interface Question {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Qual é o princípio fundamental que garante a inviolabilidade do direito à vida na Constituição Federal?',
    answers: [
      'Artigo 5º, caput',
      'Artigo 1º, III',
      'Artigo 3º, IV',
      'Artigo 4º, II'
    ],
    correctAnswer: 0
  },
  {
    id: '2',
    question: 'O que caracteriza o Estado Democrático de Direito segundo a Constituição Federal?',
    answers: [
      'Apenas a soberania popular',
      'Somente a separação dos poderes',
      'A união indissolúvel dos Estados e Municípios',
      'A dignidade da pessoa humana e a cidadania'
    ],
    correctAnswer: 3
  },
  {
    id: '3',
    question: 'Qual é o prazo para impetração do Mandado de Segurança?',
    answers: [
      '120 dias',
      '90 dias',
      '60 dias',
      '30 dias'
    ],
    correctAnswer: 0
  }
];

interface BattleModeProps {
  onClose: () => void;
}

export default function BattleMode({ onClose }: BattleModeProps) {
  const { dispatch } = useGame();
  const { t } = useLanguage();
  const [battleState, setBattleState] = useState<'searching' | 'ready' | 'battle' | 'completed'>('searching');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (battleState === 'searching') {
      const timer = setTimeout(() => {
        setBattleState('ready');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [battleState]);

  useEffect(() => {
    if (battleState === 'ready') {
      const timer = setTimeout(() => {
        setBattleState('battle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [battleState]);

  useEffect(() => {
    if (battleState === 'battle') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(-1);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [battleState]);

  const handleAnswer = (answerIndex: number) => {
    const correct = answerIndex === SAMPLE_QUESTIONS[currentQuestion].correctAnswer;
    
    if (correct) {
      dispatch({
        type: 'ADD_XP',
        payload: {
          amount: 50,
          reason: t('battle.correctAnswer')
        }
      });
    }

    setScore(prev => ({
      ...prev,
      player: prev.player + (correct ? 1 : 0),
      opponent: prev.opponent + (Math.random() > 0.5 ? 1 : 0)
    }));

    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setBattleState('completed');
      if (score.player > score.opponent) {
        setShowConfetti(true);
      }
    }
  };

  const handleComplete = () => {
    const xpEarned = score.player * 50;
    const coinsEarned = score.player * 20;
    const won = score.player > score.opponent;
    
    if (won) {
      dispatch({
        type: 'ADD_XP',
        payload: {
          amount: xpEarned + 100,
          reason: t('battle.victoryBonus')
        }
      });
      dispatch({ type: 'ADD_COINS', payload: coinsEarned + 50 });
    } else {
      dispatch({
        type: 'ADD_XP',
        payload: {
          amount: xpEarned,
          reason: t('battle.participation')
        }
      });
      dispatch({ type: 'ADD_COINS', payload: coinsEarned });
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4"
        >
          {battleState === 'searching' && (
            <div className="text-center py-8">
              <Swords size={48} className="mx-auto mb-4 text-brand-teal-500 dark:text-brand-teal-400 animate-pulse" />
              <h2 className="heading text-2xl mb-2">{t('battle.searching')}</h2>
              <p className="text-muted">{t('battle.searchingDesc')}</p>
            </div>
          )}

          {battleState === 'ready' && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="heading text-4xl text-brand-teal-600 dark:text-brand-teal-400">
                  {t('battle.getReady')}
                </h2>
              </motion.div>
            </div>
          )}

          {battleState === 'battle' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {score.player} - {score.opponent}
                </div>
                <div className="flex items-center space-x-2 text-lg">
                  <Timer className="text-red-500" />
                  <span className="text-gray-900 dark:text-white">{timeLeft}s</span>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {SAMPLE_QUESTIONS[currentQuestion].question}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {SAMPLE_QUESTIONS[currentQuestion].answers.map((answer, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-brand-teal-50 hover:border-brand-teal-300 dark:hover:bg-brand-teal-900/20 dark:hover:border-brand-teal-700 transition-colors text-gray-900 dark:text-white"
                    >
                      {answer}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {battleState === 'completed' && (
            <div className="text-center py-8">
              {score.player > score.opponent ? (
                <>
                  <Trophy size={48} className="mx-auto mb-4 text-yellow-500" />
                  <h2 className="heading text-3xl text-yellow-500 mb-4">{t('battle.victory')}</h2>
                </>
              ) : (
                <>
                  <XCircle size={48} className="mx-auto mb-4 text-gray-500 dark:text-gray-400" />
                  <h2 className="heading text-3xl mb-4">{t('battle.defeat')}</h2>
                </>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="bg-white/10 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                    {t('battle.results.title')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">{t('battle.correctAnswers')}:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{score.player}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">{t('battle.xpGained')}:</span>
                      <span className="font-bold text-brand-teal-600 dark:text-brand-teal-400">
                        +{score.player * 50} XP
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">{t('battle.coinsGained')}:</span>
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        +{score.player * 20}
                      </span>
                    </div>
                  </div>
                </div>

                {score.player === SAMPLE_QUESTIONS.length && (
                  <div className="bg-yellow-500/10 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 text-yellow-600 dark:text-yellow-400">
                      {t('achievements.perfectScholar.title')}
                    </h3>
                    <p className="text-sm text-muted">
                      {t('achievements.perfectScholar.description')}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="text-brand-teal-600 dark:text-brand-teal-400">+500 XP</span>
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="btn btn-primary"
              >
                {t('common.continue')}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}