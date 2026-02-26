// components/Questions.js
// NEW FILE: Full Questions feature with Categories/Topics navigation,
// daily question assignment, answer submission, and partner answer reveal.

import { useState, useEffect } from 'react';
import { CATEGORIES, TOPICS, questions } from '../data/questions.js';


// ─── Firestore helpers (lazy loaded) ─────────────────────────────────────────
let _db = null;
let _fs = null;

async function getFirebase() {
  if (_db && _fs) return { db: _db, fs: _fs };
  const { db } = await import('../firebase/firebase');
  const fs = await import('firebase/firestore');
  _db = db;
  _fs = fs;
  return { db: _db, fs: _fs };
}

// ─── Color maps ──────────────────────────────────────────────────────────────
const COLOR = {
  blue:   { card: 'bg-blue-500/20 border-blue-400/30',   icon: 'bg-blue-500/30',   text: 'text-blue-300',   btn: 'bg-blue-600/70 hover:bg-blue-600',     ring: 'ring-blue-400' },
  green:  { card: 'bg-green-500/20 border-green-400/30', icon: 'bg-green-500/30',  text: 'text-green-300',  btn: 'bg-green-600/70 hover:bg-green-600',   ring: 'ring-green-400' },
  amber:  { card: 'bg-amber-500/20 border-amber-400/30', icon: 'bg-amber-500/30',  text: 'text-amber-300',  btn: 'bg-amber-600/70 hover:bg-amber-600',   ring: 'ring-amber-400' },
  purple: { card: 'bg-purple-500/20 border-purple-400/30',icon:'bg-purple-500/30', text: 'text-purple-300', btn: 'bg-purple-600/70 hover:bg-purple-600', ring: 'ring-purple-400' },
  orange: { card: 'bg-orange-500/20 border-orange-400/30',icon:'bg-orange-500/30', text: 'text-orange-300', btn: 'bg-orange-600/70 hover:bg-orange-600', ring: 'ring-orange-400' },
  rose:   { card: 'bg-rose-500/20 border-rose-400/30',   icon: 'bg-rose-500/30',   text: 'text-rose-300',   btn: 'bg-rose-600/70 hover:bg-rose-600',     ring: 'ring-rose-400' },
  red:    { card: 'bg-red-500/20 border-red-400/30',     icon: 'bg-red-500/30',    text: 'text-red-300',    btn: 'bg-red-600/70 hover:bg-red-600',       ring: 'ring-red-400' },
};

// ─── Today's date key ────────────────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ─── Deterministic daily question picker ─────────────────────────────────────
// category or topic can be 'any' to match all
function pickDailyQuestion(category, topic, usedIds = []) {
  const pool = questions.filter(q => {
    const catMatch = category === 'any' || q.category === category;
    const topMatch = topic === 'any' || q.topic === topic;
    return catMatch && topMatch && !usedIds.includes(q.id);
  });
  if (!pool.length) return null;
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const comboHash = (category + topic).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return pool[(seed + comboHash) % pool.length];
}

// ─── Firestore key for a combo's daily assignment ────────────────────────────
function comboDocId(category, topic) {
  return `${category}__${topic}__${todayKey()}`;
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

// Small card for category/topic grid
function SubCard({ item, answered, onClick }) {
  const c = COLOR[item.color] || COLOR.purple;
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${c.card} backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 text-center`}
    >
      {answered && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/80 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <div className={`w-12 h-12 rounded-full ${c.icon} flex items-center justify-center text-2xl`}>
        {item.emoji}
      </div>
      <p className={`text-sm font-semibold ${c.text} leading-tight`}>{item.label}</p>
      <p className="text-xs text-purple-400/80">{item.description}</p>
    </button>
  );
}

// Section selector cards (Categories / Topics)
function SectionCard({ emoji, title, subtitle, color, onClick }) {
  const c = COLOR[color] || COLOR.purple;
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border ${c.card} backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95`}
    >
      <div className={`w-16 h-16 rounded-2xl ${c.icon} flex items-center justify-center text-3xl`}>
        {emoji}
      </div>
      <div className="text-center">
        <p className={`font-bold text-base ${c.text}`}>{title}</p>
        <p className="text-xs text-purple-400 mt-1">{subtitle}</p>
      </div>
    </button>
  );
}

