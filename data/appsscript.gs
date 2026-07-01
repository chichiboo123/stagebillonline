// ============================================================
// STAGEBILL — Google Apps Script
// ============================================================
// ★ 데이터 흐름
//   [읽기]  doGet → handleRead → 메인 시트 → JSON → 앱
//   [쓰기]  Google Form 제출 → onFormSubmit 트리거 → 메인 시트에 행 추가
//
// ★ 초기 설정 순서
//   1. Google Form "응답" 탭 → 스프레드시트 연결 → 기존 시트 선택
//      (자동으로 "설문지 응답 시트1" 시트가 생김)
//   2. 이 스크립트를 Apps Script 에디터에 붙여넣기
//   3. MAIN_SHEET_NAME 을 메인 시트의 실제 이름으로 수정
//   4. setupFormTrigger() 를 한 번 실행하여 트리거 등록
//   5. doGet 배포 (배포 > 배포 관리 > 연필 > 새 버전 > 배포)
//      액세스: 모든 사용자 (익명 포함)
// ============================================================

// ── 설정 ─────────────────────────────────────────────────────
// 메인 데이터 시트 이름 (스프레드시트 하단 탭 이름과 일치시키세요)
const MAIN_SHEET_NAME = '시트1'; // ← 실제 메인 시트 탭 이름으로 변경

function getMainSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(MAIN_SHEET_NAME) || ss.getSheets()[0];
}

// ── 트리거 등록 (최초 1회만 실행) ────────────────────────────
// Apps Script 에디터에서 이 함수를 선택 후 ▶ 실행 버튼을 누르세요.
// 이후 Form 제출 때마다 onFormSubmit 이 자동으로 호출됩니다.
function setupFormTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 중복 방지: 기존 onFormSubmit 트리거 삭제
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onFormSubmit')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  Logger.log('트리거 등록 완료');
}

// ── Form 제출 시 자동 실행 ────────────────────────────────────
// Google Form 응답을 메인 시트에 맞춰 추가합니다.
function onFormSubmit(e) {
  try {
    const mainSheet = getMainSheet();
    const headers   = mainSheet.getRange(1, 1, 1, mainSheet.getLastColumn()).getValues()[0];

    // e.namedValues: { 'title': ['값'], 'category': ['값'], ... }
    const namedValues = e.namedValues || {};

    // 메인 시트 헤더 순서대로 행을 구성
    const newRow = headers.map(h => {
      const val = namedValues[h];
      return (val && val[0] !== undefined) ? String(val[0]).trim() : '';
    });

    // id 컬럼이 있으면 자동 채번
    const idIdx = headers.indexOf('id');
    if (idIdx >= 0 && !newRow[idIdx]) {
      const lastRow  = mainSheet.getLastRow();
      const lastId   = lastRow > 1
        ? mainSheet.getRange(lastRow, idIdx + 1).getValue()
        : 0;
      newRow[idIdx] = (parseInt(lastId) || 0) + 1;
    }

    mainSheet.appendRow(newRow);
    // 새 데이터가 들어왔으므로 큐레이션용 압축 목록 캐시를 무효화
    try { CacheService.getScriptCache().remove(MUSICAL_LIST_CACHE_KEY); } catch (_) {}
    Logger.log('폼 응답 추가 완료: ' + (newRow[headers.indexOf('title')] || '(제목 없음)'));
  } catch (err) {
    Logger.log('onFormSubmit 오류: ' + err.message);
  }
}

// 배포 검증용 — 이 문자열이 ?action=ping 응답에 그대로 나오면 새 코드가 배포된 것
const SCRIPT_VERSION = '2026-07-01-curation-v9-min-calls';

