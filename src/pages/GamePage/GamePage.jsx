import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useWheel } from '../../hooks/useWheel';
import Wheel from '../../components/Wheel/Wheel';
import Pointer from '../../components/Pointer/Pointer';
import Modal from '../../components/Modal/Modal';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import styles from './GamePage.module.css';

const MODE_META = {
  multi:  { label: '🔄 Free Play',  cls: 'badgeMulti'  },
  single: { label: '⚡ One-Shot',   cls: 'badgeSingle' },
};

export default function GamePage() {
  const { userName, gameVersion, resetSession } = useApp();
  const { rotation, isSpinning, spin } = useWheel();
  const navigate = useNavigate();

  // Redirect if session is not initialised (e.g. hard refresh)
  useEffect(() => {
    if (!userName || !gameVersion) navigate('/', { replace: true });
  }, [userName, gameVersion, navigate]);

  const handleBack = () => {
    resetSession();
    navigate('/');
  };

  if (!userName || !gameVersion) return null;

  const mode = MODE_META[gameVersion];

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className={styles.title}>🎡 Prize Wheel</h1>
        <div className={styles.headerRight}>
          <span className={`${styles.modeBadge} ${styles[mode.cls]}`}>{mode.label}</span>
          <span className={styles.playerBadge}>👤 {userName}</span>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main game area ── */}
      <main className={styles.main}>
        <div className={styles.wheelArea}>
          <Pointer />
          <Wheel rotation={rotation} isSpinning={isSpinning} onSpin={spin} />
        </div>

        <p className={`${styles.hint} ${isSpinning ? styles.hintSpinning : ''}`}>
          {isSpinning
            ? '🌀 Spinning… good luck!'
            : gameVersion === 'single'
              ? '⚡ One spin — make it count!'
              : 'Tap SPIN in the centre of the wheel!'}
        </p>
      </main>

      <Modal />
    </div>
  );
}
