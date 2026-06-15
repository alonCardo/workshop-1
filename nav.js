// nav.js — shared navigation for all slides
const SLIDES = ['index.html','problem.html','blocks.html','rules.html','skills.html','loop.html','cta.html'];
const LABELS = ['Title','The Problem','Building Blocks','Rules & .mdc','Skills & Commands','The Full Loop','Call to Action'];
const TOTAL  = SLIDES.length;

const _file = decodeURIComponent(
  (location.pathname.split('/').pop() || 'index.html').split('%2F').pop()
).split(/[?#]/)[0];
const current = Math.max(0, SLIDES.findIndex(s => s.toLowerCase() === _file.toLowerCase()));

// Apply entrance animation immediately (before DOM ready)
;(function(){
  const dir = sessionStorage.getItem('navDir') || 'next';
  document.documentElement.classList.add(dir === 'prev' ? '_el' : '_er');
})();

document.addEventListener('DOMContentLoaded', function () {
  // Resolve classes onto body
  if (document.documentElement.classList.contains('_er')) {
    document.body.classList.add('enter-right');
  } else {
    document.body.classList.add('enter-left');
  }
  document.documentElement.classList.remove('_el','_er');

  // Progress bar
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = ((current + 1) / TOTAL * 100) + '%';

  // Counter
  const ctr = document.getElementById('counter');
  if (ctr) ctr.textContent = (current + 1) + ' / ' + TOTAL;

  // Dots
  const dotsEl = document.getElementById('dots');
  if (dotsEl) {
    dotsEl.innerHTML = SLIDES.map((s, i) =>
      `<div class="dot${i === current ? ' active' : ''}" onclick="go(${i})" title="${LABELS[i]}"></div>`
    ).join('');
  }

  // Button states + click handlers (inline onclick can't see const current)
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (btnPrev) {
    if (current === 0) btnPrev.disabled = true;
    btnPrev.addEventListener('click', function () { go(current - 1); });
  }
  if (btnNext) {
    if (current === TOTAL - 1) {
      btnNext.textContent = '🎉 Done';
      btnNext.disabled = true;
    }
    btnNext.addEventListener('click', function () { go(current + 1); });
  }
});

function go(i) {
  if (i < 0 || i >= TOTAL) return;
  sessionStorage.setItem('navDir', i > current ? 'next' : 'prev');
  location.href = SLIDES[i];
}

function toggleShortcuts() {
  const ov = document.getElementById('shortcut-overlay');
  if (ov) ov.classList.toggle('show');
}

document.addEventListener('keydown', function (e) {
  const ov = document.getElementById('shortcut-overlay');
  if (e.key === 'Escape') { if (ov && ov.classList.contains('show')) ov.classList.remove('show'); return; }
  if (ov && ov.classList.contains('show')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  go(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    go(current - 1);
  if (e.key === '?') toggleShortcuts();
});