// 진단용: Apps Script 에디터에서 함수 선택 → ▶ 실행 → 보기 → 로그
// "이 프로젝트가 정말 STAGEBILL이 호출하는 그 프로젝트인가?"를 확인할 때 사용
function checkVersion() {
  const props = PropertiesService.getScriptProperties();
  Logger.log('==== STAGEBILL Apps Script 진단 ====');
  Logger.log('SCRIPT_VERSION: ' + SCRIPT_VERSION);
  Logger.log('GEMINI_API_KEY 설정 여부: ' + (!!props.getProperty('GEMINI_API_KEY')));
  Logger.log('메인 시트명: ' + (getMainSheet() ? getMainSheet().getName() : '없음'));
  Logger.log('스프레드시트 ID: ' + SpreadsheetApp.getActiveSpreadsheet().getId());
  Logger.log('스프레드시트 URL: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  Logger.log('현재 배포 URL을 확인하려면: 배포 → 배포 관리 → 활성 배포의 웹앱 URL 비교');
  Logger.log('app.js의 DATA_URL과 정확히 일치해야 함 (AKfyc...PbiFUzfx_n2Wg)');
}

// ── 읽기 / AI 큐레이션 라우팅 (앱 → doGet) ──────────────────
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'read';
  if (action === 'ping') {
    return jsonResponse({
      ok: true,
      version: SCRIPT_VERSION,
      hasGeminiKey: !!PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY'),
      sheet: (getMainSheet() && getMainSheet().getName()) || null,
    });
  }
  if (action === 'curate') return handleAICuration(e.parameter);
  return handleRead();
}

