/**
 * Application configuration constants.
 * These mirror the `limits` object from the original utils.js.
 * Centralizing them here ensures quiz.ts and exam.ts always agree.
 */
export const LIMITS = {
  /** Total questions in a mock exam */
  EXAM_LIMIT: 170,
  /** Total questions in a practice quiz session */
  QUIZ_LIMIT: 25,
  /** Exam timer in seconds: 3 hours 10 minutes = 11400s */
  TIME_LIMIT: 11400,
  /** Professional-level mix of the 170-item exam: 30% verbal, 35% analytical, 30% numerical, 5% general info */
  EXAM_NUMERICAL: 51,
  EXAM_VERBAL: 51,
  EXAM_ANALYTICAL: 60,
  EXAM_GEN_INFO: 8,
  /** Number of vocabulary quiz questions per session */
  VOCAB_QUIZ_LIMIT: 15,
  /** Passing percentage threshold for mock exam */
  PASSING_SCORE: 80,
  /** Maximum exam history entries to keep */
  MAX_HISTORY: 5,
  /** Timer warning threshold in seconds (10 minutes) */
  TIMER_WARNING: 600,
} as const;

/**
 * External links used across the application.
 * Portfolio URL is configurable via VITE_PORTFOLIO_URL env variable in Netlify.
 */
export const EXTERNAL_LINKS = {
  PORTFOLIO: (import.meta.env.VITE_PORTFOLIO_URL as string | undefined) || 'https://tamercan.vercel.app',
  GITHUB: 'https://github.com/Tamercan1',
} as const;
