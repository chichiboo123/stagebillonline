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
    'stats.works': '게시 작품',
    'stats.contents': '콘텐츠',
    'stats.unit': '개',
    'footer.description': '교실에서 시작하는 뮤지컬 수업',
    'nav.aiCuration': 'AI 큐레이션',
    'nav.more': '더보기',
    'catalog.title': '작품 카탈로그',
    'catalog.tab.title': '작품명순',
    'catalog.tab.category': '카테고리별',
    'catalog.sub.category': '카테고리별로 작품명을 모아 봅니다.',
    'catalog.count.contents': '{n}개 콘텐츠',
    'catalog.open.title': '작품명순으로 전체 보기',
    'catalog.open.category': '카테고리별로 전체 보기',
    'index.title': '작품 색인',
    'index.sub': '작품명을 사전처럼 첫 글자별로 모아 봅니다.',
    'index.filter.ph': '작품명으로 좁히기...',
    'index.empty': '해당하는 작품이 없습니다.',
    'index.close': '닫기',
    'index.count': '{n}개 작품',
    'nav.upload': '업로드',
    'nav.uploadTitle': '새 내용 업로드',
    'nav.about': '소개',
    'about.title': 'STAGEBILL 소개',
    'about.tagline': '교실에서 시작하는 뮤지컬 수업',
    'upload.title': '업로드',
    'upload.pwdPrompt': '비밀번호를 입력하세요',
    'upload.pwdPlaceholder': '비밀번호',
    'upload.pwdSubmit': '확인',
    'upload.formTitle': '새 내용 업로드',
    'upload.formSub': '제출 후 스프레드시트에 자동으로 반영됩니다. (반영까지 1~2분 소요)',
    'upload.newTab': '새 창에서 열기',
    'ai.title': 'AI 큐레이션',
    'ai.subtitle': '조건을 입력하면 스테이지빌에서 맞춤 작품을 골라드려요.',
    'ai.grade': '대상 선택',
    'ai.grade.hint': '(중복 선택 가능)',
    'ai.grade.none': '선택 안 함',
    'ai.keywords': '키워드',
    'ai.keywords.ph': '예: 환경, 진로, 자존감, 우정...',
    'ai.lessonType': '하고 싶은 수업/연수',
    'ai.lessonType.ph': '예: 감상 수업, 토론, 창작 활동, 교사 연수 워크숍...',
    'ai.interests': '관심 작품 / 기타 조건',
    'ai.interests.opt': '(선택)',
    'ai.interests.ph': '예: 레미제라블처럼 사회적 메시지가 있는 작품, 노래가 쉬운 작품...',
    'ai.submit': 'AI 큐레이션 받기',
    'ai.loading': 'AI가 스테이지빌을 샅샅이 뒤지고 있어요...',
    'ai.loading2': '조건에 맞는 작품을 고르고 있어요...',
    'ai.loading3': '추천 이유와 활용 팁을 정리하고 있어요...',
    'ai.loading4': '거의 다 됐어요! 조금만 더 기다려 주세요...',
    'ai.loadingSub': '잠시만 기다려 주세요 ✨',
    'ai.validation': '대상, 키워드, 활동 중 하나 이상을 입력해주세요.',
    'ai.result': 'AI 추천 결과',
    'ai.external': '이런 작품도 있어요',
    'ai.external.sub': '스테이지빌에는 없지만 입력하신 조건과 관련된 작품이에요. 카드를 누르면 구글에서 검색돼요.',
    'ai.external.kr': '한국',
    'ai.external.intl': '해외',
    'ai.external.searchPrefix': '뮤지컬',
    'ai.external.searchHint': '구글 검색',
    'ai.model.label': 'AI 모델',
    'ai.retry': '다시 검색하기',
    'ai.export.txt': 'TXT', 'ai.export.txtTitle': '텍스트로 저장',
    'ai.export.jpg': 'JPG', 'ai.export.jpgTitle': '이미지로 저장',
    'ai.export.link': '링크', 'ai.export.linkTitle': '공유 링크 복사',
    'ai.export.copy': '복사', 'ai.export.copyTitle': '텍스트 복사',
    'ai.meta.target': '대상', 'ai.meta.keywords': '키워드', 'ai.meta.lessonType': '활동', 'ai.meta.interests': '기타',
    'target.elem12': '초등 1-2학년', 'target.elem34': '초등 3-4학년', 'target.elem56': '초등 5-6학년',
    'target.mid1': '중학교 1학년', 'target.mid2': '중학교 2학년', 'target.mid3': '중학교 3학년',
    'target.high1': '고등학교 1학년', 'target.high2': '고등학교 2학년', 'target.high3': '고등학교 3학년',
    'target.teacher': '교사',
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
    'stats.works': 'Works',
    'stats.contents': 'Contents',
    'stats.unit': '',
    'footer.description': 'Musical Class Starts in the Classroom',
    'nav.aiCuration': 'AI Curation',
    'nav.more': 'More',
    'catalog.title': 'Catalog',
    'catalog.tab.title': 'By Title',
    'catalog.tab.category': 'By Category',
    'catalog.sub.category': 'Every work grouped by category.',
    'catalog.count.contents': '{n} contents',
    'catalog.open.title': 'Browse all by title',
    'catalog.open.category': 'Browse all by category',
    'index.title': 'Title Index',
    'index.sub': 'Every work gathered by first letter, like a dictionary.',
    'index.filter.ph': 'Filter by title...',
    'index.empty': 'No matching works.',
    'index.close': 'Close',
    'index.count': '{n} works',
    'nav.upload': 'Upload',
    'nav.uploadTitle': 'Upload new content',
    'nav.about': 'About',
    'about.title': 'About STAGEBILL',
    'about.tagline': 'Musical lessons that start in the classroom',
    'upload.title': 'Upload',
    'upload.pwdPrompt': 'Enter password',
    'upload.pwdPlaceholder': 'Password',
    'upload.pwdSubmit': 'OK',
    'upload.formTitle': 'Upload new content',
    'upload.formSub': 'Submissions are auto-saved to the spreadsheet. (Takes 1-2 min to reflect)',
    'upload.newTab': 'Open in new tab',
    'ai.title': 'AI Curation',
    'ai.subtitle': 'Tell us your conditions and we\'ll pick the best works from STAGEBILL.',
    'ai.grade': 'Audience',
    'ai.grade.hint': '(multiple selection)',
    'ai.grade.none': 'Any',
    'ai.keywords': 'Keywords',
    'ai.keywords.ph': 'e.g., environment, career, self-esteem, friendship...',
    'ai.lessonType': 'Lesson / Training type',
    'ai.lessonType.ph': 'e.g., appreciation, discussion, creative activity, teacher workshop...',
    'ai.interests': 'Works of interest / Other notes',
    'ai.interests.opt': '(optional)',
    'ai.interests.ph': 'e.g., works with social messages like Les Misérables, easy-to-sing songs...',
    'ai.submit': 'Get AI Curation',
    'ai.loading': 'AI is searching through STAGEBILL...',
    'ai.loading2': 'Picking works that match your conditions...',
    'ai.loading3': 'Writing reasons and classroom tips...',
    'ai.loading4': 'Almost there! Just a moment...',
    'ai.loadingSub': 'Just a moment ✨',
    'ai.validation': 'Please fill in at least one field: audience, keywords, or activity.',
    'ai.result': 'AI Recommendations',
    'ai.external': 'You Might Also Like',
    'ai.external.sub': 'Not in STAGEBILL, but related to the conditions you entered. Tap a card to search on Google.',
    'ai.external.kr': 'Korea',
    'ai.external.intl': 'International',
    'ai.external.searchPrefix': 'musical',
    'ai.external.searchHint': 'Google Search',
    'ai.model.label': 'AI Model',
    'ai.retry': 'Search Again',
    'ai.export.txt': 'TXT', 'ai.export.txtTitle': 'Save as text',
    'ai.export.jpg': 'JPG', 'ai.export.jpgTitle': 'Save as image',
    'ai.export.link': 'Link', 'ai.export.linkTitle': 'Copy share link',
    'ai.export.copy': 'Copy', 'ai.export.copyTitle': 'Copy text',
    'ai.meta.target': 'Audience', 'ai.meta.keywords': 'Keywords', 'ai.meta.lessonType': 'Activity', 'ai.meta.interests': 'Notes',
    'target.elem12': 'Elementary 1-2', 'target.elem34': 'Elementary 3-4', 'target.elem56': 'Elementary 5-6',
    'target.mid1': 'Middle School 1', 'target.mid2': 'Middle School 2', 'target.mid3': 'Middle School 3',
    'target.high1': 'High School 1', 'target.high2': 'High School 2', 'target.high3': 'High School 3',
    'target.teacher': 'Teacher',
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
    'stats.works': '作品',
    'stats.contents': 'コンテンツ',
    'stats.unit': '件',
    'footer.description': '教室から始まるミュージカル授業',
    'nav.aiCuration': 'AIキュレーション',
    'nav.more': 'もっと見る',
    'catalog.title': '作品カタログ',
    'catalog.tab.title': '作品名順',
    'catalog.tab.category': 'カテゴリ別',
    'catalog.sub.category': 'カテゴリごとに作品名をまとめて見られます。',
    'catalog.count.contents': '{n}件のコンテンツ',
    'catalog.open.title': '作品名順で全部見る',
    'catalog.open.category': 'カテゴリ別で全部見る',
    'index.title': '作品インデックス',
    'index.sub': '作品名を辞書のように頭文字ごとにまとめて見られます。',
    'index.filter.ph': '作品名で絞り込み...',
    'index.empty': '該当する作品がありません。',
    'index.close': '閉じる',
    'index.count': '{n}作品',
    'nav.upload': 'アップロード',
    'nav.uploadTitle': '新しい内容をアップロード',
    'nav.about': 'について',
    'about.title': 'STAGEBILLについて',
    'about.tagline': '教室から始まるミュージカル授業',
    'upload.title': 'アップロード',
    'upload.pwdPrompt': 'パスワードを入力してください',
    'upload.pwdPlaceholder': 'パスワード',
    'upload.pwdSubmit': '確認',
    'upload.formTitle': '新しい内容をアップロード',
    'upload.formSub': '送信後、スプレッドシートに自動反映されます。(1〜2分かかる場合があります)',
    'upload.newTab': '新しいタブで開く',
    'ai.title': 'AIキュレーション',
    'ai.subtitle': '条件を入力すると、STAGEBILLからぴったりの作品を選びます。',
    'ai.grade': '対象を選択',
    'ai.grade.hint': '(複数選択可)',
    'ai.grade.none': '指定なし',
    'ai.keywords': 'キーワード',
    'ai.keywords.ph': '例: 環境、進路、自尊心、友情...',
    'ai.lessonType': 'やりたい授業/研修',
    'ai.lessonType.ph': '例: 鑑賞授業、討論、創作活動、教員研修ワークショップ...',
    'ai.interests': '気になる作品 / その他',
    'ai.interests.opt': '(任意)',
    'ai.interests.ph': '例: レ・ミゼラブルのような社会的メッセージのある作品、歌いやすい作品...',
    'ai.submit': 'AIキュレーションを受ける',
    'ai.loading': 'AIがSTAGEBILLを探しています...',
    'ai.loading2': '条件に合う作品を選んでいます...',
    'ai.loading3': 'おすすめ理由と活用ヒントをまとめています...',
    'ai.loading4': 'もうすぐ完成します！',
    'ai.loadingSub': 'しばらくお待ちください ✨',
    'ai.validation': '対象・キーワード・活動のいずれかを入力してください。',
    'ai.result': 'AIのおすすめ',
    'ai.external': 'こんな作品もあります',
    'ai.external.sub': 'STAGEBILLにはありませんが、入力された条件に関連する作品です。カードをタップするとGoogleで検索できます。',
    'ai.external.kr': '韓国',
    'ai.external.intl': '海外',
    'ai.external.searchPrefix': 'ミュージカル',
    'ai.external.searchHint': 'Google検索',
    'ai.model.label': 'AIモデル',
    'ai.retry': 'もう一度検索する',
    'ai.export.txt': 'TXT', 'ai.export.txtTitle': 'テキスト保存',
    'ai.export.jpg': 'JPG', 'ai.export.jpgTitle': '画像保存',
    'ai.export.link': 'リンク', 'ai.export.linkTitle': '共有リンクをコピー',
    'ai.export.copy': 'コピー', 'ai.export.copyTitle': 'テキストコピー',
    'ai.meta.target': '対象', 'ai.meta.keywords': 'キーワード', 'ai.meta.lessonType': '活動', 'ai.meta.interests': 'その他',
    'target.elem12': '小学1-2年', 'target.elem34': '小学3-4年', 'target.elem56': '小学5-6年',
    'target.mid1': '中学1年', 'target.mid2': '中学2年', 'target.mid3': '中学3年',
    'target.high1': '高校1年', 'target.high2': '高校2年', 'target.high3': '高校3年',
    'target.teacher': '教員',
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
  _shortLabelCache = {};
}

