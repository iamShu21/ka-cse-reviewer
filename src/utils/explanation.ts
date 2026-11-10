import type { QuizQuestion } from '../types/question';

/**
 * Builds the full answer text: step-by-step explanation, plus the formula and
 * tip when the question has them. Lines are separated by "\n" so the element
 * showing it needs `white-space: pre-line` (Tailwind: `whitespace-pre-line`).
 */
export function formatExplanation(q: Pick<QuizQuestion, 'explanation' | 'formula' | 'tip'>): string {
  const parts = [q.explanation];
  if (q.formula) parts.push(`Formula: ${q.formula}`);
  if (q.tip) parts.push(`Tip: ${q.tip}`);
  return parts.join('\n\n');
}
