import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className={styles.track}>
        <span className={`${styles.thumb} ${isDark ? styles.dark : styles.light}`}>
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
      <span className={styles.label}>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
