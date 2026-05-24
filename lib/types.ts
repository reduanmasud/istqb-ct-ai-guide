// ── Core content types ────────────────────────────────────────────────────────

export type KLevel = "K1" | "K2" | "K3" | "K4";
export type HLevel = "H0" | "H1" | "H2";
export type ExerciseType =
  | "confusion-matrix"
  | "workflow-sequencer"
  | "red-teaming"
  | "dataset-constraint"
  | "metamorphic"
  | "eda-explorer"
  | "none";

export interface QuizOption {
  text: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number; // 0-indexed
  explanation: string;
  multiSelect?: boolean; // for "select TWO" questions
  correctMulti?: number[]; // for multi-select
}

export interface ExerciseData {
  type: ExerciseType;
  [key: string]: unknown;
}

export interface Lesson {
  id: string; // e.g. "ai-1.1.1"
  chapter: number;
  section: string; // e.g. "1.1"
  kLevel: KLevel | HLevel;
  title: string;
  concept: string; // markdown
  keyPoints: string[];
  quiz: Quiz;
  exercise: ExerciseData;
}

export interface ChapterMeta {
  id: number;
  title: string;
  duration: number; // minutes
  color: string; // tailwind color class
  description: string;
  loIds: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  chapter: number;
  relatedLo?: string;
}

// ── Exam types ────────────────────────────────────────────────────────────────

export interface ExamQuestion {
  id: number;
  points: number;
  loRef: string; // e.g. "AI-1.1.1"
  chapter: number;
  stem: string;
  options: string[];
  correct: number | number[]; // single or multi
  multiSelect?: boolean;
  explanation: string;
}

export type ExamSet = "a" | "b";

export interface ExamSetResult {
  set: ExamSet;
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

// ── Progress types ────────────────────────────────────────────────────────────

export interface ExamAttempt {
  date: string;
  score: number;
  maxScore: number;
  answers: Record<number, number | number[]>;
  timeSpent: number; // seconds
  set?: ExamSet;
}

export interface Progress {
  completedLessons: string[]; // LO IDs
  quizAnswers: Record<string, number | number[]>; // loId → answer
  quizCorrect: Record<string, boolean>; // loId → correct?
  examAttempts: ExamAttempt[];
  examSetResults: Partial<Record<ExamSet, ExamSetResult>>;
  lastVisited: string;
}
