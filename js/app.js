/* ========================================
   STAGEBILL - Main Application
   ======================================== */

let musicals = [];
let currentFilter = 'all';
let currentHeroMusical = null;
let currentLang = 'ko';

// ==========================================
// i18n Translations
// ==========================================
const translations = {
  ko: {
    'nav.all': '전체',
    'nav.daily': '일상',
    'nav.color': '컬러',
    'nav.career': '진로',
    'hero.badge': 'STAGEBILL 추천',
    'hero.detail': '자세히 보기',
    'hero.random': '랜덤 추천',
    'modal.description': '작품 소개',
    'modal.numbers': '추천 넘버',
    'modal.ideaNotes': '뮤지컬 수업 아이디어 노트',
    'modal.playlist': '플레이리스트',
    'modal.playlistLink': 'YouTube 플레이리스트 바로가기',
    'modal.references': '참고자료',
    'modal.hashtags': '해시태그',
    'modal.curator': '큐레이터',
    'modal.curationYear': '큐레이션 연도',
    'search.placeholder': '작품명, 해시태그, 키워드 검색...',
    'search.results': '검색 결과',
    'search.resultCount': '건',
    'search.noResults': '검색 결과가 없습니다',
    'search.noResultsSub': '다른 키워드나 해시태그로 검색해보세요.',
    'row.todayPick': '오늘의 PICK',
    'row.recommendation': ' 추천',
    'row.browseOthers': '다른 카테고리도 둘러보세요',
    'row.works': ' 작품',
    'row.curatorPick': ' 추천',
    'footer.description': '교실에서 시작하는 뮤지컬 수업',
    'category.daily': '일상',
    'category.color': '컬러',
    'category.career': '진로',
  },
  en: {
    'nav.all': 'All',
    'nav.daily': 'Daily Life',
    'nav.color': 'Colors',
    'nav.career': 'Career',
    'hero.badge': 'STAGEBILL PICK',
    'hero.detail': 'Details',
    'hero.random': 'Shuffle',
    'modal.description': 'About',
    'modal.numbers': 'Recommended Numbers',
    'modal.ideaNotes': 'Class Idea Notes',
    'modal.playlist': 'Playlist',
    'modal.playlistLink': 'Go to YouTube Playlist',
    'modal.references': 'References',
    'modal.hashtags': 'Hashtags',
    'modal.curator': 'Curator',
    'modal.curationYear': 'Curation Year',
    'search.placeholder': 'Search title, hashtag, keyword...',
    'search.results': 'Search Results',
    'search.resultCount': ' result(s)',
    'search.noResults': 'No results found',
    'search.noResultsSub': 'Try different keywords or hashtags.',
    'row.todayPick': "Today's PICK",
    'row.recommendation': "'s Picks",
    'row.browseOthers': 'Browse Other Categories',
    'row.works': ' Works',
    'row.curatorPick': "'s Picks",
    'footer.description': 'Musical Class Starts in the Classroom',
    'category.daily': 'Daily Life',
    'category.color': 'Colors',
    'category.career': 'Career',
  },
  ja: {
    'nav.all': 'すべて',
    'nav.daily': '日常',
    'nav.color': 'カラー',
    'nav.career': '進路',
    'hero.badge': 'STAGEBILLのおすすめ',
    'hero.detail': '詳細を見る',
    'hero.random': 'ランダム推薦',
    'modal.description': '作品紹介',
    'modal.numbers': 'おすすめナンバー',
    'modal.ideaNotes': '授業アイデアノート',
    'modal.playlist': 'プレイリスト',
    'modal.playlistLink': 'YouTubeプレイリストへ',
    'modal.references': '参考資料',
    'modal.hashtags': 'ハッシュタグ',
    'modal.curator': 'キュレーター',
    'modal.curationYear': 'キュレーション年度',
    'search.placeholder': 'タイトル、ハッシュタグ、キーワードで検索...',
    'search.results': '検索結果',
    'search.resultCount': '件',
    'search.noResults': '検索結果がありません',
    'search.noResultsSub': '別のキーワードで検索してください。',
    'row.todayPick': '今日のPICK',
    'row.recommendation': 'のおすすめ',
    'row.browseOthers': '他のカテゴリも見てみよう',
    'row.works': 'の作品',
    'row.curatorPick': 'のおすすめ',
    'footer.description': '教室から始まるミュージカル授業',
    'category.daily': '日常',
    'category.color': 'カラー',
    'category.career': '進路',
  }
};

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations['ko'][key] || key;
}

