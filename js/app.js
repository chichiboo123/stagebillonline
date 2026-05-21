/* ========================================
   STAGEBILL - Main Application
   ======================================== */

let musicals = [];
let currentFilter = 'all';
let currentHeroMusical = null;
let currentModalMusical = null;  // tracks which musical is open in modal
let currentLang = 'ko';

// Hero history for prev/next arrow navigation
let heroHistory = [];
let heroHistoryIndex = -1;

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
    'modal.playlist': '참고 영상',
    'modal.playlistLink': 'YouTube에서 보기',
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
    'ai.title': 'AI 큐레이션',
    'ai.subtitle': '조건을 입력하면 스테이지빌에서 맞춤 작품을 골라드려요.',
    'ai.grade': '수업 대상 학년',
    'ai.grade.none': '선택 안 함',
    'ai.keywords': '수업 키워드',
    'ai.lessonType': '하고 싶은 수업',
    'ai.interests': '관심 작품 / 기타 조건',
    'ai.submit': 'AI 큐레이션 받기',
    'ai.loading': 'AI가 스테이지빌을 샅샅이 뒤지고 있어요...',
    'ai.loadingSub': '잠시만 기다려 주세요 ✨',
    'ai.result': 'AI 추천 결과',
    'ai.retry': '다시 검색하기',
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
    'modal.playlist': 'Reference Video',
    'modal.playlistLink': 'Watch on YouTube',
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
    'ai.title': 'AI Curation',
    'ai.subtitle': 'Enter your conditions and we\'ll pick the best works from STAGEBILL.',
    'ai.grade': 'Target Grade',
    'ai.grade.none': 'Any Grade',
    'ai.keywords': 'Keywords',
    'ai.lessonType': 'Lesson Type',
    'ai.interests': 'Interests / Other Notes',
    'ai.submit': 'Get AI Curation',
    'ai.loading': 'AI is searching through STAGEBILL...',
    'ai.loadingSub': 'Just a moment ✨',
    'ai.result': 'AI Recommendations',
    'ai.retry': 'Search Again',
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
    'modal.playlist': '参考動画',
    'modal.playlistLink': 'YouTubeで見る',
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
    'ai.title': 'AIキュレーション',
    'ai.subtitle': '条件を入力すると、STAGEBILLからぴったりの作品を選びます。',
    'ai.grade': '対象学年',
    'ai.grade.none': '指定なし',
    'ai.keywords': '授業キーワード',
    'ai.lessonType': 'やりたい授業',
    'ai.interests': '気になる作品 / その他',
    'ai.submit': 'AIキュレーションを受ける',
    'ai.loading': 'AIがSTAGEBILLを探しています...',
    'ai.loadingSub': 'しばらくお待ちください ✨',
    'ai.result': 'AIのおすすめ',
    'ai.retry': 'もう一度検索する',
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
  '인성': { ko: '인성', en: 'Character',    ja: '人性' },
};

// Scans loaded musicals for category_en / category_ja columns and
// registers any unknown categories into CATEGORY_MAP automatically.
function buildDynamicCategoryMap() {
  musicals.forEach(m => {
    const cat = m.category;
    if (!cat) return;
    if (CATEGORY_MAP[cat]) return; // already known
    CATEGORY_MAP[cat] = {
      ko: cat,
      en: (m.category_en && String(m.category_en).trim()) || cat,
      ja: (m.category_ja && String(m.category_ja).trim()) || cat,
    };
  });
}

function getCategoryLabel(cat) {
  return (CATEGORY_MAP[cat] && CATEGORY_MAP[cat][currentLang]) || cat;
}

// Category color map + fallback palette for dynamically added categories
const CATEGORY_COLORS = {
  '과학': '#00ACC1', '가족': '#FF7043', '진로': '#43A047',
  '힐링': '#7E57C2', '일상': '#1E88E5', '성장': '#F4511E',
  '결실': '#8D6E63', '컬러': '#E91E63',
};
const _CAT_PALETTE = [
  '#26A69A', '#AB47BC', '#EC407A', '#FFA726',
  '#66BB6A', '#42A5F5', '#EF5350', '#78909C',
  '#D4E157', '#FF8A65', '#4DB6AC', '#BA68C8',
];
const _dynamicCatColors = {};

