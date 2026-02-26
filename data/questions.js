// data/questions.js
// CHANGED: Replaced all questions with user-provided list from questions.csv
// Full question pool for the Questions feature
// Each question is tagged with a category (format/game-style) and a topic (subject matter)
// Categories: agree-or-disagree, never-have-i-ever, this-or-that, whos-more-likely, would-you-rather, transparency-check
// Topics: daily-lifestyle, relationship, food, sex-intimacy, future-goals, hobbies

export const CATEGORIES = [
  { id: 'agree-or-disagree', label: 'Agree or Disagree', emoji: '⚖️', color: 'blue', description: 'Share your stance' },
  { id: 'never-have-i-ever', label: 'Never Have I Ever', emoji: '🙋', color: 'green', description: 'Confess your firsts' },
  { id: 'this-or-that', label: 'This or That', emoji: '🔀', color: 'amber', description: 'Pick your side' },
  { id: 'whos-more-likely', label: "Who's More Likely To", emoji: '👆', color: 'purple', description: 'Point the finger' },
  { id: 'would-you-rather', label: 'Would You Rather', emoji: '🤔', color: 'orange', description: 'The hard choices' },
  { id: 'transparency-check', label: 'Transparency Check', emoji: '💬', color: 'rose', description: 'Open up honestly' },
];

export const TOPICS = [
  { id: 'daily-lifestyle', label: 'Daily Life & Lifestyle', emoji: '☀️', color: 'amber', description: 'Everyday moments' },
  { id: 'relationship', label: 'Relationship', emoji: '💜', color: 'purple', description: 'Us and our bond' },
  { id: 'food', label: 'Food', emoji: '🍽️', color: 'orange', description: 'Tastes and cravings' },
  { id: 'sex-intimacy', label: 'Sex & Intimacy', emoji: '🔥', color: 'red', description: 'Closeness and desire' },
  { id: 'future-goals', label: 'Our Future & Goals', emoji: '🌟', color: 'green', description: 'Dreams we share' },
  { id: 'hobbies', label: 'Hobbies', emoji: '🎨', color: 'blue', description: 'What we love doing' },
];

// Answer types:
// 'likert' — 5-point scale (strongly disagree → strongly agree) for agree-or-disagree
// 'binary' — two labeled buttons
// 'image' — two images side by side (this-or-that)
// 'text' — free text box (transparency-check)

