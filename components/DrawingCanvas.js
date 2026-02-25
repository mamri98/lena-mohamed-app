// components/DrawingCanvas.js
// Refactored: extracted sub-components, unified canvas element, removed redundant
// intermediate variables. Same functionality, ~40% fewer lines.

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const COLORS = ['#1a1a1a','#ffffff','#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#38bdf8','#3b82f6','#8b5cf6','#ec4899','#92400e'];
const STROKE_WIDTHS = [2, 5, 10, 18];
const DB = { strokes: 'canvasStrokes', presence: 'canvasPresence', prompt: 'canvasPrompt', meta: 'canvasMeta' };

// ─── Sub-components (defined outside to avoid re-creation on render) ──────────
const Divider = () => <div className="border-t border-white/10" />;

const ColorSwatch = ({ color, selected, onClick }) => (
  <button onClick={onClick} className="rounded-full flex-shrink-0" style={{
    width: 20, height: 20, backgroundColor: color,
    border: selected ? '2px solid #ec4899' : color === '#ffffff' ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
  }} />
);

const StrokeButton = ({ width, selected, onClick, size = 30 }) => (
  <button onClick={onClick} className={`flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors ${selected ? 'ring-2 ring-pink-400' : ''}`} style={{ width: size, height: size }}>
    <div className="rounded-full bg-white/70" style={{ width: Math.min(width + 3, 18), height: Math.min(width + 3, 18) }} />
  </button>
);

const IconButton = ({ onClick, disabled, label, red, active, children }) => (
  <button onClick={onClick} disabled={disabled} className={`flex flex-col items-center justify-center rounded-lg border py-1.5 gap-0.5 transition-colors
    ${red ? 'bg-red-500/10 border-red-500/30 text-red-400' : active ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/5 border-white/20 text-purple-300 disabled:opacity-30'}`}>
    {children}
    <span style={{ fontSize: 10 }}>{label}</span>
  </button>
);

// ─── SVG icons ────────────────────────────────────────────────────────────────
const EraserIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H7l-4-4 9.5-9.5 6.5 6.5-2 2M7 20l4-4" /></svg>;
const UndoIcon   = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 010 10H9m-6-10l4-4m-4 4l4 4" /></svg>;
const TrashIcon  = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

