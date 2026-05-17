// ============================================================
// STAGEBILL — Google Apps Script
// Google Apps Script 편집기에 이 코드를 붙여넣고
// "웹 앱으로 배포" > 액세스: 모든 사용자 (익명 포함) 로 재배포하세요.
// ============================================================

const UPLOAD_PASSWORD = 'stage';

// 스프레드시트의 첫 번째 시트를 사용합니다.
function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// GET 요청 처리 (데이터 읽기 전용)
function doGet(e) {
  try {
    const sheet = getSheet();
    const rows  = sheet.getDataRange().getValues();
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

    return ContentService
      .createTextOutput(JSON.stringify(musicals))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// POST 요청 처리 (업로드)
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // 비밀번호 확인
    if (payload.password !== UPLOAD_PASSWORD) {
      return jsonResponse({ error: '비밀번호가 올바르지 않습니다.' });
    }
    if (payload.action !== 'upload') {
      return jsonResponse({ error: '알 수 없는 action입니다.' });
    }

    const sheet   = getSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // 헤더 순서에 맞춰 행 구성 (없는 컬럼은 빈 문자열)
    const row = headers.map(h => {
      const val = payload[h];
      return val !== undefined && val !== null ? String(val) : '';
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
