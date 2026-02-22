/* ========================================
   STAGEBILL - Main Application
   ======================================== */

let musicals = [];
let currentFilter = 'all';
let currentHeroMusical = null;
let currentModalMusical = null;  // tracks which musical is open in modal
let currentLang = 'ko';

// ==========================================
// i18n Translations
// ==========================================
const translations = {
  ko: {
    'nav.all': '전체',
    'nav.science': '과학',
    'nav.family': '가족',
    'nav.career': '진로',
    'nav.healing': '힐링',
    'nav.daily': '일상',
    'nav.growth': '성장',
    'nav.fruition': '결실',
    'nav.color': '컬러',
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
    'modal.siblings': '같은 작품 다른 내용',
    'search.placeholder': '작품명, 해시태그, 키워드 검색...',
    'search.results': '검색 결과',
    'search.resultCount': '건',
    'search.noResults': '검색 결과가 없습니다',
    'search.noResultsSub': '다른 키워드나 해시태그로 검색해보세요.',
    'row.todayPick': '오늘의 PICK',
    'row.browseOthers': '다른 카테고리도 둘러보세요',
    'row.works': ' 작품',
    'row.curatorPick': ' 추천',
    'footer.description': '교실에서 시작하는 뮤지컬 수업',
  },
  en: {
    'nav.all': 'All',
    'nav.science': 'Science',
    'nav.family': 'Family',
    'nav.career': 'Career',
    'nav.healing': 'Healing',
    'nav.daily': 'Daily Life',
    'nav.growth': 'Growth',
    'nav.fruition': 'Achievement',
    'nav.color': 'Colors',
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
    'modal.siblings': 'Same Title, Different Content',
    'search.placeholder': 'Search title, hashtag, keyword...',
    'search.results': 'Search Results',
    'search.resultCount': ' result(s)',
    'search.noResults': 'No results found',
    'search.noResultsSub': 'Try different keywords or hashtags.',
    'row.todayPick': "Today's PICK",
    'row.browseOthers': 'Browse Other Categories',
    'row.works': ' Works',
    'row.curatorPick': "'s Picks",
    'footer.description': 'Musical Class Starts in the Classroom',
  },
  ja: {
    'nav.all': 'すべて',
    'nav.science': '科学',
    'nav.family': '家族',
    'nav.career': '進路',
    'nav.healing': 'ヒーリング',
    'nav.daily': '日常',
    'nav.growth': '成長',
    'nav.fruition': '実り',
    'nav.color': 'カラー',
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
    'modal.siblings': '同じ作品、別のコンテンツ',
    'search.placeholder': 'タイトル、ハッシュタグ、キーワードで検索...',
    'search.results': '検索結果',
    'search.resultCount': '件',
    'search.noResults': '検索結果がありません',
    'search.noResultsSub': '別のキーワードで検索してください。',
    'row.todayPick': '今日のPICK',
    'row.browseOthers': '他のカテゴリも見てみよう',
    'row.works': 'の作品',
    'row.curatorPick': 'のおすすめ',
    'footer.description': '教室から始まるミュージカル授業',
  }
};

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations['ko'][key] || key;
}

// Category label map: Korean key → { ko, en, ja }
const CATEGORY_MAP = {
  '과학': { ko: '과학', en: 'Science',      ja: '科学' },
  '가족': { ko: '가족', en: 'Family',       ja: '家族' },
  '진로': { ko: '진로', en: 'Career',       ja: '進路' },
  '힐링': { ko: '힐링', en: 'Healing',      ja: 'ヒーリング' },
  '일상': { ko: '일상', en: 'Daily Life',   ja: '日常' },
  '성장': { ko: '성장', en: 'Growth',       ja: '成長' },
  '결실': { ko: '결실', en: 'Achievement',  ja: '実り' },
  '컬러': { ko: '컬러', en: 'Colors',       ja: 'カラー' },
};

function getCategoryLabel(cat) {
  return (CATEGORY_MAP[cat] && CATEGORY_MAP[cat][currentLang]) || cat;
}

// Returns translated field value if available, falls back to Korean original.
// Expects spreadsheet to supply e.g. description_en, description_ja,
// ideaNotes_en, ideaNotes_ja fields from GOOGLETRANSLATE columns.
function getLocalizedField(m, fieldKey) {
  if (currentLang === 'ko') return m[fieldKey] || '';
  const translated = m[`${fieldKey}_${currentLang}`];
  return (translated && String(translated).trim()) ? String(translated) : (m[fieldKey] || '');
}

