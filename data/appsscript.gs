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

// ── 읽기 (앱 → doGet) ────────────────────────────────────────
function doGet() {
  return handleRead();
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
