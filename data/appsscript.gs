// ============================================================
// STAGEBILL — Google Apps Script
// Google Apps Script 편집기에 이 코드 전체를 붙여넣고
// "배포 > 새 배포 > 웹 앱" 으로 재배포하세요.
// 실행 계정: 나(스프레드시트 소유자)
// 액세스 권한: 모든 사용자(익명 포함)
// ============================================================

const UPLOAD_PASSWORD = 'stage';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// 모든 요청은 doGet 으로 처리합니다.
// (Apps Script는 GET 요청에만 CORS 헤더를 추가합니다.)
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'read';

  if (action === 'upload') {
    return handleUpload(e.parameter);
  }

  return handleRead();
}

// ── 데이터 읽기 ──────────────────────────────────────────────
function handleRead() {
  try {
    const sheet   = getSheet();
    const rows    = sheet.getDataRange().getValues();
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

// ── 업로드(행 추가) ──────────────────────────────────────────
function handleUpload(params) {
  try {
    if (params.password !== UPLOAD_PASSWORD) {
      return jsonResponse({ error: '비밀번호가 올바르지 않습니다.' });
    }

    const sheet   = getSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // 헤더 순서에 맞춰 행 구성 (없는 컬럼은 빈 문자열)
    const row = headers.map(h => {
      const val = params[h];
      return (val !== undefined && val !== null) ? String(val) : '';
    });

    sheet.appendRow(row);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