function applyI18n() {
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update nav links text — all category filters
  const navAll = document.querySelector('.nav-links a[data-filter="all"]');
  if (navAll) navAll.textContent = t('nav.all');
  document.querySelectorAll('.nav-links a[data-filter]').forEach(link => {
    const cat = link.dataset.filter;
    if (cat === 'all') return;
    const label = getCategoryLabel(cat);
    link.textContent = label;
  });

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
    // If a modal is currently open, re-render it in the new language
    if (currentModalMusical && document.getElementById('modalOverlay').classList.contains('active')) {
      openModal(currentModalMusical);
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
  // Update hero description with localized version if available
  const descEl = document.getElementById('heroDescription');
  if (descEl && m) descEl.textContent = getLocalizedField(m, 'description');
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
const DATA_URL = 'https://script.google.com/macros/s/AKfycby1jFiXdvlCBobh5FKRPAME1_Wfr57FGIMigQ7aJf_8T7awztqk0jwPlx1YBlDoyV4e4A/exec';

async function loadData() {
  // ── 1차 시도: Google Apps Script ──────────────────────────────────────
  try {
    console.log('[STAGEBILL] Apps Script 로딩 시작:', DATA_URL);
    const res = await fetch(`${DATA_URL}?t=${Date.now()}`, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('빈 배열 또는 잘못된 형식');
    musicals = data;
    console.log(`[STAGEBILL] Apps Script 로딩 성공 (${musicals.length}개)`);
    initApp();
    return;
  } catch (err) {
    console.warn('[STAGEBILL] Apps Script 연결 실패 →', err.message);
    console.warn('  → Apps Script 배포 설정을 확인하세요 (실행자: 나, 액세스: 모든 사용자)');
  }

  // ── 2차 시도: 로컬 JSON (폴백) ────────────────────────────────────────
  try {
    console.log('[STAGEBILL] 로컬 JSON 폴백 시도...');
    const res = await fetch('data/musicals.json');
    musicals = await res.json();
    console.warn('[STAGEBILL] 로컬 JSON 폴백 사용 중 — Apps Script 연결을 확인하세요');
    initApp();
  } catch (fbErr) {
    console.error('[STAGEBILL] 데이터 로딩 완전 실패:', fbErr);
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
  const map = {
    '과학': '🔬', '가족': '👨‍👩‍👧', '진로': '🧭',
    '힐링': '🌿', '일상': '🎭', '성장': '🌱',
    '결실': '🏆', '컬러': '🎨'
  };
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

  // Browser back button: close modal instead of leaving the page
  window.addEventListener('popstate', () => {
    const ov = document.getElementById('modalOverlay');
    if (ov.classList.contains('active')) {
      // Remove active without calling history.back() again (already popped)
      ov.classList.remove('active');
      document.body.style.overflow = '';
      currentModalMusical = null;
    }
  });
}

function openModal(m) {
  const overlay = document.getElementById('modalOverlay');
  const isAlreadyOpen = overlay.classList.contains('active');
  currentModalMusical = m;

  // Push history state only on first open (not on re-renders or sibling switches)
  if (!isAlreadyOpen) {
    history.pushState({ modal: true }, '');
  }

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

  const yearEl = document.getElementById('modalYear');
  const curationYear = m.curationYear || m.year;
  yearEl.textContent = `${t('modal.curationYear')}: ${curationYear}`;

  // i18n for section headers
  document.querySelectorAll('.modal-section h3[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  // ── Sibling versions (same title, different categories) ──────────────
  const siblingSection = document.getElementById('modalSiblingSection');
  const siblingLabel = document.getElementById('modalSiblingLabel');
  const siblingList = document.getElementById('modalSiblingList');
  const allVersions = musicals.filter(s => s.title === m.title);

  if (allVersions.length > 1) {
    siblingSection.style.display = '';
    if (siblingLabel) siblingLabel.textContent = t('modal.siblings');
    siblingList.innerHTML = allVersions.map(s => {
      const isCurrent = s.id === m.id;
      return `<button
        class="sibling-btn category-${s.category}${isCurrent ? ' current' : ''}"
        data-sibling-id="${s.id}"
        ${isCurrent ? 'disabled' : ''}
        title="${getCategoryLabel(s.category)}"
      >${getCategoryEmoji(s.category)} ${getCategoryLabel(s.category)}</button>`;
    }).join('');
    // Attach click events (avoids inline onclick)
    siblingList.querySelectorAll('.sibling-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.siblingId);
        const sibling = musicals.find(x => x.id === id);
        if (sibling) {
          openModal(sibling);
          document.getElementById('modal').scrollTop = 0;
        }
      });
    });
  } else {
    siblingSection.style.display = 'none';
  }
  // ─────────────────────────────────────────────────────────────────────

  // Description (translated if available)
  document.getElementById('modalDescription').textContent = getLocalizedField(m, 'description');

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

  // Idea Notes (translated if available)
  document.getElementById('modalIdeaNotes').textContent = getLocalizedField(m, 'ideaNotes');

  // Playlist
  const playlistEl = document.getElementById('modalPlaylist');
  playlistEl.href = m.playlistLink;
  const playlistSpan = playlistEl.querySelector('span[data-i18n]');
  if (playlistSpan) playlistSpan.textContent = t('modal.playlistLink');

  // References
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
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  currentModalMusical = null;
  // Go back in history to remove the state we pushed on openModal
  history.back();
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', loadData);