function getCategoryLabel(cat) {
  return (CATEGORY_MAP[cat] && CATEGORY_MAP[cat][currentLang]) || cat;
}

// ── 짧은 카테고리 라벨 ──────────────────────────────────────────────
// '환경·지속가능발전' / 'Environment and Sustainable Development' 처럼 긴 이름이
// 카드 배지·내비게이션을 밀어내는 문제를 막기 위해, 의미를 잃지 않는 선에서 줄인다.
//   "Environment and Sustainable Development" → "Environment"
//   "환경·지속가능발전"                        → "환경"
//   "環境・持続可能な発展"                      → "環境"
// 줄인 결과가 다른 카테고리와 겹치면 그 카테고리는 전체 이름을 그대로 쓴다.
const CJK_RE = /[\u3000-\u9FFF\uAC00-\uD7AF\uFF00-\uFFEF]/;
const CAT_SPLIT_RE = /\s*(?:[·・/,、&]|\band\b|\bund\b|と)\s*/i;

function shortenCategoryLabel(label) {
  const full = String(label || '').trim();
  if (!full) return full;
  const head = (full.split(CAT_SPLIT_RE)[0] || '').trim() || full;
  const limit = CJK_RE.test(head) ? 8 : 14;
  if (head.length <= limit) return head;
  return head.slice(0, limit - 1).trim() + '…';
}

let _shortLabelCache = {};

// 현재 언어 기준 축약 라벨 테이블을 만든다 (충돌 시 전체 이름 사용)
function buildCategoryShortLabels() {
  const cats = Object.keys(CATEGORY_MAP);
  const table = {};
  const seen = {};
  cats.forEach(cat => {
    const short = shortenCategoryLabel(getCategoryLabel(cat));
    seen[short] = (seen[short] || 0) + 1;
    table[cat] = short;
  });
  cats.forEach(cat => {
    if (seen[table[cat]] > 1) table[cat] = getCategoryLabel(cat); // 모호하면 원래 이름
  });
  _shortLabelCache[currentLang] = table;
  return table;
}

function getCategoryShortLabel(cat) {
  const table = _shortLabelCache[currentLang] || buildCategoryShortLabels();
  return table[cat] || shortenCategoryLabel(getCategoryLabel(cat));
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

// 카테고리별 콘텐츠 수 (내비 '더보기' 패널에 표시)
function getCategoryCounts() {
  const counts = {};
  musicals.forEach(m => {
    if (!m || !m.category) return;
    counts[m.category] = (counts[m.category] || 0) + 1;
  });
  return counts;
}

// Build nav links dynamically from loaded data
// (클릭 이벤트는 setupNavbar의 위임 리스너가 처리하므로 재호출해도 안전)
//
// 카테고리가 늘어나면 상단 한 줄에 다 들어가지 않는다. 전부 늘어놓는 대신
// 폭에 맞는 만큼만 노출하고 나머지는 '더보기' 패널로 접는다(reflowNavLinks).
function buildNavLinks() {
  const navLinks = document.getElementById('navLinks');
  buildCategoryShortLabels();
  // Remove existing category links + '더보기' 항목, keep only "전체"
  navLinks.querySelectorAll('li:not(:first-child)').forEach(li => li.remove());
  // Unique categories in order of first appearance
  const categories = [...new Set(musicals.map(m => m.category).filter(Boolean))];
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.className = 'nav-cat-item';
    li.dataset.category = cat;
    const a = document.createElement('a');
    a.href = '#';
    a.dataset.filter = cat;
    a.textContent = getCategoryShortLabel(cat);
    a.title = getCategoryLabel(cat);
    if (cat === currentFilter) a.classList.add('active');
    li.appendChild(a);
    navLinks.appendChild(li);
  });
  navLinks.appendChild(createNavCatMore());
  // '전체' 링크의 active 상태 동기화
  const allLink = navLinks.querySelector('a[data-filter="all"]');
  if (allLink) allLink.classList.toggle('active', currentFilter === 'all');
  scheduleNavReflow();
}

// '더보기' 드롭다운 컨테이너 (내용은 reflowNavLinks가 채운다)
function createNavCatMore() {
  const li = document.createElement('li');
  li.className = 'nav-cat-more';
  li.id = 'navCatMore';
  li.innerHTML = `
    <button class="nav-cat-more-btn" type="button" aria-haspopup="true" aria-expanded="false">
      <span class="nav-cat-more-label">${t('nav.more')}</span>
      <span class="nav-cat-more-count"></span>
      <svg class="lang-caret" viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
    </button>
    <div class="nav-cat-more-menu" role="menu"></div>`;
  li.querySelector('.nav-cat-more-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNavDropdown(li);
  });
  return li;
}

let _navReflowRaf = null;
function scheduleNavReflow() {
  if (_navReflowRaf) cancelAnimationFrame(_navReflowRaf);
  _navReflowRaf = requestAnimationFrame(() => { _navReflowRaf = null; reflowNavLinks(); });
}

// 한 줄에 들어가는 카테고리만 남기고 나머지는 '더보기' 패널로 옮긴다.
// 모바일(≤768px)에서는 내비가 가로 스크롤 전용 줄이므로 접지 않는다.
function reflowNavLinks() {
  const navLinks = document.getElementById('navLinks');
  const more = document.getElementById('navCatMore');
  if (!navLinks || !more) return;

  const items = [...navLinks.querySelectorAll('.nav-cat-item')];
  items.forEach(li => li.classList.remove('nav-cat-hidden'));

  const isDesktop = window.matchMedia('(min-width: 769px)').matches;
  if (!isDesktop || items.length === 0) {
    more.classList.add('nav-cat-hidden');
    return;
  }

  const styles = getComputedStyle(navLinks);
  const gap = parseFloat(styles.columnGap || styles.gap) || 0;
  const allItem = navLinks.querySelector('li:first-child');
  const available = navLinks.clientWidth;

  // '더보기' 버튼 폭을 먼저 확보해 둔다
  more.classList.remove('nav-cat-hidden');
  const moreWidth = more.offsetWidth + gap;

  let used = allItem ? allItem.offsetWidth + gap : 0;
  const overflow = [];
  items.forEach(li => {
    const w = li.offsetWidth + gap;
    // 남은 항목이 하나뿐이면 '더보기' 자리를 비워둘 필요가 없다
    const reserve = (li === items[items.length - 1] && overflow.length === 0) ? 0 : moreWidth;
    if (overflow.length > 0 || used + w + reserve > available) {
      overflow.push(li);
    } else {
      used += w;
    }
  });

  // 현재 선택된 카테고리는 항상 보이도록 마지막 노출 항목과 자리를 바꾼다
  const activeIdx = overflow.findIndex(li => li.dataset.category === currentFilter);
  if (activeIdx >= 0) {
    const visible = items.filter(li => overflow.indexOf(li) === -1);
    const swapOut = visible[visible.length - 1];
    if (swapOut) {
      const activeLi = overflow[activeIdx];
      navLinks.insertBefore(activeLi, swapOut);
      overflow.splice(activeIdx, 1);
      overflow.unshift(swapOut);
    }
  }

  // 아무것도 못 들어가는 좁은 폭에서도 최소 1개는 노출 (빈 내비 방지)
  if (overflow.length === items.length && overflow.length > 1) overflow.shift();

  overflow.forEach(li => li.classList.add('nav-cat-hidden'));
  if (overflow.length === 0) {
    more.classList.add('nav-cat-hidden');
    return;
  }
  more.classList.remove('nav-cat-hidden');
  more.querySelector('.nav-cat-more-label').textContent = t('nav.more');
  more.querySelector('.nav-cat-more-count').textContent = overflow.length;
  const counts = getCategoryCounts();
  more.querySelector('.nav-cat-more-menu').innerHTML = overflow.map(li => {
    const cat = li.dataset.category;
    return `<a href="#" class="nav-cat-more-link${cat === currentFilter ? ' active' : ''}" data-filter="${escapeHtml(cat)}" role="menuitem">
      <span class="nav-cat-more-dot" style="background:${getCategoryColor(cat)}"></span>
      <span class="nav-cat-more-name">${escapeHtml(getCategoryLabel(cat))}</span>
      <span class="nav-cat-more-num">${counts[cat] || 0}</span>
    </a>`;
  }).join('');
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

// ── 다국어 컬럼 해석 ────────────────────────────────────────────────
// 스프레드시트의 일본어 열 이름이 통일되어 있지 않다(`title_ja` vs `number1_title_jp`).
// 언어별로 허용 접미사를 모두 시도해 어느 쪽 표기든 인식한다.
const LANG_SUFFIXES = {
  ko: [''],
  en: ['_en'],
  ja: ['_ja', '_jp'],
};

// 해당 언어 열이 비어 있을 때 어떤 언어로 대체할지.
// 일본어는 한국어 원문(한글)보다 영어 표기가 읽기 쉬우므로 ja → en → ko 순으로 내려간다.
const LANG_FALLBACK = {
  ko: ['ko'],
  en: ['en', 'ko'],
  ja: ['ja', 'en', 'ko'],
};

function suffixesFor(lang) {
  return LANG_SUFFIXES[lang] || [''];
}

// 특정 언어의 원본 값만 조회 (폴백 없음). 없으면 '' 반환.
function rawLocalizedField(m, fieldKey, lang) {
  for (const suffix of suffixesFor(lang)) {
    const v = m[`${fieldKey}${suffix}`];
    if (v != null && String(v).trim()) return String(v);
  }
  return '';
}

// Returns translated field value if available, falls back through LANG_FALLBACK.
// Expects spreadsheet to supply e.g. description_en, description_ja,
// ideaNotes_en, ideaNotes_ja fields from GOOGLETRANSLATE columns.
function getLocalizedField(m, fieldKey) {
  if (!m) return '';
  for (const lang of (LANG_FALLBACK[currentLang] || ['ko'])) {
    const v = rawLocalizedField(m, fieldKey, lang);
    if (v) return v;
  }
  return '';
}

// 작품명 전용 헬퍼 (카드 alt·색인·검색 등 여러 곳에서 재사용)
function getLocalizedTitle(m) {
  return getLocalizedField(m, 'title') || String((m && m.title) || '');
}

function toHashtagArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val).split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
}

function getLocalizedHashtags(m) {
  if (!m) return [];
  for (const lang of (LANG_FALLBACK[currentLang] || ['ko'])) {
    for (const suffix of suffixesFor(lang)) {
      const arr = toHashtagArray(m[`hashtags${suffix}`]);
      if (arr.length > 0) return arr;
    }
  }
  return [];
}

// Returns localized recommended numbers.
// Handles all data formats:
//   A) New flat fields: number1_title, number1_title_en, number1_title_jp, etc.
//   B) Old array (recommendedNumbers) + new translation columns in JSON
//   C) Old array only → returns as-is (no translation until Apps Script updated)
function getLocalizedNumbers(m) {
  const legacy = Array.isArray(m.recommendedNumbers) ? m.recommendedNumbers : [];

  // Korean source: prefer flat field, fall back to legacy array item
  const ko1Title = m.number1_title || (legacy[0] ? legacy[0].title       : '');
  const ko1Desc  = m.number1_desc  || (legacy[0] ? legacy[0].description : '');
  const ko2Title = m.number2_title || (legacy[1] ? legacy[1].title       : '');
  const ko2Desc  = m.number2_desc  || (legacy[1] ? legacy[1].description : '');

  const result = [];
  if (ko1Title) {
    result.push({
      title:       getLocalizedField(m, 'number1_title') || ko1Title,
      description: getLocalizedField(m, 'number1_desc')  || ko1Desc,
    });
  }
  if (ko2Title) {
    result.push({
      title:       getLocalizedField(m, 'number2_title') || ko2Title,
      description: getLocalizedField(m, 'number2_desc')  || ko2Desc,
    });
  }
  // If still nothing found but legacy has more items, return legacy array as-is
  return result.length > 0 ? result : legacy;
}

