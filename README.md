# 🎡 Spin-the-Wheel Prize Game

A colourful, animated prize-wheel game built with **React 19 + Vite**. Users enter their name, spin the wheel, and win prizes drawn from a weighted probability table. Supports dark / light mode with persistence.

---

## Features

| Feature | Details |
|---|---|
| **Landing page** | Name entry with validation, prize showcase |
| **Prize wheel** | 12 SVG segments, smooth CSS spin animation |
| **Weighted prizes** | Sticker ~80 %, other prizes 1–8 % each |
| **Result modal** | Confetti / flashing effects for wins, Void and Try Again states |
| **Dark / Light mode** | Toggle persisted in `localStorage` |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## Installation

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
# clone / download the project, then:
cd prize-wheel
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Application Flow

```
Landing Page  →  Enter name  →  Click "Play Now"
     ↓
Game Page  →  Click SPIN in wheel centre
     ↓
Weighted RNG picks winner BEFORE animation starts
     ↓
Wheel animates and stops at the winning segment
     ↓
Modal shows result:
  • Big Prize  →  confetti rain + rainbow title + flashing border
  • Sticker    →  burst confetti
  • Try Again  →  encouraging message, no prize
  • Void       →  boundary-landing detected, no prize awarded
```

---

## Wheel Mechanics

### Geometry

The wheel is an SVG with **12 segments**, each spanning `360 / 12 = 30°`. Segment 0 starts at the top (12 o'clock).

The **pointer** is a fixed SVG arrow at the top of the wheel. When the wheel rotates clockwise by *R* degrees, the segment whose centre was at CSS angle *C_i* ends up at screen angle *C_i + R*. For that segment to be under the pointer (0° / top):

```
R ≡ (360 − C_i) mod 360
```

5–8 extra full rotations are added for the spin-up visual effect.

### Void detection

After the CSS transition ends the final rotation angle is inspected. If the pointer falls within **±1.8°** of any segment boundary, the result is declared **Void** (no prize awarded).

---

## Prize Selection Logic

File: `src/utils/probabilities.js`

```js
export const PRIZE_WEIGHTS = {
  'Sticker':        80,   // ≈ 80 %
  'Try Again':       8,
  'T-Shirt':         3,
  'Notebook':        3,
  'Fhenix Package':  3,
  'Tote Bag':        2,
  'Face Cap':        1,
};
```

`selectWinner()` in `src/utils/wheelLogic.js` accumulates weights and picks the prize whose cumulative weight first exceeds a uniform random value. The outcome is fixed **before** the animation starts; the wheel is then rotated programmatically to stop at the correct segment.

---

## Code Structure

```
src/
├── App.jsx                     # Router + provider tree
├── main.jsx                    # React entry point
│
├── components/
│   ├── Button/                 # Reusable button (primary / secondary / ghost variants)
│   ├── Modal/                  # Win / Try-Again / Void result modal with animations
│   ├── Pointer/                # Fixed SVG arrow sitting over the wheel rim
│   ├── ThemeToggle/            # Dark ↔ Light mode switch
│   └── Wheel/                  # SVG prize wheel + centred spin button
│
├── pages/
│   ├── HomePage/               # Name entry form + prize showcase grid
│   └── GamePage/               # Wheel layout + spin orchestration
│
├── hooks/
│   └── useWheel.js             # Rotation state, spin trigger, post-spin timer
│
├── context/
│   ├── AppContext.jsx           # userName · spinResult · isSpinning · modalOpen
│   └── ThemeContext.jsx         # theme · toggleTheme · localStorage sync
│
├── utils/
│   ├── constants.js            # Segment definitions, timing constants, thresholds
│   ├── probabilities.js        # Prize weight table
│   └── wheelLogic.js           # selectWinner · calculateTargetRotation · isVoidResult
│
├── animations/
│   └── confetti.js             # canvas-confetti helper wrappers
│
└── styles/
    └── global.css              # CSS custom properties (dark/light tokens) + keyframes
```

---

## Customisation Guide

### Add a prize

1. **`src/utils/constants.js`** — append to `SEGMENTS`:
   ```js
   { label: 'Hoodie', color: '#6C5CE7' },
   ```
2. **`src/utils/probabilities.js`** — add a weight (reduce others to keep total sensible):
   ```js
   'Hoodie': 2,
   ```
3. (Optional) map an emoji in `Modal.jsx`'s `PRIZE_EMOJIS` object.

### Change probabilities

Edit the numbers in `PRIZE_WEIGHTS`. They don't need to sum to exactly 100 — the algorithm works with any positive integers — but percentage-like values are easy to reason about.

### Change wheel colours

Edit the `color` field of each segment in `SEGMENTS` (`src/utils/constants.js`). Text colour on each segment is chosen automatically — dark text on bright backgrounds, white on dark — via the `contrastColor()` helper in `Wheel.jsx`.

### Add or remove segments

Simply add/remove entries in the `SEGMENTS` array. The segment angle, SVG geometry, and rotation maths are all derived from `SEGMENTS.length` at runtime — no other changes needed.

### Adjust spin speed or number of rotations

In `src/utils/constants.js`:

| Constant | Default | Effect |
|---|---|---|
| `SPIN_DURATION` | `5000` ms | CSS transition duration |
| `MIN_EXTRA_ROTATIONS` | `5` | Minimum full spins before stopping |
| `MAX_EXTRA_ROTATIONS` | `8` | Maximum full spins before stopping |

---

## Future Improvements

| Area | Ideas |
|---|---|
| **Backend integration** | Record spins per user, enforce one-spin-per-session server-side |
| **User analytics** | Track prize distribution, popular spin times, conversion rates |
| **Leaderboards** | Show top winners, display recent prize history |
| **Prize inventory** | Cap available quantities; remove exhausted prizes dynamically |
| **Auth** | OAuth / wallet sign-in for persistent user identities |
| **Sound effects** | Tick sounds while spinning, fanfare on big win |
| **Accessibility** | Full keyboard navigation, screen-reader announcements for spin result |

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 19 | UI framework |
| React Router 7 | Client-side routing |
| canvas-confetti | Celebration animations |
| Vite 6 | Development server & bundler |
| CSS Modules | Scoped component styles |
