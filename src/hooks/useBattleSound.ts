import { useSound } from 'use-sound';
import { useCallback } from 'react';
import { useSound as useSoundContext } from '../contexts/SoundContext';

export function useBattleSound() {
  const { volume, isMuted } = useSoundContext();
  
  const effectiveVolume = isMuted ? 0 : volume;

  const [playCorrect] = useSound('/sounds/correct.mp3', { volume: effectiveVolume * 0.5 });
  const [playWrong] = useSound('/sounds/wrong.mp3', { volume: effectiveVolume * 0.5 });
  const [playVictory] = useSound('/sounds/victory.mp3', { volume: effectiveVolume * 0.7 });
  const [playDefeat] = useSound('/sounds/defeat.mp3', { volume: effectiveVolume * 0.7 });
  const [playTick] = useSound('/sounds/tick.mp3', { volume: effectiveVolume * 0.3 });
  const [playStart] = useSound('/sounds/battle-start.mp3', { volume: effectiveVolume * 0.6 });

  const playSound = useCallback((type: 'correct' | 'wrong' | 'victory' | 'defeat' | 'tick' | 'start') => {
    if (isMuted) return;
    
    switch (type) {
      case 'correct':
        playCorrect();
        break;
      case 'wrong':
        playWrong();
        break;
      case 'victory':
        playVictory();
        break;
      case 'defeat':
        playDefeat();
        break;
      case 'tick':
        playTick();
        break;
      case 'start':
        playStart();
        break;
    }
  }, [playCorrect, playWrong, playVictory, playDefeat, playTick, playStart, isMuted]);

  return { playSound };
} 

