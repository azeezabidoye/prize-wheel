import { SEGMENTS, MIN_EXTRA_ROTATIONS, MAX_EXTRA_ROTATIONS, VOID_THRESHOLD } from './constants';
import { PRIZE_WEIGHTS } from './probabilities';

/**
 * Weighted random prize selection.
 * Outcome is determined BEFORE the wheel animation starts.
 */
export function selectWinner() {
  const total = Object.values(PRIZE_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  for (const [prize, weight] of Object.entries(PRIZE_WEIGHTS)) {
    rand -= weight;
    if (rand <= 0) return prize;
  }
  return 'Sticker'; // fallback
}

/**
 * Among all segments showing the winning label, pick one randomly.
 */
export function findWinningSegmentIndex(winner) {
  const candidates = SEGMENTS
    .map((seg, i) => (seg.label === winner ? i : -1))
    .filter((i) => i !== -1);

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Calculate target CSS rotation (degrees, clockwise) so that the winning
 * segment's center lands under the pointer (top / 0°).
 *
 * Geometry:
 *   - Segment 0 is drawn starting from the top (-90° in canvas coords).
 *   - Center of segment i in CSS-angle space = (i + 0.5) * segmentAngle.
 *   - When the wheel div rotates clockwise by R, the segment at CSS angle C
 *     moves to absolute screen position C + R.
 *   - Pointer is at screen position 0 (top).
 *   - For segment i at pointer: (C_i + R) ≡ 0 (mod 360) → R ≡ -C_i (mod 360)
 *     → R = (360 - C_i) % 360  [positive, clockwise]
 */
export function calculateTargetRotation(segmentIndex, currentRotation) {
  const N = SEGMENTS.length;
  const segmentAngle = 360 / N;
  const C_i = (segmentIndex + 0.5) * segmentAngle;

  const targetMod = (360 - C_i + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;

  let delta = targetMod - currentMod;
  if (delta <= 0) delta += 360; // always spin forward (clockwise)

  const extraSpins =
    (MIN_EXTRA_ROTATIONS +
      Math.floor(Math.random() * (MAX_EXTRA_ROTATIONS - MIN_EXTRA_ROTATIONS + 1))) *
    360;

  return currentRotation + delta + extraSpins;
}

/**
 * After animation: check whether the pointer angle fell within VOID_THRESHOLD
 * degrees of a segment boundary. Returns true → void result.
 */
export function isVoidResult(finalRotation) {
  const N = SEGMENTS.length;
  const segmentAngle = 360 / N;
  const normalizedR = ((finalRotation % 360) + 360) % 360;
  const wheelAngleAtPointer = (360 - normalizedR) % 360;

  for (let i = 0; i < N; i++) {
    const boundary = i * segmentAngle;
    const diff = Math.abs(wheelAngleAtPointer - boundary);
    const wrapped = Math.min(diff, 360 - diff);
    if (wrapped < VOID_THRESHOLD) return true;
  }
  return false;
}