// ── 번역 열 진단 ────────────────────────────────────────────────────
// "일본어 모드인데 작품명이 한국어로 나온다" 같은 문제는 코드가 아니라
// 스프레드시트에 해당 열이 비어 있어서 생긴다. 어떤 작품의 어떤 열이 비었는지
// 콘솔에 정리해 출력한다. (window.stagebillTranslationReport()로 언제든 재실행)
const TRANSLATION_CHECK_FIELDS = ['title', 'description', 'ideaNotes', 'hashtags'];

function collectMissingTranslations() {
  const report = { en: {}, ja: {} };
  ['en', 'ja'].forEach(lang => {
    TRANSLATION_CHECK_FIELDS.forEach(field => {
      report[lang][field] = musicals
        .filter(m => m && m.title && !rawLocalizedField(m, field, lang))
        .map(m => String(m.title));
    });
  });
  return report;
}

function stagebillTranslationReport() {
  const report = collectMissingTranslations();
  const summary = [];
  ['en', 'ja'].forEach(lang => {
    TRANSLATION_CHECK_FIELDS.forEach(field => {
      const missing = report[lang][field];
      if (missing.length === 0) return;
      const columns = suffixesFor(lang).map(s => `${field}${s}`).join(' 또는 ');
      summary.push({
        언어: lang,
        열: columns,
        비어있는_작품수: missing.length,
        예시: missing.slice(0, 5).join(', ') + (missing.length > 5 ? ' …' : ''),
      });
    });
  });
  if (summary.length === 0) {
    console.log('[STAGEBILL i18n] 모든 번역 열이 채워져 있습니다.');
  } else {
    console.groupCollapsed(`[STAGEBILL i18n] 비어 있는 번역 열 ${summary.length}종 — 스프레드시트를 채우면 자동 반영됩니다`);
    console.table(summary);
    console.groupEnd();
  }
  return report;
}
if (typeof window !== 'undefined') window.stagebillTranslationReport = stagebillTranslationReport;

function applyI18n() {
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // title 속성 (네비 버튼 등)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  // placeholder 속성 (input/textarea)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  // 학년/대상 칩의 라벨
  document.querySelectorAll('[data-target-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-target-i18n'));
  });
  // 소개 모달 내용 (열려있지 않아도 미리 채워둠)
  renderAboutContent();
  // AI 큐레이션 결과가 화면에 있으면 다국어 갱신
  if (currentAICuration && document.getElementById('aiResultStep').style.display !== 'none') {
    renderAIResults(currentAICuration);
  }

  // Update nav links text — all category filters
  const navAll = document.querySelector('.nav-links a[data-filter="all"]');
  if (navAll) navAll.textContent = t('nav.all');
  buildCategoryShortLabels();
  document.querySelectorAll('.nav-links .nav-cat-item a[data-filter]').forEach(link => {
    const cat = link.dataset.filter;
    if (cat === 'all') return;
    link.textContent = getCategoryShortLabel(cat);
    link.title = getCategoryLabel(cat);
  });
  scheduleNavReflow();

  // Update search placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('search.placeholder');

  // Update html lang attribute
  document.documentElement.lang = currentLang === 'ja' ? 'ja' : (currentLang === 'en' ? 'en' : 'ko');

  // Re-render content if already loaded
  if (musicals.length > 0) {
    renderContentRows(currentFilter);
    if (isCatalogOpen()) renderCatalog();
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
      `<span class="hashtag" onclick="searchByHashtag('${h.replace(/'/g, "\\'")}')">${h}</span>`
    ).join('');
  }
}

// ==========================================
// Nav Dropdowns (언어 선택 + ⋯ 더보기 메뉴)
// ==========================================
const LANG_SHORT = { ko: 'KO', en: 'EN', ja: 'JP' };

// 열려 있는 모든 네비 드롭다운을 닫음
function closeAllNavDropdowns() {
  document.querySelectorAll('.lang-dropdown.open, .nav-cat-more.open').forEach(el => {
    el.classList.remove('open');
    const trigger = el.querySelector('[aria-expanded]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

// 드롭다운 컨테이너를 토글 (다른 드롭다운은 닫음)
function toggleNavDropdown(container) {
  const willOpen = !container.classList.contains('open');
  closeAllNavDropdowns();
  if (willOpen) {
    container.classList.add('open');
    const trigger = container.querySelector('[aria-expanded]');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }
}

function setupLangSwitcher() {
  const dropdown   = document.getElementById('langDropdown');
  const currentBtn = document.getElementById('langCurrentBtn');
  const menu       = document.getElementById('langMenu');
  const label      = document.getElementById('langCurrentLabel');
  const options    = document.querySelectorAll('.lang-option');
  if (!dropdown || !currentBtn) return;

  function syncActive() {
    label.textContent = LANG_SHORT[currentLang] || currentLang.toUpperCase();
    options.forEach(o => o.classList.toggle('active', o.dataset.lang === currentLang));
  }

  currentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNavDropdown(dropdown);
  });
  menu.addEventListener('click', (e) => e.stopPropagation());

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      closeAllNavDropdowns();
      if (lang === currentLang) return;
      currentLang = lang;
      syncActive();
      applyI18n();
    });
  });

  syncActive();
}

// 바깥 클릭 / ESC 로 드롭다운 닫기
document.addEventListener('click', closeAllNavDropdowns);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllNavDropdowns();
});

// ==========================================
// Data Loading
// ==========================================
const DATA_URL = 'https://script.google.com/macros/s/AKfycbxlzG6jhmT8YfZBSr3hxAJrHxuqlmHW2k5mEiCh2Oz8-WxlUv5uiWmVpwLZqPx1T3xCOQ/exec';

// 최근 로딩한 데이터를 localStorage에 저장 → 재방문 시 즉시 화면을 그리고,
// 백그라운드에서 최신 데이터를 받아 변경이 있을 때만 갱신 (stale-while-revalidate)
const DATA_CACHE_KEY = 'stagebill_data_v1';

function readCachedData() {
  try {
    const cached = JSON.parse(localStorage.getItem(DATA_CACHE_KEY) || 'null');
    if (cached && Array.isArray(cached.data) && cached.data.length > 0) return cached.data;
  } catch (_) {}
  return null;
}

