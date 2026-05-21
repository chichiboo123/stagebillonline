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
    Logger.log('폼 응답 추가 완료: ' + (newRow[headers.indexOf('title')] || '(제목 없음)'));
  } catch (err) {
    Logger.log('onFormSubmit 오류: ' + err.message);
  }
}

// 배포 검증용 — 이 문자열이 ?action=ping 응답에 그대로 나오면 새 코드가 배포된 것
const SCRIPT_VERSION = '2026-05-21-curation-v3';

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
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

// params: e.parameter (GET) 또는 JSON body (POST)
function handleAICuration(params) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'API_KEY_MISSING' });

    const grade      = String(params.grade      || '').trim();
    const keywords   = String(params.keywords   || '').trim();
    const lessonType = String(params.lessonType || '').trim();
    const interests  = String(params.interests  || '').trim();

    const sheet = getMainSheet();
    const rows  = sheet.getDataRange().getValues();
    if (rows.length < 2) return jsonResponse({ error: 'NO_DATA' });
    const headers = rows[0];

    const musicalList = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    }).filter(m => m.title).map(m => ({
      id:          String(m.id    || ''),
      title:       String(m.title || ''),
      category:    String(m.category   || ''),
      description: String(m.description|| '').substring(0, 150),
      ideaNotes:   String(m.ideaNotes  || '').substring(0, 150),
      hashtags:    Array.isArray(m.hashtags) ? m.hashtags.join(', ') : String(m.hashtags || ''),
      number1:     String(m.number1_title || ''),
      number2:     String(m.number2_title || ''),
    }));

    const prompt = buildCurationPrompt(grade, keywords, lessonType, interests, musicalList);

    const attempts = [];
    for (const model of GEMINI_MODELS) {
      const result = callGemini(apiKey, model, prompt);
      attempts.push({ model: model, status: result.status, snippet: result.snippet });
      Logger.log('[Gemini] ' + model + ' → status=' + result.status + ' / ' + (result.snippet || ''));
      if (result.invalidKey)    return jsonResponse({ error: 'INVALID_KEY', attempts: attempts });
      if (result.quotaExceeded) continue;
      if (result.error)         continue;
      return jsonResponse({ recommendations: result.recommendations, model: model });
    }

    // 모든 모델 실패: 마지막 시도의 상태를 그대로 노출하여 진단 가능하게 함
    const last = attempts[attempts.length - 1] || {};
    return jsonResponse({
      error: 'ALL_MODELS_FAILED',
      lastStatus: last.status,
      lastSnippet: last.snippet,
      attempts: attempts,
    });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function buildCurationPrompt(grade, keywords, lessonType, interests, musicals) {
  return `당신은 교사를 위한 뮤지컬 수업 큐레이터입니다. 스테이지빌 데이터에서 교사 조건에 가장 적합한 작품을 추천해주세요.

[교사 조건]
- 수업 대상 학년: ${grade      || '미지정'}
- 수업 키워드:    ${keywords   || '없음'}
- 하고 싶은 수업: ${lessonType || '없음'}
- 관심 작품/기타: ${interests  || '없음'}

[스테이지빌 데이터]
${JSON.stringify(musicals)}

위 데이터에서 교사 조건에 가장 적합한 작품 3~5개를 선별하여 추천해주세요.
선택 기준: 학년 수준, 키워드 관련성, 수업 활용도, 아이디어 노트.

반드시 아래 JSON 형식으로만 답하세요 (다른 텍스트 없이):
{"recommendations":[{"id":"작품ID","title":"작품명","reason":"추천 이유 2-3문장"}]}`;
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
          maxOutputTokens: 2048,
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
    return { recommendations: parsed.recommendations || [], status: status };
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

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
