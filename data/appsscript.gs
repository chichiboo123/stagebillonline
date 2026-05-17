// ============================================================
// STAGEBILL — Google Apps Script (읽기 전용)
// ============================================================
// 업로드는 Google Forms로 위임합니다.
//   - 폼 응답이 같은 스프레드시트(혹은 연결된 응답 시트)에 자동 저장
//   - 이 스크립트는 시트를 읽어 JSON으로 반환만 합니다.
//
// 배포:
//   "배포 > 배포 관리 > 연필 > 버전: 새 버전 > 배포"
//   액세스 권한: 모든 사용자(익명 포함)
// ============================================================

function getSheet() {
  // 첫 번째 시트를 데이터 시트로 사용합니다.
  // Google Forms 응답 시트로 바꾸려면 시트 이름으로 명시하는 편이 안전합니다.
  //   return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('설문지 응답 시트1');
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function doGet() {
  return handleRead();
}

// ── 데이터 읽기 ──────────────────────────────────────────────
function handleRead() {
  try {
    const sheet   = getSheet();
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
