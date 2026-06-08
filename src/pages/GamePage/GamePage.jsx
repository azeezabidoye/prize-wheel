import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useWheel } from '../../hooks/useWheel';
import Wheel from '../../components/Wheel/Wheel';
import Pointer from '../../components/Pointer/Pointer';
import Modal from '../../components/Modal/Modal';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import styles from './GamePage.module.css';

export default function GamePage() {
  const { userName, setSpinResult, setModalOpen } = useApp();
  const { rotation, isSpinning, spin } = useWheel();
  const navigate = useNavigate();

  // Redirect to home if no name (e.g. hard refresh)
  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  }, [userName, navigate]);

  const handleBack = () => {
    setSpinResult(null);
    setModalOpen(false);
    navigate('/');
  };

  if (!userName) return null;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className={styles.title}>🎡 Prize Wheel</h1>
        <div className={styles.headerRight}>
          <span className={styles.playerBadge}>👤 {userName}</span>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main game area ── */}
      <main className={styles.main}>
        <div className={styles.wheelArea}>
          {/* Fixed pointer sits above the wheel */}
          <Pointer />
          <Wheel rotation={rotation} isSpinning={isSpinning} onSpin={spin} />
        </div>

        <p className={`${styles.hint} ${isSpinning ? styles.hintSpinning : ''}`}>
          {isSpinning
            ? '🌀 Spinning… good luck!'
            : 'Tap SPIN in the centre of the wheel!'}
        </p>
      </main>

      <Modal />
    </div>
  );
}
