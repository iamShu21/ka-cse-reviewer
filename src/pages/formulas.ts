import { renderNavbar, renderFooter } from '../modules/navbar';
import { getElement } from '../utils/dom';
import { escapeHtml } from '../utils/explanation';

interface FormulaItem {
  n: string;
  f: string;
  e?: string;
}

interface FormulaSection {
  id: string;
  title: string;
  items: FormulaItem[];
  tips: string[];
}

function sectionHTML(s: FormulaSection, open: boolean): string {
  const items = s.items
    .map(
      (it) => `
      <div class="py-3 first:pt-0 last:pb-0">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">${escapeHtml(it.n)}</div>
        <div class="font-mono text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 break-words">${escapeHtml(it.f)}</div>
        ${it.e ? `<div class="text-xs text-slate-500 mt-1.5">e.g. ${escapeHtml(it.e)}</div>` : ''}
      </div>`
    )
    .join('');
  const tips = s.tips.length
    ? `<div class="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-3">
         <div class="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Tips &amp; tricks</div>
         <ul class="list-disc pl-4 space-y-1 text-sm text-amber-900">${s.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
       </div>`
    : '';
  return `
    <details id="sec-${s.id}" class="group bg-white border border-slate-200 rounded-2xl shadow-sm scroll-mt-24" data-section="${s.id}" ${open ? 'open' : ''}>
      <summary class="flex items-center justify-between cursor-pointer select-none list-none px-4 sm:px-5 py-4">
        <span class="font-bold text-slate-800">${escapeHtml(s.title)}</span>
        <span class="flex items-center gap-2">
          <span class="text-xs font-semibold text-slate-400">${s.items.length}</span>
          <svg class="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </span>
      </summary>
      <div class="px-4 sm:px-5 pb-5 divide-y divide-slate-100">${items}</div>
      <div class="px-4 sm:px-5 pb-5 -mt-1">${tips}</div>
    </details>`;
}

function matches(s: FormulaSection, q: string): boolean {
  if (!q) return true;
  const hay = [s.title, ...s.tips, ...s.items.flatMap((i) => [i.n, i.f, i.e ?? ''])].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

async function init(): Promise<void> {
  renderNavbar();
  renderFooter();

  const list = getElement('formula-list');
  const chips = getElement('formula-chips');
  const empty = getElement('formula-empty');
  const search = getElement<HTMLInputElement>('formula-search');
  if (!list || !chips) return;

  let sections: FormulaSection[] = [];
  try {
    const res = await fetch('../data/formulas.json');
    sections = (await res.json()) as FormulaSection[];
  } catch {
    list.innerHTML = '<p class="text-sm text-slate-500">Could not load formulas. Please refresh.</p>';
    return;
  }

  chips.innerHTML = sections
    .map(
      (s) =>
        `<a href="#sec-${s.id}" data-chip="${s.id}" class="shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors whitespace-nowrap">${escapeHtml(s.title)}</a>`
    )
    .join('');

  const render = (): void => {
    const q = search?.value.trim() ?? '';
    const shown = sections.filter((s) => matches(s, q));
    list.innerHTML = shown.map((s, i) => sectionHTML(s, q ? true : i === 0)).join('');
    empty?.classList.toggle('hidden', shown.length > 0);
    chips.querySelectorAll<HTMLElement>('[data-chip]').forEach((c) => {
      c.classList.toggle('hidden', !shown.some((s) => s.id === c.dataset.chip));
    });
  };

  search?.addEventListener('input', render);
  chips.addEventListener('click', (ev) => {
    const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('[data-chip]');
    if (!a) return;
    ev.preventDefault();
    const el = document.getElementById(`sec-${a.dataset.chip}`) as HTMLDetailsElement | null;
    if (!el) return;
    el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  void init();
});
