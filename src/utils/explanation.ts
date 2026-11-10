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

/** Escapes text for safe insertion into innerHTML. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * HTML for the explanation panel: the steps, then the formula in a monospace
 * card and the tip in a highlighted callout (when the question has them).
 */
export function renderExplanationHTML(q: Pick<QuizQuestion, 'explanation' | 'formula' | 'tip'>): string {
  const steps = `<p class="whitespace-pre-line text-emerald-800 text-sm leading-relaxed">${escapeHtml(q.explanation)}</p>`;
  const formula = q.formula
    ? `<div class="mt-3 rounded-xl bg-white border border-emerald-200 px-3 py-2.5">
         <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 mb-1">Formula</div>
         <div class="font-mono text-xs sm:text-sm text-slate-800 leading-relaxed break-words">${escapeHtml(q.formula)}</div>
       </div>`
    : '';
  const tip = q.tip
    ? `<div class="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
         <div class="text-[11px] font-bold uppercase tracking-wide text-amber-800 mb-1">Tip</div>
         <div class="text-xs sm:text-sm text-amber-900 leading-relaxed">${escapeHtml(q.tip)}</div>
       </div>`
    : '';
  return steps + formula + tip;
}