export const questions = [

  // ─────────────────────────────────────────────
  // AGREE OR DISAGREE
  // ─────────────────────────────────────────────

  // hobbies
  {
    id: 'aod-hob-1',
    category: 'agree-or-disagree',
    topic: 'hobbies',
    type: 'likert',
    question: 'Couples who share hobbies have better relationships than those who don\'t.',
  },
  {
    id: 'aod-hob-2',
    category: 'agree-or-disagree',
    topic: 'hobbies',
    type: 'likert',
    question: 'Having separate hobbies is essential for maintaining individuality in a relationship.',
  },

  // daily-lifestyle
  {
    id: 'aod-dl-1',
    category: 'agree-or-disagree',
    topic: 'daily-lifestyle',
    type: 'likert',
    question: 'Social media has a mostly negative effect on mental health.',
  },

  // future-goals
  {
    id: 'aod-fg-1',
    category: 'agree-or-disagree',
    topic: 'future-goals',
    type: 'likert',
    question: 'One partner should be the primary breadwinner while the other focuses on home life.',
  },
  {
    id: 'aod-fg-2',
    category: 'agree-or-disagree',
    topic: 'future-goals',
    type: 'likert',
    question: 'Both partners should contribute equally to household finances.',
  },

  // relationship
  {
    id: 'aod-rel-1',
    category: 'agree-or-disagree',
    topic: 'relationship',
    type: 'likert',
    question: 'You should never go to bed angry at your partner.',
  },

  // sex-intimacy
  {
    id: 'aod-si-1',
    category: 'agree-or-disagree',
    topic: 'sex-intimacy',
    type: 'likert',
    question: 'Talking openly about intimacy makes a relationship stronger.',
  },

  // ─────────────────────────────────────────────
  // NEVER HAVE I EVER
  // ─────────────────────────────────────────────

  // daily-lifestyle
  {
    id: 'nhie-dl-1',
    category: 'never-have-i-ever',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Never have I ever fallen asleep in a movie theatre.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-dl-2',
    category: 'never-have-i-ever',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Never have I ever cried in public.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // relationship
  {
    id: 'nhie-rel-1',
    category: 'never-have-i-ever',
    topic: 'relationship',
    type: 'binary',
    question: 'Never have I ever felt jealous and pretended I wasn\'t.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // food
  {
    id: 'nhie-food-1',
    category: 'never-have-i-ever',
    topic: 'food',
    type: 'binary',
    question: 'Never have I ever eaten something off the floor.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // hobbies
  {
    id: 'nhie-hob-1',
    category: 'never-have-i-ever',
    topic: 'hobbies',
    type: 'binary',
    question: 'Never have I ever gotten obsessed with something for a month and then completely dropped it.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // ─────────────────────────────────────────────
  // THIS OR THAT (image-based)
  // ─────────────────────────────────────────────

  {
    id: 'tot-fg-1',
    category: 'this-or-that',
    topic: 'future-goals',
    type: 'image',
    question: 'Our Dream Home',
    options: ['Option A', 'Option B'],
    images: ['/placeholders/home-a.jpg', '/placeholders/home-b.jpg'],
  },
  {
    id: 'tot-hob-1',
    category: 'this-or-that',
    topic: 'hobbies',
    type: 'image',
    question: 'Our Ideal Vacation',
    options: ['Option A', 'Option B'],
    images: ['/placeholders/vacation-a.jpg', '/placeholders/vacation-b.jpg'],
  },
  {
    id: 'tot-hob-2',
    category: 'this-or-that',
    topic: 'hobbies',
    type: 'image',
    question: 'Ideal Night In',
    options: ['Option A', 'Option B'],
    images: ['/placeholders/nightin-a.jpg', '/placeholders/nightin-b.jpg'],
  },
  {
    id: 'tot-si-1',
    category: 'this-or-that',
    topic: 'sex-intimacy',
    type: 'image',
    question: 'Romantic Getaway',
    options: ['Option A', 'Option B'],
    images: ['/placeholders/getaway-a.jpg', '/placeholders/getaway-b.jpg'],
  },

  // ─────────────────────────────────────────────
  // WHO'S MORE LIKELY TO
  // ─────────────────────────────────────────────

  // hobbies
  {
    id: 'wml-hob-1',
    category: 'whos-more-likely',
    topic: 'hobbies',
    type: 'binary',
    question: "Who's more likely to spend hours on a creative project and lose track of time?",
    options: ['Me 🙋', 'You 👉'],
  },

  // sex-intimacy
  {
    id: 'wml-si-1',
    category: 'whos-more-likely',
    topic: 'sex-intimacy',
    type: 'binary',
    question: "Who's more likely to initiate a spontaneous romantic evening?",
    options: ['Me 🙋', 'You 👉'],
  },

  // food
  {
    id: 'wml-food-1',
    category: 'whos-more-likely',
    topic: 'food',
    type: 'binary',
    question: "Who's more likely to try a weird food at a restaurant?",
    options: ['Me 🙋', 'You 👉'],
  },

  // daily-lifestyle
  {
    id: 'wml-dl-1',
    category: 'whos-more-likely',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: "Who's more likely to stay up until 3am for no reason?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-dl-2',
    category: 'whos-more-likely',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: "Who's more likely to be the one running late?",
    options: ['Me 🙋', 'You 👉'],
  },

  // relationship
  {
    id: 'wml-rel-1',
    category: 'whos-more-likely',
    topic: 'relationship',
    type: 'binary',
    question: "Who's more likely to cry during a movie?",
    options: ['Me 🙋', 'You 👉'],
  },

  // future-goals
  {
    id: 'wml-fg-1',
    category: 'whos-more-likely',
    topic: 'future-goals',
    type: 'binary',
    question: "Who's more likely to be the strict parent?",
    options: ['Me 🙋', 'You 👉'],
  },

  // ─────────────────────────────────────────────
  // WOULD YOU RATHER
  // ─────────────────────────────────────────────

  // hobbies
  {
    id: 'wyr-hob-1',
    category: 'would-you-rather',
    topic: 'hobbies',
    type: 'binary',
    question: 'Would you rather travel somewhere new every holiday or have one perfect place you always return to?',
    options: ['Always Explore 🌍', 'Our Place 🏖️'],
  },

  // future-goals
  {
    id: 'wyr-fg-1',
    category: 'would-you-rather',
    topic: 'future-goals',
    type: 'binary',
    question: 'Would you rather be financially comfortable with a job you love or very wealthy with a job you tolerate?',
    options: ['Comfortable & Happy 💛', 'Wealthy & Tolerating 💰'],
  },

  // sex-intimacy
  {
    id: 'wyr-si-1',
    category: 'would-you-rather',
    topic: 'sex-intimacy',
    type: 'binary',
    question: 'Would you rather have less frequent but deeply intimate moments or more frequent but lighter ones?',
    options: ['Fewer & Deeper 🕯️', 'More & Lighter ✨'],
  },

  // daily-lifestyle
  {
    id: 'wyr-dl-1',
    category: 'would-you-rather',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Would you rather always be overdressed or always be underdressed?',
    options: ['Overdressed 👔', 'Underdressed 👕'],
  },
  {
    id: 'wyr-dl-2',
    category: 'would-you-rather',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Would you rather wake up early every day or stay up late every night?',
    options: ['Early Bird 🌅', 'Night Owl 🦉'],
  },

  // food
  {
    id: 'wyr-food-1',
    category: 'would-you-rather',
    topic: 'food',
    type: 'binary',
    question: 'Would you rather have to cook every meal from scratch or never cook and always eat out?',
    options: ['Always Cook 🍳', 'Always Eat Out 🍽️'],
  },

  // ─────────────────────────────────────────────
  // TRANSPARENCY CHECK (always text)
  // ─────────────────────────────────────────────

  // hobbies
  {
    id: 'tc-hob-1',
    category: 'transparency-check',
    topic: 'hobbies',
    type: 'text',
    question: 'What\'s something you\'d love for us to do together that you\'ve been nervous to suggest?',
  },

  // daily-lifestyle
  {
    id: 'tc-dl-1',
    category: 'transparency-check',
    topic: 'daily-lifestyle',
    type: 'text',
    question: 'What habit of mine would you want to gently change if you could?',
  },

  // future-goals
  {
    id: 'tc-fg-1',
    category: 'transparency-check',
    topic: 'future-goals',
    type: 'text',
    question: 'What kind of parent do you genuinely hope to be, and what worries you about that?',
  },
  {
    id: 'tc-fg-2',
    category: 'transparency-check',
    topic: 'future-goals',
    type: 'text',
    question: 'Is there a fear about our future that you haven\'t fully voiced?',
  },

  // sex-intimacy
  {
    id: 'tc-si-1',
    category: 'transparency-check',
    topic: 'sex-intimacy',
    type: 'text',
    question: 'Is there something you\'d like more of in our relationship?',
  },
  {
    id: 'tc-si-2',
    category: 'transparency-check',
    topic: 'sex-intimacy',
    type: 'text',
    question: 'Is there something about our intimacy you\'ve wanted to say but haven\'t found the right moment?',
  },

  // relationship
  {
    id: 'tc-rel-1',
    category: 'transparency-check',
    topic: 'relationship',
    type: 'text',
    question: 'What did I help you feel safe to be for the first time?',
  },
  {
    id: 'tc-rel-2',
    category: 'transparency-check',
    topic: 'relationship',
    type: 'text',
    question: 'What\'s something you\'ve never told me because you weren\'t sure how I\'d react?',
  },

];

// Helper: get today's assigned question for a given category+topic combo
// Uses a deterministic daily rotation based on date + combo key
export function getDailyQuestion(category, topic, answeredIds = []) {
  const pool = questions.filter(
    q => q.category === category && q.topic === topic && !answeredIds.includes(q.id)
  );
  if (pool.length === 0) return null;

  // Deterministic but rotates daily
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return pool[seed % pool.length];
}

// Helper: get all questions for a given category (for browsing by categories)
export function getQuestionsByCategory(category) {
  return questions.filter(q => q.category === category);
}

// Helper: get all questions for a given topic (for browsing by topics)
export function getQuestionsByTopic(topic) {
  return questions.filter(q => q.topic === topic);
}