// AI 큐레이션은 POST로도 수신 (GET 리다이렉트 시 파라미터 소실 방지)
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'curate') return handleAICuration(body);
    return jsonResponse({ error: 'UNKNOWN_ACTION' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ── AI 큐레이션 (Gemini API 프록시) ──────────────────────────
// API 키 저장: Apps Script 에디터 > 프로젝트 설정 > 스크립트 속성
//   속성명: GEMINI_API_KEY  /  값: (발급한 키 붙여넣기)
//
// 모델은 ListModels API로 동적으로 조회하여 사용 가능한 것 중 우선순위 높은 순으로 시도합니다.
// 모델이 deprecate되어도 자동 대응됩니다.

// 선호하는 모델 패턴 (정규식). 위에서부터 우선순위.
const MODEL_PRIORITY = [
  /^gemini-flash-latest$/,
  /^gemini-3\.\d+.*-flash(-latest)?$/,
  /^gemini-2\.5-flash(-latest)?$/,
  /^gemini-2\.5-flash-lite$/,
  /^gemini-2\.0-flash(-001|-latest)?$/,
  /^gemini-2\.0-flash-lite(-001|-latest)?$/,
  /^gemini-.*-flash[^-]*$/, // 그 외 flash 계열 (안정 버전)
  /^gemini-.*-pro[^-]*$/,   // pro 계열
];

// 랭킹된 모델 목록 캐시 (ListModels 호출은 느려서 매 요청마다 하면 지연이 큼)
// CacheService에 6시간 저장 → 큐레이션 요청의 핫패스에서 네트워크 왕복 1회 제거
const MODEL_CACHE_KEY = 'stagebill_ranked_models_v1';
const MODEL_CACHE_TTL = 21600; // 6시간(초)

// 직전에 성공한 모델을 기억해 두고 다음 요청에서 가장 먼저 시도
// → 랭킹 1위 모델이 할당량 초과 상태여도 매번 헛 호출을 반복하지 않음
const LAST_GOOD_MODEL_KEY = 'stagebill_last_good_model_v1';
// 429/오류를 낸 모델은 10분간 후순위로 미룸 (쿨다운)
const MODEL_COOLDOWN_PREFIX = 'stagebill_model_cd_';
const MODEL_COOLDOWN_TTL = 600; // 10분(초)
// 한 요청에서 시도하는 최대 모델 수 — 실패 시 헛되이 소모되는 호출을 제한
const MAX_MODEL_ATTEMPTS = 3;

// 큐레이션용 압축 작품 목록 캐시 (시트 읽기는 요청마다 1~3초 소요)
const MUSICAL_LIST_CACHE_KEY = 'stagebill_compact_list_v1';
const MUSICAL_LIST_CACHE_TTL = 1800; // 30분(초) — 폼 제출 시 즉시 무효화됨

// 큐레이션 결과 캐시 TTL — 데이터가 자주 바뀌지 않으므로 CacheService 최대치 사용
const CURATION_RESULT_TTL = 21600; // 6시간(초)

function getRankedModels(apiKey) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(MODEL_CACHE_KEY);
  if (cached) {
    try {
      const models = JSON.parse(cached);
      if (Array.isArray(models) && models.length) {
        return { models: models, cached: true };
      }
    } catch (_) { /* 캐시 파손 시 무시하고 재조회 */ }
  }
  const result = listGenerateContentModels(apiKey);
  if (!result.error && result.models.length) {
    try {
      cache.put(MODEL_CACHE_KEY, JSON.stringify(result.models), MODEL_CACHE_TTL);
    } catch (_) { /* 캐시 저장 실패는 무시 (기능에는 영향 없음) */ }
  }
  return result;
}

// 사용 가능한 generateContent 지원 모델을 우선순위대로 정렬해서 반환
function listGenerateContentModels(apiKey) {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey + '&pageSize=200';
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const status = res.getResponseCode();
    if (status !== 200) {
      const body = res.getContentText();
      Logger.log('[ListModels] status=' + status + ' body=' + body.substring(0, 300));
      return { error: true, status: status, snippet: body.substring(0, 300), models: [] };
    }
    const data = JSON.parse(res.getContentText());
    const candidates = (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).indexOf('generateContent') >= 0)
      .map(m => String(m.name || '').replace(/^models\//, ''))
      .filter(Boolean);

    const ranked = candidates
      .map(name => {
        let rank = MODEL_PRIORITY.length;
        for (let i = 0; i < MODEL_PRIORITY.length; i++) {
          if (MODEL_PRIORITY[i].test(name)) { rank = i; break; }
        }
        const isExperimental = /(-exp|-preview|-thinking|-image|-tts|-native-audio)/.test(name);
        return { name: name, rank: rank + (isExperimental ? 100 : 0) };
      })
      .sort((a, b) => a.rank - b.rank)
      .map(x => x.name);

    Logger.log('[ListModels] ' + candidates.length + '개 사용 가능, 시도 순서: ' + ranked.slice(0, 8).join(', '));
    return { models: ranked };
  } catch (err) {
    Logger.log('[ListModels] 예외: ' + err.message);
    return { error: true, status: 0, snippet: err.message, models: [] };
  }
}

// 시도 순서 결정: 직전 성공 모델 우선, 쿨다운 중인 모델은 후순위
function orderModelsForAttempt(rankedModels, cache) {
  let models = rankedModels.slice();
  const lastGood = cache.get(LAST_GOOD_MODEL_KEY);
  if (lastGood && models.indexOf(lastGood) >= 0) {
    models = [lastGood].concat(models.filter(m => m !== lastGood));
  }
  const hot  = [];
  const cold = [];
  models.forEach(m => {
    (cache.get(MODEL_COOLDOWN_PREFIX + m) ? cold : hot).push(m);
  });
  return hot.concat(cold); // 전부 쿨다운이어도 시도는 함 (완전 차단 방지)
}

// 큐레이션 프롬프트용 압축 작품 목록 — 시트 읽기(1~3초)를 30분 캐시로 대체
function getCompactMusicalList(cache) {
  const cached = cache.get(MUSICAL_LIST_CACHE_KEY);
  if (cached) {
    try {
      const list = JSON.parse(cached);
      if (Array.isArray(list) && list.length) return list;
    } catch (_) { /* 캐시 파손 시 무시하고 재조회 */ }
  }
  const sheet = getMainSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  const list = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  }).filter(m => m.title).map(m => ({
    id:          String(m.id    || ''),
    title:       String(m.title || ''),
    title_en:    String(m.title_en || ''),
    title_ja:    String(m.title_ja || ''),
    category:    String(m.category   || ''),
    description: String(m.description|| '').substring(0, 150),
    ideaNotes:   String(m.ideaNotes  || '').substring(0, 150),
    hashtags:    Array.isArray(m.hashtags) ? m.hashtags.join(', ') : String(m.hashtags || ''),
    number1:     String(m.number1_title || ''),
    number2:     String(m.number2_title || ''),
  }));
  // CacheService 값 제한(100KB) 초과 등으로 저장 실패해도 기능에는 영향 없음
  try { cache.put(MUSICAL_LIST_CACHE_KEY, JSON.stringify(list), MUSICAL_LIST_CACHE_TTL); } catch (_) {}
  return list;
}

