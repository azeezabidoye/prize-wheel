import confetti from 'canvas-confetti';

export function triggerWinConfetti() {
  const end = Date.now() + 3000;
  const colors = ['#ff0d72', '#0cd977', '#ff8000', '#ffff00', '#7c3aed', '#00ccff'];

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function triggerStickerConfetti() {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#FF6B6B', '#4ECDC4', '#F7B731', '#A55EEA'],
    shapes: ['circle'],
  });
}