function writeCachedData(data) {
  try {
    localStorage.setItem(DATA_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch (_) { /* 저장 공간 부족 등은 무시 — 캐시는 최적화일 뿐 */ }
}

// 데이터 로딩 중 빈 화면 대신 스켈레톤(자리 표시) 노출
function showLoadingSkeleton() {
  const area = document.getElementById('contentArea');
  if (!area) return;
  const cardHTML = '<div class="skeleton-card loading-shimmer"></div>'.repeat(6);
  const rowHTML = `
    <div class="content-row">
      <div class="skeleton-title loading-shimmer"></div>
      <div class="row-slider">${cardHTML}</div>
    </div>`;
  area.innerHTML = rowHTML + rowHTML;
}

async function loadData() {
  // 1) 캐시가 있으면 먼저 그린다 (체감 로딩 시간 제거)
  const cachedData = readCachedData();
  if (cachedData) {
    musicals = cachedData;
    console.log(`[STAGEBILL] 캐시 데이터로 즉시 렌더링 (${musicals.length}개)`);
    initApp();
  } else {
    showLoadingSkeleton();
  }

  // 2) 항상 최신 데이터를 받아온다
  try {
    console.log('[STAGEBILL] Apps Script 로딩 시작:', DATA_URL);
    const res = await fetch(DATA_URL, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status} — Apps Script 배포 설정 확인 필요 (액세스: 모든 사용자)`);
    const data = await res.json();
    if (data && data.error) throw new Error(`Apps Script 오류: ${data.error} / 시트 목록: ${JSON.stringify(data.availableSheets)}`);
    if (!Array.isArray(data) || data.length === 0) throw new Error('빈 배열 — 스프레드시트에 데이터가 없거나 시트명이 다릅니다');
    console.log(`[STAGEBILL] 데이터 로딩 성공 (${data.length}개)`);
    pingDeployment();

    if (cachedData) {
      // 캐시로 이미 렌더링된 상태: 내용이 실제로 바뀐 경우에만 다시 그림
      if (JSON.stringify(data) !== JSON.stringify(cachedData)) {
        console.log('[STAGEBILL] 데이터 변경 감지 → 화면 갱신');
        musicals = data;
        refreshAfterDataUpdate();
      }
    } else {
      musicals = data;
      initApp();
    }
    writeCachedData(data);
  } catch (err) {
    console.error('[STAGEBILL] 데이터 로딩 실패 →', err.message);
    // 캐시로라도 화면이 그려져 있으면 에러 화면으로 덮지 않음
    if (!cachedData) showDataError(err.message);
  }
}

// 백그라운드 갱신으로 데이터가 바뀌었을 때 화면 요소만 다시 그림 (이벤트 재등록 불필요)
function refreshAfterDataUpdate() {
  buildDynamicCategoryMap();
  buildNavLinks();
  const searchOn = document.getElementById('searchResults').style.display !== 'none';
  if (!searchOn) renderContentRows(currentFilter);
}

// 배포된 Apps Script가 최신 코드(action=ping 지원)인지 검증
async function pingDeployment() {
  try {
    const res = await fetch(`${DATA_URL}?action=ping`, { redirect: 'follow' });
    const data = await res.json();
    if (Array.isArray(data)) {
      console.warn('[STAGEBILL] ⚠️ Apps Script가 옛 버전입니다. ?action=ping이 인식되지 않아 데이터 배열이 반환됨. data/appsscript.gs 전체를 에디터에 붙여넣고 [배포 관리 → 편집 → 새 버전 → 배포] 하세요.');
    } else if (data && data.ok) {
      console.log(`[STAGEBILL] Apps Script 버전: ${data.version} / Gemini 키: ${data.hasGeminiKey ? '설정됨' : '미설정'} / 시트: ${data.sheet}`);
    } else {
      console.warn('[STAGEBILL] ping 응답이 비정상:', data);
    }
  } catch (err) {
    console.warn('[STAGEBILL] ping 실패:', err.message);
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
  setupAbout();
  setupCatalog();
  applyI18n();
  stagebillTranslationReport();
}

// ==========================================
// Navbar Scroll Effect
// ==========================================
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Category filter links — 위임 방식: buildNavLinks가 링크를 다시 만들어도 동작
  // ('더보기' 패널 안의 링크도 같은 ul 안에 있으므로 함께 처리된다)
  document.getElementById('navLinks').addEventListener('click', (e) => {
    const link = e.target.closest('a[data-filter]');
    if (!link) return;
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
    scheduleNavReflow();
  });

  // 폭이 바뀌면 상단 카테고리 노출 개수를 다시 계산
  window.addEventListener('resize', scheduleNavReflow);
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
  const lower = v => String(v || '').toLowerCase();
  const results = musicals.filter(m => {
    const descMatch = [m.description, m.description_en, m.description_ja, m.description_jp]
      .some(f => lower(f).includes(q));
    const categoryMatch = [m.category, m.category_en, m.category_ja, m.category_jp]
      .some(f => lower(f).includes(q));
    const curatorMatch = lower(m.curator).includes(q);
    const allHashtags = [
      ...toHashtagArray(m.hashtags), ...toHashtagArray(m.hashtags_en),
      ...toHashtagArray(m.hashtags_ja), ...toHashtagArray(m.hashtags_jp),
    ];
    const hashtagMatch = allHashtags.some(h => lower(h).includes(q));
    const ideaMatch = [m.ideaNotes, m.ideaNotes_en, m.ideaNotes_ja, m.ideaNotes_jp]
      .some(f => lower(f).includes(q));
    const numTexts = [
      m.number1_title||'', m.number1_desc||'',
      m.number1_title_en||'', m.number1_desc_en||'',
      m.number1_title_jp||'', m.number1_desc_jp||'',
      m.number1_title_ja||'', m.number1_desc_ja||'',
      m.number2_title||'', m.number2_desc||'',
      m.number2_title_en||'', m.number2_desc_en||'',
      m.number2_title_jp||'', m.number2_desc_jp||'',
      m.number2_title_ja||'', m.number2_desc_ja||'',
      ...(Array.isArray(m.recommendedNumbers)
        ? m.recommendedNumbers.flatMap(n => [n.title||'', n.description||''])
        : []),
    ];
    const numberMatch = numTexts.some(f => lower(f).includes(q));
    const titleAllLang = lower([m.title, m.title_en || '', m.title_ja || '', m.title_jp || ''].join(' '));
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
// 작품 색인 (사전형 가나다/ABC 보기)
// ==========================================
// 카테고리가 아니라 '작품명'을 기준으로 전체 목록을 훑어볼 수 있는 화면.
// 첫 글자(한글 초성 / 알파벳 / 일본어 오십음행)로 묶고, 상단 점프바로 이동한다.

const HANGUL_CHOSUNG = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];
// 된소리는 예사소리 그룹으로 합친다 (ㄲ→ㄱ)
const CHOSUNG_GROUP = { 'ㄲ': 'ㄱ', 'ㄸ': 'ㄷ', 'ㅃ': 'ㅂ', 'ㅆ': 'ㅅ', 'ㅉ': 'ㅈ' };
const KO_INDEX_ORDER = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const EN_INDEX_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const JA_INDEX_ORDER = ['あ','か','さ','た','な','は','ま','や','ら','わ'];
// 오십음행 매핑 (탁음·반탁음·소문자 포함)
const JA_ROWS = {
  'あ': 'あいうえおぁぃぅぇぉヴ',
  'か': 'かきくけこがぎぐげご',
  'さ': 'さしすせそざじずぜぞ',
  'た': 'たちつてとだぢづでどっ',
  'な': 'なにぬねの',
  'は': 'はひふへほばびぶべぼぱぴぷぺぽ',
  'ま': 'まみむめも',
  'や': 'やゆよゃゅょ',
  'ら': 'らりるれろ',
  'わ': 'わをんゎ',
};
const OTHER_INDEX_KEY = '#';
// 한자로 시작하는 제목(주로 일본어)은 읽는 법을 알 수 없으므로 한 그룹으로 모은다
const IDEOGRAPH_INDEX_KEY = '漢';

// 카타카나 → 히라가나
function kataToHira(ch) {
  const code = ch.charCodeAt(0);
  if (code >= 0x30A1 && code <= 0x30F6) return String.fromCharCode(code - 0x60);
  return ch;
}

// 제목의 첫 글자로 색인 그룹 키를 만든다
function getIndexKey(title) {
  const ch = String(title || '').trim().charAt(0);
  if (!ch) return OTHER_INDEX_KEY;
  const code = ch.charCodeAt(0);

  // 한글 음절 → 초성
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const cho = HANGUL_CHOSUNG[Math.floor((code - 0xAC00) / 588)];
    return CHOSUNG_GROUP[cho] || cho;
  }
  // 한글 자모 단독 표기
  if (code >= 0x3131 && code <= 0x314E) return CHOSUNG_GROUP[ch] || ch;
  // 알파벳
  if (/[A-Za-z]/.test(ch)) return ch.toUpperCase();
  // 가나 → 오십음행
  const hira = kataToHira(ch);
  for (const row of JA_INDEX_ORDER) {
    if (JA_ROWS[row].indexOf(hira) >= 0) return row;
  }
  // 한자
  if ((code >= 0x3400 && code <= 0x4DBF) || (code >= 0x4E00 && code <= 0x9FFF)) {
    return IDEOGRAPH_INDEX_KEY;
  }
  return OTHER_INDEX_KEY;
}

// 문자열을 초성 문자열로 변환 ('빨래' → 'ㅂㄹ'). 한글이 아닌 글자는 그대로 둔다.
// 된소리는 예사소리로 합쳐 'ㅂㄹ'로 검색해도 '빨래'가 잡히게 한다.
function toChosungString(str) {
  return String(str || '').split('').map(ch => {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const cho = HANGUL_CHOSUNG[Math.floor((code - 0xAC00) / 588)];
      return CHOSUNG_GROUP[cho] || cho;
    }
    return CHOSUNG_GROUP[ch] || ch;
  }).join('');
}

// 현재 언어에 맞춘 그룹 정렬 순서
function getIndexOrder() {
  if (currentLang === 'en') return [...EN_INDEX_ORDER, ...KO_INDEX_ORDER, ...JA_INDEX_ORDER];
  if (currentLang === 'ja') return [...JA_INDEX_ORDER, ...EN_INDEX_ORDER, ...KO_INDEX_ORDER];
  return [...KO_INDEX_ORDER, ...EN_INDEX_ORDER, ...JA_INDEX_ORDER];
}

function localeTag() {
  return currentLang === 'ja' ? 'ja-JP' : currentLang === 'en' ? 'en-US' : 'ko-KR';
}

// 같은 제목의 여러 콘텐츠(카테고리 버전)를 한 항목으로 묶는다
function buildTitleIndexEntries() {
  const byTitle = new Map();
  musicals.filter(m => m && m.title).forEach(m => {
    const key = String(m.title).trim();
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key).push(m);
  });
  return [...byTitle.entries()].map(([key, items]) => ({
    key,
    items,
    label: getLocalizedTitle(items[0]) || key,
  }));
}

function groupTitleIndexEntries(entries) {
  const groups = new Map();
  entries.forEach(entry => {
    const k = getIndexKey(entry.label);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(entry);
  });
  const order = getIndexOrder();
  const rank = k => {
    if (k === OTHER_INDEX_KEY) return 9999;
    if (k === IDEOGRAPH_INDEX_KEY) return 9998;
    const i = order.indexOf(k);
    return i === -1 ? 9997 : i;
  };
  const tag = localeTag();
  return [...groups.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0], tag))
    .map(([k, list]) => ({
      key: k,
      entries: list.sort((a, b) => a.label.localeCompare(b.label, tag)),
    }));
}

let catalogTab = 'title';           // 'title' | 'category'
let modalOpenedFromCatalog = false;  // 카탈로그에서 상세로 들어갔는지

function isCatalogOpen() {
  const el = document.getElementById('catalogOverlay');
  return !!el && el.classList.contains('active');
}

// 필터(작품명 일부 / 초성)를 적용한 항목 목록
function filterIndexEntries(entries, filterText) {
  const q = String(filterText || '').trim().toLowerCase();
  if (!q) return entries;
  const chosungQuery = /^[ㄱ-ㅎ]+$/.test(q) ? toChosungString(q) : '';
  return entries.filter(e => {
    // 'ㅂㄹ' 처럼 초성만 입력하면 초성으로 찾는다 (사전식 검색).
    // 색인이므로 '포함'이 아니라 '시작'으로 맞춰야 점프바와 결과가 어긋나지 않는다.
    if (chosungQuery &&
        (toChosungString(e.label).startsWith(chosungQuery) || toChosungString(e.key).startsWith(chosungQuery))) return true;
    return e.label.toLowerCase().includes(q) ||
      e.key.toLowerCase().includes(q) ||
      e.items.some(m => ['title_en', 'title_ja', 'title_jp']
        .some(f => String(m[f] || '').toLowerCase().includes(q)));
  });
}

// 항목 한 줄 (작품명 + 원제 + 카테고리 칩)
function catalogItemHTML(entry, opts = {}) {
  const cats = opts.hideChips
    ? []
    : [...new Set(entry.items.map(m => m.category).filter(Boolean))];
  const chips = cats.map(c =>
    `<span class="index-cat-chip" style="background:${getCategoryColor(c)}" title="${escapeHtml(getCategoryLabel(c))}">${escapeHtml(getCategoryShortLabel(c))}</span>`
  ).join('');
  const sub = entry.label !== entry.key ? `<span class="index-item-sub">${escapeHtml(entry.key)}</span>` : '';
  const id = (opts.item || entry.items[0]).id;
  return `<li class="index-item" data-id="${id}">
    <button class="index-item-btn" type="button">
      <span class="index-item-name">${escapeHtml(entry.label)}${sub}</span>
      <span class="index-item-tags">${chips}</span>
    </button>
  </li>`;
}

// 탭 1 — 작품명순 (첫 글자 그룹 + 점프바)
function renderCatalogByTitle(entries) {
  const groups = groupTitleIndexEntries(entries);
  const jump = groups.map(g =>
    `<button class="index-jump-btn" type="button" data-jump="${escapeHtml(g.key)}">${escapeHtml(g.key)}</button>`
  ).join('');
  const body = groups.map(g => `
    <section class="index-group" id="catalog-group-${encodeURIComponent(g.key)}">
      <h3 class="index-group-key">${escapeHtml(g.key)}<span class="index-group-num">${g.entries.length}</span></h3>
      <ul class="index-list">${g.entries.map(e => catalogItemHTML(e)).join('')}</ul>
    </section>`).join('');
  return { jump, body };
}

// 탭 2 — 카테고리별 (카테고리마다 작품명 가나다순)
function renderCatalogByCategory(entries) {
  const tag = localeTag();
  // 데이터 등장 순서를 유지해 내비 카테고리 순서와 맞춘다
  const order = [...new Set(musicals.map(m => m.category).filter(Boolean))];
  const byCat = new Map(order.map(c => [c, []]));
  entries.forEach(entry => {
    entry.items.forEach(m => {
      if (!m.category) return;
      if (!byCat.has(m.category)) byCat.set(m.category, []);
      byCat.get(m.category).push({ ...entry, item: m });
    });
  });

  const groups = [...byCat.entries()]
    .filter(([, list]) => list.length > 0)
    .map(([cat, list]) => ({
      cat,
      list: list.sort((a, b) => a.label.localeCompare(b.label, tag)),
    }));

  const jump = groups.map(g =>
    `<button class="index-jump-btn index-jump-cat" type="button" data-jump="${escapeHtml(g.cat)}" title="${escapeHtml(getCategoryLabel(g.cat))}">
      <span class="index-jump-dot" style="background:${getCategoryColor(g.cat)}"></span>${escapeHtml(getCategoryShortLabel(g.cat))}
    </button>`).join('');

  const body = groups.map(g => `
    <section class="index-group index-group-cat" id="catalog-group-${encodeURIComponent(g.cat)}">
      <h3 class="index-group-key index-group-key-cat">
        <span class="index-group-dot" style="background:${getCategoryColor(g.cat)}"></span>
        <span class="index-group-catname">${escapeHtml(getCategoryLabel(g.cat))}</span>
        <span class="index-group-num">${g.list.length}</span>
      </h3>
      <ul class="index-list">${g.list.map(e => catalogItemHTML(e, { hideChips: true, item: e.item })).join('')}</ul>
    </section>`).join('');
  return { jump, body };
}

function renderCatalog() {
  const overlay = document.getElementById('catalogOverlay');
  if (!overlay) return;
  const jumpEl    = document.getElementById('catalogJump');
  const contentEl = document.getElementById('catalogContent');
  const countEl   = document.getElementById('catalogCount');
  const subEl     = document.getElementById('catalogSub');
  const filterEl  = document.getElementById('catalogFilter');

  const entries = filterIndexEntries(buildTitleIndexEntries(), filterEl ? filterEl.value : '');

  subEl.textContent = catalogTab === 'category' ? t('catalog.sub.category') : t('index.sub');
  countEl.textContent = catalogTab === 'category'
    ? t('catalog.count.contents').replace('{n}', entries.reduce((n, e) => n + e.items.length, 0))
    : t('index.count').replace('{n}', entries.length);

  document.querySelectorAll('.catalog-tab').forEach(tab => {
    const on = tab.dataset.tab === catalogTab;
    tab.classList.toggle('active', on);
    tab.setAttribute('aria-selected', String(on));
  });

  if (entries.length === 0) {
    jumpEl.innerHTML = '';
    contentEl.innerHTML = `<p class="index-empty">${t('index.empty')}</p>`;
    return;
  }

  const { jump, body } = catalogTab === 'category'
    ? renderCatalogByCategory(entries)
    : renderCatalogByTitle(entries);
  jumpEl.innerHTML = jump;
  contentEl.innerHTML = body;

  jumpEl.querySelectorAll('.index-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(`catalog-group-${encodeURIComponent(btn.dataset.jump)}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  contentEl.querySelectorAll('.index-item').forEach(li => {
    li.addEventListener('click', () => {
      const m = musicals.find(x => String(x.id) === String(li.dataset.id));
      if (m) {
        modalOpenedFromCatalog = true;
        openModal(m);
      }
    });
  });
}

function openCatalog(tab) {
  const overlay = document.getElementById('catalogOverlay');
  if (!overlay) return;
  catalogTab = (tab === 'category') ? 'category' : 'title';
  const filterEl = document.getElementById('catalogFilter');
  if (filterEl) filterEl.value = '';
  renderCatalog();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  const body = document.getElementById('catalogBody');
  if (body) body.scrollTop = 0;
  // 데스크톱에서만 필터에 포커스 — 모바일은 키보드가 바로 올라와 목록을 가린다
  if (filterEl && window.matchMedia('(min-width: 769px)').matches) filterEl.focus();
}

function closeCatalog() {
  const overlay = document.getElementById('catalogOverlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.style.zIndex = '';
  document.body.style.overflow = '';
}

function setupCatalog() {
  const overlay  = document.getElementById('catalogOverlay');
  const closeBtn = document.getElementById('catalogClose');
  const filter   = document.getElementById('catalogFilter');
  if (!overlay) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCatalog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCatalog(); });

  document.querySelectorAll('.catalog-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      catalogTab = tab.dataset.tab;
      renderCatalog();
      const body = document.getElementById('catalogBody');
      if (body) body.scrollTop = 0;
    });
  });

  if (filter) {
    let timer;
    filter.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(renderCatalog, 180);
    });
    filter.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filter.value) {
        e.stopPropagation();
        filter.value = '';
        renderCatalog();
      }
    });
  }
}

