import { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  selectWinner,
  findWinningSegmentIndex,
  calculateTargetRotation,
  isVoidResult,
} from '../utils/wheelLogic';
import { SPIN_DURATION } from '../utils/constants';

export function useWheel() {
  const { isSpinning, setIsSpinning, setSpinResult, setModalOpen } = useApp();
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const timerRef    = useRef(null);

  const spin = useCallback(() => {
    if (isSpinning) return;

    // Determine outcome BEFORE animation
    const winner       = selectWinner();
    const segmentIndex = findWinningSegmentIndex(winner);
    const target       = calculateTargetRotation(segmentIndex, rotationRef.current);

    rotationRef.current = target;
    setIsSpinning(true);
    setRotation(target);

    // Resolve after CSS transition finishes
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsSpinning(false);

      if (isVoidResult(target)) {
        setSpinResult({ isVoid: true, prize: null });
      } else {
        setSpinResult({ isVoid: false, prize: winner });
      }

      setModalOpen(true);
    }, SPIN_DURATION + 150);
  }, [isSpinning, setIsSpinning, setSpinResult, setModalOpen]);

  return { rotation, isSpinning, spin };
}
