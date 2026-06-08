import { useMemo } from 'react';
import { SEGMENTS, WHEEL_SIZE, SPIN_DURATION } from '../../utils/constants';
import styles from './Wheel.module.css';

const CX = WHEEL_SIZE / 2;
const CY = WHEEL_SIZE / 2;
const R  = WHEEL_SIZE / 2 - 14; // segment radius
const N  = SEGMENTS.length;
const SEG_ANGLE = (2 * Math.PI) / N;

/** SVG arc path for segment i */
function segmentPath(i) {
  const start = -Math.PI / 2 + i * SEG_ANGLE;
  const end   = start + SEG_ANGLE;
  const x1 = CX + R * Math.cos(start);
  const y1 = CY + R * Math.sin(start);
  const x2 = CX + R * Math.cos(end);
  const y2 = CY + R * Math.sin(end);
  const large = SEG_ANGLE > Math.PI ? 1 : 0;
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

/** Luminance-based contrast: white on dark, dark on bright */
function contrastColor(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#222' : '#fff';
}

export default function Wheel({ rotation, isSpinning, onSpin }) {
  const segments = useMemo(() =>
    SEGMENTS.map((seg, i) => {
      const midAngle  = -Math.PI / 2 + (i + 0.5) * SEG_ANGLE;
      const textR     = R * 0.64;
      const tx        = CX + textR * Math.cos(midAngle);
      const ty        = CY + textR * Math.sin(midAngle);
      const rotateDeg = (midAngle * 180) / Math.PI + 90;
      const fontSize  = seg.label.length > 10 ? 9 : seg.label.length > 7 ? 10.5 : 12;
      return { ...seg, path: segmentPath(i), tx, ty, rotateDeg, fontSize, fill: contrastColor(seg.color) };
    }),
  []);

  return (
    <div className={styles.outerContainer}>
      {/* Decorative glow ring */}
      <div className={`${styles.glowRing} ${isSpinning ? styles.spinning : ''}`} />

      {/* Rotating wheel disc */}
      <div
        className={styles.wheelDisc}
        style={{
          transform:  `rotate(${rotation}deg)`,
          transition: isSpinning
            ? `transform ${SPIN_DURATION / 1000}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`
            : 'none',
        }}
      >
        <svg
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          className={styles.svg}
        >
          {/* Metallic outer ring */}
          <circle cx={CX} cy={CY} r={R + 12} fill="url(#outerRing)" />
          <circle cx={CX} cy={CY} r={R + 6}  fill="#1a1a2e" />

          {/* Segments */}
          {segments.map((seg, i) => (
            <g key={i}>
              <path d={seg.path} fill={seg.color} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <text
                x={seg.tx}
                y={seg.ty}
                fill={seg.fill}
                fontSize={seg.fontSize}
                fontWeight="700"
                fontFamily="Inter, Arial, sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${seg.rotateDeg}, ${seg.tx}, ${seg.ty})`}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {seg.label}
              </text>
            </g>
          ))}

          {/* Spoke dividers */}
          {SEGMENTS.map((_, i) => {
            const angle = -Math.PI / 2 + i * SEG_ANGLE;
            return (
              <line
                key={`spoke-${i}`}
                x1={CX}
                y1={CY}
                x2={CX + R * Math.cos(angle)}
                y2={CY + R * Math.sin(angle)}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
              />
            );
          })}

          {/* Center hub */}
          <circle cx={CX} cy={CY} r={46} fill="#0d0d1a" />
          <circle cx={CX} cy={CY} r={42} fill="url(#hubGrad)" />
          <circle cx={CX} cy={CY} r={38} fill="#1a1a2e" />

          {/* SVG Gradients */}
          <defs>
            <radialGradient id="outerRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#4a4a7a" />
              <stop offset="60%"  stopColor="#2a2a5a" />
              <stop offset="100%" stopColor="#1a1a3a" />
            </radialGradient>
            <radialGradient id="hubGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4c0fa0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Spin button — fixed center, does NOT rotate */}
      <button
        className={`${styles.spinBtn} ${isSpinning ? styles.spinBtnActive : ''}`}
        onClick={onSpin}
        disabled={isSpinning}
        aria-label="Spin the wheel"
      >
        {isSpinning ? (
          <span className={styles.spinDots}>●●●</span>
        ) : (
          'SPIN'
        )}
      </button>
    </div>
  );
}
