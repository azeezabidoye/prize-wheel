import styles from './Pointer.module.css';

export default function Pointer() {
  return (
    <div className={styles.pointerWrapper}>
      <svg
        viewBox="0 0 48 56"
        width="48"
        height="56"
        className={styles.arrow}
        aria-hidden="true"
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer arrow shape */}
        <polygon
          points="24,52 4,8 44,8"
          fill="#c0392b"
          filter="url(#shadow)"
        />
        {/* Inner highlight */}
        <polygon
          points="24,44 10,12 38,12"
          fill="#e74c3c"
        />
        {/* Tip gleam */}
        <ellipse cx="24" cy="46" rx="4" ry="3" fill="#ff6b6b" opacity="0.7" />
      </svg>
    </div>
  );
}
