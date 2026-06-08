import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { triggerWinConfetti, triggerStickerConfetti } from '../../animations/confetti';
import styles from './Modal.module.css';

const PRIZE_EMOJIS = {
  'Fhenix Package': '🎁',
  'T-Shirt':        '👕',
  'Notebook':       '📓',
  'Tote Bag':       '👜',
  'Face Cap':       '🧢',
  'Sticker':        '🏷️',
  'Try Again':      '😅',
};

export default function Modal() {
  const { modalOpen, setModalOpen, spinResult, userName } = useApp();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!modalOpen || !spinResult) return;

    const { isVoid, prize } = spinResult;
    if (!isVoid) {
      if (prize === 'Sticker') triggerStickerConfetti();
      else if (prize !== 'Try Again') triggerWinConfetti();
    }
  }, [modalOpen, spinResult]);

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handle = (e) => { if (e.key === 'Escape') setModalOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [modalOpen, setModalOpen]);

  if (!modalOpen || !spinResult) return null;

  const { isVoid, prize } = spinResult;
  const isTryAgain = prize === 'Try Again';
  const isBigWin   = !isVoid && !isTryAgain && prize !== 'Sticker';

  const handleClose = () => setModalOpen(false);
  const handleOverlay = (e) => { if (e.target === overlayRef.current) handleClose(); };

  /* ── Void ── */
  if (isVoid) {
    return (
      <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
        <div className={`${styles.modal} ${styles.void}`}>
          <div className={styles.icon}>⚠️</div>
          <h2 className={styles.title}>Void!</h2>
          <p className={styles.subtitle}>The arrow landed on a boundary line.</p>
          <p className={styles.message}>No prize awarded — please try again!</p>
          <button className={`${styles.actionBtn} ${styles.retryBtn}`} onClick={handleClose}>
            Spin Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Try Again ── */
  if (isTryAgain) {
    return (
      <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
        <div className={`${styles.modal} ${styles.tryAgain}`}>
          <button className={styles.closeX} onClick={handleClose} aria-label="Close">✕</button>
          <div className={styles.icon}>😅</div>
          <h2 className={styles.title}>Not This Time!</h2>
          <p className={styles.playerName}>{userName}</p>
          <p className={styles.message}>Better luck on your next spin!</p>
          <button className={`${styles.actionBtn} ${styles.retryBtn}`} onClick={handleClose}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Winner ── */
  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={`${styles.modal} ${styles.winner} ${isBigWin ? styles.bigWin : ''}`}>
        <button className={styles.closeX} onClick={handleClose} aria-label="Close">✕</button>

        {/* Flashing border for big wins */}
        {isBigWin && <div className={styles.flashRing} />}

        <div className={`${styles.icon} ${styles.bouncing}`}>
          {PRIZE_EMOJIS[prize] ?? '🎉'}
        </div>
        <div className={styles.congratsBanner}>
          <span className={styles.starsLeft}>✨</span>
          <h2 className={`${styles.title} ${isBigWin ? styles.rainbow : ''}`}>Congratulations!</h2>
          <span className={styles.starsRight}>✨</span>
        </div>
        <p className={styles.playerName}>{userName}</p>
        <p className={styles.wonLabel}>You won a</p>
        <div className={`${styles.prizeBox} ${isBigWin ? styles.prizeBoxBig : ''}`}>
          {prize}
        </div>

        <button className={`${styles.actionBtn} ${styles.claimBtn}`} onClick={handleClose}>
          Awesome! 🎊
        </button>
      </div>
    </div>
  );
}
