const PAGES = [
  { href:'index.html',        label:'Главная'   },
  { href:'commandments.html', label:'Заповеди'  },
  { href:'books.html',        label:'Писания'   },
  { href:'rules.html',        label:'Уставы'    },
  { href:'prayers.html',      label:'Молитвы'   },
  { href:'calendar.html',     label:'Календарь' },
  { href:'zhitiya.html',      label:'Святые'    },
  { href:'confession.html',   label:'Исповедь'  },
  { href:'join.html',         label:'Вступить'  },
];

const current = document.body.dataset.page || 'index.html';

/* ---------- HEADER ---------- */
const headerHost = document.getElementById('site-header');
if (headerHost) {
  headerHost.outerHTML = `
  <header class="site">
    <a class="logo" href="index.html" style="text-decoration:none">
      <span class="oct">100</span> ΒΡΕΝΤΙΑΝΙΣΜΟΣ
    </a>
    <nav class="main" id="mainnav">
      ${PAGES.map(p => `<a href="${p.href}" class="${p.href===current?'active':''}">${p.label}</a>`).join('')}
    </nav>
    <div class="gauge-wrap">
      <div class="gauge"><div class="gauge-fill" id="gaugeFill"></div></div>
      <button class="btn-fill" id="fillBtn">Γεμίσατε!</button>
    </div>
    <button class="burger" id="burger" aria-label="Меню">☰</button>
  </header>`;
}

/* ---------- FOOTER ---------- */
const footerHost = document.getElementById('site-footer');
if (footerHost) {
  footerHost.outerHTML = `
  <footer class="site">
    <div class="mantra">Γεμίσατε! · Мур-мур! · 100 октан во веки веков</div>
    <p>ΒΡΕΝΤΙΑΝΙΣΜΟΣ · Brentianism · Брентианизм — религия, созданная ради прикола,<br>
    но с полным соблюдением всех канонов жанра.</p>

    <div class="founders">
      <div class="founders-title">Основатели веры</div>
      <div class="founders-names">
        <span class="founder"><b>Риз Эсса</b><small>Reese Essa</small></span>
        <span class="founders-amp">·</span>
        <span class="founder"><b>Стекловатность</b><small>SteklowatA</small></span>
      </div>
    </div>

    <p style="margin-top:22px;font-size:.8rem;opacity:.65">
      Сайт является сатирой. Не заправляйтесь 92-м в премиум-двигатель. Серьёзно.
    </p>
  </footer>`;
}

/* ---------- BURGER (site menu) ---------- */
document.addEventListener('click', e => {
  if (e.target.id === 'burger') {
    document.getElementById('mainnav')?.classList.toggle('open');
  }
});

/* ---------- GAUGE / TOAST ---------- */
let level = Number(localStorage.getItem('brent_level') || 0);

function renderGauge() {
  const f = document.getElementById('gaugeFill');
  if (f) f.style.width = level + '%';
}

const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
let toastTimer;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

const PHRASES = [
  'Γεμίσατε! Бак полон.',
  'Брент наполняет. Пистолет освящает. Шланг соединяет.',
  'Мур-мур. 100 октан принят.',
  'Переливов тебе не будет. Γεμίσατε!',
  'Заправка засчитана как крещение.',
];

document.addEventListener('click', e => {
  if (e.target.id === 'fillBtn') {
    level = level >= 100 ? 0 : Math.min(100, level + 25);
    localStorage.setItem('brent_level', level);
    renderGauge();
    showToast(level === 100
      ? '⛽ БАК ПОЛОН. Слава Бренту во веки. Γεμίσατε!'
      : PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  }
});

/* ---------- REVEAL ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- AUTO TOC ---------- */
function buildTOC() {
  const main = document.querySelector('main');
  if (!main) return;

  // Собираем заголовки, исключая карточки и ссылки
  const headings = [...main.querySelectorAll('h2, h3')].filter(h => {
    if (h.closest('.card') || h.closest('.linkcard') || h.closest('footer') || h.closest('header')) return false;
    if (!h.textContent.trim()) return false;
    return true;
  });

  if (headings.length < 6) return;

  // Генерируем ID, если нет
  let h2i = 0, h3i = 0;
  headings.forEach(h => {
    if (!h.id) {
      const slug = h.textContent.trim().toLowerCase()
        .replace(/^[^\p{L}\d]+/u, '')
        .replace(/[^\p{L}\d]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'sec';
      h.id = (h.tagName === 'H2' ? 'sec-' : 'sub-')
           + (h.tagName === 'H2' ? ++h2i : ++h3i)
           + '-' + slug;
    }
  });

  // Sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'toc-sidebar';
  sidebar.innerHTML = `<div class="toc-header">📑 Оглавление</div><nav class="toc-nav"></nav>`;
  const nav = sidebar.querySelector('.toc-nav');

  headings.forEach(h => {
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.replace(/^[^\p{L}\d]+/u, '').trim();
    a.className = h.tagName === 'H2' ? 'toc-main' : 'toc-sub';
    a.addEventListener('click', ev => {
      ev.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + h.id);
      if (window.innerWidth < 900) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
      }
    });
    nav.appendChild(a);
  });

  document.body.appendChild(sidebar);
  document.body.classList.add('has-toc');

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'toc-backdrop';
  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  });
  document.body.appendChild(backdrop);

  // Burger
  const toggle = document.createElement('button');
  toggle.className = 'toc-burger';
  toggle.innerHTML = '📑 Оглавление';
  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    backdrop.classList.toggle('show', open);
  });
  document.body.appendChild(toggle);

  // Active highlight
  const links = nav.querySelectorAll('a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        const active = nav.querySelector('a.active');
        if (active && sidebar.classList.contains('open')) {
          const r = active.getBoundingClientRect();
          const sr = sidebar.getBoundingClientRect();
          if (r.top < sr.top + 40 || r.bottom > sr.bottom - 40) {
            active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    });
  }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => spy.observe(h));
}

buildTOC();

/* ---------- INIT ---------- */
renderGauge();