function getCategoryLabel(cat) {
  const map = {
    '일상': { ko: '일상', en: 'Daily Life', ja: '日常' },
    '컬러': { ko: '컬러', en: 'Colors', ja: 'カラー' },
    '진로': { ko: '진로', en: 'Career', ja: '進路' }
  };
  return (map[cat] && map[cat][currentLang]) || cat;
}

function applyI18n() {
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update nav links text
  const navAll = document.querySelector('.nav-links a[data-filter="all"]');
  const navDaily = document.querySelector('.nav-links a[data-filter="일상"]');
  const navColor = document.querySelector('.nav-links a[data-filter="컬러"]');
  const navCareer = document.querySelector('.nav-links a[data-filter="진로"]');
  if (navAll) navAll.textContent = t('nav.all');
  if (navDaily) navDaily.textContent = t('nav.daily');
  if (navColor) navColor.textContent = t('nav.color');
  if (navCareer) navCareer.textContent = t('nav.career');

  // Update search placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('search.placeholder');

  // Update html lang attribute
  document.documentElement.lang = currentLang === 'ja' ? 'ja' : (currentLang === 'en' ? 'en' : 'ko');

  // Re-render content if already loaded
  if (musicals.length > 0) {
    renderContentRows(currentFilter);
    if (currentHeroMusical) {
      refreshHeroText(currentHeroMusical);
    }
  }
}

function refreshHeroText(m) {
  const badge = document.querySelector('.hero-badge');
  if (badge) badge.textContent = t('hero.badge');
  const detailBtn = document.querySelector('#heroDetailBtn span');
  if (detailBtn) detailBtn.textContent = t('hero.detail');
  const randomBtn = document.querySelector('#heroRandomBtn span');
  if (randomBtn) randomBtn.textContent = t('hero.random');
}

// ==========================================
// Language Switcher
// ==========================================
function setupLangSwitcher() {
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      currentLang = lang;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyI18n();
    });
  });
}

// ==========================================
// Data Loading
// ==========================================
async function loadData() {
  try {
    const response = await fetch('data/musicals.json');
    musicals = await response.json();
    initApp();
  } catch (err) {
    console.error('데이터 로딩 실패:', err);
  }
}

// ==========================================
// App Initialization
// ==========================================
function initApp() {
  setupNavbar();
  setupSearch();
  setupLangSwitcher();
  setRandomHero();
  renderContentRows('all');
  setupModal();
  applyI18n();
}

// ==========================================
// Navbar Scroll Effect
// ==========================================
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Category filter links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = link.dataset.filter;
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentFilter = filter;

      // Close search results
      document.getElementById('searchResults').style.display = 'none';
      document.getElementById('searchInput').value = '';
      document.getElementById('heroBanner').style.display = '';
      document.getElementById('contentArea').style.display = '';

      renderContentRows(filter);
    });
  });
}

// ==========================================
// Search Functionality
// ==========================================
function setupSearch() {
  const container = document.getElementById('searchContainer');
  const btn = document.getElementById('searchBtn');
  const input = document.getElementById('searchInput');

  btn.addEventListener('click', () => {
    container.classList.toggle('active');
    if (container.classList.contains('active')) {
      input.focus();
    } else {
      input.value = '';
      hideSearchResults();
    }
  });

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      if (query.length > 0) {
        performSearch(query);
      } else {
        hideSearchResults();
      }
    }, 300);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      container.classList.remove('active');
      hideSearchResults();
    }
  });
}

function performSearch(query) {
  const q = query.toLowerCase();
  const results = musicals.filter(m => {
    const titleMatch = m.title.toLowerCase().includes(q);
    const descMatch = m.description.toLowerCase().includes(q);
    const categoryMatch = m.category.toLowerCase().includes(q);
    const curatorMatch = m.curator.toLowerCase().includes(q);
    const hashtagMatch = m.hashtags.some(h => h.toLowerCase().includes(q));
    const ideaMatch = m.ideaNotes.toLowerCase().includes(q);
    const numberMatch = m.recommendedNumbers.some(n =>
      n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    );
    return titleMatch || descMatch || categoryMatch || curatorMatch || hashtagMatch || ideaMatch || numberMatch;
  });

  showSearchResults(results, query);
}

function showSearchResults(results, query) {
  const section = document.getElementById('searchResults');
  const grid = document.getElementById('searchResultGrid');
  const title = document.getElementById('searchResultTitle');

  document.getElementById('heroBanner').style.display = 'none';
  document.getElementById('contentArea').style.display = 'none';
  section.style.display = 'block';

  const countLabel = currentLang === 'en'
    ? `"${query}" ${t('search.results')} (${results.length}${t('search.resultCount')})`
    : `"${query}" ${t('search.results')} (${results.length}${t('search.resultCount')})`;
  title.textContent = countLabel;

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <h3>${t('search.noResults')}</h3>
        <p>${t('search.noResultsSub')}</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(m => createCardHTML(m)).join('');
  attachCardEvents(grid);
}