// Likert scale (5 options)
const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly\nDisagree', short: '🙅‍♀️' },
  { value: 2, label: 'Disagree',           short: '👎' },
  { value: 3, label: 'Neutral',            short: '😐' },
  { value: 4, label: 'Agree',              short: '👍' },
  { value: 5, label: 'Strongly\nAgree',    short: '🙆‍♀️' },
];

function LikertAnswer({ selected, onSelect, disabled }) {
  return (
    <div className="flex justify-between gap-1 mt-4">
      {LIKERT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          disabled={disabled}
          onClick={() => onSelect(opt.value)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-150
            ${selected === opt.value
              ? 'bg-purple-500/40 border-purple-400 scale-105'
              : 'bg-white/5 border-white/10 hover:bg-white/10'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-lg">{opt.short}</span>
          <span className="text-[10px] text-purple-300 text-center leading-tight whitespace-pre-line">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function BinaryAnswer({ options, selected, onSelect, disabled }) {
  return (
    <div className="flex gap-3 mt-4">
      {options.map((opt, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={() => onSelect(opt)}
          className={`flex-1 py-4 rounded-xl border text-sm font-semibold transition-all duration-150
            ${selected === opt
              ? 'bg-purple-500/40 border-purple-400 text-white scale-105'
              : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ImageAnswer({ question, selected, onSelect, disabled }) {
  return (
    <div className="flex gap-3 mt-4">
      {question.images.map((img, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={() => onSelect(question.options[i])}
          className={`flex-1 flex flex-col overflow-hidden rounded-xl border transition-all duration-150
            ${selected === question.options[i]
              ? 'border-purple-400 scale-105 shadow-lg shadow-purple-500/20'
              : 'border-white/10 hover:border-white/30'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="w-full aspect-square bg-white/10 flex items-center justify-center overflow-hidden">
            <img
              src={img}
              alt={question.options[i]}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div class="flex flex-col items-center justify-center h-full gap-2 p-2"><span class="text-3xl">🖼️</span><span class="text-xs text-purple-400 text-center">Placeholder</span></div>`;
              }}
            />
          </div>
          <div className={`py-2 px-1 text-center text-xs font-medium
            ${selected === question.options[i] ? 'text-purple-200 bg-purple-500/20' : 'text-purple-400 bg-white/5'}`}>
            {question.options[i]}
          </div>
        </button>
      ))}
    </div>
  );
}

function TextAnswer({ value, onChange, disabled }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      rows={4}
      placeholder="Write your honest answer here..."
      className="w-full mt-4 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none disabled:opacity-50"
    />
  );
}

// Partner answer reveal block
function PartnerAnswer({ partnerName, answer, question }) {
  const display = question.type === 'likert'
    ? LIKERT_OPTIONS.find(o => o.value === Number(answer))?.label || answer
    : answer;

  return (
    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <p className="text-xs text-purple-400 mb-2">{partnerName}'s answer:</p>
      <p className="text-white font-medium">{display}</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// QUESTION SCREEN
// ═════════════════════════════════════════════════════════════════════════════

function QuestionScreen({ category, topic, name, partnerName, onBack }) {
  const catInfo = CATEGORIES.find(c => c.id === category);
  const topInfo = TOPICS.find(t => t.id === topic);
  const c = COLOR[catInfo?.color || 'purple'];

  const [question, setQuestion] = useState(null);
  const [myAnswer, setMyAnswer] = useState(null);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [partnerAnswer, setPartnerAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noQuestions, setNoQuestions] = useState(false);

  // Load today's assigned question from Firestore (or create assignment)
  useEffect(() => {
    let unsubAnswers = null;

    async function load() {
      try {
        const { db, fs } = await getFirebase();
        const docId = comboDocId(category, topic);
        const assignRef = fs.doc(db, 'questionAssignments', docId);
        const assignSnap = await fs.getDoc(assignRef);

        let qId;
        if (assignSnap.exists()) {
          qId = assignSnap.data().questionId;
        } else {
          // Get all previously answered question IDs for this combo
          const answersSnap = await fs.getDocs(
            fs.query(
              fs.collection(db, 'questionAnswers'),
              fs.where('category', '==', category),
              fs.where('topic', '==', topic)
            )
          );
          const usedIds = [...new Set(answersSnap.docs.map(d => d.data().questionId))];
          const picked = pickDailyQuestion(category, topic, usedIds);
          if (!picked) { setNoQuestions(true); setLoading(false); return; }
          qId = picked.id;
          await fs.setDoc(assignRef, { questionId: qId, date: todayKey(), category, topic });
        }

        const q = questions.find(q => q.id === qId);
        if (!q) { setNoQuestions(true); setLoading(false); return; }
        setQuestion(q);

        // Listen for answers in real-time
        unsubAnswers = fs.onSnapshot(
          fs.query(
            fs.collection(db, 'questionAnswers'),
            fs.where('questionId', '==', qId),
            fs.where('date', '==', todayKey())
          ),
          snap => {
            snap.docs.forEach(d => {
              const data = d.data();
              if (data.name === name) setMyAnswer(data.answer);
              else if (data.name === partnerName) setPartnerAnswer(data.answer);
            });
          }
        );

        setLoading(false);
      } catch (e) {
        console.error('Error loading question:', e);
        setLoading(false);
      }
    }

    load();
    return () => { if (unsubAnswers) unsubAnswers(); };
  }, [category, topic, name, partnerName]);

  const handleSubmit = async () => {
    const answer = question.type === 'text' ? draftAnswer.trim() : draftAnswer;
    if (!answer) return;
    setIsSubmitting(true);
    try {
      const { db, fs } = await getFirebase();
      await fs.addDoc(fs.collection(db, 'questionAnswers'), {
        questionId: question.id,
        category,
        topic,
        name,
        answer,
        date: todayKey(),
        timestamp: fs.serverTimestamp(),
      });
    } catch (e) {
      console.error('Submit error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-purple-400 text-sm">Loading question...</p>
      </div>
    );
  }

  if (noQuestions || !question) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <span className="text-4xl">🎉</span>
        <p className="text-white font-semibold">All done!</p>
        <p className="text-purple-400 text-sm">You've answered every question in this combo. More coming soon.</p>
        <button onClick={onBack} className="mt-4 text-sm text-purple-300 hover:text-white underline">Go back</button>
      </div>
    );
  }

  const hasAnswered = !!myAnswer;
  const canSeePartner = hasAnswered && !!partnerAnswer;
  const partnerWaiting = hasAnswered && !partnerAnswer;

  return (
    <div className="flex flex-col gap-1">
      {/* Breadcrumb */}
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-200 mb-2 w-fit">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-1">
        <span className={`text-xs px-2 py-1 rounded-full ${c.card} ${c.text} border`}>{catInfo?.emoji} {catInfo?.label}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300">{topInfo?.emoji} {topInfo?.label}</span>
      </div>

      {/* Question */}
      <div className={`p-4 rounded-xl border ${c.card} mt-1`}>
        <p className="text-white font-semibold text-base leading-snug">{question.question}</p>
      </div>

      {/* Answer UI */}
      {question.type === 'likert' && (
        <LikertAnswer
          selected={hasAnswered ? Number(myAnswer) : (draftAnswer ? Number(draftAnswer) : null)}
          onSelect={v => !hasAnswered && setDraftAnswer(String(v))}
          disabled={hasAnswered}
        />
      )}
      {question.type === 'binary' && (
        <BinaryAnswer
          options={question.options}
          selected={hasAnswered ? myAnswer : draftAnswer}
          onSelect={v => !hasAnswered && setDraftAnswer(v)}
          disabled={hasAnswered}
        />
      )}
      {question.type === 'image' && (
        <ImageAnswer
          question={question}
          selected={hasAnswered ? myAnswer : draftAnswer}
          onSelect={v => !hasAnswered && setDraftAnswer(v)}
          disabled={hasAnswered}
        />
      )}
      {question.type === 'text' && (
        <TextAnswer
          value={hasAnswered ? myAnswer : draftAnswer}
          onChange={v => !hasAnswered && setDraftAnswer(v)}
          disabled={hasAnswered}
        />
      )}

      {/* Submit button */}
      {!hasAnswered && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !draftAnswer}
          className={`mt-3 w-full py-3 rounded-xl text-white text-sm font-semibold transition-all ${c.btn} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      )}

      {/* Partner answer */}
      {hasAnswered && (
        <div className="mt-3">
          {canSeePartner ? (
            <PartnerAnswer
              partnerName={partnerName}
              answer={partnerAnswer}
              question={question}
            />
          ) : partnerWaiting ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-lg">🔒</span>
              <p className="text-xs text-purple-400">Waiting for {partnerName} to answer before their answer is revealed...</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-CATEGORY GRID (after selecting Categories or Topics)
// ═════════════════════════════════════════════════════════════════════════════

function SubCategoryGrid({ mode, name, partnerName, onSelect, onBack }) {
  const items = mode === 'categories' ? CATEGORIES : TOPICS;
  const [answeredCombos, setAnsweredCombos] = useState({});

  // Load which combos the current user has already answered today
  useEffect(() => {
    async function load() {
      try {
        const { db, fs } = await getFirebase();
        const snap = await fs.getDocs(
          fs.query(
            fs.collection(db, 'questionAnswers'),
            fs.where('name', '==', name),
            fs.where('date', '==', todayKey())
          )
        );
        const combos = {};
        snap.docs.forEach(d => {
          const data = d.data();
          // In categories mode, track which category they answered today
          // In topics mode, track which topic they answered today
          const key = mode === 'categories' ? data.category : data.topic;
          if (key) combos[key] = true;
        });
        setAnsweredCombos(combos);
      } catch (e) {
        console.error('Error loading answered combos:', e);
      }
    }
    load();
  }, [name, mode]);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-200 mb-4 w-fit">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <p className="text-purple-300 text-xs mb-4">
        {mode === 'categories' ? 'Choose a game style to get your daily question.' : 'Choose a topic to get your daily question.'}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <SubCard
            key={item.id}
            item={item}
            answered={!!answeredCombos[item.id]}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN QUESTIONS COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function Questions({ name }) {
  const partnerName = name === 'Lena' ? 'Mohamed' : 'Lena';

  // nav: 'home' | 'categories' | 'topics' | 'question'
  const [nav, setNav] = useState('home');
  const [selectedMode, setSelectedMode] = useState(null); // 'categories' | 'topics'
  const [selectedSubId, setSelectedSubId] = useState(null);

  // Derived: when on question screen, what is the category and topic?
  // If mode=categories, user picked a category → we pick a topic from the question
  // If mode=topics, user picked a topic → we pick a category from the question
  // For simplicity: we use the sub-id as both and let the question picker handle it
  // Actually: we need both to look up. We'll derive from selected sub + first matching q.
  function getCategoryTopic() {
    if (!selectedSubId) return { category: null, topic: null };
    if (selectedMode === 'categories') {
      // They picked a category. For the question screen, we need a topic too.
      // We'll pass the category and null topic → question screen picks any topic
      return { category: selectedSubId, topic: null };
    } else {
      return { category: null, topic: selectedSubId };
    }
  }

  // For the question screen, we pass both. When one is null, the question screen
  // picks the best available question for that single filter.
  // Let's simplify: question screen always gets both; when one is "any", pass 'any'.

  const handleSubSelect = (subId) => {
    setSelectedSubId(subId);
    setNav('question');
  };

  const goBack = () => {
    if (nav === 'question') setNav(selectedMode);
    else if (nav === 'categories' || nav === 'topics') setNav('home');
    else setNav('home');
  };

  // Question screen props
  const qCategory = selectedMode === 'categories' ? selectedSubId : 'any';
  const qTopic    = selectedMode === 'topics'     ? selectedSubId : 'any';

  return (
    <div className="p-1 pb-4">
      {nav === 'home' && (
        <div>
          <p className="text-purple-300 text-sm mb-5 text-center">
            How do you want to explore today?
          </p>
          <div className="flex gap-4">
            <SectionCard
              emoji="🎮"
              title="Categories"
              subtitle="By game style"
              color="purple"
              onClick={() => { setSelectedMode('categories'); setNav('categories'); }}
            />
            <SectionCard
              emoji="🗂️"
              title="Topics"
              subtitle="By subject"
              color="amber"
              onClick={() => { setSelectedMode('topics'); setNav('topics'); }}
            />
          </div>
          <p className="text-center text-xs text-purple-500 mt-5">
            Same questions, two ways in ✨
          </p>
        </div>
      )}

      {(nav === 'categories' || nav === 'topics') && (
        <SubCategoryGrid
          mode={nav}
          name={name}
          partnerName={partnerName}
          onSelect={handleSubSelect}
          onBack={goBack}
        />
      )}

      {nav === 'question' && (
        <QuestionScreen
          category={qCategory}
          topic={qTopic}
          name={name}
          partnerName={partnerName}
          onBack={goBack}
        />
      )}
    </div>
  );
}