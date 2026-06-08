import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import Button from '../../components/Button/Button';
import VersionSelectModal from '../../components/VersionSelectModal/VersionSelectModal';
import styles from './HomePage.module.css';

const PRIZE_LIST = [
  { emoji: '🎁', label: 'Fhenix Package' },
  { emoji: '👕', label: 'T-Shirt' },
  { emoji: '📓', label: 'Notebook' },
  { emoji: '👜', label: 'Tote Bag' },
  { emoji: '🧢', label: 'Face Cap' },
  { emoji: '🏷️', label: 'Sticker' },
];

export default function HomePage() {
  const [name,             setName]             = useState('');
  const [error,            setError]            = useState('');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const { setUserName, resetSession }           = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue!');
      return;
    }
    setUserName(trimmed);
    setShowVersionModal(true);
  };

  const handleVersionModalClose = () => {
    // User cancelled version selection — clear the name we just set
    resetSession();
    setShowVersionModal(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.toggleRow}>
        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.wheelEmoji}>🎡</div>
        <h1 className={styles.title}>Spin the Wheel</h1>
        <p className={styles.subtitle}>
          Enter your name and test your luck — amazing prizes are waiting!
        </p>
      </div>

      {/* Entry form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="player-name" className={styles.label}>
            Your Name
          </label>
          <input
            id="player-name"
            type="text"
            value={name}
            maxLength={50}
            autoComplete="name"
            autoFocus
            placeholder="e.g. Alex"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            onChange={(e) => { setName(e.target.value); setError(''); }}
          />
          {error && <p className={styles.errorMsg} role="alert">{error}</p>}
        </div>

        <Button type="submit" variant="primary" className={styles.playBtn}>
          Play Now 🎮
        </Button>
      </form>

      {/* Prize showcase */}
      <section className={styles.prizes} aria-label="Available prizes">
        <h2 className={styles.prizesHeading}>Prizes Up for Grabs</h2>
        <div className={styles.prizeGrid}>
          {PRIZE_LIST.map(({ emoji, label }) => (
            <div key={label} className={styles.prizeCard}>
              <span className={styles.prizeEmoji}>{emoji}</span>
              <span className={styles.prizeLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Version selection modal — shown after name is validated */}
      {showVersionModal && (
        <VersionSelectModal onClose={handleVersionModalClose} />
      )}
    </div>
  );
}
