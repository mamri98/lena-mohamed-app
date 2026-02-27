// components/ChibiWidget.js
// CHANGED:
//   - Reverted previous DPR attempts which were unreliable due to canvas reset behavior
//   - New approach: canvas buffer is sized at DPR * CSS size, ctx.scale(dpr,dpr) is applied
//     EVERY frame inside the loop (after clearRect) so it's never lost
//   - drawParticles no longer divides by dpr (ctx is always in logical space now)
//   - Resize useEffect sizes the buffer correctly but does NOT call ctx.scale (loop owns that)
//   - All coordinates stay in logical CSS px throughout — no division needed anywhere

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const BEAR_COLOR  = { body: '#C68642', bodyDark: '#A0522D', belly: '#E8C99A', nose: '#6B3A2A', ear_inner: '#E8A87C', cheek: 'rgba(220, 120, 80, 0.35)' };
const BUNNY_COLOR = { body: '#F5F0EB', bodyDark: '#E8DDD5', belly: '#FDF9F7', nose: '#F4A7B9', ear_inner: '#F9C8D5', cheek: 'rgba(255, 182, 193, 0.5)' };

const BEAR_ACTIONS  = ['Hug', 'Kiss', 'Wave', 'Pat head', 'Boop nose', 'High five'];
const BUNNY_ACTIONS = ['Kiss', 'Poke', 'Wave', 'Throw heart', 'High five', 'Nuzzle'];

const ACTION_ICONS = {
  'Hug': '🤗', 'Kiss': '💋', 'Wave': '👋', 'Pat head': '🫶',
  'Boop nose': '👆', 'High five': '🙌', 'Poke': '👉',
  'Throw heart': '💝', 'Nuzzle': '🥰'
};

const EXPIRY_MS = 24 * 60 * 60 * 1000;