function getCategoryColor(cat) {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  if (_dynamicCatColors[cat]) return _dynamicCatColors[cat];
  const idx = Object.keys(_dynamicCatColors).length % _CAT_PALETTE.length;
  _dynamicCatColors[cat] = _CAT_PALETTE[idx];
  return _dynamicCatColors[cat];
}

// Build nav links dynamically from loaded data
function buildNavLinks() {
  const navLinks = document.getElementById('navLinks');
  // Remove existing category links, keep only "전체"
  navLinks.querySelectorAll('li:not(:first-child)').forEach(li => li.remove());
  // Unique categories in order of first appearance
  const categories = [...new Set(musicals.map(m => m.category).filter(Boolean))];
  categories.forEach(cat => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.filter = cat;
    a.textContent = getCategoryLabel(cat);
    li.appendChild(a);
    navLinks.appendChild(li);
  });
}

// Extracts YouTube video ID from a single-video URL.
// Returns null for playlists (youtube.com/playlist?list=...) or non-YouTube URLs.
function getYouTubeVideoId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') return u.searchParams.get('v') || null;
  } catch(e) {}
  return null;
}

function makeVideoEmbed(videoId) {
  return `<div class="video-embed-container">
    <iframe src="https://www.youtube.com/embed/${videoId}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen frameborder="0" loading="lazy"></iframe>
  </div>`;
}

// Parses references from either an already-parsed array (Apps Script v2)
// or a raw string (Apps Script v1 / fallback). Format: "title::url|title2::url2"
function parseReferences(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    // Already parsed — filter out entries missing url
    return raw.filter(r => r && r.url);
  }
  const str = String(raw).trim();
  if (!str) return [];
  return str.split('|').map(r => {
    const trimmed = r.trim();
    if (!trimmed) return null;
    if (trimmed.includes('::')) {
      const sepIdx = trimmed.indexOf('::');
      const title = trimmed.substring(0, sepIdx).trim();
      const url   = trimmed.substring(sepIdx + 2).trim();
      return (url) ? { title: title || '참고 링크', url } : null;
    }
    if (trimmed.startsWith('http')) {
      return { title: '참고 링크', url: trimmed };
    }
    return null;
  }).filter(Boolean);
}

// Returns translated field value if available, falls back to Korean original.
// Expects spreadsheet to supply e.g. description_en, description_ja,
// ideaNotes_en, ideaNotes_ja fields from GOOGLETRANSLATE columns.
function getLocalizedField(m, fieldKey) {
  if (currentLang === 'ko') return m[fieldKey] || '';
  const translated = m[`${fieldKey}_${currentLang}`];
  return (translated && String(translated).trim()) ? String(translated) : (m[fieldKey] || '');
}

function getLocalizedHashtags(m) {
  if (currentLang === 'ko') return m.hashtags || [];
  const localized = m[`hashtags_${currentLang}`];
  return (localized && localized.length > 0) ? localized : (m.hashtags || []);
}