// params: e.parameter (GET) 또는 JSON body (POST)
function handleAICuration(params) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'API_KEY_MISSING' });

    const grade      = String(params.grade      || '').trim();
    const keywords   = String(params.keywords   || '').trim();
    const lessonType = String(params.lessonType || '').trim();
    const interests  = String(params.interests  || '').trim();
    const lang       = String(params.lang       || 'ko').trim();

    // 동일 조건의 이전 결과가 캐시에 있으면 즉시 반환 (시트 읽기·Gemini 호출 없이)
    const resultCache = CacheService.getScriptCache();
    const cacheKey = curationCacheKey(grade, keywords, lessonType, interests, lang);
    const cachedResult = resultCache.get(cacheKey);
    if (cachedResult) {
      return ContentService
        .createTextOutput(cachedResult)
        .setMimeType(ContentService.MimeType.JSON);
    }

    const musicalList = getCompactMusicalList(resultCache);
    if (!musicalList.length) return jsonResponse({ error: 'NO_DATA' });

    const prompt = buildCurationPrompt(grade, keywords, lessonType, interests, musicalList, lang);

    // 동적 모델 조회 (ListModels API) — 결과는 6시간 캐시하여 핫패스에서 네트워크 왕복 제거
    const listResult = getRankedModels(apiKey);
    if (listResult.error) {
      return jsonResponse({
        error: 'LIST_MODELS_FAILED',
        lastStatus: listResult.status,
        lastSnippet: listResult.snippet,
      });
    }
    if (!listResult.models.length) {
      return jsonResponse({ error: 'NO_AVAILABLE_MODELS' });
    }

    // 시도 순서 최적화:
    //   1) 직전에 성공한 모델을 맨 앞으로 (거의 항상 1회 호출로 끝남)
    //   2) 최근 실패(쿨다운 중)한 모델은 뒤로 미룸 → 헛 호출 방지
    const modelsToTry = orderModelsForAttempt(listResult.models, resultCache)
      .slice(0, MAX_MODEL_ATTEMPTS);
    const attempts = [];
    for (const model of modelsToTry) {
      const result = callGemini(apiKey, model, prompt);
      attempts.push({ model: model, status: result.status, snippet: result.snippet });
      Logger.log('[Gemini] ' + model + ' → status=' + result.status + ' / ' + (result.snippet || ''));
      if (result.invalidKey)    return jsonResponse({ error: 'INVALID_KEY', attempts: attempts });
      if (result.quotaExceeded || result.error) {
        // 실패한 모델은 10분간 후순위 → 다음 요청이 같은 모델에 호출을 낭비하지 않음
        try { resultCache.put(MODEL_COOLDOWN_PREFIX + model, '1', MODEL_COOLDOWN_TTL); } catch (_) {}
        continue;
      }
      const payload = JSON.stringify({
        recommendations: result.recommendations,
        external: result.external || [],
        model: model,
      });
      // 성공한 모델 기억 + 결과 6시간 캐시 → 동일 조건 재요청 시 Gemini 재호출 없이 즉시 응답
      try {
        resultCache.put(LAST_GOOD_MODEL_KEY, model, MODEL_CACHE_TTL);
        resultCache.put(cacheKey, payload, CURATION_RESULT_TTL);
      } catch (_) {}
      return ContentService
        .createTextOutput(payload)
        .setMimeType(ContentService.MimeType.JSON);
    }

    const last = attempts[attempts.length - 1] || {};
    return jsonResponse({
      error: 'ALL_MODELS_FAILED',
      lastStatus: last.status,
      lastSnippet: last.snippet,
      attempts: attempts,
      availableModels: listResult.models.slice(0, 20),
    });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function buildCurationPrompt(grade, keywords, lessonType, interests, musicals, lang) {
  const targets = String(grade || '').split(',').map(s => s.trim()).filter(Boolean);
  const hasTeacher = targets.indexOf('교사') >= 0;
  const grades = targets.filter(t => t !== '교사');

  // 언어별 출력 지시
  const langMap = { ko: 'Korean (한국어)', en: 'English', ja: 'Japanese (日本語)' };
  const outputLang = langMap[lang] || langMap.ko;
  const titleField = lang === 'en' ? 'title_en' : lang === 'ja' ? 'title_ja' : 'title';

  const roleLine = hasTeacher && grades.length > 0
    ? '당신은 교사를 위한 뮤지컬 수업·연수 큐레이터입니다. 학생 수업과 교사 연수 모두에 활용할 수 있는 작품을 추천해주세요.'
    : hasTeacher
    ? '당신은 교사 연수 큐레이터입니다. 교사의 전문성 신장과 워크숍에 적합한 뮤지컬 작품을 추천해주세요.'
    : '당신은 교사를 위한 뮤지컬 수업 큐레이터입니다. 스테이지빌 데이터에서 교사 조건에 가장 적합한 작품을 추천해주세요.';

  const targetLine = targets.length
    ? '- 대상: ' + targets.join(', ') + (hasTeacher ? ' (교사 포함 → 교사 연수·전문성 신장·작품 분석·지도법·창작 워크숍 관점 고려)' : '')
    : '- 대상: 미지정';

  return `${roleLine}

[조건]
${targetLine}
- 키워드:        ${keywords   || '없음'}
- 하고 싶은 활동: ${lessonType || '없음'}
- 관심 작품/기타: ${interests  || '없음'}

[스테이지빌 데이터]
${JSON.stringify(musicals)}

위 데이터에서 조건에 적합한 작품을 선별하여 추천해주세요.
- 적합도가 높은 작품 위주로 최대 8개까지 추천하세요. 조건에 정말로 맞는 작품만 고르고, 적으면 1-2개여도 됩니다. 억지로 채우지 마세요.
- 선택 기준: 대상 적합성, 키워드 관련성, 수업/연수 활용도, 아이디어 노트의 풍부함.
- 추천 이유(reason)는 해당 대상(학생/교사)에게 왜 적합한지 1-2문장으로 간결하게 적어주세요.
- 각 추천에 활용 팁(tip)을 함께 주세요: 이 작품을 '하고 싶은 활동' 조건에 맞춰 수업/연수에서 바로 써먹을 수 있는 구체적인 아이디어 1문장.

[추가 추천 — '이런 작품도 있어요']
위 스테이지빌 데이터에 없는 작품 중에서도, 사용자의 키워드·활동·관심 작품 조건과 관련 있는 뮤지컬을 3~5개 추천해주세요.
- 실제로 존재하는 잘 알려진 뮤지컬만 추천하세요. 작품명을 지어내지 마세요.
- 한국 창작/라이선스 작품과 외국(브로드웨이/웨스트엔드 등) 작품을 골고루 섞어주세요.
- 스테이지빌 데이터에 이미 있는 작품(위 title 목록)은 제외하세요.
- 각 작품의 origin 값은 한국 작품이면 "KR", 그 외 해외 작품이면 "INTL" 로만 표기하세요.

[출력 언어]
${outputLang}로 응답하세요. 작품명(title)은 데이터의 "${titleField}" 필드가 있으면 그것을, 없으면 한국어 원본(title)을 사용하세요. 추가 추천(external) 작품명도 ${outputLang} 기준 통용 명칭으로 작성하세요. 모든 추천 이유(reason)는 반드시 ${outputLang}로 작성하세요.

반드시 아래 JSON 형식으로만 답하세요 (다른 텍스트 없이):
{"recommendations":[{"id":"작품ID","title":"작품명(선택된 언어)","reason":"추천 이유 1-2문장(선택된 언어로)","tip":"수업/연수 활용 아이디어 1문장(선택된 언어로)"}],"external":[{"title":"작품명(선택된 언어)","origin":"KR 또는 INTL","reason":"조건과 어떤 점이 관련 있는지 1-2문장(선택된 언어로)"}]}`;
}