function hideSearchResults() {
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('heroBanner').style.display = '';
  document.getElementById('contentArea').style.display = '';
}

// ==========================================
// Hero Banner
// ==========================================
function setRandomHero() {
  const idx = Math.floor(Math.random() * musicals.length);
  const m = musicals[idx];
  currentHeroMusical = m;

  const hero = document.getElementById('heroBanner');

  // Set background: image if thumbnail exists, gradient otherwise
  if (m.thumbnail) {
    hero.style.backgroundImage = `url(${m.thumbnail})`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center top';
    hero.style.background = `
      url(${m.thumbnail}) center top / cover no-repeat,
      linear-gradient(135deg, ${m.color}22 0%, var(--bg-primary) 100%)
    `;
  } else {
    hero.style.backgroundImage = '';
    hero.style.background = `
      radial-gradient(ellipse at 70% 40%, ${m.color}44 0%, transparent 70%),
      linear-gradient(135deg, ${m.color}22 0%, var(--bg-primary) 100%)
    `;
  }

  document.getElementById('heroTitle').textContent = m.title;
  document.getElementById('heroDescription').textContent = m.description;

  const hashtagsEl = document.getElementById('heroHashtags');
  hashtagsEl.innerHTML = m.hashtags.slice(0, 5).map(h =>
    `<span class="hashtag" onclick="searchByHashtag('${h}')">${h}</span>`
  ).join('');

  document.getElementById('heroDetailBtn').onclick = () => openModal(m);
  document.getElementById('heroRandomBtn').onclick = () => {
    setRandomHero();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

function searchByHashtag(tag) {
  const input = document.getElementById('searchInput');
  const container = document.getElementById('searchContainer');
  container.classList.add('active');
  input.value = tag;
  performSearch(tag);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetView() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchContainer').classList.remove('active');
  hideSearchResults();
  currentFilter = 'all';
  document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
  document.querySelector('.nav-links a[data-filter="all"]').classList.add('active');
  setRandomHero();
  renderContentRows('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// Content Rows
// ==========================================
function renderContentRows(filter) {
  const area = document.getElementById('contentArea');
  area.innerHTML = '';

  let filtered = filter === 'all' ? musicals : musicals.filter(m => m.category === filter);

  if (filter === 'all') {
    // Group by category
    const categories = [...new Set(musicals.map(m => m.category))];

    // "Today's Pick" row with random shuffle
    const shuffled = [...musicals].sort(() => Math.random() - 0.5);
    area.appendChild(createRow(t('row.todayPick'), shuffled));

    // Category rows
    categories.forEach(cat => {
      const items = musicals.filter(m => m.category === cat);
      const label = getCategoryLabel(cat);
      area.appendChild(createRow(`${getCategoryEmoji(cat)} ${label}`, items));
    });

    // "Curator's Choice" row
    const curators = [...new Set(musicals.map(m => m.curator))];
    curators.forEach(cur => {
      const items = musicals.filter(m => m.curator === cur);
      if (items.length > 0) {
        area.appendChild(createRow(`${cur}${t('row.curatorPick')}`, items));
      }
    });
  } else {
    const label = getCategoryLabel(filter);
    area.appendChild(createRow(`${getCategoryEmoji(filter)} ${label}${t('row.works')}`, filtered));

    // Also show random recommendations from other categories
    const others = musicals.filter(m => m.category !== filter).sort(() => Math.random() - 0.5).slice(0, 6);
    if (others.length > 0) {
      area.appendChild(createRow(t('row.browseOthers'), others));
    }
  }
}

function getCategoryEmoji(cat) {
  const map = { '일상': '🎭', '컬러': '🎨', '진로': '🧭' };
  return map[cat] || '🎵';
}

function createRow(title, items) {
  const row = document.createElement('div');
  row.className = 'content-row fade-in';
  row.innerHTML = `
    <h2 class="row-title">${title}</h2>
    <div class="row-slider">
      ${items.map(m => createCardHTML(m)).join('')}
    </div>
  `;
  attachCardEvents(row);
  return row;
}

// ==========================================
// Card Component
// ==========================================
function createCardHTML(m) {
  const categoryClass = `category-${m.category}`;
  const hashtags = m.hashtags.slice(0, 3).map(h =>
    `<span class="hashtag-sm" onclick="event.stopPropagation(); searchByHashtag('${h}')">${h}</span>`
  ).join('');

  const thumbnailInner = m.thumbnail
    ? `<img src="${m.thumbnail}" alt="${m.title} 포스터" class="card-poster" loading="lazy">`
    : `<div class="card-pattern"></div><span class="card-title-display">${m.title}</span>`;

  const thumbnailStyle = m.thumbnail
    ? ''
    : `style="background: linear-gradient(135deg, ${m.color}cc, ${m.color}44);"`;

  const catLabel = getCategoryLabel(m.category);

  return `
    <div class="card" data-id="${m.id}">
      <div class="card-thumbnail ${m.thumbnail ? 'has-image' : ''}" ${thumbnailStyle}>
        ${thumbnailInner}
      </div>
      <div class="card-info">
        <div class="card-info-title">${m.title}</div>
        <div class="card-info-meta">
          <span class="card-category-badge ${categoryClass}">${catLabel}</span>
          <span>${m.curationYear || m.year}</span>
        </div>
        <div class="card-hashtags">${hashtags}</div>
      </div>
    </div>
  `;
}

function attachCardEvents(container) {
  container.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const musical = musicals.find(m => m.id === id);
      if (musical) openModal(musical);
    });
  });
}