// Returns localized recommended numbers.
// Handles all data formats:
//   A) New flat fields: number1_title, number1_title_en, number1_title_jp, etc.
//   B) Old array (recommendedNumbers) + new translation columns in JSON
//   C) Old array only → returns as-is (no translation until Apps Script updated)
function getLocalizedNumbers(m) {
  const suffix = currentLang === 'ko' ? '' : (currentLang === 'ja' ? '_jp' : '_en');
  const legacy = Array.isArray(m.recommendedNumbers) ? m.recommendedNumbers : [];

  // Korean source: prefer flat field, fall back to legacy array item
  const ko1Title = m.number1_title || (legacy[0] ? legacy[0].title       : '');
  const ko1Desc  = m.number1_desc  || (legacy[0] ? legacy[0].description : '');
  const ko2Title = m.number2_title || (legacy[1] ? legacy[1].title       : '');
  const ko2Desc  = m.number2_desc  || (legacy[1] ? legacy[1].description : '');

  const result = [];
  if (ko1Title) {
    result.push({
      title:       (suffix && m[`number1_title${suffix}`]) || ko1Title,
      description: (suffix && m[`number1_desc${suffix}`])  || ko1Desc,
    });
  }
  if (ko2Title) {
    result.push({ title: ko2Title, description: ko2Desc });
  }
  // If still nothing found but legacy has more items, return legacy array as-is
  return result.length > 0 ? result : legacy;
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
  if (!m) return;
  const titleEl = document.getElementById('heroTitle');
  if (titleEl) titleEl.textContent = getLocalizedField(m, 'title');
  const descEl = document.getElementById('heroDescription');
  if (descEl) descEl.textContent = getLocalizedField(m, 'description');
  const hashtagsEl = document.getElementById('heroHashtags');
  if (hashtagsEl) {
    hashtagsEl.innerHTML = getLocalizedHashtags(m).slice(0, 5).map(h =>
      `<span class="hashtag" onclick="searchByHashtag('${h}')">${h}</span>`
    ).join('');
  }
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
const DATA_URL = 'https://script.google.com/macros/s/AKfycbzpN9MNW3FpUwco4qCc4OZkv1nUi2GLyi58LBAq3MoZG8lo9X-qb-ZfzPbiFUzfx_n2Wg/exec';

async function loadData() {
  try {
    console.log('[STAGEBILL] Apps Script 로딩 시작:', DATA_URL);
    const res = await fetch(DATA_URL, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status} — Apps Script 배포 설정 확인 필요 (액세스: 모든 사용자)`);
    const data = await res.json();
    if (data && data.error) throw new Error(`Apps Script 오류: ${data.error} / 시트 목록: ${JSON.stringify(data.availableSheets)}`);
    if (!Array.isArray(data) || data.length === 0) throw new Error('빈 배열 — 스프레드시트에 데이터가 없거나 시트명이 다릅니다');
    musicals = data;
    console.log(`[STAGEBILL] 데이터 로딩 성공 (${musicals.length}개)`);
    initApp();
  } catch (err) {
    console.error('[STAGEBILL] 데이터 로딩 실패 →', err.message);
    showDataError(err.message);
  }
}

function showDataError(msg) {
  const area = document.getElementById('contentArea');
  if (area) {
    area.innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:var(--text-secondary);">
        <p style="font-size:1.1rem;margin-bottom:8px;">데이터를 불러오지 못했습니다.</p>
        <p style="font-size:0.85rem;opacity:0.6;">${msg}</p>
        <p style="font-size:0.8rem;margin-top:16px;opacity:0.5;">Apps Script 배포 설정 → 액세스: <b>모든 사용자</b> 로 재배포 후 새로고침하세요.</p>
      </div>`;
  }
}

// ==========================================
// App Initialization
// ==========================================
function initApp() {
  buildDynamicCategoryMap();
  buildNavLinks();
  setupNavbar();
  setupSearch();
  setupLangSwitcher();
  setRandomHero();
  setupHeroAutoRotation();
  renderContentRows('all');
  setupModal();
  setupUpload();
  setupAICuration();
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

  input.addEventListener('focus', () => input.removeAttribute('readonly'), { once: false });
  input.addEventListener('blur', () => { if (!input.value) input.setAttribute('readonly', ''); });

  btn.addEventListener('click', () => {
    container.classList.toggle('active');
    if (container.classList.contains('active')) {
      input.removeAttribute('readonly');
      input.focus();
    } else {
      input.value = '';
      input.setAttribute('readonly', '');
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
    const allHashtags = [...(m.hashtags||[]), ...(m.hashtags_en||[]), ...(m.hashtags_ja||[])];
    const hashtagMatch = allHashtags.some(h => h.toLowerCase().includes(q));
    const ideaMatch = m.ideaNotes.toLowerCase().includes(q);
    const numTexts = [
      m.number1_title||'', m.number1_desc||'',
      m.number1_title_en||'', m.number1_desc_en||'',
      m.number1_title_jp||'', m.number1_desc_jp||'',
      m.number2_title||'', m.number2_desc||'',
      ...(Array.isArray(m.recommendedNumbers)
        ? m.recommendedNumbers.flatMap(n => [n.title||'', n.description||''])
        : []),
    ];
    const numberMatch = numTexts.some(f => f.toLowerCase().includes(q));
    const titleAllLang = [m.title, m.title_en||'', m.title_ja||''].join(' ').toLowerCase();
    return titleAllLang.includes(q) || descMatch || categoryMatch || curatorMatch || hashtagMatch || ideaMatch || numberMatch;
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

// 히어로 콘텐츠 즉시 적용 (fade 여부 선택)
function applyHero(m, withFade) {
  const hero = document.getElementById('heroBanner');
  const doApply = () => {
    currentHeroMusical = m;
    if (m.thumbnail) {
      hero.style.background = `url("${m.thumbnail}") center top / cover no-repeat`;
    } else {
      hero.style.background = `
        radial-gradient(ellipse at 70% 40%, ${m.color}44 0%, transparent 70%),
        linear-gradient(135deg, ${m.color}22 0%, var(--bg-primary) 100%)
      `;
    }
    document.getElementById('heroTitle').textContent = getLocalizedField(m, 'title');
    document.getElementById('heroDescription').textContent = getLocalizedField(m, 'description');
    const hashtagsEl = document.getElementById('heroHashtags');
    hashtagsEl.innerHTML = getLocalizedHashtags(m).slice(0, 5).map(h =>
      `<span class="hashtag" onclick="searchByHashtag('${h}')">${h}</span>`
    ).join('');
    document.getElementById('heroDetailBtn').onclick = () => openModal(m);
    updateHeroNavArrows();
  };

  if (withFade) {
    hero.style.opacity = '0';
    setTimeout(() => { doApply(); hero.style.opacity = '1'; }, 420);
  } else {
    doApply();
  }
}

// 이전/다음 화살표 활성화 상태 업데이트
function updateHeroNavArrows() {
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  if (!prevBtn || !nextBtn) return;
  const canPrev = heroHistoryIndex > 0;
  prevBtn.classList.toggle('disabled', !canPrev);
  nextBtn.classList.remove('disabled');
}

// 랜덤 히어로 선택 + 히스토리에 추가
function setRandomHero(withFade = false) {
  const all  = musicals.filter(m => m.title && m.description);
  const pool = all.filter(m => !currentHeroMusical || m.id !== currentHeroMusical.id);
  const src  = pool.length > 0 ? pool : all;
  if (src.length === 0) return;
  const m = src[Math.floor(Math.random() * src.length)];
  // 현재 위치 이후의 히스토리 삭제 후 새 항목 추가
  heroHistory = heroHistory.slice(0, heroHistoryIndex + 1);
  heroHistory.push(m);
  heroHistoryIndex = heroHistory.length - 1;
  applyHero(m, withFade);
}

// 화살표로 히어로 이동 (-1: 이전, +1: 다음)
function navigateHero(direction) {
  scheduleHeroRotation(); // 타이머 리셋
  if (direction === -1 && heroHistoryIndex > 0) {
    heroHistoryIndex--;
    applyHero(heroHistory[heroHistoryIndex], true);
  } else if (direction === 1) {
    if (heroHistoryIndex < heroHistory.length - 1) {
      // 히스토리에 다음 항목이 있으면 그대로 이동
      heroHistoryIndex++;
      applyHero(heroHistory[heroHistoryIndex], true);
    } else {
      // 히스토리 끝이면 새 랜덤 선택
      setRandomHero(true);
    }
  }
}

// ─── Hero 자동 슬라이드 (Netflix 스타일) ───────────────
let _heroTimer = null;
let _heroHovered = false;
const HERO_INTERVAL = 7000; // 7초마다 전환

// setInterval 대신 재귀 setTimeout으로 구현
// → opacity 전환 중 spurious mouseleave 이벤트가 타이머를 멈추는 버그 방지
function scheduleHeroRotation() {
  clearTimeout(_heroTimer);
  _heroTimer = setTimeout(function tick() {
    const searchOn = document.getElementById('searchResults').style.display !== 'none';
    const modalOn  = document.getElementById('modalOverlay').classList.contains('active');
    if (!_heroHovered && !searchOn && !modalOn) setRandomHero(true);
    _heroTimer = setTimeout(tick, HERO_INTERVAL);
  }, HERO_INTERVAL);
}

function startHeroRotation() { scheduleHeroRotation(); }
function stopHeroRotation()  { clearTimeout(_heroTimer); _heroTimer = null; }

function setupHeroAutoRotation() {
  const hero = document.getElementById('heroBanner');
  // 플래그만 업데이트 — 타이머는 항상 유지
  hero.addEventListener('mouseenter', () => { _heroHovered = true; });
  hero.addEventListener('mouseleave', () => { _heroHovered = false; });
  // 랜덤 추천 버튼
  document.getElementById('heroRandomBtn').addEventListener('click', () => {
    setRandomHero(true);
    scheduleHeroRotation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // 이전/다음 화살표 버튼
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => { navigateHero(-1); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  if (nextBtn) nextBtn.addEventListener('click', () => { navigateHero(1);  window.scrollTo({ top: 0, behavior: 'smooth' }); });
  // 터치 스와이프로 좌우 이동 (모바일)
  let _swipeStartX = 0;
  let _swipeStartY = 0;
  hero.addEventListener('touchstart', e => {
    _swipeStartX = e.touches[0].clientX;
    _swipeStartY = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - _swipeStartX;
    const dy = e.changedTouches[0].clientY - _swipeStartY;
    // 수평 이동이 50px 이상이고 수직보다 클 때만 반응
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      navigateHero(dx < 0 ? 1 : -1); // 왼쪽 스와이프 → 다음, 오른쪽 → 이전
    }
  }, { passive: true });
  scheduleHeroRotation();
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
  heroHistory = [];
  heroHistoryIndex = -1;
  setRandomHero();
  scheduleHeroRotation();
  renderContentRows('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// Content Rows
// ==========================================
function renderContentRows(filter) {
  const area = document.getElementById('contentArea');
  area.innerHTML = '';
  area.style.display = '';  // 검색 후 숨겨진 경우 복원

  let filtered = filter === 'all' ? musicals : musicals.filter(m => m.category === filter);

  if (filter === 'all') {
    // "Today's Pick" row — only musicals with actual content
    const validMusicals = musicals.filter(m => m.title && m.description);
    if (validMusicals.length > 0) {
      const shuffled = [...validMusicals].sort(() => Math.random() - 0.5);
      area.appendChild(createRow(t('row.todayPick'), shuffled));
    }

    // Category rows — only categories that have data
    const categories = [...new Set(musicals.map(m => m.category))];
    categories.forEach(cat => {
      const items = musicals.filter(m => m.category === cat);
      if (items.length > 0) {
        const label = getCategoryLabel(cat);
        area.appendChild(createRow(label, items));
      }
    });
  } else {
    const label = getCategoryLabel(filter);
    area.appendChild(createRow(`${label}${t('row.works')}`, filtered));

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
  const cardsHTML = items.map(m => {
    try { return createCardHTML(m); }
    catch(e) { console.error('[STAGEBILL] 카드 오류:', m.title, e); return ''; }
  }).join('');
  row.innerHTML = `
    <h2 class="row-title">${title}</h2>
    <div class="row-slider-wrap">
      <button class="row-nav-btn row-nav-prev row-nav-hidden" aria-label="이전">
        <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <div class="row-slider">${cardsHTML}</div>
      <button class="row-nav-btn row-nav-next" aria-label="다음">
        <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
    </div>
  `;
  attachCardEvents(row);
  setupRowNav(row);
  return row;
}

function setupRowNav(row) {
  const slider  = row.querySelector('.row-slider');
  const prevBtn = row.querySelector('.row-nav-prev');
  const nextBtn = row.querySelector('.row-nav-next');
  if (!slider || !prevBtn || !nextBtn) return;

  const update = () => {
    const atStart = slider.scrollLeft <= 2;
    const atEnd   = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 2;
    prevBtn.classList.toggle('row-nav-hidden', atStart);
    nextBtn.classList.toggle('row-nav-hidden', atEnd);
  };

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -(slider.clientWidth * 0.85), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: slider.clientWidth * 0.85, behavior: 'smooth' });
  });

  slider.addEventListener('scroll', update, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(update).observe(slider);
  } else {
    setTimeout(update, 300);
  }
  update();
}

// ==========================================
// Card Component
// ==========================================
function createCardHTML(m) {
  const hashtags = getLocalizedHashtags(m).slice(0, 3).map(h =>
    `<span class="hashtag-sm" onclick="event.stopPropagation(); searchByHashtag('${h}')">${h}</span>`
  ).join('');

  const thumbnailInner = m.thumbnail
    ? `<img src="${m.thumbnail}" alt="${m.title} 포스터" class="card-poster" loading="lazy">`
    : `<div class="card-pattern"></div><span class="card-title-display">${m.title}</span>`;

  const thumbnailStyle = m.thumbnail
    ? ''
    : `style="background: linear-gradient(135deg, ${m.color}cc, ${m.color}44);"`;

  const catLabel = getCategoryLabel(m.category);
  const catColor = getCategoryColor(m.category);

  return `
    <div class="card" data-id="${m.id}">
      <div class="card-thumbnail ${m.thumbnail ? 'has-image' : ''}" ${thumbnailStyle}>
        ${thumbnailInner}
      </div>
      <div class="card-info">
        <div class="card-info-title">${getLocalizedField(m, 'title')}</div>
        <div class="card-info-meta">
          <span class="card-category-badge" style="background:${catColor}">${catLabel}</span>
          <span>${m.curationYear}</span>
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

  document.getElementById('modalTitle').textContent = getLocalizedField(m, 'title');

  const catEl = document.getElementById('modalCategory');
  catEl.textContent = getCategoryLabel(m.category);
  catEl.className = 'modal-category';
  catEl.style.background = getCategoryColor(m.category);

  document.getElementById('modalCurator').textContent = `${t('modal.curator')}: ${m.curator}`;

  const yearEl = document.getElementById('modalYear');
  yearEl.textContent = `${t('modal.curationYear')}: ${m.curationYear}`;

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
        class="sibling-btn${isCurrent ? ' current' : ''}"
        style="background:${getCategoryColor(s.category)}"
        data-sibling-id="${s.id}"
        ${isCurrent ? 'disabled' : ''}
        title="${getCategoryLabel(s.category)}"
      >${getCategoryLabel(s.category)}</button>`;
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

  // Recommended Numbers (localized)
  const numbersEl = document.getElementById('modalNumbers');
  const localizedNumbers = getLocalizedNumbers(m);
  numbersEl.innerHTML = localizedNumbers.map((n, i) => `
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

  // 참고 영상: 단일 YouTube 동영상이면 embed, 플레이리스트·기타는 링크 버튼
  const playlistEl = document.getElementById('modalPlaylist');
  playlistEl.href = m.playlistLink || '#';
  const playlistSpan = playlistEl.querySelector('span[data-i18n]');
  if (playlistSpan) playlistSpan.textContent = t('modal.playlistLink');
  const playlistEmbed = document.getElementById('playlistEmbed');
  const plVideoId = getYouTubeVideoId(m.playlistLink);
  if (plVideoId) {
    playlistEmbed.innerHTML = makeVideoEmbed(plVideoId);
    playlistEl.style.display = 'none';
  } else {
    playlistEmbed.innerHTML = '';
    playlistEl.style.display = '';
  }

  // References
  const refsSection = document.getElementById('modalReferencesSection');
  const refsEl = document.getElementById('modalReferences');
  const refHeader = refsSection.querySelector('h3[data-i18n]');
  if (refHeader) refHeader.textContent = t('modal.references');

  const refs = parseReferences(m.references);
  console.log('[STAGEBILL] references raw:', JSON.stringify(m.references), '→ parsed:', refs.length + '개');
  if (refs.length > 0) {
    refsSection.style.display = 'block';
    refsEl.innerHTML = refs.map(ref => {
      const refVideoId = getYouTubeVideoId(ref.url);
      if (refVideoId) {
        return `<div class="ref-embed-item">
          <div class="ref-embed-title">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="ref-embed-link">${ref.title}</a>
          </div>
          ${makeVideoEmbed(refVideoId)}
        </div>`;
      }
      return `<a href="${ref.url}" class="reference-link" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
        ${ref.title}
      </a>`;
    }).join('');
  } else {
    refsSection.style.display = 'none';
  }

  // Hashtags
  const hashtagsEl = document.getElementById('modalHashtags');
  hashtagsEl.innerHTML = getLocalizedHashtags(m).map(h =>
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
// Upload (Google Forms 임베드)
// ==========================================
// 업로드는 Google Forms로 위임합니다.
//   - 응답은 Google Forms가 직접 연결된 스프레드시트에 기록 → CORS/iframe 트릭 불필요
//   - 폼 질문 제목을 시트 컬럼명(title, category, ...)과 똑같이 만들면 유지보수 단순
// 폼 교체 시 아래 URL만 바꾸면 됩니다.
const UPLOAD_FORM_BASE = 'https://forms.gle/Ag8QvdduCh3L4DDC6';
const UPLOAD_FORM_EMBED = `${UPLOAD_FORM_BASE}?embedded=true`;
const UPLOAD_PASSWORD = 'stage';

function setupUpload() {
  const btn     = document.getElementById('uploadBtn');
  const closeBtn = document.getElementById('uploadClose');
  const pwdInput = document.getElementById('uploadPassword');
  const pwdBtn   = document.getElementById('uploadPasswordBtn');

  btn.addEventListener('click', openUpload);
  closeBtn.addEventListener('click', closeUpload);

  pwdBtn.addEventListener('click', checkUploadPassword);
  pwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkUploadPassword(); });
}

function openUpload() {
  const overlay = document.getElementById('uploadOverlay');
  const pwdInput = document.getElementById('uploadPassword');
  overlay.classList.add('active');
  document.getElementById('uploadPasswordStep').style.display = '';
  document.getElementById('uploadFormStep').style.display = 'none';
  document.getElementById('uploadPwdError').textContent = '';
  // iframe src를 비워 두면 모달을 다시 열었을 때 이전 입력이 남지 않음
  const frame = document.getElementById('uploadFormFrame');
  if (frame) frame.src = 'about:blank';
  pwdInput.value = '';
  setTimeout(() => pwdInput.focus(), 80);
}

function closeUpload() {
  document.getElementById('uploadOverlay').classList.remove('active');
  // 닫을 때 iframe도 해제 → 다음 열기 때 새 폼 인스턴스 로드
  const frame = document.getElementById('uploadFormFrame');
  if (frame) frame.src = 'about:blank';
}

function checkUploadPassword() {
  const pwd = document.getElementById('uploadPassword').value;
  if (pwd === UPLOAD_PASSWORD) {
    document.getElementById('uploadPasswordStep').style.display = 'none';
    document.getElementById('uploadFormStep').style.display = '';
    const frame = document.getElementById('uploadFormFrame');
    if (frame) frame.src = UPLOAD_FORM_EMBED;
    const newTabLink = document.getElementById('uploadFormNewTab');
    if (newTabLink) newTabLink.href = UPLOAD_FORM_BASE;
  } else {
    const err = document.getElementById('uploadPwdError');
    err.textContent = '비밀번호가 올바르지 않습니다.';
    document.getElementById('uploadPassword').value = '';
    document.getElementById('uploadPassword').focus();
  }
}

// ==========================================
// AI 큐레이션
// ==========================================
function setupAICuration() {
  const btn       = document.getElementById('aiCurationBtn');
  const closeBtn  = document.getElementById('aiClose');
  const submitBtn = document.getElementById('aiSubmitBtn');
  const retryBtn  = document.getElementById('aiRetryBtn');
  const errorRetryBtn = document.getElementById('aiErrorRetryBtn');

  btn.addEventListener('click', openAICuration);
  closeBtn.addEventListener('click', closeAICuration);
  submitBtn.addEventListener('click', submitAICuration);
  retryBtn.addEventListener('click', resetAICuration);
  errorRetryBtn.addEventListener('click', resetAICuration);

  document.getElementById('aiOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('aiOverlay')) closeAICuration();
  });
}

function openAICuration() {
  resetAICuration();
  document.getElementById('aiOverlay').classList.add('active');
}

function closeAICuration() {
  document.getElementById('aiOverlay').classList.remove('active');
}

function resetAICuration() {
  showAIStep('aiInputStep');
}

function showAIStep(stepId) {
  ['aiInputStep', 'aiLoadingStep', 'aiResultStep', 'aiErrorStep'].forEach(id => {
    document.getElementById(id).style.display = id === stepId ? '' : 'none';
  });
}

async function submitAICuration() {
  const grade      = document.getElementById('aiGrade').value.trim();
  const keywords   = document.getElementById('aiKeywords').value.trim();
  const lessonType = document.getElementById('aiLessonType').value.trim();
  const interests  = document.getElementById('aiInterests').value.trim();

  if (!keywords && !lessonType && !grade) {
    document.getElementById('aiKeywords').focus();
    return;
  }

  showAIStep('aiLoadingStep');

  try {
    // GET + 쿼리 파라미터: CORS 프리플라이트 없음 + Apps Script 리다이렉트(302 → googleusercontent)에서 정상 동작
    // (POST는 Apps Script 리다이렉트 후 CORS 헤더가 누락되어 차단됨)
    const params = new URLSearchParams({
      action: 'curate',
      grade,
      keywords,
      lessonType,
      interests,
    });
    const res  = await fetch(`${DATA_URL}?${params.toString()}`, { redirect: 'follow' });
    const data = await res.json();

    if (data.error === 'QUOTA_EXCEEDED') {
      showAIError(
        '🎭',
        '오늘의 AI 큐레이션은 문을 닫았어요.',
        'AI 선생님이 하루치 에너지를 몽땅 쏟아부었거든요!\n내일 다시 찾아오시면 새 마음으로 맞이할게요 🌙\n(할당량은 매일 자정에 초기화됩니다)'
      );
      return;
    }
    if (data.error === 'INVALID_KEY') {
      showAIError('🔑', 'API 키를 확인해주세요.', 'Apps Script 설정의 GEMINI_API_KEY를 확인해주세요.');
      return;
    }
    if (data.error === 'API_KEY_MISSING') {
      showAIError('🔑', 'API 키가 설정되지 않았어요.', 'Apps Script > 프로젝트 설정 > 스크립트 속성에\nGEMINI_API_KEY를 추가해주세요.');
      return;
    }
    // Apps Script가 재배포되지 않으면 뮤지컬 배열을 그대로 반환함
    if (Array.isArray(data)) {
      showAIError('🔄', 'Apps Script 재배포가 필요해요.',
        'appsscript.gs 코드를 Apps Script 에디터에 붙여넣고\n새 버전으로 재배포한 뒤 다시 시도해주세요.');
      return;
    }
    if (data.error) {
      showAIError('😅', '오류가 발생했어요.', data.error);
      return;
    }
    if (!Array.isArray(data.recommendations) || data.recommendations.length === 0) {
      showAIError('🔍', '조건에 맞는 작품을 찾지 못했어요.', '키워드나 학년 조건을 바꿔서 다시 시도해보세요.');
      return;
    }

    renderAIResults(data.recommendations);
  } catch (err) {
    showAIError('📡', '연결에 문제가 생겼어요.', '인터넷 연결을 확인하고 다시 시도해주세요.');
  }
}

function renderAIResults(recommendations) {
  const list = document.getElementById('aiResultList');
  list.innerHTML = '';

  recommendations.forEach((rec, idx) => {
    const musical = musicals.find(m => String(m.id) === String(rec.id));
    const category = musical ? musical.category : '';
    const color = category ? getCategoryColor(category) : '#7c3aed';

    const card = document.createElement('div');
    card.className = 'ai-result-card';
    card.innerHTML = `
      <div class="ai-card-top">
        <div class="ai-card-num">${idx + 1}</div>
        <span class="ai-card-title">${rec.title || ''}</span>
        ${category ? `<span class="ai-card-category" style="background:${color}">${getCategoryLabel(category)}</span>` : ''}
      </div>
      <p class="ai-card-reason">${rec.reason || ''}</p>
    `;

    if (musical) {
      card.addEventListener('click', () => {
        closeAICuration();
        openModal(musical);
      });
    }
    list.appendChild(card);
  });

  showAIStep('aiResultStep');
}

function showAIError(emoji, title, sub) {
  document.getElementById('aiErrorEmoji').textContent = emoji;
  document.getElementById('aiErrorTitle').textContent = title;
  document.getElementById('aiErrorSub').textContent   = sub;
  showAIStep('aiErrorStep');
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', loadData);