function callGemini(apiKey, model, prompt) {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/'
              + model + ':generateContent?key=' + apiKey;
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          // 출력 토큰 수가 LLM 지연을 좌우함. 데이터셋 규모(수십 개)와 간결한 reason 기준
          // 실제 출력은 ~2K 토큰 이내라 4096이면 잘림 없이 충분하며 최악 지연을 절반으로 줄임
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
      muteHttpExceptions: true,
    };

    const res     = UrlFetchApp.fetch(url, options);
    const status  = res.getResponseCode();
    const body    = res.getContentText();
    const snippet = body.substring(0, 300);

    // 400은 key/요청 형식 문제일 수도 있음 — 본문에 API_KEY_INVALID가 있을 때만 invalidKey로 분류
    if (status === 400 && /API_KEY_INVALID|API key not valid/i.test(body)) {
      return { invalidKey: true, status: status, snippet: snippet };
    }
    if (status === 429) return { quotaExceeded: true, status: status, snippet: snippet };
    if (status !== 200) return { error: true, status: status, snippet: snippet };

    const data  = JSON.parse(body);
    const parts = ((data.candidates || [])[0]?.content?.parts) || [];
    const text  = parts.filter(p => !p.thought).map(p => p.text || '').join('').trim();
    if (!text) return { error: true, status: status, snippet: 'empty text in candidates' };

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (!m) return { error: true, status: status, snippet: 'unparseable: ' + text.substring(0, 200) };
      parsed = JSON.parse(m[1].trim());
    }
    return {
      recommendations: parsed.recommendations || [],
      external: parsed.external || [],
      status: status,
    };
  } catch (err) {
    return { error: true, status: 0, snippet: 'exception: ' + err.message };
  }
}