// ─── Canvas Drawing Helpers ───────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Bear Drawing ─────────────────────────────────────────────────────────────
function drawBear(ctx, x, y, scale, anim) {
  const {
    breathOffset = 0, blinkT = 0,
    armAngle = 0, armReach = 0,
    headTilt = 0, jumpOffset = 0,
    xOffset = 0,
  } = anim;
  const s = scale;
  const bx = x + xOffset;
  const by = y + breathOffset + jumpOffset;

  ctx.save();
  ctx.translate(bx, by);

  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 22 * s, 20 * s, 22 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = BEAR_COLOR.belly;
  ctx.beginPath();
  ctx.ellipse(0, 24 * s, 12 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(-18 * s, 16 * s);
  ctx.rotate(-0.25 + armAngle * 0.3);
  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 9 * s, 6 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BEAR_COLOR.bodyDark;
  ctx.beginPath();
  ctx.ellipse(0, 18 * s, 5.5 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(18 * s, 16 * s);
  ctx.rotate(0.25 - armAngle * 0.3 - armReach * 0.9);
  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 9 * s, 6 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BEAR_COLOR.bodyDark;
  ctx.beginPath();
  ctx.ellipse(0, 18 * s, 5.5 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(0, -4 * s);
  ctx.rotate(headTilt * 0.4);

  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath(); ctx.ellipse(-15 * s, -14 * s, 8 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(15 * s, -14 * s, 8 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = BEAR_COLOR.ear_inner;
  ctx.beginPath(); ctx.ellipse(-15 * s, -14 * s, 5 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(15 * s, -14 * s, 5 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, -10 * s, 19 * s, 18 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = BEAR_COLOR.belly;
  ctx.beginPath();
  ctx.ellipse(0, -4 * s, 10 * s, 7.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = BEAR_COLOR.nose;
  ctx.beginPath();
  ctx.ellipse(0, -8 * s, 4.5 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeH = blinkT > 0.8 ? 0.8 : 4.5 * s;
  ctx.fillStyle = '#2C1810';
  ctx.beginPath(); ctx.ellipse(-7 * s, -15 * s, 3.5 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7 * s, -15 * s, 3.5 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();
  if (blinkT <= 0.8) {
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(-6 * s, -16.5 * s, 1.3 * s, 1.3 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8 * s, -16.5 * s, 1.3 * s, 1.3 * s, 0, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = BEAR_COLOR.cheek;
  ctx.beginPath(); ctx.ellipse(-12 * s, -9 * s, 6 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(12 * s, -9 * s, 6 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = BEAR_COLOR.nose;
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-3.5 * s, -2.5 * s);
  ctx.quadraticCurveTo(0, 0.5 * s, 3.5 * s, -2.5 * s);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

// ─── Bunny Drawing ────────────────────────────────────────────────────────────
function drawBunny(ctx, x, y, scale, anim) {
  const {
    breathOffset = 0, blinkT = 0, earWiggle = 0,
    armAngle = 0, armReach = 0,
    headTilt = 0, jumpOffset = 0,
    xOffset = 0,
  } = anim;
  const s = scale;
  const by = y + breathOffset + jumpOffset;

  ctx.save();
  ctx.translate(x, by);

  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 22 * s, 17 * s, 20 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = BUNNY_COLOR.belly;
  ctx.beginPath();
  ctx.ellipse(0, 24 * s, 10 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(-15 * s, 15 * s);
  ctx.rotate(-0.2 + armAngle * 0.3);
  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 8 * s, 5 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  ctx.beginPath();
  ctx.ellipse(0, 16 * s, 4.5 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(15 * s, 15 * s);
  ctx.rotate(0.2 - armAngle * 0.3 - armReach * 0.9);
  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 8 * s, 5 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  ctx.beginPath();
  ctx.ellipse(0, 16 * s, 4.5 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(0, -4 * s);
  ctx.rotate(headTilt * 0.4);

  const earBaseW = 6 * s, earBaseH = 26 * s, earInnerW = 3.5 * s, earInnerH = 20 * s;

  ctx.save();
  ctx.translate(-9 * s, -22 * s);
  ctx.rotate(-0.12 + earWiggle);
  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, earBaseW, earBaseH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  ctx.beginPath();
  ctx.ellipse(0, 2 * s, earInnerW, earInnerH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(9 * s, -22 * s);
  ctx.rotate(0.12 - earWiggle);
  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, earBaseW, earBaseH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  ctx.beginPath();
  ctx.ellipse(0, 2 * s, earInnerW, earInnerH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath();
  ctx.ellipse(0, -8 * s, 17 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = BUNNY_COLOR.belly;
  ctx.beginPath();
  ctx.ellipse(0, -2 * s, 8.5 * s, 6.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = BUNNY_COLOR.nose;
  ctx.beginPath();
  ctx.ellipse(0, -5.5 * s, 3 * s, 2.2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = BUNNY_COLOR.nose;
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(0, -3.5 * s);
  ctx.lineTo(-2.5 * s, -1 * s);
  ctx.moveTo(0, -3.5 * s);
  ctx.lineTo(2.5 * s, -1 * s);
  ctx.stroke();

  const eyeH = blinkT > 0.8 ? 0.8 : 4 * s;
  ctx.fillStyle = '#3D2B3D';
  ctx.beginPath(); ctx.ellipse(-6 * s, -13 * s, 3 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6 * s, -13 * s, 3 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();
  if (blinkT <= 0.8) {
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(-5 * s, -14.5 * s, 1.2 * s, 1.2 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7 * s, -14.5 * s, 1.2 * s, 1.2 * s, 0, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  ctx.globalAlpha = 0.45;
  ctx.beginPath(); ctx.ellipse(-11 * s, -7 * s, 5.5 * s, 3.5 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(11 * s, -7 * s, 5.5 * s, 3.5 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = '#D4A0A0';
  ctx.lineWidth = 1.3 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -0.5 * s);
  ctx.quadraticCurveTo(0, 1.5 * s, 3 * s, -0.5 * s);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

// ─── Floating particles ───────────────────────────────────────────────────────
// ctx is always in logical CSS px space (DPR scale applied each frame), so no division needed
function drawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.emoji, p.x, p.y);
    ctx.restore();
  });
}

// ─── Action Animation Definitions ────────────────────────────────────────────
function getActionFrame(action, t) {
  const ease    = v => v < 0.5 ? 2 * v * v : -1 + (4 - 2 * v) * v;
  const easeOut = v => 1 - Math.pow(1 - v, 3);
  const easeIn  = v => v * v * v;

  switch (action) {
    case 'Hug': {
      const proximity = t < 0.25 ? easeOut(t / 0.25)
                      : t < 0.75 ? 1
                      : 1 - easeIn((t - 0.75) / 0.25);
      const reach = proximity * 1.6;
      return {
        self:  { armReach: reach, headTilt: proximity * 0.12 },
        other: { armReach: reach * 0.7, headTilt: -proximity * 0.12 },
        bearXOffset:  proximity * 18,
        bunnyXOffset: -proximity * 18,
      };
    }
    case 'Kiss': {
      const lean = t < 0.35 ? easeOut(t / 0.35)
                 : t < 0.65 ? 1
                 : 1 - easeOut((t - 0.65) / 0.35);
      return {
        self:  { headTilt: lean * 0.18, armReach: lean * 0.5 },
        other: { headTilt: -lean * 0.18 },
        bearXOffset:  lean * 14,
        bunnyXOffset: -lean * 14,
      };
    }
    case 'Wave': {
      const wave = Math.sin(t * Math.PI * 3) * easeOut(Math.min(t * 2, 1));
      return {
        self:  { armAngle: wave * 0.6 },
        other: {},
        bearXOffset: 0, bunnyXOffset: 0,
      };
    }
    case 'Pat head': {
      const reach = t < 0.4 ? easeOut(t / 0.4) * 1.4
                  : t < 0.6 ? 1.4
                  : 1.4 * (1 - easeOut((t - 0.6) / 0.4));
      const proximity = reach * 0.5;
      return {
        self:  { armReach: reach, armAngle: -reach * 0.4 },
        other: { armReach: reach, armAngle: -reach * 0.4 },
        bearXOffset:  proximity * 12,
        bunnyXOffset: -proximity * 12,
      };
    }
    case 'Boop nose': {
      const poke = t < 0.3 ? easeOut(t / 0.3) * 1.3
                 : t < 0.5 ? 1.3
                 : 1.3 * (1 - easeOut((t - 0.5) / 0.5));
      return {
        self:  { armReach: poke },
        other: { jumpOffset: ease(t) * -6, headTilt: ease(t) * 0.08 },
        bearXOffset: poke * 10,
        bunnyXOffset: 0,
      };
    }
    case 'Poke': {
      const poke = t < 0.3 ? easeOut(t / 0.3) * 1.3
                 : t < 0.5 ? 1.3
                 : 1.3 * (1 - easeOut((t - 0.5) / 0.5));
      return {
        self:  { armReach: poke },
        other: { jumpOffset: ease(t) * -6, headTilt: ease(t) * 0.08 },
        bearXOffset: 0,
        bunnyXOffset: -poke * 10,
      };
    }
    case 'Throw heart': {
      const jump = Math.sin(t * Math.PI) * -14;
      const bearBounce = Math.sin(t * Math.PI * 2) * -4;
      return {
        self:  { jumpOffset: jump, armAngle: -t * 0.6 },
        other: { jumpOffset: bearBounce },
        bearXOffset: 0, bunnyXOffset: 0,
      };
    }
    case 'High five': {
      const raise = t < 0.4 ? easeOut(t / 0.4) * 1.4
                  : t < 0.6 ? 1.4
                  : 1.4 * (1 - easeOut((t - 0.6) / 0.4));
      const proximity = raise * 0.5;
      return {
        self:  { armReach: raise, armAngle: -raise * 0.4 },
        other: { armReach: raise, armAngle: -raise * 0.4 },
        bearXOffset:  proximity * 12,
        bunnyXOffset: -proximity * 12,
      };
    }
    case 'Nuzzle': {
      const proximity = t < 0.2 ? easeOut(t / 0.2)
                      : t < 0.8 ? 1
                      : 1 - easeOut((t - 0.8) / 0.2);
      const nuzzle = Math.sin(t * Math.PI * 4) * 0.14 * proximity;
      return {
        self:  { headTilt: nuzzle },
        other: { headTilt: -nuzzle * 0.8 },
        bearXOffset:  proximity * 20,
        bunnyXOffset: -proximity * 20,
      };
    }
    default: return { self: {}, other: {}, bearXOffset: 0, bunnyXOffset: 0 };
  }
}

// ─── Map action frame to bear/bunny based on who sent it ─────────────────────
function resolveActionFrame(action, t, senderIsBear) {
  const raw = getActionFrame(action, t);
  if (senderIsBear) {
    return {
      bear:  raw.self  || {},
      bunny: raw.other || {},
      bearXOffset:  raw.bearXOffset  || 0,
      bunnyXOffset: raw.bunnyXOffset || 0,
    };
  } else {
    return {
      bear:  raw.other || {},
      bunny: raw.self  || {},
      bearXOffset:  -(raw.bunnyXOffset || 0),
      bunnyXOffset: -(raw.bearXOffset  || 0),
    };
  }
}

// ─── Particles per action ─────────────────────────────────────────────────────
function getActionParticles(action, bearX, bunnyX, midY) {
  const midX = (bearX + bunnyX) / 2;
  switch (action) {
    case 'Kiss':
      return [
        { emoji: '💋', x: midX,      y: midY - 15, vy: -1.4, alpha: 1, size: 20 },
        { emoji: '✨', x: midX - 15, y: midY - 5,  vy: -0.9, alpha: 1, size: 13 },
      ];
    case 'Nuzzle':
      return [
        { emoji: '🤍', x: midX,      y: midY - 20, vy: -1.1, alpha: 1, size: 18 },
        { emoji: '✨', x: midX + 12, y: midY - 5,  vy: -0.8, alpha: 1, size: 12 },
      ];
    case 'Throw heart':
      return [
        { emoji: '💝', x: bunnyX - 10, y: midY - 25, vy: -1.6, alpha: 1, size: 22 },
        { emoji: '✨', x: bunnyX + 5,  y: midY - 8,  vy: -1.0, alpha: 1, size: 14 },
        { emoji: '💫', x: midX,        y: midY - 10, vy: -0.8, alpha: 1, size: 12 },
      ];
    case 'High five':
      return [
        { emoji: '✨', x: midX,      y: midY - 25, vy: -1.2, alpha: 1, size: 18 },
        { emoji: '⭐', x: midX - 10, y: midY - 10, vy: -0.9, alpha: 1, size: 14 },
      ];
    case 'Hug':
      return [
        { emoji: '🤍', x: midX,     y: midY - 20, vy: -1.0, alpha: 1, size: 16 },
        { emoji: '💜', x: midX + 8, y: midY - 8,  vy: -0.8, alpha: 1, size: 13 },
      ];
    case 'Boop nose':
      return [{ emoji: '⭐', x: bunnyX - 10, y: midY - 10, vy: -0.9, alpha: 1, size: 15 }];
    case 'Wave':
      return [{ emoji: '👋', x: midX + 15,  y: midY - 30, vy: -0.7, alpha: 1, size: 16 }];
    case 'Pat head':
      return [{ emoji: '🫶', x: midX,        y: midY - 20, vy: -0.8, alpha: 1, size: 16 }];
    case 'Poke':
      return [{ emoji: '💥', x: bearX + 5,   y: midY - 10, vy: -0.7, alpha: 1, size: 15 }];
    default: return [];
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChibiWidget({ name }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const stateRef  = useRef({
    time: 0,
    bearBlink: 0, bearBlinkTimer: Math.random() * 200,
    bunnyBlink: 0, bunnyBlinkTimer: Math.random() * 200 + 50,
    action: null,
    actionT: 0,
    actionSender: null,
    particles: [],
    queue: [],
    isPlaying: false,
  });

  const [db, setDb]     = useState(null);
  const [fs, setFs]     = useState(null);
  const [isMounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const myName      = name;
  const partnerName = name === 'Mohamed' ? 'Lena' : 'Mohamed';
  const myActions   = name === 'Mohamed' ? BEAR_ACTIONS : BUNNY_ACTIONS;

  // ── Firebase init ──
  useEffect(() => {
    setMounted(true);
    (async () => {
      try {
        const { db: firebaseDb } = await import('../firebase/firebase');
        const firestore = await import('firebase/firestore');
        setDb(firebaseDb);
        setFs(firestore);
      } catch (e) { console.error('ChibiWidget Firebase init error:', e); }
    })();
  }, []);

  // ── Save action to Firebase ──
  const sendAction = useCallback(async (action) => {
    if (!db || !fs) return;
    try {
      await fs.addDoc(fs.collection(db, 'chibiQueue'), {
        from: myName,
        to: partnerName,
        action,
        timestamp: fs.serverTimestamp(),
        seen: false,
      });
    } catch (e) { console.error('Failed to queue action:', e); }
  }, [db, fs, myName, partnerName]);

  const markSeen = useCallback(async (docIds) => {
    if (!db || !fs || !docIds.length) return;
    try {
      await Promise.all(docIds.map(id =>
        fs.updateDoc(fs.doc(db, 'chibiQueue', id), { seen: true })
      ));
    } catch (e) { console.error('Failed to mark seen:', e); }
  }, [db, fs]);

  const cleanExpired = useCallback(async () => {
    if (!db || !fs) return;
    try {
      const cutoff = new Date(Date.now() - EXPIRY_MS);
      const snap = await fs.getDocs(
        fs.query(
          fs.collection(db, 'chibiQueue'),
          fs.where('to', '==', myName),
          fs.where('seen', '==', false)
        )
      );
      const expired = snap.docs.filter(d => {
        const ts = d.data().timestamp?.toDate?.();
        return ts && ts < cutoff;
      });
      await Promise.all(expired.map(d => fs.deleteDoc(fs.doc(db, 'chibiQueue', d.id))));
    } catch (e) { console.error('cleanExpired error:', e); }
  }, [db, fs, myName]);

  // ── Listen for incoming actions ──
  useEffect(() => {
    if (!db || !fs) return;
    cleanExpired();
    const q = fs.query(
      fs.collection(db, 'chibiQueue'),
      fs.where('to', '==', myName),
      fs.where('seen', '==', false),
      fs.orderBy('timestamp', 'asc')
    );
    const unsub = fs.onSnapshot(q, (snap) => {
      const now = Date.now();
      const items = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(item => {
          const ts = item.timestamp?.toDate?.();
          return ts && (now - ts.getTime()) < EXPIRY_MS;
        });
      if (items.length > 0) {
        const s = stateRef.current;
        const existingIds = new Set(s.queue.map(q => q.id));
        const newItems = items.filter(i => !existingIds.has(i.id));
        s.queue.push(...newItems);
      }
    });
    return () => unsub();
  }, [db, fs, myName, cleanExpired]);

  // ── Process queue ──
  const processQueue = useCallback(() => {
    const s = stateRef.current;
    if (s.isPlaying || s.queue.length === 0) return;
    const next = s.queue.shift();
    s.action = next.action;
    s.actionT = 0;
    s.actionSender = next.from;
    s.isPlaying = true;
    setIsAnimating(true);
    markSeen([next.id]);
    const canvas = canvasRef.current;
    if (canvas) {
      // Use offsetWidth/Height — logical CSS px, matching the loop's coordinate space
      const bearX  = canvas.offsetWidth * 0.28;
      const bunnyX = canvas.offsetWidth * 0.72;
      const midY   = canvas.offsetHeight * 0.55;
      s.particles.push(...getActionParticles(next.action, bearX, bunnyX, midY));
    }
  }, [markSeen]);

  // ── Trigger local action ──
  const triggerAction = useCallback((action) => {
    const s = stateRef.current;
    if (s.isPlaying) return;
    s.action = action;
    s.actionT = 0;
    s.actionSender = myName;
    s.isPlaying = true;
    setIsAnimating(true);
    sendAction(action);
    const canvas = canvasRef.current;
    if (canvas) {
      // Use offsetWidth/Height — logical CSS px, matching the loop's coordinate space
      const bearX  = canvas.offsetWidth * 0.28;
      const bunnyX = canvas.offsetWidth * 0.72;
      const midY   = canvas.offsetHeight * 0.55;
      s.particles.push(...getActionParticles(action, bearX, bunnyX, midY));
    }
  }, [sendAction, myName]);

  // ── Main render loop ──
  // KEY: setTransform(identity) + clearRect + scale(dpr,dpr) every frame.
  // This guarantees the DPR scale is always active even after canvas buffer resizes reset the ctx.
  // All drawing coordinates are in logical CSS px — the per-frame scale maps to physical pixels.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const ACTION_DURATION = 100;

    const loop = () => {
      const dpr  = window.devicePixelRatio || 1;
      const cssW = canvas.offsetWidth;
      const cssH = canvas.offsetHeight;

      const SCALE       = cssW / 280;
      const BASE_BEAR_X  = cssW * 0.28;
      const BASE_BEAR_Y  = cssH * 0.68;
      const BASE_BUNNY_X = cssW * 0.72;
      const BASE_BUNNY_Y = cssH * 0.68;

      const s = stateRef.current;
      s.time++;

      const breathBear  = Math.sin(s.time * 0.038) * 1.5;
      const breathBunny = Math.sin(s.time * 0.038 + 1.1) * 1.5;
      const earWiggle   = Math.sin(s.time * 0.065) * 0.07;

      s.bearBlinkTimer--;
      if (s.bearBlinkTimer <= 0) { s.bearBlink = 1; s.bearBlinkTimer = 180 + Math.random() * 120; }
      if (s.bearBlink > 0) s.bearBlink = Math.max(0, s.bearBlink - 0.14);

      s.bunnyBlinkTimer--;
      if (s.bunnyBlinkTimer <= 0) { s.bunnyBlink = 1; s.bunnyBlinkTimer = 200 + Math.random() * 100; }
      if (s.bunnyBlink > 0) s.bunnyBlink = Math.max(0, s.bunnyBlink - 0.14);

      let bearAnim = {}, bunnyAnim = {};
      let bearX = BASE_BEAR_X, bunnyX = BASE_BUNNY_X;

      if (s.isPlaying && s.action) {
        s.actionT = Math.min(1, s.actionT + 1 / ACTION_DURATION);
        const senderIsBear = s.actionSender === 'Mohamed';
        const frame = resolveActionFrame(s.action, s.actionT, senderIsBear);
        bearAnim  = frame.bear  || {};
        bunnyAnim = frame.bunny || {};
        bearX  = BASE_BEAR_X  + (frame.bearXOffset  || 0) * SCALE;
        bunnyX = BASE_BUNNY_X + (frame.bunnyXOffset || 0) * SCALE;

        if (s.actionT >= 1) {
          s.isPlaying = false;
          s.action = null;
          s.actionT = 0;
          s.actionSender = null;
          setIsAnimating(false);
          setTimeout(() => processQueue(), 400);
        }
      } else if (!s.isPlaying) {
        processQueue();
      }

      s.particles = s.particles
        .map(p => ({ ...p, y: p.y + p.vy, alpha: p.alpha - 0.011 }))
        .filter(p => p.alpha > 0);

      // Reset transform, clear, then reapply DPR scale — owns the transform every frame
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const grd = ctx.createRadialGradient(cssW / 2, cssH / 2, 0, cssW / 2, cssH / 2, cssW * 0.4);
      grd.addColorStop(0, 'rgba(180, 140, 255, 0.07)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cssW, cssH);

      drawBear(ctx, bearX, BASE_BEAR_Y, SCALE, {
        breathOffset: breathBear,
        blinkT: s.bearBlink,
        ...bearAnim,
      });

      ctx.save();
      ctx.translate(bunnyX, 0);
      ctx.scale(-1, 1);
      drawBunny(ctx, 0, BASE_BUNNY_Y, SCALE, {
        breathOffset: breathBunny,
        blinkT: s.bunnyBlink,
        earWiggle,
        ...bunnyAnim,
      });
      ctx.restore();

      drawParticles(ctx, s.particles);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [processQueue]);

  // ── Resize canvas ──
  // Sizes the physical buffer only — does NOT call ctx.scale (the loop owns the transform)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="col-span-2 rounded-2xl border border-purple-500/30 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Canvas */}
      <div className="w-full" style={{ height: 180 }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Character labels */}
      <div className="flex justify-between px-6 pb-1 text-xs text-purple-300/70">
        <span>🐻 Bear</span>
        <span>Bunny 🐰</span>
      </div>

      {/* Action buttons */}
      <div className="px-3 pb-3">
        {isMounted && (
          <div className="flex flex-wrap gap-2 justify-center">
            {myActions.map(action => (
              <button
                key={action}
                disabled={isAnimating}
                onClick={() => triggerAction(action)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                  ${isAnimating
                    ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-purple-300'
                    : name === 'Mohamed'
                      ? 'bg-amber-800/30 border-amber-600/40 text-amber-200 hover:bg-amber-700/40 active:scale-95'
                      : 'bg-pink-800/30 border-pink-500/40 text-pink-200 hover:bg-pink-700/40 active:scale-95'
                  }`}
              >
                <span>{ACTION_ICONS[action]}</span>
                <span>{action}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}