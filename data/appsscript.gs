// ============================================================
// STAGEBILL — Google Apps Script
// Google Apps Script 편집기에 이 코드 전체를 붙여넣고
// 반드시 "배포 > 배포 관리 > (현재 배포 옆 연필 아이콘) > 버전: 새 버전 > 배포"
// 를 눌러 재배포하세요. (새 배포로 만들면 URL이 바뀌니 주의)
// 실행 계정: 나(스프레드시트 소유자)
// 액세스 권한: 모든 사용자(익명 포함)
// ============================================================

const UPLOAD_PASSWORD = 'stage';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// 모든 요청은 doGet 으로 처리합니다.
// (Apps Script는 GET 요청에만 기본 CORS 헤더를 추가합니다.)
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'read';

  if (action === 'upload') {
    return handleUpload(e.parameter || {});
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

    // id 자동 생성 (기존 최대 id + 1, 없으면 1)
    let nextId = 1;
    if (headers[0] === 'id') {
      const lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues()
          .map(r => Number(r[0]))
          .filter(n => !isNaN(n));
        if (ids.length) nextId = Math.max.apply(null, ids) + 1;
      }
      params.id = String(nextId);
    }

    // 헤더 순서에 맞춰 행 구성 (없는 컬럼은 빈 문자열)
    const row = headers.map(h => {
      const val = params[h];
      return (val !== undefined && val !== null) ? String(val) : '';
    });

    sheet.appendRow(row);
    SpreadsheetApp.flush();  // 다음 read 요청이 새 행을 즉시 볼 수 있도록 확정

    Logger.log('Upload OK — id=%s, title=%s', params.id, params.title);
    return jsonResponse({ success: true, id: nextId });
  } catch (err) {
    Logger.log('Upload ERROR — %s', err && err.message);
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
