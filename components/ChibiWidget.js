// components/ChibiWidget.js
// NEW FILE: Interactive chibi widget with Canvas 2D bear (Mohamed) and bunny (Lena)
// Features: idle animations, action animations, Firebase queue system, 24hr expiry

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const BEAR_COLOR   = { body: '#8B6555', belly: '#C4A882', nose: '#5C3D2E', ear_inner: '#C4A882' };
const BUNNY_COLOR  = { body: '#F0EDE8', belly: '#FAF7F4', nose: '#FFB6C1', ear_inner: '#FFB6C1' };
const CHEEK_COLOR  = 'rgba(255, 182, 193, 0.5)';

const BEAR_ACTIONS  = ['Hug', 'Kiss', 'Wave', 'Pat head', 'Boop nose', 'High five'];
const BUNNY_ACTIONS = ['Kiss', 'Poke', 'Wave', 'Throw heart', 'High five', 'Nuzzle'];

const ACTION_ICONS = {
  'Hug': '🤗', 'Kiss': '💋', 'Wave': '👋', 'Pat head': '🫶',
  'Boop nose': '👆', 'High five': '🙌', 'Poke': '👉',
  'Throw heart': '💝', 'Nuzzle': '🥰'
};

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

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

// ─── Character Drawers ────────────────────────────────────────────────────────