// ==========================================
// Modal (Detail View)
// ==========================================
function setupModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(m) {
  const overlay = document.getElementById('modalOverlay');
  const categoryClass = `category-${m.category}`;

  // Hero background
  const modalHero = document.getElementById('modalHero');
  if (m.thumbnail) {
    modalHero.style.backgroundImage = `url(${m.thumbnail})`;
    modalHero.style.backgroundSize = 'cover';
    modalHero.style.backgroundPosition = 'center top';
    modalHero.classList.add('has-image');
  } else {
    modalHero.style.backgroundImage = '';
    modalHero.style.backgroundSize = '';
    modalHero.style.backgroundPosition = '';
    modalHero.style.background = `
      radial-gradient(ellipse at 50% 30%, ${m.color}66 0%, transparent 70%),
      linear-gradient(135deg, ${m.color}33 0%, var(--bg-secondary) 100%)
    `;
    modalHero.classList.remove('has-image');
  }

  document.getElementById('modalTitle').textContent = m.title;

  const catEl = document.getElementById('modalCategory');
  catEl.textContent = getCategoryLabel(m.category);
  catEl.className = `modal-category ${categoryClass}`;

  document.getElementById('modalCurator').textContent = `${t('modal.curator')}: ${m.curator}`;

  // Show curation year (with production year as subtitle if available)
  const yearEl = document.getElementById('modalYear');
  const curationYear = m.curationYear || m.year;
  yearEl.textContent = `${t('modal.curationYear')}: ${curationYear}`;

  // Apply i18n to modal section headers
  document.querySelectorAll('.modal-section h3[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.getElementById('modalDescription').textContent = m.description;

  // Recommended Numbers
  const numbersEl = document.getElementById('modalNumbers');
  numbersEl.innerHTML = m.recommendedNumbers.map((n, i) => `
    <div class="number-item">
      <span class="number-index">${i + 1}</span>
      <div class="number-info">
        <div class="number-title">${n.title}</div>
        <div class="number-desc">${n.description}</div>
      </div>
    </div>
  `).join('');

  // Idea Notes
  document.getElementById('modalIdeaNotes').textContent = m.ideaNotes;

  // Playlist
  const playlistEl = document.getElementById('modalPlaylist');
  playlistEl.href = m.playlistLink;
  const playlistSpan = playlistEl.querySelector('span[data-i18n]');
  if (playlistSpan) playlistSpan.textContent = t('modal.playlistLink');

  // References (show only if available)
  const refsSection = document.getElementById('modalReferencesSection');
  const refsEl = document.getElementById('modalReferences');
  const refHeader = refsSection.querySelector('h3[data-i18n]');
  if (refHeader) refHeader.textContent = t('modal.references');

  if (m.references && m.references.length > 0) {
    refsSection.style.display = '';
    refsEl.innerHTML = m.references.map(ref => `
      <a href="${ref.url}" class="reference-link" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
        ${ref.title}
      </a>
    `).join('');
  } else {
    refsSection.style.display = 'none';
  }

  // Hashtags
  const hashtagsEl = document.getElementById('modalHashtags');
  hashtagsEl.innerHTML = m.hashtags.map(h =>
    `<span class="hashtag" onclick="closeModal(); searchByHashtag('${h}')">${h}</span>`
  ).join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', loadData);
