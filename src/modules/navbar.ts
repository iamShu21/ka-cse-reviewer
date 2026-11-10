import { getElement } from '../utils/dom';
import { EXTERNAL_LINKS } from '../config';

export function isRootDirectory(): boolean {
  return window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
}

interface NavItem {
  id: string;
  label: string;
  short: string;
  href: string;
  icon: string;
  bottom: boolean;
}

const ICONS = {
  home: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5L12 3l9 7.5M5.25 9.75V20a.75.75 0 00.75.75h3.75v-5.25h4.5v5.25H18a.75.75 0 00.75-.75V9.75"/>',
  practice: '<path stroke-linecap="round" stroke-linejoin="round" d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z"/>',
  exam: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.5V12l3.5 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  formulas: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.5 5.5h-11l5.25 6.5-5.25 6.5h11"/>',
  vocabulary: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.25v13m0-13C10.8 5.45 9.25 5 7.5 5S4.2 5.45 3 6.25v13C4.2 18.45 5.75 18 7.5 18s3.3.45 4.5 1.25m0-13C13.2 5.45 14.75 5 16.5 5s3.3.45 4.5 1.25v13c-1.2-.8-2.75-1.25-4.5-1.25s-3.3.45-4.5 1.25"/>',
  dashboard: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>',
};

function navItems(basePath: string, pagesPath: string): NavItem[] {
  return [
    { id: 'home', label: 'Home', short: 'Home', href: `${basePath}index.html`, icon: ICONS.home, bottom: true },
    { id: 'practice', label: 'Practice', short: 'Practice', href: `${pagesPath}practice.html`, icon: ICONS.practice, bottom: true },
    { id: 'exam', label: 'Mock Exam', short: 'Exam', href: `${pagesPath}exam.html`, icon: ICONS.exam, bottom: true },
    { id: 'formulas', label: 'Formulas', short: 'Formulas', href: `${pagesPath}formulas.html`, icon: ICONS.formulas, bottom: true },
    { id: 'vocabulary', label: 'Vocabulary', short: 'Words', href: `${pagesPath}vocabulary.html`, icon: ICONS.vocabulary, bottom: true },
    { id: 'dashboard', label: 'Results', short: 'Results', href: `${pagesPath}dashboard.html`, icon: ICONS.dashboard, bottom: false },
  ];
}

function svg(icon: string, cls: string): string {
  return `<svg class="${cls}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
}

export function renderNavbar(): void {
  const placeholder = getElement('navbar-placeholder');
  if (!placeholder) return;

  const isRoot = isRootDirectory();
  const basePath = isRoot ? '' : '../';
  const pagesPath = isRoot ? 'pages/' : '';

  // Get active page name from path
  const path = window.location.pathname;
  let activePage = 'home';
  if (path.includes('practice.html')) activePage = 'practice';
  else if (path.includes('exam.html')) activePage = 'exam';
  else if (path.includes('vocabulary.html') || path.includes('vocab-quiz.html')) activePage = 'vocabulary';
  else if (path.includes('formulas.html')) activePage = 'formulas';
  else if (path.includes('dashboard.html')) activePage = 'dashboard';
  else if (path.includes('about.html')) activePage = 'about';

  const items = navItems(basePath, pagesPath);
  const resultsItem = items.find((i) => i.id === 'dashboard')!;

  const desktopLinks = items
    .map(
      (i) =>
        `<a href="${i.href}" data-page="${i.id}" class="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          activePage === i.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }">${i.label}</a>`
    )
    .join('');

  const navbarHTML = `
    <nav class="bg-white/90 backdrop-blur border-b border-slate-200 select-none">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a href="${basePath}index.html" class="flex items-center gap-2.5 font-extrabold text-slate-900 tracking-tight">
                <img src="${basePath}img/logo.png" alt="" class="w-8 h-8 rounded-lg object-cover border border-slate-200">
                <span class="text-base">Ka-CSE <span class="text-blue-700">Reviewer</span></span>
            </a>
            <div class="hidden md:flex items-center gap-1">${desktopLinks}</div>
            <a href="${resultsItem.href}" data-page="dashboard" aria-label="Results" class="md:hidden p-2 -mr-2 rounded-lg ${
              activePage === 'dashboard' ? 'text-blue-700' : 'text-slate-500'
            }">${svg(resultsItem.icon, 'w-6 h-6')}</a>
        </div>
    </nav>
  `;

  placeholder.className = 'sticky top-0 z-50';
  placeholder.innerHTML = navbarHTML;

  // Phone bottom tab bar (hidden on the exam page so the simulation stays distraction-free)
  document.getElementById('bottom-nav')?.remove();
  document.body.classList.remove('pb-24', 'md:pb-0');
  if (activePage !== 'exam') {
    const bottom = document.createElement('nav');
    bottom.id = 'bottom-nav';
    bottom.setAttribute('aria-label', 'Primary');
    bottom.className =
      'md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 select-none';
    bottom.style.paddingBottom = 'env(safe-area-inset-bottom)';
    bottom.innerHTML = `<div class="grid grid-cols-5 h-16">${items
      .filter((i) => i.bottom)
      .map(
        (i) => `
        <a href="${i.href}" data-page="${i.id}" class="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
          activePage === i.id ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'
        }">
          ${svg(i.icon, 'w-6 h-6')}
          <span>${i.short}</span>
        </a>`
      )
      .join('')}</div>`;
    document.body.appendChild(bottom);
    document.body.classList.add('pb-24', 'md:pb-0');
  }
}

export function renderFooter(): void {
  const placeholder = getElement('footer-placeholder');
  if (!placeholder) return;

  const isRoot = isRootDirectory();
  const pagesPath = isRoot ? 'pages/' : '';

  const footerHTML = `
    <footer class="bg-white border-t border-slate-200 mt-auto py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:items-center">
            <div class="mb-4 md:mb-0">
                <p class="text-sm text-slate-500">&copy; 2026 CSE Reviewer.</p>
            </div>
            <div class="flex items-center justify-center space-x-4 text-sm font-medium text-slate-500">
                <a href="${pagesPath}about.html" class="hover:text-blue-600 transition-colors">About the Creator</a>
                <span class="text-slate-300">&middot;</span>
                <a href="${EXTERNAL_LINKS.PORTFOLIO}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors">Portfolio</a>
                <span class="text-slate-300">&middot;</span>
                <a href="${EXTERNAL_LINKS.GITHUB}" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors">GitHub</a>
            </div>
        </div>
    </footer>
  `;

  placeholder.innerHTML = footerHTML;
}