function drawBear(ctx, x, y, scale, anim) {
  const { breathOffset = 0, blinkT = 0, armAngle = 0, armReach = 0, headTilt = 0, jumpOffset = 0 } = anim;
  const s = scale;
  const by = y + breathOffset + jumpOffset;

  ctx.save();
  ctx.translate(x, by);

  // ── Body ──
  ctx.fillStyle = BEAR_COLOR.body;
  roundRect(ctx, -18 * s, 10 * s, 36 * s, 32 * s, 12 * s);
  ctx.fill();

  // belly
  ctx.fillStyle = BEAR_COLOR.belly;
  ctx.beginPath();
  ctx.ellipse(0, 24 * s, 10 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Left arm (idle) ──
  ctx.save();
  ctx.translate(-18 * s, 18 * s);
  ctx.rotate(-0.3 + armAngle);
  ctx.fillStyle = BEAR_COLOR.body;
  roundRect(ctx, -6 * s, 0, 12 * s, 20 * s, 6 * s);
  ctx.fill();
  ctx.restore();

  // ── Right arm (action arm) ──
  ctx.save();
  ctx.translate(18 * s, 18 * s);
  ctx.rotate(0.3 - armAngle + armReach);
  ctx.fillStyle = BEAR_COLOR.body;
  roundRect(ctx, -6 * s, 0, 12 * s, 20 * s, 6 * s);
  ctx.fill();
  ctx.restore();

  // ── Head ──
  ctx.save();
  ctx.rotate(headTilt);
  // ears
  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath(); ctx.ellipse(-14 * s, -24 * s, 7 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(14 * s, -24 * s, 7 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
  // ear inner
  ctx.fillStyle = BEAR_COLOR.ear_inner;
  ctx.beginPath(); ctx.ellipse(-14 * s, -24 * s, 4 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(14 * s, -24 * s, 4 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();

  // head
  ctx.fillStyle = BEAR_COLOR.body;
  ctx.beginPath(); ctx.ellipse(0, -12 * s, 18 * s, 17 * s, 0, 0, Math.PI * 2); ctx.fill();

  // snout
  ctx.fillStyle = BEAR_COLOR.belly;
  ctx.beginPath(); ctx.ellipse(0, -5 * s, 9 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();

  // nose
  ctx.fillStyle = BEAR_COLOR.nose;
  ctx.beginPath(); ctx.ellipse(0, -8 * s, 4 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill();

  // eyes
  const eyeH = blinkT > 0.8 ? 1 : 4 * s;
  ctx.fillStyle = '#2C1810';
  ctx.beginPath(); ctx.ellipse(-7 * s, -16 * s, 3 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7 * s, -16 * s, 3 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();

  // eye shine
  if (blinkT <= 0.8) {
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(-6 * s, -17 * s, 1.2 * s, 1.2 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8 * s, -17 * s, 1.2 * s, 1.2 * s, 0, 0, Math.PI * 2); ctx.fill();
  }

  // cheeks
  ctx.fillStyle = CHEEK_COLOR;
  ctx.beginPath(); ctx.ellipse(-11 * s, -11 * s, 5 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(11 * s, -11 * s, 5 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill();

  // mouth
  ctx.strokeStyle = BEAR_COLOR.nose;
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -3 * s);
  ctx.quadraticCurveTo(0, -1 * s, 3 * s, -3 * s);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

function drawBunny(ctx, x, y, scale, anim) {
  const { breathOffset = 0, blinkT = 0, earWiggle = 0, armAngle = 0, armReach = 0, headTilt = 0, jumpOffset = 0 } = anim;
  const s = scale;
  const by = y + breathOffset + jumpOffset;

  ctx.save();
  ctx.translate(x, by);

  // ── Body ──
  ctx.fillStyle = BUNNY_COLOR.body;
  roundRect(ctx, -16 * s, 10 * s, 32 * s, 30 * s, 12 * s);
  ctx.fill();

  // belly
  ctx.fillStyle = BUNNY_COLOR.belly;
  ctx.beginPath(); ctx.ellipse(0, 23 * s, 9 * s, 11 * s, 0, 0, Math.PI * 2); ctx.fill();

  // ── Left arm (idle) ──
  ctx.save();
  ctx.translate(-16 * s, 16 * s);
  ctx.rotate(-0.2 + armAngle);
  ctx.fillStyle = BUNNY_COLOR.body;
  roundRect(ctx, -5 * s, 0, 10 * s, 18 * s, 5 * s);
  ctx.fill();
  ctx.restore();

  // ── Right arm (action arm) ──
  ctx.save();
  ctx.translate(16 * s, 16 * s);
  ctx.rotate(0.2 - armAngle + armReach);
  ctx.fillStyle = BUNNY_COLOR.body;
  roundRect(ctx, -5 * s, 0, 10 * s, 18 * s, 5 * s);
  ctx.fill();
  ctx.restore();

  // ── Head ──
  ctx.save();
  ctx.rotate(headTilt);

  // long ears with wiggle
  ctx.save();
  ctx.translate(-9 * s, -28 * s);
  ctx.rotate(-0.15 + earWiggle);
  ctx.fillStyle = BUNNY_COLOR.body;
  roundRect(ctx, -4 * s, -22 * s, 8 * s, 24 * s, 4 * s);
  ctx.fill();
  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  roundRect(ctx, -2.5 * s, -20 * s, 5 * s, 18 * s, 2.5 * s);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(9 * s, -28 * s);
  ctx.rotate(0.15 - earWiggle);
  ctx.fillStyle = BUNNY_COLOR.body;
  roundRect(ctx, -4 * s, -22 * s, 8 * s, 24 * s, 4 * s);
  ctx.fill();
  ctx.fillStyle = BUNNY_COLOR.ear_inner;
  roundRect(ctx, -2.5 * s, -20 * s, 5 * s, 18 * s, 2.5 * s);
  ctx.fill();
  ctx.restore();

  // head
  ctx.fillStyle = BUNNY_COLOR.body;
  ctx.beginPath(); ctx.ellipse(0, -12 * s, 16 * s, 15 * s, 0, 0, Math.PI * 2); ctx.fill();

  // snout
  ctx.fillStyle = BUNNY_COLOR.belly;
  ctx.beginPath(); ctx.ellipse(0, -5 * s, 8 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();

  // nose
  ctx.fillStyle = BUNNY_COLOR.nose;
  ctx.beginPath(); ctx.ellipse(0, -7.5 * s, 3 * s, 2.5 * s, 0, 0, Math.PI * 2); ctx.fill();

  // eyes
  const eyeH = blinkT > 0.8 ? 1 : 3.5 * s;
  ctx.fillStyle = '#3D2B3D';
  ctx.beginPath(); ctx.ellipse(-6 * s, -15 * s, 2.8 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6 * s, -15 * s, 2.8 * s, eyeH, 0, 0, Math.PI * 2); ctx.fill();

  if (blinkT <= 0.8) {
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.ellipse(-5 * s, -16 * s, 1.1 * s, 1.1 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(7 * s, -16 * s, 1.1 * s, 1.1 * s, 0, 0, Math.PI * 2); ctx.fill();
  }

  // cheeks
  ctx.fillStyle = CHEEK_COLOR;
  ctx.beginPath(); ctx.ellipse(-10 * s, -10 * s, 4.5 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(10 * s, -10 * s, 4.5 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill();

  // mouth
  ctx.strokeStyle = '#D4A0A0';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(-2.5 * s, -3 * s);
  ctx.quadraticCurveTo(0, -1 * s, 2.5 * s, -3 * s);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

// ─── Floating particles (hearts, stars) ─────────────────────────────────────
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
// Each action returns { bearAnim, bunnyAnim } based on progress t (0→1)
function getActionFrame(action, t) {
  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  switch (action) {
    case 'Hug': {
      // Bear's right arm swings far right toward bunny, bunny tilts into bear
      const reach = t < 0.3 ? easeOut(t / 0.3) * 1.8
                  : t < 0.7 ? 1.8
                  : 1.8 * (1 - easeOut((t - 0.7) / 0.3));
      return {
        bear: { armReach: reach, headTilt: reach * 0.1 },
        bunny: { headTilt: -reach * 0.15, jumpOffset: -reach * 2 }
      };
    }
    case 'Kiss': {
      // Bear leans forward, heart particle handled separately
      const lean = t < 0.4 ? easeOut(t / 0.4) * 0.25
                 : t < 0.6 ? 0.25
                 : 0.25 * (1 - easeOut((t - 0.6) / 0.4));
      return {
        bear: { headTilt: lean },
        bunny: { headTilt: -lean * 0.5, jumpOffset: -lean * 8 }
      };
    }
    case 'Wave': {
      const wave = Math.sin(t * Math.PI * 4) * 0.6;
      return {
        bear: { armReach: wave > 0 ? wave : 0, armAngle: wave * 0.3 },
        bunny: { jumpOffset: Math.sin(t * Math.PI * 2) * -3 }
      };
    }
    case 'Pat head': {
      const pat = t < 0.5 ? easeOut(t / 0.5) * 1.2 : 1.2 * (1 - easeOut((t - 0.5) / 0.5));
      const bob = Math.sin(t * Math.PI * 6) * 0.3;
      return {
        bear: { armReach: pat },
        bunny: { jumpOffset: bob * -4, headTilt: bob * 0.1 }
      };
    }
    case 'Boop nose': {
      const boop = t < 0.4 ? easeOut(t / 0.4) * 1.5
                 : t < 0.6 ? 1.5
                 : 1.5 * (1 - easeOut((t - 0.6) / 0.4));
      return {
        bear: { armReach: boop },
        bunny: { headTilt: boop * 0.08, jumpOffset: boop * -1 }
      };
    }
    case 'High five': {
      const raise = t < 0.4 ? easeOut(t / 0.4) * 1.4
                  : t < 0.6 ? 1.4
                  : 1.4 * (1 - easeOut((t - 0.6) / 0.4));
      return {
        bear: { armReach: raise, armAngle: -raise * 0.5 },
        bunny: { armReach: raise, armAngle: -raise * 0.5 }
      };
    }
    case 'Poke': {
      const poke = t < 0.3 ? easeOut(t / 0.3) * 1.3
                 : t < 0.5 ? 1.3
                 : 1.3 * (1 - easeOut((t - 0.5) / 0.5));
      return {
        bear: { jumpOffset: ease(t) * -5 },
        bunny: { armReach: poke, headTilt: poke * 0.05 }
      };
    }
    case 'Throw heart': {
      const jump = Math.sin(t * Math.PI) * -12;
      return {
        bear: { jumpOffset: ease(t) * -4 },
        bunny: { jumpOffset: jump, armAngle: -t * 0.5 }
      };
    }
    case 'Nuzzle': {
      const nuzzle = Math.sin(t * Math.PI * 3) * 0.15;
      return {
        bear: { headTilt: -nuzzle * 0.5 },
        bunny: { headTilt: nuzzle, jumpOffset: Math.sin(t * Math.PI) * -5 }
      };
    }
    default: return { bear: {}, bunny: {} };
  }
}

// Particles to spawn per action
function getActionParticles(action, bearX, bunnyX, midY) {
  const midX = (bearX + bunnyX) / 2;
  switch (action) {
    case 'Kiss': case 'Nuzzle':
      return [{ emoji: '💋', x: midX, y: midY - 10, vy: -1.2, alpha: 1, size: 18 }];
    case 'Throw heart':
      return [
        { emoji: '💝', x: bunnyX + 10, y: midY - 20, vy: -1.5, alpha: 1, size: 20 },
        { emoji: '✨', x: bunnyX - 5,  y: midY - 10, vy: -1.0, alpha: 1, size: 14 },
      ];
    case 'High five':
      return [{ emoji: '✨', x: midX, y: midY - 20, vy: -1.0, alpha: 1, size: 16 }];
    case 'Hug':
      return [{ emoji: '🤍', x: midX, y: midY - 15, vy: -1.0, alpha: 1, size: 16 }];
    case 'Boop nose':
      return [{ emoji: '⭐', x: bunnyX - 5, y: midY - 10, vy: -0.8, alpha: 1, size: 14 }];
    default: return [];
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChibiWidget({ name }) {
  const canvasRef       = useRef(null);
  const animRef         = useRef(null);
  const stateRef        = useRef({
    // Idle animation clocks
    time: 0,
    bearBlink: 0, bearBlinkTimer: Math.random() * 200,
    bunnyBlink: 0, bunnyBlinkTimer: Math.random() * 200 + 50,
    // Action state
    action: null,        // current action name
    actionT: 0,          // progress 0→1
    actionDone: false,
    particles: [],
    // Queue
    queue: [],
    isPlaying: false,
  });

  const [db, setDb]           = useState(null);
  const [fs, setFs]           = useState(null);
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

  // ── Save action to Firebase queue for partner ──
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

  // ── Mark actions as seen ──
  const markSeen = useCallback(async (docIds) => {
    if (!db || !fs || !docIds.length) return;
    try {
      await Promise.all(docIds.map(id =>
        fs.updateDoc(fs.doc(db, 'chibiQueue', id), { seen: true })
      ));
    } catch (e) { console.error('Failed to mark seen:', e); }
  }, [db, fs]);

  // ── Clean up expired (>24h) entries on open ──
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

  // ── Listen for real-time incoming actions ──
  useEffect(() => {
    if (!db || !fs) return;

    // First clean expired, then load queue
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
        // Add new items to queue (avoid duplicates)
        const existingIds = new Set(s.queue.map(q => q.id));
        const newItems = items.filter(i => !existingIds.has(i.id));
        s.queue.push(...newItems);
      }
    });

    return () => unsub();
  }, [db, fs, myName, cleanExpired]);

  // ── Trigger an action (locally + send to Firebase) ──
  const triggerAction = useCallback((action) => {
    const s = stateRef.current;
    if (s.isPlaying) return;
    s.action = action;
    s.actionT = 0;
    s.isPlaying = true;
    setIsAnimating(true);
    sendAction(action);

    // Spawn particles
    const canvas = canvasRef.current;
    if (canvas) {
      const bearX  = canvas.width * 0.28;
      const bunnyX = canvas.width * 0.72;
      const midY   = canvas.height * 0.55;
      s.particles.push(...getActionParticles(action, bearX, bunnyX, midY));
    }
  }, [sendAction]);

  // ── Process queue ──
  const processQueue = useCallback(() => {
    const s = stateRef.current;
    if (s.isPlaying || s.queue.length === 0) return;
    const next = s.queue.shift();
    s.action = next.action;
    s.actionT = 0;
    s.isPlaying = true;
    setIsAnimating(true);
    markSeen([next.id]);

    const canvas = canvasRef.current;
    if (canvas) {
      const bearX  = canvas.width * 0.28;
      const bunnyX = canvas.width * 0.72;
      const midY   = canvas.height * 0.55;
      s.particles.push(...getActionParticles(next.action, bearX, bunnyX, midY));
    }
  }, [markSeen]);

  // ── Main render loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const ACTION_DURATION = 90; // frames
    const SCALE = canvas.width / 280;

    const bearX  = canvas.width * 0.28;
    const bearY  = canvas.height * 0.68;
    const bunnyX = canvas.width * 0.72;
    const bunnyY = canvas.height * 0.68;

    const loop = () => {
      const s = stateRef.current;
      s.time++;

      // ── Idle animation values ──
      const breathBear  = Math.sin(s.time * 0.04) * 1.5;
      const breathBunny = Math.sin(s.time * 0.04 + 1) * 1.5;
      const earWiggle   = Math.sin(s.time * 0.07) * 0.08;

      // Blink logic
      s.bearBlinkTimer--;
      if (s.bearBlinkTimer <= 0) { s.bearBlink = 1; s.bearBlinkTimer = 180 + Math.random() * 120; }
      if (s.bearBlink > 0) s.bearBlink = Math.max(0, s.bearBlink - 0.15);

      s.bunnyBlinkTimer--;
      if (s.bunnyBlinkTimer <= 0) { s.bunnyBlink = 1; s.bunnyBlinkTimer = 200 + Math.random() * 100; }
      if (s.bunnyBlink > 0) s.bunnyBlink = Math.max(0, s.bunnyBlink - 0.15);

      // ── Action progress ──
      let actionFrame = { bear: {}, bunny: {} };
      if (s.isPlaying && s.action) {
        s.actionT = Math.min(1, s.actionT + 1 / ACTION_DURATION);
        actionFrame = getActionFrame(s.action, s.actionT);

        if (s.actionT >= 1) {
          s.isPlaying = false;
          s.action = null;
          s.actionT = 0;
          setIsAnimating(false);
          // Try to play next queued action
          setTimeout(() => processQueue(), 400);
        }
      } else if (!s.isPlaying) {
        processQueue();
      }

      // ── Update particles ──
      s.particles = s.particles
        .map(p => ({ ...p, y: p.y + p.vy, alpha: p.alpha - 0.012 }))
        .filter(p => p.alpha > 0);

      // ── Draw ──
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background subtle glow between characters
      const grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.4);
      grd.addColorStop(0, 'rgba(180, 140, 255, 0.08)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bear
      drawBear(ctx, bearX, bearY, SCALE, {
        breathOffset: breathBear,
        blinkT: s.bearBlink,
        ...(actionFrame.bear || {}),
      });

      // Bunny (mirror horizontally so they face each other)
      ctx.save();
      ctx.translate(bunnyX, 0);
      ctx.scale(-1, 1);
      drawBunny(ctx, 0, bunnyY, SCALE, {
        breathOffset: breathBunny,
        blinkT: s.bunnyBlink,
        earWiggle,
        ...(actionFrame.bunny || {}),
      });
      ctx.restore();

      // Particles
      drawParticles(ctx, s.particles);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [processQueue]);

  // ── Resize canvas to container ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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
        <span>🐻 Mohamed</span>
        <span>Lena 🐰</span>
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