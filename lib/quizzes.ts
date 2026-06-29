export interface Question {
  id: string;
  question: string;
  answers: {
    label: string;
    text: string;
    scores: Partial<Record<ArchetypeId, number>>;
  }[];
}

export type ArchetypeId = "efficient" | "minimiser" | "feeder" | "adventurer";

export interface Archetype {
  id: ArchetypeId;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
}

export const questions: Question[] = [
  {
    id: "struggle",
    question: "What's your biggest weeknight struggle?",
    answers: [
      {
        label: "a",
        text: "🕐 No time to think of what to cook",
        scores: { efficient: 3, minimiser: 1 },
      },
      {
        label: "b",
        text: "🔁 I cook the same 5 things on repeat",
        scores: { adventurer: 3, efficient: 1 },
      },
      {
        label: "c",
        text: "🗑️ I buy ingredients and they go to waste",
        scores: { minimiser: 3, feeder: 1 },
      },
      {
        label: "d",
        text: "😬 I never know if it'll be good enough",
        scores: { adventurer: 2, feeder: 2 },
      },
    ],
  },
  {
    id: "style",
    question: "How do you actually cook?",
    answers: [
      {
        label: "a",
        text: "📖 I follow recipes exactly",
        scores: { efficient: 2, feeder: 2 },
      },
      {
        label: "b",
        text: "🧠 I improvise with what I have",
        scores: { minimiser: 3, adventurer: 1 },
      },
      {
        label: "c",
        text: "⚡ I need it dead simple",
        scores: { efficient: 3 },
      },
      {
        label: "d",
        text: "📈 I'm decent but want to level up",
        scores: { adventurer: 3, minimiser: 1 },
      },
    ],
  },
  {
    id: "household",
    question: "Who are you feeding?",
    answers: [
      {
        label: "a",
        text: "🙋 Just me",
        scores: { efficient: 2, minimiser: 2 },
      },
      {
        label: "b",
        text: "👫 Me and a partner",
        scores: { efficient: 2, adventurer: 2 },
      },
      {
        label: "c",
        text: "👨‍👩‍👧 A family",
        scores: { feeder: 4 },
      },
      {
        label: "d",
        text: "🎲 It changes week to week",
        scores: { minimiser: 2, adventurer: 2 },
      },
    ],
  },
  {
    id: "cuisine",
    question: "What cuisine do you keep coming back to?",
    answers: [
      {
        label: "a",
        text: "🍝 Italian / Mediterranean",
        scores: { efficient: 2, feeder: 1 },
      },
      {
        label: "b",
        text: "🍜 Asian — Thai, Japanese, Chinese",
        scores: { adventurer: 3 },
      },
      {
        label: "c",
        text: "🍔 American comfort food",
        scores: { feeder: 3, efficient: 1 },
      },
      {
        label: "d",
        text: "🌍 Variety — surprise me",
        scores: { adventurer: 2, minimiser: 2 },
      },
    ],
  },
  {
    id: "priority",
    question: "What matters most when picking a meal?",
    answers: [
      {
        label: "a",
        text: "⚡ Speed — under 30 minutes",
        scores: { efficient: 3 },
      },
      {
        label: "b",
        text: "🥗 Health — clean ingredients",
        scores: { minimiser: 2, feeder: 2 },
      },
      {
        label: "c",
        text: "💰 Cost — under $15 a meal",
        scores: { minimiser: 3 },
      },
      {
        label: "d",
        text: "🔥 Flavour — I don't compromise",
        scores: { adventurer: 3, feeder: 1 },
      },
    ],
  },
];

export const archetypes: Record<ArchetypeId, Archetype> = {
  efficient: {
    id: "efficient",
    emoji: "⚡",
    name: "The Efficient Cook",
    tagline: "You want dinner sorted in under 30 minutes with zero mental load.",
    description:
      "You cook to eat well, not to impress. Speed, simplicity, and consistency are your values — and MyChef was built for exactly this.",
  },
  minimiser: {
    id: "minimiser",
    emoji: "🧠",
    name: "The Ingredient Maximiser",
    tagline: "You hate waste. You want to cook with what you already have.",
    description:
      "The fridge scan feature was built for you. Scan what you have, get a week of meals that actually use it — nothing wasted.",
  },
  feeder: {
    id: "feeder",
    emoji: "🍽️",
    name: "The Family Feeder",
    tagline:
      "Feeding a household means planning. You need variety, volume, and no complaints.",
    description:
      "MyChef adjusts serving sizes, plans across the week, and keeps the rotation fresh so nobody at the table gets bored.",
  },
  adventurer: {
    id: "adventurer",
    emoji: "🔥",
    name: "The Flavour Chaser",
    tagline:
      "You actually care what your food tastes like. You want to level up.",
    description:
      "MyChef introduces you to cuisines and techniques you haven't tried yet — personalised to your taste, one week at a time.",
  },
};

export type Answer = { questionId: string; label: string };

export function computeScores(answers: Answer[]): Record<ArchetypeId, number> {
  const totals: Record<ArchetypeId, number> = {
    efficient: 0,
    minimiser: 0,
    feeder: 0,
    adventurer: 0,
  };

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    const choice = question.answers.find((a) => a.label === answer.label);
    if (!choice) continue;
    for (const [key, val] of Object.entries(choice.scores)) {
      totals[key as ArchetypeId] = (totals[key as ArchetypeId] || 0) + val;
    }
  }

  return totals;
}

export function scoreArchetype(answers: Answer[]): ArchetypeId {
  const totals = computeScores(answers);

  const ordered: ArchetypeId[] = [
    "efficient",
    "minimiser",
    "feeder",
    "adventurer",
  ];

  let best: ArchetypeId = "efficient";
  let bestScore = totals["efficient"] || 0;

  for (const id of ordered) {
    const score = totals[id] || 0;
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  }

  return best;
}