function handleRead() {
  try {
    const sheet   = getMainSheet();
    const rows    = sheet.getDataRange().getValues();
    if (rows.length < 2) return jsonResponse([]);
    const headers = rows[0];

    const musicals = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      // hashtags: 쉼표 구분 문자열 → 배열
      if (typeof obj.hashtags === 'string' && obj.hashtags) {
        obj.hashtags = obj.hashtags.split(',').map(t => t.trim()).filter(Boolean);
      }
      return obj;
    }).filter(m => m.title);

    return jsonResponse(musicals);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// 큐레이션 결과 캐시 키 (조건 조합을 짧은 해시로 변환 — CacheService 키 길이 제한 대응)
// 입력을 정규화(공백 정리·소문자화·대상 정렬)하여 사실상 같은 조건이면 캐시를 재사용
//   예: "환경,  진로" ↔ "환경, 진로" / "초등 1-2학년,교사" ↔ "교사,초등 1-2학년"
function curationCacheKey(grade, keywords, lessonType, interests, lang) {
  const normText  = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const normGrade = String(grade || '').split(',').map(s => s.trim()).filter(Boolean).sort().join(',');
  const raw = [normGrade, normText(keywords), normText(lessonType), normText(interests), lang].join('\x1f');
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw, Utilities.Charset.UTF_8);
  const hex = bytes.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
  return 'stagebill_curate_v2_' + hex;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