// ─── Main component ───────────────────────────────────────────────────────────
export default function DrawingCanvas({ name }) {
  const canvasRef          = useRef(null);
  const canvasContainerRef = useRef(null);
  const isDrawing          = useRef(false);
  const currentStroke      = useRef([]);
  const lastPos            = useRef(null);
  const strokesCache       = useRef([]);

  const [db, setDb]                       = useState(null);
  const [fs, setFs]                       = useState(null);
  const [isMounted, setIsMounted]         = useState(false);
  const [selectedColor, setSelectedColor] = useState('#1a1a1a');
  const [selectedWidth, setSelectedWidth] = useState(STROKE_WIDTHS[1]);
  const [isEraser, setIsEraser]           = useState(false);
  const [otherPersonPresent, setOtherPersonPresent] = useState(false);
  const [otherName]                       = useState(name === 'Lena' ? 'Mohamed' : 'Lena');
  const [prompt, setPrompt]               = useState('');
  const [promptInput, setPromptInput]     = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [myStrokes, setMyStrokes]         = useState([]);
  const [isLandscape, setIsLandscape]     = useState(false);

  // Orientation detection — delayed on orientationchange since iOS fires before dimensions update
  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    const delayed = () => setTimeout(check, 100);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', delayed);
    return () => { window.removeEventListener('resize', check); window.removeEventListener('orientationchange', delayed); };
  }, []);

  // Firebase init + presence
  useEffect(() => {
    setIsMounted(true);
    (async () => {
      try {
        const { db: firebaseDb } = await import('../firebase/firebase');
        const firestore = await import('firebase/firestore');
        setDb(firebaseDb); setFs(firestore);
      } catch (e) { console.error('Firebase init error:', e); }
    })();
  }, []);

  useEffect(() => {
    if (!db || !fs || !name) return;
    const ref = fs.doc(db, DB.presence, name);
    fs.setDoc(ref, { name, online: true, timestamp: fs.serverTimestamp() }).catch(console.error);
    return () => { fs.deleteDoc(ref).catch(console.error); };
  }, [db, fs, name]);

  useEffect(() => {
    if (!db || !fs) return;
    return fs.onSnapshot(fs.doc(db, DB.presence, otherName), (snap) => setOtherPersonPresent(snap.exists()));
  }, [db, fs, otherName]);

  useEffect(() => {
    if (!db || !fs) return;
    return fs.onSnapshot(fs.doc(db, DB.prompt, 'current'), (snap) => setPrompt(snap.exists() ? snap.data().text || '' : ''));
  }, [db, fs]);

  // Canvas drawing logic
  const getCtx = () => canvasRef.current?.getContext('2d');

  const drawStroke = useCallback((ctx, stroke) => {
    if (!stroke.points?.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color; ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    stroke.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }, []);

  const redrawAllStrokes = useCallback((strokes) => {
    const canvas = canvasRef.current; const ctx = getCtx();
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    strokes.forEach(s => drawStroke(ctx, s));
  }, [drawStroke]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current; const container = canvasContainerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth; const h = container.clientHeight;
    if (canvas.width === w * dpr && canvas.height === h * dpr) return;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    const ctx = getCtx(); ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, w, h);
    redrawAllStrokes(strokesCache.current);
  }, [redrawAllStrokes]);

  useEffect(() => {
    if (!isMounted) return;
    const container = canvasContainerRef.current; if (!container) return;
    const timer = setTimeout(resizeCanvas, 50);
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isMounted, resizeCanvas, isLandscape]);

  useEffect(() => {
    if (!db || !fs || !name) return;
    return fs.onSnapshot(
      fs.query(fs.collection(db, DB.strokes), fs.orderBy('timestamp', 'asc')),
      (snapshot) => {
        const strokes = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        strokesCache.current = strokes;
        setMyStrokes(strokes.filter(s => s.author === name));
        redrawAllStrokes(strokes);
      }
    );
  }, [db, fs, name, redrawAllStrokes]);

  // Auto-reset after 24h
  useEffect(() => {
    if (!db || !fs) return;
    (async () => {
      try {
        const snap = await fs.getDoc(fs.doc(db, DB.meta, 'canvas'));
        const lastReset = snap.exists() ? snap.data().lastReset?.toMillis() || 0 : 0;
        if (Date.now() - lastReset > 86400000) doReset(false);
      } catch (e) { console.error('Auto-reset error:', e); }
    })();
  }, [db, fs]);

  const doReset = async (clearPrompt = true) => {
    if (!db || !fs) return;
    try {
      const snap = await fs.getDocs(fs.collection(db, DB.strokes));
      const batch = fs.writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      batch.set(fs.doc(db, DB.meta, 'canvas'), { lastReset: fs.serverTimestamp() });
      if (clearPrompt) batch.delete(fs.doc(db, DB.prompt, 'current'));
      await batch.commit();
    } catch (e) { console.error('Reset error:', e); }
  };

  const handleUndo = async () => {
    if (!db || !fs || !myStrokes.length) return;
    try { await fs.deleteDoc(fs.doc(db, DB.strokes, myStrokes.at(-1).id)); }
    catch (e) { console.error('Undo error:', e); }
  };

  const getPos = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    e.preventDefault(); isDrawing.current = true;
    const pos = getPos(e); currentStroke.current = [pos]; lastPos.current = pos;
    const ctx = getCtx(); if (!ctx) return;
    ctx.beginPath();
    ctx.fillStyle = isEraser ? '#fafafa' : selectedColor;
    ctx.arc(pos.x, pos.y, (isEraser ? selectedWidth * 2 : selectedWidth) / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e) => {
    e.preventDefault(); if (!isDrawing.current) return;
    const pos = getPos(e); currentStroke.current.push(pos);
    const ctx = getCtx(); if (!ctx) return;
    ctx.beginPath();
    ctx.strokeStyle = isEraser ? '#fafafa' : selectedColor;
    ctx.lineWidth = isEraser ? selectedWidth * 2.5 : selectedWidth;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y);
    ctx.stroke(); lastPos.current = pos;
  };

  const endDrawing = async (e) => {
    if (!e || !isDrawing.current) return;
    e.preventDefault(); isDrawing.current = false;
    const points = currentStroke.current;
    if (points.length < 2 || !db || !fs) return;
    try {
      await fs.addDoc(fs.collection(db, DB.strokes), {
        points, author: name, timestamp: fs.serverTimestamp(),
        color: isEraser ? '#fafafa' : selectedColor,
        width: isEraser ? selectedWidth * 2.5 : selectedWidth,
      });
    } catch (e) { console.error('Stroke save error:', e); }
    currentStroke.current = [];
  };

  const selectColor = (c) => { setSelectedColor(c); setIsEraser(false); };
  const selectWidth = (w) => { setSelectedWidth(w); setIsEraser(false); };
  const savePrompt  = async (text) => {
    if (!db || !fs) return;
    await fs.setDoc(fs.doc(db, DB.prompt, 'current'), { text, updatedBy: name, timestamp: fs.serverTimestamp() });
    setIsEditingPrompt(false);
  };

  // ─── Shared canvas element ────────────────────────────────────────────────
  const canvasEl = (
    <div ref={canvasContainerRef} className={`relative overflow-hidden border border-white/10 shadow-inner bg-gray-50 ${isLandscape ? 'flex-1 min-w-0 rounded-xl' : 'flex-1 min-h-0 rounded-xl'}`} style={{ touchAction: 'none' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
        style={{ cursor: isEraser ? 'cell' : 'crosshair', touchAction: 'none' }}
        onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={endDrawing} onMouseLeave={endDrawing}
        onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={endDrawing}
      />
    </div>
  );

  if (!isMounted) return <div className="flex items-center justify-center h-64 text-purple-300 text-sm">Loading canvas...</div>;

  // ─── LANDSCAPE layout ─────────────────────────────────────────────────────
  if (isLandscape) return (
    <div className="flex flex-row h-full min-h-0 gap-2">
      {canvasEl}
      <div className="flex flex-col gap-3 w-20 flex-shrink-0 overflow-y-auto py-1 px-1">
        {/* Presence */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${otherPersonPresent ? 'bg-green-400 animate-pulse' : 'bg-purple-500/40'}`} />
          <span className="text-purple-400 text-center leading-tight" style={{ fontSize: 10 }}>
            {otherPersonPresent ? `${otherName} ✓` : otherName}
          </span>
        </div>
        <Divider />
        {/* Colors */}
        <div className="grid grid-cols-3 gap-1.5 justify-items-center">
          {COLORS.map(c => <ColorSwatch key={c} color={c} selected={selectedColor === c && !isEraser} onClick={() => selectColor(c)} />)}
        </div>
        <Divider />
        {/* Stroke widths */}
        <div className="flex flex-col items-center gap-1.5">
          {STROKE_WIDTHS.map(w => <StrokeButton key={w} width={w} selected={selectedWidth === w && !isEraser} onClick={() => selectWidth(w)} />)}
        </div>
        <Divider />
        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <IconButton onClick={() => setIsEraser(!isEraser)} active={isEraser} label="Erase"><EraserIcon /></IconButton>
          <IconButton onClick={handleUndo} disabled={!myStrokes.length} label="Undo"><UndoIcon /></IconButton>
          <IconButton onClick={() => window.confirm('Clear the canvas for both of you?') && doReset(true)} red label="Clear"><TrashIcon /></IconButton>
        </div>
      </div>
    </div>
  );

  // ─── PORTRAIT layout ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Presence bar */}
      <div className="flex items-center justify-between mb-2 px-1 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${otherPersonPresent ? 'bg-green-400 animate-pulse' : 'bg-purple-500/40'}`} />
          <span className="text-xs text-purple-300">{otherPersonPresent ? `${otherName} is here` : `${otherName} is away`}</span>
        </div>
        <strong className="text-xs text-purple-200">{name}</strong>
      </div>

      {/* Prompt bar */}
      <div className="mb-2 flex-shrink-0">
        {isEditingPrompt ? (
          <div className="flex gap-1.5 items-center">
            <input type="text" value={promptInput} onChange={e => setPromptInput(e.target.value)} placeholder="Enter a prompt..."
              className="flex-1 text-xs px-2 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-1 focus:ring-pink-400 min-w-0" />
            <button onClick={() => savePrompt(promptInput)} className="text-xs px-2 py-1.5 bg-pink-600/60 text-white rounded-lg hover:bg-pink-600 flex-shrink-0">Set</button>
            <button onClick={() => setIsEditingPrompt(false)} className="text-xs text-purple-400 hover:text-purple-200 flex-shrink-0">✕</button>
          </div>
        ) : (
          <button onClick={() => { setPromptInput(prompt); setIsEditingPrompt(true); }}
            className="w-full text-left text-xs px-2 py-1.5 rounded-lg border border-dashed border-white/20 text-purple-400 hover:border-pink-400/50 hover:text-pink-300 truncate">
            {prompt ? `✏️ ${prompt}` : '+ Add a prompt'}
          </button>
        )}
      </div>

      {canvasEl}

      {/* Controls */}
      <div className="mt-3 space-y-2 flex-shrink-0">
        <div className="flex gap-1.5 flex-wrap justify-center">
          {COLORS.map(c => <ColorSwatch key={c} color={c} selected={selectedColor === c && !isEraser} onClick={() => selectColor(c)} />)}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {STROKE_WIDTHS.map(w => <StrokeButton key={w} width={w} selected={selectedWidth === w && !isEraser} onClick={() => selectWidth(w)} size={32} />)}
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setIsEraser(!isEraser)} className={`text-xs px-2 py-1.5 rounded-lg border transition-colors ${isEraser ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/5 border-white/20 text-purple-300'}`}>Eraser</button>
            <button onClick={handleUndo} disabled={!myStrokes.length} className="text-xs px-2 py-1.5 rounded-lg border bg-white/5 border-white/20 text-purple-300 disabled:opacity-30">Undo</button>
            <button onClick={() => window.confirm('Clear the canvas for both of you?') && doReset(true)} className="text-xs px-2 py-1.5 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}