// ==========================================
// Hero Banner
// ==========================================

// 히어로 콘텐츠 즉시 적용 (fade 여부 선택)
function applyHero(m, withFade) {
  const hero = document.getElementById('heroBanner');
  // 포스터가 없거나 불러오지 못했을 때 쓰는 색상 배경
  const gradientBg = (mm) => `
    radial-gradient(ellipse at 70% 40%, ${mm.color || '#555'}44 0%, transparent 70%),
    linear-gradient(135deg, ${mm.color || '#555'}22 0%, var(--bg-primary) 100%)
  `;

  const doApply = () => {
    currentHeroMusical = m;
    if (m.thumbnail) {
      hero.style.background = `url("${m.thumbnail}") center top / cover no-repeat`;
      // CSS background 는 오류 이벤트가 없어 깨져도 빈 화면만 남는다.
      // 별도로 한 번 로드해 보고 실패하면 색상 배경으로 되돌린다.
      const probe = new Image();
      probe.onerror = () => {
        recordBrokenThumbnail(m.thumbnail, getLocalizedTitle(m));
        if (currentHeroMusical && currentHeroMusical.id === m.id) {
          hero.style.background = gradientBg(m);
        }
      };
      probe.src = m.thumbnail;
    } else {
      hero.style.background = gradientBg(m);
    }
    document.getElementById('heroTitle').textContent = getLocalizedField(m, 'title');
    document.getElementById('heroDescription').textContent = getLocalizedField(m, 'description');
    const hashtagsEl = document.getElementById('heroHashtags');
    hashtagsEl.innerHTML = getLocalizedHashtags(m).slice(0, 5).map(h =>
      `<span class="hashtag" onclick="searchByHashtag('${h.replace(/'/g, "\\'")}')">${h}</span>`
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
  // 카탈로그에서 연 상세 모달의 해시태그로 들어올 수 있다.
  // 카탈로그를 닫지 않으면 검색 결과가 오버레이 뒤에 가려진다.
  closeCatalog();
  const input = document.getElementById('searchInput');
  const container = document.getElementById('searchContainer');
  container.classList.add('active');
  input.value = tag;
  performSearch(tag);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetView() {
  closeCatalog();
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
// ==========================================
// Catalog Stats (게시 작품 수 / 콘텐츠 수)
// ==========================================
let statsAnimated = false;

// '작품' = 고유 제목 수, '콘텐츠' = 제목이 있는 전체 항목 수
function computeCatalogStats() {
  const withTitle = musicals.filter(m => m && m.title);
  const workCount = new Set(withTitle.map(m => m.title)).size;
  const contentCount = withTitle.length;
  return { workCount, contentCount };
}

function createStatsBar() {
  const { workCount, contentCount } = computeCatalogStats();
  // 단위는 빈 문자열(영어)도 유효하므로 t()의 falsy 폴백을 피해 직접 조회
  const langPack = translations[currentLang] || translations['ko'];
  const unit = (langPack['stats.unit'] != null) ? langPack['stats.unit'] : (translations['ko']['stats.unit'] || '');
  const bar = document.createElement('div');
  bar.className = 'stats-bar fade-in';
  // 각 항목은 버튼 — 누르면 작품 카탈로그가 해당 탭으로 열린다
  bar.innerHTML = `
    <button class="stat-item" type="button" data-catalog-tab="title" title="${escapeHtml(t('catalog.open.title'))}">
      <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2,16.5C2,19.54,4.46,22,7.5,22s5.5-2.46,5.5-5.5V10H2V16.5z M7.5,18.5C6.12,18.5,5,17.83,5,17h5C10,17.83,8.88,18.5,7.5,18.5z M10,13c0.55,0,1,0.45,1,1c0,0.55-0.45,1-1,1s-1-0.45-1-1C9,13.45,9.45,13,10,13z M5,13c0.55,0,1,0.45,1,1c0,0.55-0.45,1-1,1s-1-0.45-1-1C4,13.45,4.45,13,5,13z"/><path d="M11,3v6h3v2.5c0-0.83,1.12-1.5,2.5-1.5c1.38,0,2.5,0.67,2.5,1.5h-5V14v0.39c0.75,0.38,1.6,0.61,2.5,0.61c3.04,0,5.5-2.46,5.5-5.5V3H11z M14,8.08c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1s1,0.45,1,1C15,7.64,14.55,8.08,14,8.08z M19,8.08c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1s1,0.45,1,1C20,7.64,19.55,8.08,19,8.08z"/></svg>
      <span class="stat-text">
        <span class="stat-label">${t('stats.works')}</span>
        <span class="stat-value"><span class="stat-num" data-count="${workCount}">0</span>${unit}</span>
      </span>
      <svg class="stat-cta" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
    </button>
    <span class="stat-divider" aria-hidden="true"></span>
    <button class="stat-item" type="button" data-catalog-tab="category" title="${escapeHtml(t('catalog.open.category'))}">
      <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
      <span class="stat-text">
        <span class="stat-label">${t('stats.contents')}</span>
        <span class="stat-value"><span class="stat-num" data-count="${contentCount}">0</span>${unit}</span>
      </span>
      <svg class="stat-cta" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
    </button>
  `;
  bar.querySelectorAll('.stat-item').forEach(btn => {
    btn.addEventListener('click', () => openCatalog(btn.dataset.catalogTab));
  });
  return bar;
}

// 최초 1회만 카운트업 애니메이션, 이후(언어 전환 등)에는 즉시 표시
function animateStatNums(container) {
  container.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (statsAnimated || target === 0) { el.textContent = target; return; }
    const dur = 900, start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
  statsAnimated = true;
}

function renderContentRows(filter) {
  const area = document.getElementById('contentArea');
  area.innerHTML = '';
  area.style.display = '';  // 검색 후 숨겨진 경우 복원

  let filtered = filter === 'all' ? musicals : musicals.filter(m => m.category === filter);

  if (filter === 'all') {
    // 게시 현황 — 첫 페이지 상단에 작품/콘텐츠 카운트 표시
    const statsBar = createStatsBar();
    area.appendChild(statsBar);
    animateStatNums(statsBar);

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
  // 카드에는 태그를 한 줄에 들어갈 만큼만 노출한다.
  // 개수가 아니라 '글자 수'로 자르는 이유: 번역된 태그(#EnvironmentalSustainability)는
  // 한국어 태그보다 훨씬 길어서, 3개 고정으로 두면 전부 말줄임만 남는다.
  const allTags = getLocalizedHashtags(m);
  const shownTags = [];
  let tagBudget = 30;
  for (const tag of allTags) {
    if (shownTags.length >= 3) break;
    if (shownTags.length > 0 && tagBudget - tag.length < 0) break;
    shownTags.push(tag);
    tagBudget -= tag.length;
  }
  const hashtags = shownTags.map(h =>
    `<span class="hashtag-sm" title="${escapeHtml(h)}" onclick="event.stopPropagation(); searchByHashtag('${h.replace(/'/g, "\\'")}')">${escapeHtml(h)}</span>`
  ).join('');
  const moreTags = allTags.length > shownTags.length
    ? `<span class="hashtag-more" title="${escapeHtml(allTags.slice(shownTags.length).join(' '))}">+${allTags.length - shownTags.length}</span>`
    : '';

  const title = getLocalizedTitle(m);
  const thumbnailInner = m.thumbnail
    ? `<img src="${m.thumbnail}" alt="${escapeHtml(title)}" class="card-poster" loading="lazy" onerror="handlePosterError(this, '${m.id}')">`
    : `<div class="card-pattern"></div><span class="card-title-display">${escapeHtml(title)}</span>`;

  const thumbnailStyle = m.thumbnail
    ? ''
    : `style="background: linear-gradient(135deg, ${m.color}cc, ${m.color}44);"`;

  const catLabel = getCategoryLabel(m.category);
  const catShort = getCategoryShortLabel(m.category);
  const catColor = getCategoryColor(m.category);

  return `
    <div class="card" data-id="${m.id}">
      <div class="card-thumbnail ${m.thumbnail ? 'has-image' : ''}" ${thumbnailStyle}>
        ${thumbnailInner}
      </div>
      <div class="card-info">
        <div class="card-info-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
        <div class="card-info-meta">
          <span class="card-category-badge" style="background:${catColor}" title="${escapeHtml(catLabel)}">${escapeHtml(catShort)}</span>
          <span class="card-year">${m.curationYear}</span>
        </div>
        <div class="card-hashtags">${hashtags}${moreTags}</div>
      </div>
    </div>
  `;
}

// ── 포스터 이미지 오류 처리 ──────────────────────────────────────────
// thumbnail URL이 403/404를 내면(비공개 Google Drive 링크, 만료된 호스트 등)
// 깨진 이미지 아이콘 대신 색상 플레이스홀더로 대체하고, 어떤 작품인지 기록한다.
// 같은 URL이 여러 카드에 쓰이면 콘솔에 같은 403이 수십 줄 찍히므로 URL 단위로 집계한다.
const _brokenThumbnails = new Map(); // url → { titles:Set, count:number }

function recordBrokenThumbnail(url, title) {
  if (!url) return;
  if (!_brokenThumbnails.has(url)) _brokenThumbnails.set(url, { titles: new Set(), count: 0 });
  const entry = _brokenThumbnails.get(url);
  entry.count++;
  if (title) entry.titles.add(title);
  scheduleThumbnailReport();
}

let _thumbReportTimer = null;
let _reportedThumbCount = 0;
function scheduleThumbnailReport() {
  clearTimeout(_thumbReportTimer);
  _thumbReportTimer = setTimeout(() => {
    // 화면을 다시 그릴 때마다 같은 내용을 반복 출력하지 않도록, 새 URL이 생겼을 때만 알린다
    if (_brokenThumbnails.size <= _reportedThumbCount) return;
    _reportedThumbCount = _brokenThumbnails.size;
    stagebillThumbnailReport();
  }, 1500);
}

function stagebillThumbnailReport() {
  if (_brokenThumbnails.size === 0) {
    console.log('[STAGEBILL 이미지] 불러오지 못한 포스터가 없습니다.');
    return [];
  }
  const rows = [..._brokenThumbnails.entries()].map(([url, v]) => ({
    작품: [...v.titles].join(', '),
    사용된_카드수: v.count,
    thumbnail_URL: url,
  }));
  console.groupCollapsed(`[STAGEBILL 이미지] 불러오지 못한 포스터 ${rows.length}건 — 시트의 thumbnail 열을 확인하세요`);
  console.table(rows);
  console.info('Google Drive 링크라면 공유 설정을 "링크가 있는 모든 사용자"로 바꾸거나, 직접 이미지 URL(.png/.jpg)로 교체하세요.');
  console.groupEnd();
  return rows;
}
if (typeof window !== 'undefined') window.stagebillThumbnailReport = stagebillThumbnailReport;

function handlePosterError(img, id) {
  const m = musicals.find(x => String(x.id) === String(id));
  recordBrokenThumbnail(img.getAttribute('src'), m ? getLocalizedTitle(m) : '');
  const wrap = img.parentElement;
  if (!wrap) { img.remove(); return; }
  const color = (m && m.color) || '#555';
  const title = m ? getLocalizedTitle(m) : (img.alt || '');
  wrap.classList.remove('has-image');
  wrap.style.background = `linear-gradient(135deg, ${color}cc, ${color}44)`;
  wrap.innerHTML = `<div class="card-pattern"></div><span class="card-title-display">${escapeHtml(title)}</span>`;
}
if (typeof window !== 'undefined') window.handlePosterError = handlePosterError;

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

  // ESC: 가장 위에 떠 있는 오버레이부터 순서대로 닫음
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('modalOverlay').classList.contains('active')) { closeModal(); return; }
    if (isCatalogOpen())                                                      { closeCatalog(); return; }
    if (document.getElementById('aiOverlay').classList.contains('active'))     { closeAICuration(); return; }
    if (document.getElementById('uploadOverlay').classList.contains('active')) { closeUpload(); return; }
    if (document.getElementById('aboutOverlay').classList.contains('active'))  { closeAbout(); }
  });

  // Browser back button: close modal instead of leaving the page
  window.addEventListener('popstate', () => {
    const ov = document.getElementById('modalOverlay');
    if (ov.classList.contains('active')) {
      ov.classList.remove('active');
      currentModalMusical = null;
      if (modalOpenedFromAI) {
        modalOpenedFromAI = false;
        document.getElementById('aiOverlay').style.zIndex = '';
      } else if (modalOpenedFromCatalog && isCatalogOpen()) {
        modalOpenedFromCatalog = false;
      } else {
        modalOpenedFromCatalog = false;
        document.body.style.overflow = '';
      }
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
    `<span class="hashtag" onclick="closeModal(); searchByHashtag('${h.replace(/'/g, "\\'")}')">${h}</span>`
  ).join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  currentModalMusical = null;
  // AI 큐레이션에서 진입한 경우: AI 오버레이 복원, 결과 화면이 그대로 보이게 함
  if (modalOpenedFromAI) {
    modalOpenedFromAI = false;
    const aiOverlay = document.getElementById('aiOverlay');
    aiOverlay.style.zIndex = ''; // 원래 z-index로 복원
    // 모달은 body overflow를 hidden으로 두었음. AI 오버레이도 열려 있으므로 유지
  } else if (modalOpenedFromCatalog && isCatalogOpen()) {
    // 카탈로그에서 들어온 경우: 카탈로그가 그대로 보이도록 스크롤 잠금 유지
    modalOpenedFromCatalog = false;
  } else {
    modalOpenedFromCatalog = false;
    document.body.style.overflow = '';
  }
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
// 현재 화면에 표시 중인 큐레이션 (export / 모달 복귀용)
let currentAICuration = null;
// 모달이 AI 큐레이션에서 열렸는지 (X 누르면 큐레이션 결과로 복귀)
let modalOpenedFromAI = false;

function setupAICuration() {
  const btn       = document.getElementById('aiCurationBtn');
  const closeBtn  = document.getElementById('aiClose');
  const submitBtn = document.getElementById('aiSubmitBtn');
  const retryBtn  = document.getElementById('aiRetryBtn');
  const errorRetryBtn = document.getElementById('aiErrorRetryBtn');

  btn.addEventListener('click', openAICuration);
  const miniBtn = document.getElementById('aiMiniBtn');
  if (miniBtn) miniBtn.addEventListener('click', openAICuration);
  closeBtn.addEventListener('click', closeAICuration);
  submitBtn.addEventListener('click', submitAICuration);
  retryBtn.addEventListener('click', resetAICuration);
  errorRetryBtn.addEventListener('click', resetAICuration);

  document.getElementById('aiOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('aiOverlay')) closeAICuration();
  });

  document.getElementById('aiExportTxt').addEventListener('click', exportAICurationTxt);
  document.getElementById('aiExportJpg').addEventListener('click', exportAICurationJpg);
  document.getElementById('aiExportLink').addEventListener('click', exportAICurationLink);
  document.getElementById('aiExportCopy').addEventListener('click', exportAICurationCopy);

  // URL 해시에 공유된 큐레이션이 있으면 즉시 표시
  tryRenderSharedCuration();
}

function openAICuration() {
  // 공유 링크 해시가 남아 있으면 제거 (사용자가 새로 시작하려는 의도)
  if (location.hash && /ai=/.test(location.hash)) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  // 직전 결과가 있으면 그대로 보여줌 (닫았다 열어도 결과 유지, 재호출 불필요)
  // '다시 검색하기' 버튼으로 언제든 입력 화면으로 돌아갈 수 있음
  if (currentAICuration) {
    showAIStep('aiResultStep');
  } else {
    resetAICuration();
  }
  openAICurationOverlay();
  // 오버레이가 열리는 동안(사용자가 폼 작성 중) Apps Script 컨테이너를 미리 깨워 둔다.
  // 콜드 스타트를 실제 큐레이션 요청의 임계 경로에서 제거하기 위한 워밍업.
  warmUpCuration();
}

// 큐레이션 백엔드 워밍업 (콜드 스타트 완화). 실패해도 조용히 무시.
let curationWarmedAt = 0;
function warmUpCuration() {
  const now = Date.now();
  if (now - curationWarmedAt < 60000) return; // 1분 내 중복 워밍업 방지
  curationWarmedAt = now;
  fetch(`${DATA_URL}?action=ping`, { redirect: 'follow' }).catch(() => {});
}

function closeAICuration() {
  document.getElementById('aiOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function openAICurationOverlay() {
  document.getElementById('aiOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function resetAICuration() {
  currentAICuration = null;
  showAIStep('aiInputStep');
}

function showAIStep(stepId) {
  ['aiInputStep', 'aiLoadingStep', 'aiResultStep', 'aiErrorStep'].forEach(id => {
    document.getElementById(id).style.display = id === stepId ? '' : 'none';
  });
}

// ── 클라이언트 결과 캐시 ─────────────────────────────
// 같은 조건으로 다시 요청하면 서버 왕복 없이 즉시 결과 표시 (AI 호출 0회)
const AI_RESULT_CACHE_KEY = 'stagebill_ai_results_v1';
const AI_RESULT_CACHE_TTL = 6 * 60 * 60 * 1000; // 6시간 (서버 캐시와 동일)
const AI_RESULT_CACHE_MAX = 20;                 // 최근 20개 조건만 보관

// 조건 정규화: 공백 정리 + 소문자화 + 대상 정렬 → 사실상 같은 조건은 같은 키
function normalizeAIQueryKey(grade, keywords, lessonType, interests, lang) {
  const norm = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const gradeSorted = String(grade || '').split(',').map(s => s.trim()).filter(Boolean).sort().join(',');
  return [gradeSorted, norm(keywords), norm(lessonType), norm(interests), lang].join('\x1f');
}

function readAIResultCache(key) {
  try {
    const store = JSON.parse(localStorage.getItem(AI_RESULT_CACHE_KEY) || '{}');
    const entry = store[key];
    if (entry && entry.ts && (Date.now() - entry.ts) < AI_RESULT_CACHE_TTL) return entry.curation;
  } catch (_) {}
  return null;
}

function writeAIResultCache(key, curation) {
  try {
    let store = {};
    try { store = JSON.parse(localStorage.getItem(AI_RESULT_CACHE_KEY) || '{}') || {}; } catch (_) {}
    store[key] = { ts: Date.now(), curation };
    // 오래된 항목부터 정리 (최대 개수 초과 시)
    const keys = Object.keys(store);
    if (keys.length > AI_RESULT_CACHE_MAX) {
      keys.sort((a, b) => (store[a].ts || 0) - (store[b].ts || 0))
        .slice(0, keys.length - AI_RESULT_CACHE_MAX)
        .forEach(k => delete store[k]);
    }
    localStorage.setItem(AI_RESULT_CACHE_KEY, JSON.stringify(store));
  } catch (_) { /* 저장 실패는 무시 */ }
}

// 입력 검증 안내 메시지
function showAIFormHint(msg) {
  const hint = document.getElementById('aiFormHint');
  if (!hint) return;
  hint.textContent = msg;
  hint.hidden = false;
}
function hideAIFormHint() {
  const hint = document.getElementById('aiFormHint');
  if (hint) hint.hidden = true;
}

// 로딩 단계 메시지 순환 (긴 대기 시간의 체감 완화)
let _aiLoadingTimer = null;
function startAILoadingMessages() {
  const el = document.querySelector('#aiLoadingStep .ai-loading-text');
  if (!el) return;
  const msgs = [t('ai.loading'), t('ai.loading2'), t('ai.loading3'), t('ai.loading4')];
  let i = 0;
  el.textContent = msgs[0];
  clearInterval(_aiLoadingTimer);
  _aiLoadingTimer = setInterval(() => {
    i += 1;
    if (i >= msgs.length) { clearInterval(_aiLoadingTimer); return; }
    el.textContent = msgs[i];
  }, 4000);
}
function stopAILoadingMessages() {
  clearInterval(_aiLoadingTimer);
  _aiLoadingTimer = null;
}

let aiSubmitInFlight = false; // 더블클릭 등으로 인한 중복 호출 방지

async function submitAICuration() {
  if (aiSubmitInFlight) return;

  const targets = Array.from(
    document.querySelectorAll('#aiTargetGrid input[type="checkbox"]:checked')
  ).map(cb => cb.value);
  const grade      = targets.join(',');
  const keywords   = document.getElementById('aiKeywords').value.trim();
  const lessonType = document.getElementById('aiLessonType').value.trim();
  const interests  = document.getElementById('aiInterests').value.trim();

  if (!keywords && !lessonType && !grade) {
    showAIFormHint(t('ai.validation'));
    document.getElementById('aiKeywords').focus();
    return;
  }
  hideAIFormHint();

  // 같은 조건의 결과가 로컬 캐시에 있으면 즉시 표시 (네트워크·AI 호출 없음)
  const cacheKey = normalizeAIQueryKey(grade, keywords, lessonType, interests, currentLang);
  const cachedCuration = readAIResultCache(cacheKey);
  if (cachedCuration) {
    console.log('[STAGEBILL AI] 로컬 캐시 결과 사용 (호출 0회)');
    currentAICuration = cachedCuration;
    renderAIResults(cachedCuration);
    return;
  }

  aiSubmitInFlight = true;
  showAIStep('aiLoadingStep');
  startAILoadingMessages();

  try {
    // GET + 쿼리 파라미터: CORS 프리플라이트 없음 + Apps Script 리다이렉트(302 → googleusercontent)에서 정상 동작
    // (POST는 Apps Script 리다이렉트 후 CORS 헤더가 누락되어 차단됨)
    const params = new URLSearchParams({
      action: 'curate',
      grade,
      keywords,
      lessonType,
      interests,
      lang: currentLang,
    });
    const startedAt = performance.now();
    const res  = await fetch(`${DATA_URL}?${params.toString()}`, { redirect: 'follow' });
    const data = await res.json();
    console.log(`[STAGEBILL AI] 응답 (${Math.round(performance.now() - startedAt)}ms):`, data);

    if (data.error === 'QUOTA_EXCEEDED') {
      showAIError(
        '🎭',
        '오늘의 AI 큐레이션은 문을 닫았어요.',
        'AI 선생님이 하루치 에너지를 몽땅 쏟아부었거든요!\n내일 다시 찾아오시면 새 마음으로 맞이할게요 🌙\n(할당량은 매일 자정에 초기화됩니다)'
      );
      return;
    }
    if (data.error === 'ALL_MODELS_FAILED') {
      // 콘솔에서 접어놓은 객체를 펼치지 않아도 원인이 보이도록 표로 출력
      const attempts = Array.isArray(data.attempts) ? data.attempts : [];
      console.error('[STAGEBILL AI] 모든 Gemini 모델 호출 실패');
      if (console.table && attempts.length) console.table(attempts);
      else console.error(attempts);
      console.error('[STAGEBILL AI] 사용 가능했던 모델 목록:', data.availableModels);

      const status = data.lastStatus;
      const snippet = String(data.lastSnippet || '');
      const emptyOutput = attempts.some(a => a && a.emptyOutput) || /EMPTY_OUTPUT/.test(snippet);

      let title = 'AI 호출에 실패했어요.';
      // 마지막 시도의 상태·사유를 그대로 보여준다 (콘솔을 못 여는 상황 대비)
      let sub   = `마지막 시도: ${attempts.length ? attempts[attempts.length - 1].model : '?'} / status ${status}\n${snippet.substring(0, 200)}`;

      if (emptyOutput) {
        title = 'AI가 답을 다 쓰지 못했어요.';
        sub = '모델이 생각하는 데 출력 예산을 다 써서 본문이 비어 돌아왔습니다.\n'
            + 'Apps Script를 최신 코드로 다시 배포하면 해결됩니다.\n'
            + '(배포 관리 → 편집 → 새 버전 → 배포)';
      } else if (status === 403) {
        title = 'Gemini API 사용 권한이 없어요.';
        sub = 'Google Cloud Console에서 Generative Language API를 활성화하거나,\nAPI 키 제한(HTTP/IP)을 해제해주세요.';
      } else if (status === 429) {
        title = '잠시 후 다시 시도해주세요.';
        sub = '요청 한도를 초과했습니다. 몇 분 뒤 다시 시도해주세요.';
      } else if (status === 404) {
        title = '모델을 찾을 수 없어요.';
        sub = '시도한 모델이 더 이상 제공되지 않습니다.\n' + snippet.substring(0, 200);
      } else if (status === 400) {
        title = '요청 형식 오류.';
        sub = snippet.substring(0, 200);
      }
      showAIError('😵', title, sub);
      return;
    }
    if (data.error === 'LIST_MODELS_FAILED') {
      console.error('[STAGEBILL AI] ListModels 호출 실패:', data);
      const status = data.lastStatus;
      let title = '모델 목록을 조회할 수 없어요.';
      let sub = (data.lastSnippet || '').substring(0, 300);
      if (status === 403) {
        title = 'Gemini API 사용 권한이 없어요.';
        sub = 'Google Cloud Console에서 Generative Language API를 활성화하거나,\nAPI 키 제한(HTTP/IP/앱)을 해제해주세요.';
      } else if (status === 400) {
        title = 'API 키가 유효하지 않아요.';
        sub = 'Apps Script 스크립트 속성의 GEMINI_API_KEY를 확인해주세요.';
      }
      showAIError('🔑', title, sub);
      return;
    }
    if (data.error === 'NO_AVAILABLE_MODELS') {
      showAIError('🤷', '사용 가능한 모델이 없어요.', '이 API 키로 generateContent 가능한 모델이 0개입니다.');
      return;
    }
    if (data.error === 'INVALID_KEY') {
      console.error('[STAGEBILL AI] INVALID_KEY 응답:', data);
      showAIError('🔑', 'API 키를 확인해주세요.', 'Apps Script 설정의 GEMINI_API_KEY를 확인해주세요.\n상세: ' + (data.attempts ? JSON.stringify(data.attempts[0]) : ''));
      return;
    }
    if (data.error === 'API_KEY_MISSING') {
      showAIError('🔑', 'API 키가 설정되지 않았어요.', 'Apps Script > 프로젝트 설정 > 스크립트 속성에\nGEMINI_API_KEY를 추가해주세요.');
      return;
    }
    // Apps Script가 새 코드로 재배포되지 않은 경우 doGet이 그대로 handleRead를 호출하여 배열 반환
    if (Array.isArray(data)) {
      console.warn('[STAGEBILL AI] 큐레이션 대신 데이터 배열이 반환됨 — 배포된 Apps Script 코드에 action=curate 분기가 없습니다.');
      showAIError('🔄', 'Apps Script 코드 업데이트가 필요해요.',
        '에디터에서 data/appsscript.gs 코드를 전체 교체하고 저장(Ctrl+S)한 뒤\n[배포 관리 → 편집(연필) → 새 버전 → 배포]를 해주세요.\n자세한 진단은 콘솔(F12)을 확인해주세요.');
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

    currentAICuration = {
      query: { grade, keywords, lessonType, interests, targets },
      recommendations: data.recommendations,
      external: Array.isArray(data.external) ? data.external : [],
      model: data.model,
      createdAt: new Date().toISOString(),
    };
    writeAIResultCache(cacheKey, currentAICuration);
    renderAIResults(currentAICuration);
  } catch (err) {
    showAIError('📡', '연결에 문제가 생겼어요.', '인터넷 연결을 확인하고 다시 시도해주세요.');
  } finally {
    aiSubmitInFlight = false;
    stopAILoadingMessages();
  }
}

// 모델 ID를 사람이 읽기 좋은 이름으로 변환 (예: gemini-2.5-flash → Gemini 2.5 Flash)
function formatModelName(model) {
  if (!model) return '';
  return String(model)
    .split('-')
    .map(seg => /^[a-z]/.test(seg) ? seg.charAt(0).toUpperCase() + seg.slice(1) : seg)
    .join(' ');
}

// 결과 헤더에 현재 사용 중인 AI 모델을 작게 노출
function renderModelBadge(model) {
  const badge = document.getElementById('aiModelBadge');
  if (!badge) return;
  if (!model) { badge.hidden = true; badge.innerHTML = ''; return; }
  badge.hidden = false;
  badge.title = t('ai.model.label') + ': ' + model;
  badge.innerHTML =
    '<span class="ai-model-dot"></span>' +
    '<span>' + escapeHtml(formatModelName(model)) + '</span>';
}

function renderExternalList(external) {
  const section = document.getElementById('aiExternalSection');
  const list = document.getElementById('aiExternalList');
  if (!section || !list) return;
  list.innerHTML = '';
  const items = Array.isArray(external) ? external.filter(e => e && e.title) : [];
  if (!items.length) { section.style.display = 'none'; return; }
  section.style.display = '';
  items.forEach(item => {
    const isKr = String(item.origin || '').toUpperCase() === 'KR';
    const originLabel = isKr ? t('ai.external.kr') : t('ai.external.intl');
    const card = document.createElement('div');
    card.className = 'ai-external-card ai-external-card-clickable';
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('title', t('ai.external.searchHint'));
    card.innerHTML = `
      <div class="ai-external-card-top">
        <span class="ai-external-card-title">${escapeHtml(item.title || '')}</span>
        <span class="ai-external-origin ${isKr ? 'origin-kr' : 'origin-intl'}">${escapeHtml(originLabel)}</span>
      </div>
      <p class="ai-external-card-reason">${escapeHtml(item.reason || '')}</p>
      <span class="ai-external-search-hint">
        <svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <span>${escapeHtml(t('ai.external.searchHint'))}</span>
      </span>
    `;
    const openSearch = () => openExternalSearch(item.title);
    card.addEventListener('click', openSearch);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSearch(); }
    });
    list.appendChild(card);
  });
}

// '이런 작품도 있어요' 카드 클릭 → 새 탭에서 구글 검색 ('뮤지컬 작품명')
function openExternalSearch(title) {
  const name = String(title || '').trim();
  if (!name) return;
  const query = `${t('ai.external.searchPrefix')} ${name}`.trim();
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function renderAIResults(curation) {
  const recommendations = (curation && curation.recommendations) || [];
  const query = (curation && curation.query) || {};
  const list = document.getElementById('aiResultList');
  list.innerHTML = '';

  renderModelBadge(curation && curation.model);
  renderExternalList(curation && curation.external);

  // 조건 요약
  const meta = document.getElementById('aiResultMeta');
  if (meta) {
    const parts = [];
    const targets = (query && query.targets) || (query && query.grade ? String(query.grade).split(',').filter(Boolean) : []);
    if (targets && targets.length) parts.push(`<span class="ai-meta-label">${t('ai.meta.target')}</span> ${escapeHtml(targets.map(translateTargetValue).join(', '))}`);
    if (query && query.keywords)   parts.push(`<span class="ai-meta-label">${t('ai.meta.keywords')}</span> ${escapeHtml(query.keywords)}`);
    if (query && query.lessonType) parts.push(`<span class="ai-meta-label">${t('ai.meta.lessonType')}</span> ${escapeHtml(query.lessonType)}`);
    if (query && query.interests)  parts.push(`<span class="ai-meta-label">${t('ai.meta.interests')}</span> ${escapeHtml(query.interests)}`);
    meta.innerHTML = parts.join(' · ');
  }

  recommendations.forEach((rec, idx) => {
    const musical = musicals.find(m => String(m.id) === String(rec.id));
    const category = musical ? musical.category : '';
    const color = category ? getCategoryColor(category) : '#E50914';

    const card = document.createElement('div');
    card.className = 'ai-result-card';
    card.innerHTML = `
      <div class="ai-card-top">
        <div class="ai-card-num">${idx + 1}</div>
        <span class="ai-card-title">${escapeHtml(rec.title || '')}</span>
        ${category ? `<span class="ai-card-category" style="background:${color}">${getCategoryLabel(category)}</span>` : ''}
      </div>
      <p class="ai-card-reason">${escapeHtml(rec.reason || '')}</p>
      ${rec.tip ? `<p class="ai-card-tip">💡 ${escapeHtml(rec.tip)}</p>` : ''}
    `;

    if (musical) {
      card.addEventListener('click', () => {
        // AI 오버레이는 유지한 채 모달만 위에 띄움. 모달 X → AI 결과로 복귀.
        modalOpenedFromAI = true;
        document.getElementById('aiOverlay').style.zIndex = '1900'; // 모달(2000) 아래로
        openModal(musical);
      });
    }
    list.appendChild(card);
  });

  showAIStep('aiResultStep');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 체크박스 value(한국어 원본)를 현재 언어로 변환. 일치 키 없으면 원본 반환
const TARGET_VALUE_TO_KEY = {
  '초등 1-2학년': 'target.elem12', '초등 3-4학년': 'target.elem34', '초등 5-6학년': 'target.elem56',
  '중학교 1학년': 'target.mid1',  '중학교 2학년': 'target.mid2',  '중학교 3학년': 'target.mid3',
  '고등학교 1학년': 'target.high1', '고등학교 2학년': 'target.high2', '고등학교 3학년': 'target.high3',
  '교사': 'target.teacher',
};
function translateTargetValue(v) {
  const key = TARGET_VALUE_TO_KEY[v];
  return key ? t(key) : v;
}

function showAIError(emoji, title, sub) {
  document.getElementById('aiErrorEmoji').textContent = emoji;
  document.getElementById('aiErrorTitle').textContent = title;
  document.getElementById('aiErrorSub').textContent   = sub;
  showAIStep('aiErrorStep');
}

// ==========================================
// AI 큐레이션 결과 내보내기 / 공유
// ==========================================

function buildCurationText() {
  if (!currentAICuration) return '';
  const q = currentAICuration.query || {};
  const lines = ['🎭 STAGEBILL · ' + t('ai.result'), ''];
  const targets = q.targets && q.targets.length ? q.targets.map(translateTargetValue).join(', ') : '';
  if (targets)      lines.push('▸ ' + t('ai.meta.target')     + ': ' + targets);
  if (q.keywords)   lines.push('▸ ' + t('ai.meta.keywords')   + ': ' + q.keywords);
  if (q.lessonType) lines.push('▸ ' + t('ai.meta.lessonType') + ': ' + q.lessonType);
  if (q.interests)  lines.push('▸ ' + t('ai.meta.interests')  + ': ' + q.interests);
  lines.push('');
  lines.push('─'.repeat(40));
  lines.push('');
  currentAICuration.recommendations.forEach((rec, idx) => {
    const musical = musicals.find(m => String(m.id) === String(rec.id));
    const cat = musical ? getCategoryLabel(musical.category) : '';
    lines.push(`${idx + 1}. ${rec.title || ''}${cat ? `  [${cat}]` : ''}`);
    if (rec.reason) lines.push(`   → ${rec.reason}`);
    if (rec.tip)    lines.push(`   💡 ${rec.tip}`);
    lines.push('');
  });
  const external = (currentAICuration.external || []).filter(e => e && e.title);
  if (external.length) {
    lines.push('─'.repeat(40));
    lines.push('');
    lines.push('✨ ' + t('ai.external'));
    lines.push('');
    external.forEach((ex) => {
      const origin = String(ex.origin || '').toUpperCase() === 'KR' ? t('ai.external.kr') : t('ai.external.intl');
      lines.push(`• ${ex.title || ''}  [${origin}]`);
      if (ex.reason) lines.push(`   → ${ex.reason}`);
      lines.push('');
    });
  }
  lines.push('─'.repeat(40));
  lines.push('https://stagebill.chichiboo.link');
  return lines.join('\n');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function flashExportBtn(btn, label) {
  if (!btn) return;
  const span = btn.querySelector('span');
  const original = span ? span.textContent : '';
  btn.classList.add('copied');
  if (span && label) span.textContent = label;
  setTimeout(() => {
    btn.classList.remove('copied');
    if (span) span.textContent = original;
  }, 1500);
}

function exportAICurationTxt() {
  if (!currentAICuration) return;
  const text = buildCurationText();
  const ts = new Date().toISOString().slice(0, 10);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `stagebill-ai-${ts}.txt`);
  flashExportBtn(document.getElementById('aiExportTxt'), '저장됨');
}

async function exportAICurationCopy() {
  if (!currentAICuration) return;
  const text = buildCurationText();
  try {
    await navigator.clipboard.writeText(text);
    flashExportBtn(document.getElementById('aiExportCopy'), '복사됨');
  } catch (_) {
    // 폴백: textarea + execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flashExportBtn(document.getElementById('aiExportCopy'), '복사됨'); }
    catch (_) { alert('클립보드 복사에 실패했어요. 텍스트로 저장(TXT)을 이용해주세요.'); }
    ta.remove();
  }
}

async function exportAICurationJpg() {
  if (!currentAICuration) return;
  if (typeof html2canvas !== 'function') {
    alert('이미지 변환 라이브러리를 불러오지 못했어요. 인터넷 연결을 확인해주세요.');
    return;
  }
  const btn = document.getElementById('aiExportJpg');
  flashExportBtn(btn, '생성 중...');
  try {
    const target = buildJpgCaptureNode();
    document.body.appendChild(target);
    const canvas = await html2canvas(target, {
      backgroundColor: '#13111c',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    target.remove();
    canvas.toBlob((blob) => {
      const ts = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `stagebill-ai-${ts}.jpg`);
      flashExportBtn(btn, '저장됨');
    }, 'image/jpeg', 0.92);
  } catch (err) {
    console.error('[STAGEBILL AI] JPG export 실패:', err);
    alert('이미지 생성에 실패했어요. TXT 다운로드를 이용해주세요.');
    flashExportBtn(btn, 'JPG');
  }
}

// 화면 캡처 대신 깔끔한 별도 노드를 만들어 캡처 (오버레이/그림자 영향 제거)
function buildJpgCaptureNode() {
  const q = currentAICuration.query || {};
  const targets = q.targets && q.targets.length ? q.targets.map(translateTargetValue).join(', ') : '';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-9999px;top:0;width:720px;padding:36px;background:#13111c;color:#fff;font-family:"Noto Sans KR","Noto Sans JP",sans-serif;';

  const metaParts = [];
  if (targets)      metaParts.push(`<div><span style="color:#ff5b6b;font-weight:600;">${t('ai.meta.target')}</span> ${escapeHtml(targets)}</div>`);
  if (q.keywords)   metaParts.push(`<div><span style="color:#ff5b6b;font-weight:600;">${t('ai.meta.keywords')}</span> ${escapeHtml(q.keywords)}</div>`);
  if (q.lessonType) metaParts.push(`<div><span style="color:#ff5b6b;font-weight:600;">${t('ai.meta.lessonType')}</span> ${escapeHtml(q.lessonType)}</div>`);
  if (q.interests)  metaParts.push(`<div><span style="color:#ff5b6b;font-weight:600;">${t('ai.meta.interests')}</span> ${escapeHtml(q.interests)}</div>`);

  const cards = currentAICuration.recommendations.map((rec, idx) => {
    const musical = musicals.find(m => String(m.id) === String(rec.id));
    const category = musical ? musical.category : '';
    const color = category ? getCategoryColor(category) : '#E50914';
    const catLabel = category ? getCategoryLabel(category) : '';
    return `
      <div style="background:#222;border:1px solid #333;border-radius:12px;padding:18px 20px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#E50914;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${idx + 1}</div>
          <span style="font-size:18px;font-weight:700;color:#fff;flex:1;">${escapeHtml(rec.title || '')}</span>
          ${catLabel ? `<span style="background:${color};color:#fff;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;">${escapeHtml(catLabel)}</span>` : ''}
        </div>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#b3b3b3;">${escapeHtml(rec.reason || '')}</p>
        ${rec.tip ? `<p style="margin:10px 0 0;padding:8px 12px;font-size:13px;line-height:1.6;color:#d5d5d5;background:rgba(255,255,255,0.05);border-left:2px solid #E50914;border-radius:0 6px 6px 0;">💡 ${escapeHtml(rec.tip)}</p>` : ''}
      </div>`;
  }).join('');

  const external = (currentAICuration.external || []).filter(e => e && e.title);
  const externalBlock = external.length ? `
    <div style="margin-top:20px;padding-top:18px;border-top:1px dashed #383838;">
      <div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:12px;">✨ ${escapeHtml(t('ai.external'))}</div>
      ${external.map(ex => {
        const isKr = String(ex.origin || '').toUpperCase() === 'KR';
        const originLabel = isKr ? t('ai.external.kr') : t('ai.external.intl');
        const oColor = isKr ? '#ff9aa2' : '#8fd3ff';
        const oBg = isKr ? 'rgba(229,9,20,0.16)' : 'rgba(30,136,229,0.18)';
        return `
        <div style="background:rgba(255,255,255,0.03);border:1px solid #2e2e2e;border-radius:10px;padding:13px 16px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:15px;font-weight:700;color:#fff;flex:1;">${escapeHtml(ex.title || '')}</span>
            <span style="background:${oBg};color:${oColor};padding:2px 9px;border-radius:12px;font-size:11px;font-weight:600;">${escapeHtml(originLabel)}</span>
          </div>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#b3b3b3;">${escapeHtml(ex.reason || '')}</p>
        </div>`;
      }).join('')}
    </div>` : '';

  const modelLine = currentAICuration.model
    ? `<span style="margin-left:auto;font-size:11px;font-weight:600;color:#8a8a8a;border:1px solid #333;border-radius:999px;padding:3px 10px;">⚡ ${escapeHtml(formatModelName(currentAICuration.model))}</span>`
    : '';

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#E50914"><path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10 0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z"/></svg>
      <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">STAGEBILL · ${escapeHtml(t('ai.result'))}</span>
      ${modelLine}
    </div>
    ${metaParts.length ? `<div style="font-size:13px;color:#b3b3b3;line-height:1.8;margin-bottom:24px;padding:14px 16px;background:rgba(255,255,255,0.04);border:1px solid #333;border-radius:10px;">${metaParts.join('')}</div>` : ''}
    <div>${cards}</div>
    ${externalBlock}
    <div style="margin-top:24px;text-align:right;font-size:11px;color:#777;">stagebill.chichiboo.link · ${new Date().toLocaleDateString(currentLang === 'ja' ? 'ja-JP' : currentLang === 'en' ? 'en-US' : 'ko-KR')}</div>
  `;
  return wrap;
}

// 공유 링크: 큐레이션을 URL 해시(base64)로 인코딩
function encodeCurationToHash(c) {
  const payload = {
    r: c.recommendations.map(rec => ({ id: rec.id, title: rec.title, reason: rec.reason, tip: rec.tip || '' })),
    e: (c.external || []).map(ex => ({ title: ex.title, origin: ex.origin, reason: ex.reason })),
    q: c.query,
    m: c.model || '',
    t: c.createdAt,
  };
  const json = JSON.stringify(payload);
  // UTF-8 안전 base64
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return 'ai=' + b64;
}

function decodeCurationFromHash(hash) {
  const m = hash.match(/(?:^#|&)ai=([^&]+)/);
  if (!m) return null;
  try {
    const json = decodeURIComponent(escape(atob(m[1])));
    return JSON.parse(json);
  } catch (err) {
    console.warn('[STAGEBILL AI] 공유 링크 디코딩 실패:', err);
    return null;
  }
}

async function exportAICurationLink() {
  if (!currentAICuration) return;
  const hashPart = encodeCurationToHash(currentAICuration);
  const url = `${location.origin}${location.pathname}#${hashPart}`;
  try {
    await navigator.clipboard.writeText(url);
    flashExportBtn(document.getElementById('aiExportLink'), '복사됨');
  } catch (_) {
    prompt('아래 링크를 복사해서 공유하세요:', url);
  }
}

function tryRenderSharedCuration() {
  const shared = decodeCurationFromHash(location.hash || '');
  if (!shared || !shared.r || !shared.r.length) return;
  currentAICuration = {
    query: shared.q || {},
    recommendations: shared.r,
    external: Array.isArray(shared.e) ? shared.e : [],
    model: shared.m || '',
    createdAt: shared.t,
  };
  renderAIResults(currentAICuration);
  openAICurationOverlay();
}

// ==========================================
// STAGEBILL 소개
// ==========================================
const ABOUT_CONTENT = {
  ko: {
    body: [
      `STAGEBILL은 브로드웨이 공연장에서 관객에게 제공되는 프로그램 북인 'PLAYBILL'에서 영감을 받아 시작된 자료집입니다.`,
      `PLAYBILL은 공연 주요 정보와 스태프, 출연진, 줄거리 등을 소개하며 공연의 맥락을 풍부하게 이해하도록 돕는 소중한 안내서입니다.`,
      `이처럼 STAGEBILL은 '교육'과 '뮤지컬'의 의미 있는 만남을 기록하고, 매월 선생님과 함께 교육뮤지컬의 영감을 나누기 위해 만들었습니다.`,
    ],
    quote: '교실이라는 작지만 큰 무대 위에서,\n선생님과 학생들이 뮤지컬을 통해\n더 행복한 수업 시간을 만들어가시길 기원합니다.',
    credits: [
      { label: '제작',         value: '경기도뮤지컬교육연구회 STAGE' },
      { label: '기획 및 편집', value: '원치수' },
    ],
  },
  en: {
    body: [
      `STAGEBILL is inspired by 'PLAYBILL'—the program book Broadway theaters hand to audiences.`,
      `PLAYBILL introduces a show's key information, staff, cast, and synopsis, helping audiences understand the work in richer context.`,
      `In the same spirit, STAGEBILL records meaningful encounters between 'education' and 'musicals,' sharing monthly inspiration for educational musical theatre with teachers.`,
    ],
    quote: 'On the small but vast stage that is a classroom,\nwe hope teachers and students\ncreate happier lessons through musicals.',
    credits: [
      { label: 'Produced by', value: 'Gyeonggi Musical Education Research Society STAGE' },
      { label: 'Edited by',   value: 'WON Chisoo' },
    ],
  },
  ja: {
    body: [
      `STAGEBILLは、ブロードウェイの劇場で観客に配られるプログラム冊子「PLAYBILL」にインスピレーションを受けて始まった資料集です。`,
      `PLAYBILLは公演の主要情報、スタッフ、キャスト、あらすじなどを紹介し、公演の文脈を豊かに理解できるよう導く大切な案内書です。`,
      `STAGEBILLは「教育」と「ミュージカル」の意味ある出会いを記録し、毎月先生方と教育ミュージカルのインスピレーションを分かち合うために作られました。`,
    ],
    quote: '教室という小さくても大きな舞台の上で、\n先生方と生徒たちがミュージカルを通して\nより幸せな授業時間を作っていけることを願っています。',
    credits: [
      { label: '制作',     value: '京畿道ミュージカル教育研究会 STAGE' },
      { label: '企画・編集', value: 'ウォン・チス' },
    ],
  },
};

function setupAbout() {
  document.getElementById('aboutBtn').addEventListener('click', openAbout);
  document.getElementById('aboutClose').addEventListener('click', closeAbout);
  document.getElementById('aboutOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('aboutOverlay')) closeAbout();
  });
  renderAboutContent();
}
function openAbout() {
  renderAboutContent();
  document.getElementById('aboutOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeAbout() {
  document.getElementById('aboutOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
function renderAboutContent() {
  const body = document.getElementById('aboutBody');
  const credits = document.getElementById('aboutCredits');
  if (!body || !credits) return;
  const c = ABOUT_CONTENT[currentLang] || ABOUT_CONTENT.ko;
  body.innerHTML =
    c.body.map(p => `<p>${escapeHtml(p)}</p>`).join('') +
    `<div class="about-quote">“${escapeHtml(c.quote).replace(/\n/g, '<br>')}”</div>`;
  credits.innerHTML = c.credits.map(cr =>
    `<div class="about-credit-row"><span class="about-credit-label">${escapeHtml(cr.label)}</span><span>${escapeHtml(cr.value)}</span></div>`
  ).join('');
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', loadData);
