import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import styles from './VersionSelectModal.module.css';

const VERSIONS = [
  {
    id: 'multi',
    icon: '🔄',
    title: 'Free Play',
    tagline: 'Unlimited spins',
    description: 'Spin as many times as you like. Use the Back button whenever you\'re done.',
    accent: '#7c3aed',
  },
  {
    id: 'single',
    icon: '⚡',
    title: 'One-Shot',
    tagline: 'One spin only',
    description: 'You get exactly one spin. After claiming your result you\'re automatically signed out.',
    accent: '#db2777',
  },
];

export default function VersionSelectModal({ onClose }) {
  const { userName, setGameVersion } = useApp();
  const navigate    = useNavigate();
  const overlayRef  = useRef(null);

  const handleSelect = (versionId) => {
    setGameVersion(versionId);
    navigate('/game');
  };

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Escape → cancel selection, stay on homepage
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="vsm-title">
        <button className={styles.closeX} onClick={onClose} aria-label="Cancel">✕</button>

        <div className={styles.header}>
          <span className={styles.headerIcon}>🎮</span>
          <h2 id="vsm-title" className={styles.title}>Choose Your Mode</h2>
          <p className={styles.subtitle}>
            Welcome, <strong className={styles.name}>{userName}</strong>! Pick how you'd like to play:
          </p>
        </div>

        <div className={styles.cards}>
          {VERSIONS.map((v) => (
            <button
              key={v.id}
              className={styles.card}
              style={{ '--card-accent': v.accent }}
              onClick={() => handleSelect(v.id)}
            >
              <span className={styles.cardIcon}>{v.icon}</span>
              <span className={styles.cardTitle}>{v.title}</span>
              <span className={styles.cardTagline}>{v.tagline}</span>
              <span className={styles.cardDesc}>{v.description}</span>
              <span className={styles.selectHint}>Select →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
