// components/DrawingCanvas.js
// CHANGED: Added landscape layout mode — detects orientation and switches to a
// horizontal layout where the canvas fills the left and controls become a compact
// right-side panel. Portrait mode is unchanged.

import { useState, useEffect, useRef, useCallback } from 'react';

const COLORS = [
  '#1a1a1a', '#ffffff', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#38bdf8',
  '#3b82f6', '#8b5cf6', '#ec4899', '#92400e',
];
const STROKE_WIDTHS = [2, 5, 10, 18];
const STROKES_COLLECTION = 'canvasStrokes';
const PRESENCE_COLLECTION = 'canvasPresence';
const PROMPT_COLLECTION = 'canvasPrompt';
const META_COLLECTION = 'canvasMeta';

export default function DrawingCanvas({ name }) {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef([]);
  const lastPos = useRef(null);
  const strokesCache = useRef([]);

  const [db, setDb] = useState(null);
  const [fs, setFs] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#1a1a1a');
  const [selectedWidth, setSelectedWidth] = useState(STROKE_WIDTHS[1]);
  const [isEraser, setIsEraser] = useState(false);
  const [otherPersonPresent, setOtherPersonPresent] = useState(false);
  const [otherName] = useState(name === 'Lena' ? 'Mohamed' : 'Lena');
  const [prompt, setPrompt] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [myStrokes, setMyStrokes] = useState([]);
  const [isLandscape, setIsLandscape] = useState(false);

  // Detect orientation — delay after orientationchange because dimensions
  // aren't updated yet at the moment the event fires on iOS/Android
  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    const delayedCheck = () => setTimeout(check, 100);
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', delayedCheck);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', delayedCheck);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const init = async () => {
      try {
        const { db: firebaseDb } = await import('../firebase/firebase');
        const firestore = await import('firebase/firestore');
        setDb(firebaseDb);
        setFs(firestore);
      } catch (e) { console.error('Firebase init error:', e); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!db || !fs || !name) return;
    const ref = fs.doc(db, PRESENCE_COLLECTION, name);
    fs.setDoc(ref, { name, online: true, timestamp: fs.serverTimestamp() }).catch(console.error);
    return () => { fs.deleteDoc(ref).catch(console.error); };
  }, [db, fs, name]);

  useEffect(() => {
    if (!db || !fs) return;
    const ref = fs.doc(db, PRESENCE_COLLECTION, otherName);
    return fs.onSnapshot(ref, (snap) => setOtherPersonPresent(snap.exists()));
  }, [db, fs, otherName]);

  useEffect(() => {
    if (!db || !fs) return;
    const ref = fs.doc(db, PROMPT_COLLECTION, 'current');
    return fs.onSnapshot(ref, (snap) => setPrompt(snap.exists() ? snap.data().text || '' : ''));
  }, [db, fs]);

  const savePrompt = async (text) => {
    if (!db || !fs) return;
    await fs.setDoc(fs.doc(db, PROMPT_COLLECTION, 'current'), { text, updatedBy: name, timestamp: fs.serverTimestamp() });
    setIsEditingPrompt(false);
  };

  const getCtx = () => canvasRef.current?.getContext('2d');

  const drawStroke = useCallback((ctx, stroke) => {
    if (!stroke.points || stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    ctx.stroke();
  }, []);

  const redrawAllStrokes = useCallback((strokes) => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    strokes.forEach((s) => drawStroke(ctx, s));
  }, [drawStroke]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (canvas.width === w * dpr && canvas.height === h * dpr) return;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = getCtx();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);
    redrawAllStrokes(strokesCache.current);
  }, [redrawAllStrokes]);

  useEffect(() => {
    if (!isMounted) return;
    const container = canvasContainerRef.current;
    if (!container) return;
    const timer = setTimeout(resizeCanvas, 50);
    const observer = new ResizeObserver(() => resizeCanvas());
    observer.observe(container);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isMounted, resizeCanvas, isLandscape]); // re-run when orientation changes

  useEffect(() => {
    if (!db || !fs || !name) return;
    const q = fs.query(fs.collection(db, STROKES_COLLECTION), fs.orderBy('timestamp', 'asc'));
    return fs.onSnapshot(q, (snapshot) => {
      const strokes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      strokesCache.current = strokes;
      setMyStrokes(strokes.filter((s) => s.author === name));
      redrawAllStrokes(strokes);
    });
  }, [db, fs, name, redrawAllStrokes]);

  useEffect(() => {
    if (!db || !fs) return;
    const checkReset = async () => {
      try {
        const metaSnap = await fs.getDoc(fs.doc(db, META_COLLECTION, 'canvas'));
        const lastReset = metaSnap.exists() ? metaSnap.data().lastReset?.toMillis() || 0 : 0;
        if (Date.now() - lastReset > 24 * 60 * 60 * 1000) await doReset(false);
      } catch (e) { console.error('Auto-reset error:', e); }
    };
    checkReset();
  }, [db, fs]);

  const doReset = async (clearPromptToo = true) => {
    if (!db || !fs) return;
    try {
      const strokesSnap = await fs.getDocs(fs.collection(db, STROKES_COLLECTION));
      const batch = fs.writeBatch(db);
      strokesSnap.docs.forEach((d) => batch.delete(d.ref));
      batch.set(fs.doc(db, META_COLLECTION, 'canvas'), { lastReset: fs.serverTimestamp() });
      if (clearPromptToo) batch.delete(fs.doc(db, PROMPT_COLLECTION, 'current'));
      await batch.commit();
    } catch (e) { console.error('Reset error:', e); }
  };

  const handleReset = () => { if (window.confirm('Clear the canvas for both of you?')) doReset(true); };

  const handleUndo = async () => {
    if (!db || !fs || myStrokes.length === 0) return;
    try { await fs.deleteDoc(fs.doc(db, STROKES_COLLECTION, myStrokes[myStrokes.length - 1].id)); }
    catch (e) { console.error('Undo error:', e); }
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e);
    currentStroke.current = [pos];
    lastPos.current = pos;
    const ctx = getCtx();
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = isEraser ? '#fafafa' : selectedColor;
      ctx.arc(pos.x, pos.y, (isEraser ? selectedWidth * 2 : selectedWidth) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pos = getPos(e);
    currentStroke.current.push(pos);
    const ctx = getCtx();
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = isEraser ? '#fafafa' : selectedColor;
      ctx.lineWidth = isEraser ? selectedWidth * 2.5 : selectedWidth;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const endDrawing = async (e) => {
    if (!e || !isDrawing.current) return;
    e.preventDefault();
    isDrawing.current = false;
    const points = currentStroke.current;
    if (points.length < 2 || !db || !fs) return;
    try {
      await fs.addDoc(fs.collection(db, STROKES_COLLECTION), {
        points, color: isEraser ? '#fafafa' : selectedColor,
        width: isEraser ? selectedWidth * 2.5 : selectedWidth,
        author: name, timestamp: fs.serverTimestamp(),
      });
    } catch (e) { console.error('Stroke save error:', e); }
    currentStroke.current = [];
  };

  if (!isMounted) {
    return <div className="flex items-center justify-center h-64 text-purple-300 text-sm">Loading canvas...</div>;
  }

  // ─── Shared controls (used in both layouts) ───────────────────────────────

  const colorPalette = (
    <div className={`flex flex-wrap gap-1.5 justify-center`}>
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => { setSelectedColor(color); setIsEraser(false); }}
          className="rounded-full transition-transform hover:scale-110 flex-shrink-0"
          style={{
            width: 22, height: 22, backgroundColor: color,
            border: selectedColor === color && !isEraser
              ? '3px solid #ec4899'
              : color === '#ffffff' ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
            transform: selectedColor === color && !isEraser ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );

  const strokePicker = (
    <div className={`flex ${isLandscape ? 'flex-col items-center' : 'flex-row'} gap-1.5`}>
      {STROKE_WIDTHS.map((w) => (
        <button
          key={w}
          onClick={() => { setSelectedWidth(w); setIsEraser(false); }}
          className={`flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0 ${selectedWidth === w && !isEraser ? 'ring-2 ring-pink-400' : ''}`}
          style={{ width: 30, height: 30 }}
        >
          <div className="rounded-full bg-white/70" style={{ width: Math.min(w + 4, 20), height: Math.min(w + 4, 20) }} />
        </button>
      ))}
    </div>
  );

  const actionButtons = (
    <div className={`flex ${isLandscape ? 'flex-col' : 'flex-row'} gap-1.5`}>
      <button
        onClick={() => setIsEraser(!isEraser)}
        className={`text-xs px-2 py-1.5 rounded-lg border transition-colors ${isEraser ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/5 border-white/20 text-purple-300 hover:border-white/30'}`}
      >
        Eraser
      </button>
      <button
        onClick={handleUndo}
        disabled={myStrokes.length === 0}
        className="text-xs px-2 py-1.5 rounded-lg border bg-white/5 border-white/20 text-purple-300 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Undo
      </button>
      <button
        onClick={handleReset}
        className="text-xs px-2 py-1.5 rounded-lg border bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
      >
        Clear
      </button>
    </div>
  );

  const presenceBar = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full inline-block flex-shrink-0 ${otherPersonPresent ? 'bg-green-400 animate-pulse' : 'bg-purple-500/40'}`} />
        <span className="text-xs text-purple-300 truncate">
          {otherPersonPresent ? `${otherName} is here` : `${otherName} is away`}
        </span>
      </div>
      <span className="text-xs text-purple-400 ml-2 flex-shrink-0">
        <strong className="text-purple-200">{name}</strong>
      </span>
    </div>
  );

  const promptBar = isEditingPrompt ? (
    <div className="flex gap-1.5 items-center">
      <input
        type="text"
        value={promptInput}
        onChange={(e) => setPromptInput(e.target.value)}
        placeholder="Enter a prompt..."
        className="flex-1 text-xs px-2 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-1 focus:ring-pink-400 min-w-0"
      />
      <button onClick={() => savePrompt(promptInput)} className="text-xs px-2 py-1.5 bg-pink-600/60 text-white rounded-lg hover:bg-pink-600 transition-colors flex-shrink-0">Set</button>
      <button onClick={() => setIsEditingPrompt(false)} className="text-xs px-1 py-1.5 text-purple-400 hover:text-purple-200 flex-shrink-0">✕</button>
    </div>
  ) : (
    <button
      onClick={() => { setPromptInput(prompt); setIsEditingPrompt(true); }}
      className="w-full text-left text-xs px-2 py-1.5 rounded-lg border border-dashed border-white/20 text-purple-400 hover:border-pink-400/50 hover:text-pink-300 transition-colors truncate"
    >
      {prompt ? `✏️ ${prompt}` : '+ Add a prompt'}
    </button>
  );

  // ─── LANDSCAPE layout ─────────────────────────────────────────────────────
  if (isLandscape) {
    return (
      <div className="flex flex-row h-full min-h-0 gap-2">
        {/* Canvas — takes up all available width */}
        <div
          ref={canvasContainerRef}
          className="relative flex-1 min-w-0 rounded-xl overflow-hidden border border-white/10 shadow-inner bg-gray-50"
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ cursor: isEraser ? 'cell' : 'crosshair', touchAction: 'none' }}
            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={endDrawing} onMouseLeave={endDrawing}
            onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={endDrawing}
          />
        </div>

        {/* Right sidebar — compact vertical controls */}
        <div className="flex flex-col gap-2 w-14 flex-shrink-0 justify-between py-1">
          {/* Presence dot */}
          <div className="flex flex-col items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${otherPersonPresent ? 'bg-green-400 animate-pulse' : 'bg-purple-500/40'}`} />
            <span className="text-purple-400" style={{ fontSize: 9, textAlign: 'center', lineHeight: 1.2 }}>
              {otherPersonPresent ? `${otherName} ✓` : otherName}
            </span>
          </div>

          {/* Color palette — 2 column grid */}
          <div className="grid grid-cols-2 gap-1 justify-items-center">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => { setSelectedColor(color); setIsEraser(false); }}
                className="rounded-full flex-shrink-0"
                style={{
                  width: 18, height: 18, backgroundColor: color,
                  border: selectedColor === color && !isEraser
                    ? '2px solid #ec4899'
                    : color === '#ffffff' ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                }}
              />
            ))}
          </div>

          {/* Stroke widths */}
          <div className="flex flex-col items-center gap-1">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => { setSelectedWidth(w); setIsEraser(false); }}
                className={`flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors ${selectedWidth === w && !isEraser ? 'ring-2 ring-pink-400' : ''}`}
                style={{ width: 26, height: 26 }}
              >
                <div className="rounded-full bg-white/70" style={{ width: Math.min(w + 2, 16), height: Math.min(w + 2, 16) }} />
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`text-center rounded-lg border transition-colors leading-tight py-1 ${isEraser ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/5 border-white/20 text-purple-300'}`}
              style={{ fontSize: 9 }}
            >
              Erase
            </button>
            <button
              onClick={handleUndo}
              disabled={myStrokes.length === 0}
              className="text-center rounded-lg border bg-white/5 border-white/20 text-purple-300 disabled:opacity-30 py-1"
              style={{ fontSize: 9 }}
            >
              Undo
            </button>
            <button
              onClick={handleReset}
              className="text-center rounded-lg border bg-red-500/10 border-red-500/20 text-red-400 py-1"
              style={{ fontSize: 9 }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PORTRAIT layout (unchanged) ──────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-2 px-1 flex-shrink-0">
        {presenceBar}
      </div>

      <div className="mb-2 flex-shrink-0">
        {promptBar}
      </div>

      <div
        ref={canvasContainerRef}
        className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10 shadow-inner bg-gray-50"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: isEraser ? 'cell' : 'crosshair', touchAction: 'none' }}
          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={endDrawing} onMouseLeave={endDrawing}
          onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={endDrawing}
        />
      </div>

      <div className="mt-3 space-y-2 flex-shrink-0">
        {colorPalette}
        <div className="flex items-center justify-between gap-2">
          {strokePicker}
          {actionButtons}
        </div>
      </div>
    </div>
  );
}