// data/questions.js
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

  // sex-intimacy
  {
    id: 'aod-si-1',
    category: 'agree-or-disagree',
    topic: 'sex-intimacy',
    type: 'likert',
    question: 'I worry that social media might affect how my partner sees me physically.',
  },
  {
    id: 'aod-si-2',
    category: 'agree-or-disagree',
    topic: 'sex-intimacy',
    type: 'likert',
    question: 'Physical intimacy is just as important as emotional intimacy in a relationship.',
  },
  {
    id: 'aod-si-3',
    category: 'agree-or-disagree',
    topic: 'sex-intimacy',
    type: 'likert',
    question: 'It\'s important to always feel physically attracted to your partner, even years into a relationship.',
  },
  {
    id: 'aod-si-4',
    category: 'agree-or-disagree',
    topic: 'sex-intimacy',
    type: 'likert',
    question: 'Talking openly about intimacy makes a relationship stronger.',
  },

  // relationship
  {
    id: 'aod-rel-1',
    category: 'agree-or-disagree',
    topic: 'relationship',
    type: 'likert',
    question: 'Couples should share all passwords and have full access to each other\'s phones.',
  },
  {
    id: 'aod-rel-2',
    category: 'agree-or-disagree',
    topic: 'relationship',
    type: 'likert',
    question: 'It\'s healthy to argue in a relationship as long as you resolve things.',
  },
  {
    id: 'aod-rel-3',
    category: 'agree-or-disagree',
    topic: 'relationship',
    type: 'likert',
    question: 'You should never go to bed angry at your partner.',
  },
  {
    id: 'aod-rel-4',
    category: 'agree-or-disagree',
    topic: 'relationship',
    type: 'likert',
    question: 'Love alone is enough to sustain a long-term relationship.',
  },

  // future-goals
  {
    id: 'aod-fg-1',
    category: 'agree-or-disagree',
    topic: 'future-goals',
    type: 'likert',
    question: 'Both partners should contribute equally to household finances.',
  },
  {
    id: 'aod-fg-2',
    category: 'agree-or-disagree',
    topic: 'future-goals',
    type: 'likert',
    question: 'Having kids is something couples should decide on before getting married.',
  },
  {
    id: 'aod-fg-3',
    category: 'agree-or-disagree',
    topic: 'future-goals',
    type: 'likert',
    question: 'It\'s fine for one partner to be the primary breadwinner while the other focuses on home life.',
  },

  // daily-lifestyle
  {
    id: 'aod-dl-1',
    category: 'agree-or-disagree',
    topic: 'daily-lifestyle',
    type: 'likert',
    question: 'Social media has a mostly negative effect on mental health.',
  },
  {
    id: 'aod-dl-2',
    category: 'agree-or-disagree',
    topic: 'daily-lifestyle',
    type: 'likert',
    question: 'Couples who live together before marriage have stronger relationships.',
  },
  {
    id: 'aod-dl-3',
    category: 'agree-or-disagree',
    topic: 'daily-lifestyle',
    type: 'likert',
    question: 'Everyone should have at least one hobby that\'s entirely their own.',
  },

  // food
  {
    id: 'aod-food-1',
    category: 'agree-or-disagree',
    topic: 'food',
    type: 'likert',
    question: 'Cooking together is one of the best ways to bond as a couple.',
  },
  {
    id: 'aod-food-2',
    category: 'agree-or-disagree',
    topic: 'food',
    type: 'likert',
    question: 'It\'s worth spending more money on high quality food.',
  },

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
    question: 'Never have I ever pulled an all-nighter for no reason.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-dl-3',
    category: 'never-have-i-ever',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Never have I ever ghosted someone I regularly talked to.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-dl-4',
    category: 'never-have-i-ever',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Never have I ever bought something expensive and hidden it from someone.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-dl-5',
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
    question: 'Never have I ever broken up with someone over text.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-rel-2',
    category: 'never-have-i-ever',
    topic: 'relationship',
    type: 'binary',
    question: 'Never have I ever stayed in a relationship longer than I should have.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-rel-3',
    category: 'never-have-i-ever',
    topic: 'relationship',
    type: 'binary',
    question: 'Never have I ever felt jealous and pretended I wasn\'t.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // sex-intimacy
  {
    id: 'nhie-si-1',
    category: 'never-have-i-ever',
    topic: 'sex-intimacy',
    type: 'binary',
    question: 'Never have I ever had feelings for someone and never told them.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-si-2',
    category: 'never-have-i-ever',
    topic: 'sex-intimacy',
    type: 'binary',
    question: 'Never have I ever liked someone I knew I shouldn\'t.',
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
  {
    id: 'nhie-food-2',
    category: 'never-have-i-ever',
    topic: 'food',
    type: 'binary',
    question: 'Never have I ever lied about liking a meal someone cooked for me.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-food-3',
    category: 'never-have-i-ever',
    topic: 'food',
    type: 'binary',
    question: 'Never have I ever ordered the same meal every single time at a restaurant.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // future-goals
  {
    id: 'nhie-fg-1',
    category: 'never-have-i-ever',
    topic: 'future-goals',
    type: 'binary',
    question: 'Never have I ever seriously considered moving to another country.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-fg-2',
    category: 'never-have-i-ever',
    topic: 'future-goals',
    type: 'binary',
    question: 'Never have I ever made a big life decision based on a gut feeling.',
    options: ['I Have 🙋', 'Never 🙅'],
  },

  // hobbies
  {
    id: 'nhie-hob-1',
    category: 'never-have-i-ever',
    topic: 'hobbies',
    type: 'binary',
    question: 'Never have I ever spent an entire day doing nothing but my favorite hobby.',
    options: ['I Have 🙋', 'Never 🙅'],
  },
  {
    id: 'nhie-hob-2',
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
    options: ['Cozy Cottage', 'Modern Villa'],
    images: ['/placeholders/home-a.jpg', '/placeholders/home-b.jpg'],
  },
  {
    id: 'tot-fg-2',
    category: 'this-or-that',
    topic: 'future-goals',
    type: 'image',
    question: 'Our Dream Wedding Venue',
    options: ['Garden Ceremony', 'Ballroom Elegance'],
    images: ['/placeholders/venue-a.jpg', '/placeholders/venue-b.jpg'],
  },
  {
    id: 'tot-fg-3',
    category: 'this-or-that',
    topic: 'future-goals',
    type: 'image',
    question: 'Our Dream Car',
    options: ['Classic & Sleek', 'Bold & Sporty'],
    images: ['/placeholders/car-a.jpg', '/placeholders/car-b.jpg'],
  },
  {
    id: 'tot-dl-1',
    category: 'this-or-that',
    topic: 'daily-lifestyle',
    type: 'image',
    question: 'Morning Vibe',
    options: ['Slow & Cozy', 'Fresh & Active'],
    images: ['/placeholders/morning-a.jpg', '/placeholders/morning-b.jpg'],
  },
  {
    id: 'tot-dl-2',
    category: 'this-or-that',
    topic: 'daily-lifestyle',
    type: 'image',
    question: 'Our Living Room',
    options: ['Minimal & Clean', 'Warm & Eclectic'],
    images: ['/placeholders/livingroom-a.jpg', '/placeholders/livingroom-b.jpg'],
  },
  {
    id: 'tot-food-1',
    category: 'this-or-that',
    topic: 'food',
    type: 'image',
    question: 'Date Night Dinner',
    options: ['Fine Dining', 'Cozy Home Cook'],
    images: ['/placeholders/dinner-a.jpg', '/placeholders/dinner-b.jpg'],
  },
  {
    id: 'tot-food-2',
    category: 'this-or-that',
    topic: 'food',
    type: 'image',
    question: 'Weekend Breakfast',
    options: ['Full English', 'Pancakes & Fruit'],
    images: ['/placeholders/breakfast-a.jpg', '/placeholders/breakfast-b.jpg'],
  },
  {
    id: 'tot-hob-1',
    category: 'this-or-that',
    topic: 'hobbies',
    type: 'image',
    question: 'Our Ideal Vacation',
    options: ['Beach & Sun', 'Mountains & Hikes'],
    images: ['/placeholders/vacation-a.jpg', '/placeholders/vacation-b.jpg'],
  },
  {
    id: 'tot-hob-2',
    category: 'this-or-that',
    topic: 'hobbies',
    type: 'image',
    question: 'Ideal Night In',
    options: ['Movie Night', 'Games & Music'],
    images: ['/placeholders/nightin-a.jpg', '/placeholders/nightin-b.jpg'],
  },
  {
    id: 'tot-si-1',
    category: 'this-or-that',
    topic: 'sex-intimacy',
    type: 'image',
    question: 'Romantic Getaway',
    options: ['City Hotel Suite', 'Remote Cabin'],
    images: ['/placeholders/getaway-a.jpg', '/placeholders/getaway-b.jpg'],
  },

  // ─────────────────────────────────────────────
  // WHO'S MORE LIKELY TO
  // ─────────────────────────────────────────────

  // future-goals
  {
    id: 'wml-fg-1',
    category: 'whos-more-likely',
    topic: 'future-goals',
    type: 'binary',
    question: "Who's more likely to be competitive at our kids' events?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-fg-2',
    category: 'whos-more-likely',
    topic: 'future-goals',
    type: 'binary',
    question: "Who's more likely to want to move to a new city on a whim?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-fg-3',
    category: 'whos-more-likely',
    topic: 'future-goals',
    type: 'binary',
    question: "Who's more likely to be the strict parent?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-fg-4',
    category: 'whos-more-likely',
    topic: 'future-goals',
    type: 'binary',
    question: "Who's more likely to splurge on a big purchase without consulting the other?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-fg-5',
    category: 'whos-more-likely',
    topic: 'future-goals',
    type: 'binary',
    question: "Who's more likely to want a bigger house than we actually need?",
    options: ['Me 🙋', 'You 👉'],
  },

  // relationship
  {
    id: 'wml-rel-1',
    category: 'whos-more-likely',
    topic: 'relationship',
    type: 'binary',
    question: "Who's more likely to apologize first after an argument?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-rel-2',
    category: 'whos-more-likely',
    topic: 'relationship',
    type: 'binary',
    question: "Who's more likely to remember our anniversary without a reminder?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-rel-3',
    category: 'whos-more-likely',
    topic: 'relationship',
    type: 'binary',
    question: "Who's more likely to plan a surprise?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-rel-4',
    category: 'whos-more-likely',
    topic: 'relationship',
    type: 'binary',
    question: "Who's more likely to cry during a romantic movie?",
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
  {
    id: 'wml-dl-3',
    category: 'whos-more-likely',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: "Who's more likely to get addicted to a new TV show?",
    options: ['Me 🙋', 'You 👉'],
  },

  // food
  {
    id: 'wml-food-1',
    category: 'whos-more-likely',
    topic: 'food',
    type: 'binary',
    question: "Who's more likely to eat the last slice of pizza without asking?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-food-2',
    category: 'whos-more-likely',
    topic: 'food',
    type: 'binary',
    question: "Who's more likely to try a weird food at a restaurant?",
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
  {
    id: 'wml-si-2',
    category: 'whos-more-likely',
    topic: 'sex-intimacy',
    type: 'binary',
    question: "Who's more likely to want more physical affection on a daily basis?",
    options: ['Me 🙋', 'You 👉'],
  },

  // hobbies
  {
    id: 'wml-hob-1',
    category: 'whos-more-likely',
    topic: 'hobbies',
    type: 'binary',
    question: "Who's more likely to drag the other into a new hobby?",
    options: ['Me 🙋', 'You 👉'],
  },
  {
    id: 'wml-hob-2',
    category: 'whos-more-likely',
    topic: 'hobbies',
    type: 'binary',
    question: "Who's more likely to spend hours on a creative project and lose track of time?",
    options: ['Me 🙋', 'You 👉'],
  },

  // ─────────────────────────────────────────────
  // WOULD YOU RATHER
  // ─────────────────────────────────────────────

  // food
  {
    id: 'wyr-food-1',
    category: 'would-you-rather',
    topic: 'food',
    type: 'binary',
    question: 'Would you rather never eat your favorite fruit again or only eat it when it\'s not ripe?',
    options: ['Never Again 🚫', 'Always Unripe 😬'],
  },
  {
    id: 'wyr-food-2',
    category: 'would-you-rather',
    topic: 'food',
    type: 'binary',
    question: 'Would you rather only eat savory food for the rest of your life or only sweet?',
    options: ['Savory Only 🧂', 'Sweet Only 🍬'],
  },
  {
    id: 'wyr-food-3',
    category: 'would-you-rather',
    topic: 'food',
    type: 'binary',
    question: 'Would you rather have to cook every meal from scratch or never cook and always eat out?',
    options: ['Always Cook 🍳', 'Always Eat Out 🍽️'],
  },
  {
    id: 'wyr-food-4',
    category: 'would-you-rather',
    topic: 'food',
    type: 'binary',
    question: 'Would you rather give up coffee forever or give up your favorite takeaway forever?',
    options: ['No Coffee ☕', 'No Takeaway 🥡'],
  },

  // daily-lifestyle
  {
    id: 'wyr-dl-1',
    category: 'would-you-rather',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Would you rather wake up early every day or stay up late every night?',
    options: ['Early Bird 🌅', 'Night Owl 🦉'],
  },
  {
    id: 'wyr-dl-2',
    category: 'would-you-rather',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Would you rather live in a big city or a small quiet town?',
    options: ['Big City 🏙️', 'Quiet Town 🌳'],
  },
  {
    id: 'wyr-dl-3',
    category: 'would-you-rather',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Would you rather have no social media for a year or no music for a year?',
    options: ['No Social Media 📵', 'No Music 🔇'],
  },
  {
    id: 'wyr-dl-4',
    category: 'would-you-rather',
    topic: 'daily-lifestyle',
    type: 'binary',
    question: 'Would you rather always be overdressed or always be underdressed?',
    options: ['Overdressed 👔', 'Underdressed 👕'],
  },

  // relationship
  {
    id: 'wyr-rel-1',
    category: 'would-you-rather',
    topic: 'relationship',
    type: 'binary',
    question: 'Would you rather know every thought your partner has or have them know every thought you have?',
    options: ['Know Theirs 🔍', 'They Know Mine 😬'],
  },
  {
    id: 'wyr-rel-2',
    category: 'would-you-rather',
    topic: 'relationship',
    type: 'binary',
    question: 'Would you rather fight and resolve it the same day or not fight but let tension linger?',
    options: ['Fight & Resolve 🔥', 'Keep the Peace 😶'],
  },
  {
    id: 'wyr-rel-3',
    category: 'would-you-rather',
    topic: 'relationship',
    type: 'binary',
    question: 'Would you rather go on a surprise date planned entirely by your partner or plan the perfect date yourself?',
    options: ['Surprise Me ✨', 'I\'ll Plan It 📋'],
  },

  // sex-intimacy
  {
    id: 'wyr-si-1',
    category: 'would-you-rather',
    topic: 'sex-intimacy',
    type: 'binary',
    question: 'Would you rather have less frequent but deeply intimate moments or more frequent but lighter ones?',
    options: ['Deep & Rare 💫', 'Often & Light 💛'],
  },
  {
    id: 'wyr-si-2',
    category: 'would-you-rather',
    topic: 'sex-intimacy',
    type: 'binary',
    question: 'Would you rather your partner always knew exactly what you needed emotionally or physically?',
    options: ['Emotionally 💜', 'Physically 🔥'],
  },
  {
    id: 'wyr-si-3',
    category: 'would-you-rather',
    topic: 'sex-intimacy',
    type: 'binary',
    question: 'Would you rather have a long romantic night in or a spontaneous passionate moment?',
    options: ['Long Night In 🕯️', 'Spontaneous 🌪️'],
  },

  // future-goals
  {
    id: 'wyr-fg-1',
    category: 'would-you-rather',
    topic: 'future-goals',
    type: 'binary',
    question: 'Would you rather be financially comfortable with a job you love or very wealthy with a job you tolerate?',
    options: ['Love My Job 💛', 'Be Wealthy 💰'],
  },
  {
    id: 'wyr-fg-2',
    category: 'would-you-rather',
    topic: 'future-goals',
    type: 'binary',
    question: 'Would you rather raise kids in the city or the countryside?',
    options: ['City Kids 🏙️', 'Country Kids 🌿'],
  },
  {
    id: 'wyr-fg-3',
    category: 'would-you-rather',
    topic: 'future-goals',
    type: 'binary',
    question: 'Would you rather own your dream home young with a big mortgage or rent longer and buy later with cash?',
    options: ['Dream Home Now 🏠', 'Patience Pays 💎'],
  },

  // hobbies
  {
    id: 'wyr-hob-1',
    category: 'would-you-rather',
    topic: 'hobbies',
    type: 'binary',
    question: 'Would you rather travel somewhere new every holiday or have one perfect place you always return to?',
    options: ['Always Explore 🌍', 'Our Place 🏖️'],
  },
  {
    id: 'wyr-hob-2',
    category: 'would-you-rather',
    topic: 'hobbies',
    type: 'binary',
    question: 'Would you rather spend your free time being creative or being active?',
    options: ['Creative 🎨', 'Active 🏃'],
  },
  {
    id: 'wyr-hob-3',
    category: 'would-you-rather',
    topic: 'hobbies',
    type: 'binary',
    question: 'Would you rather read every night before bed or watch something together?',
    options: ['Read 📚', 'Watch Together 📺'],
  },

  // ─────────────────────────────────────────────
  // TRANSPARENCY CHECK (always text)
  // ─────────────────────────────────────────────

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
  {
    id: 'tc-rel-3',
    category: 'transparency-check',
    topic: 'relationship',
    type: 'text',
    question: 'What moment made you realize this relationship was different?',
  },
  {
    id: 'tc-rel-4',
    category: 'transparency-check',
    topic: 'relationship',
    type: 'text',
    question: 'Is there anything about the way I communicate that sometimes hurts you, even if unintentionally?',
  },
  {
    id: 'tc-rel-5',
    category: 'transparency-check',
    topic: 'relationship',
    type: 'text',
    question: 'What\'s something you wish you could ask me but always hold back?',
  },
  {
    id: 'tc-rel-6',
    category: 'transparency-check',
    topic: 'relationship',
    type: 'text',
    question: 'How do you feel most loved — and am I doing that enough?',
  },

  // sex-intimacy
  {
    id: 'tc-si-1',
    category: 'transparency-check',
    topic: 'sex-intimacy',
    type: 'text',
    question: 'Is there something about our intimacy you\'ve wanted to say but haven\'t found the right moment?',
  },
  {
    id: 'tc-si-2',
    category: 'transparency-check',
    topic: 'sex-intimacy',
    type: 'text',
    question: 'What makes you feel most desired by me?',
  },
  {
    id: 'tc-si-3',
    category: 'transparency-check',
    topic: 'sex-intimacy',
    type: 'text',
    question: 'Is there something you\'d like more of in our relationship that you haven\'t asked for yet?',
  },
  {
    id: 'tc-si-4',
    category: 'transparency-check',
    topic: 'sex-intimacy',
    type: 'text',
    question: 'When do you feel closest to me — what does that moment usually look like?',
  },

  // future-goals
  {
    id: 'tc-fg-1',
    category: 'transparency-check',
    topic: 'future-goals',
    type: 'text',
    question: 'Is there a fear about our future that you haven\'t fully voiced to me yet?',
  },
  {
    id: 'tc-fg-2',
    category: 'transparency-check',
    topic: 'future-goals',
    type: 'text',
    question: 'What does our life look like in 10 years in your most honest vision?',
  },
  {
    id: 'tc-fg-3',
    category: 'transparency-check',
    topic: 'future-goals',
    type: 'text',
    question: 'Is there something about our financial future that worries you that we haven\'t talked about properly?',
  },
  {
    id: 'tc-fg-4',
    category: 'transparency-check',
    topic: 'future-goals',
    type: 'text',
    question: 'What kind of parent do you genuinely hope to be, and what worries you about that?',
  },

  // daily-lifestyle
  {
    id: 'tc-dl-1',
    category: 'transparency-check',
    topic: 'daily-lifestyle',
    type: 'text',
    question: 'What part of your daily life do you feel I don\'t fully understand yet?',
  },
  {
    id: 'tc-dl-2',
    category: 'transparency-check',
    topic: 'daily-lifestyle',
    type: 'text',
    question: 'What habit of mine would you want to gently change if you could?',
  },

  // hobbies
  {
    id: 'tc-hob-1',
    category: 'transparency-check',
    topic: 'hobbies',
    type: 'text',
    question: 'Is there a passion or interest of yours that you feel I don\'t fully appreciate or understand?',
  },
  {
    id: 'tc-hob-2',
    category: 'transparency-check',
    topic: 'hobbies',
    type: 'text',
    question: 'What\'s something you\'d love for us to do together that you\'ve been nervous to suggest?',
  },

  // food
  {
    id: 'tc-food-1',
    category: 'transparency-check',
    topic: 'food',
    type: 'text',
    question: 'What\'s a food memory from your childhood that shaped how you eat or cook today?',
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