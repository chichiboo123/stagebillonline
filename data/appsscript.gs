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

// 읽기는 doGet, 업로드는 doPost로 처리합니다.
// (GET은 URL 길이 한계가 있어 긴 본문이 잘리므로 업로드는 POST 권장)
// 이전 버전 호환을 위해 doGet에서도 action=upload를 받아주지만,
// 클라이언트는 POST를 사용하세요.
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'read';

  if (action === 'upload') {
    return handleUpload(e.parameter || {});
  }

  return handleRead();
}

function doPost(e) {
  // form-urlencoded POST는 e.parameter 로 들어옵니다.
  const params = (e && e.parameter) || {};
  return handleUpload(params);
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
// 메타 파라미터(저장하지 않는 키)
const META_KEYS = { action: 1, password: 1 };

function handleUpload(params) {
  try {
    if (params.password !== UPLOAD_PASSWORD) {
      return jsonResponse({ error: '비밀번호가 올바르지 않습니다.' });
    }

    const sheet     = getSheet();
    const lastCol   = Math.max(sheet.getLastColumn(), 1);
    let headers     = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // 시트가 비어있으면 (헤더 없음) 입력 키로 헤더를 생성
    if (headers.every(h => !h)) {
      const seedHeaders = Object.keys(params).filter(k => !META_KEYS[k]);
      if (seedHeaders.length === 0) {
        return jsonResponse({ error: '빈 시트에 보낼 데이터가 없습니다.' });
      }
      sheet.getRange(1, 1, 1, seedHeaders.length).setValues([seedHeaders]);
      headers = seedHeaders;
    }

    // 누락된 컬럼을 자동으로 추가 (조용한 데이터 손실 방지)
    const headerSet = new Set(headers.filter(Boolean));
    const missing   = Object.keys(params)
      .filter(k => !META_KEYS[k] && !headerSet.has(k));
    if (missing.length > 0) {
      const startCol = headers.length + 1;
      sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
      headers = headers.concat(missing);
      Logger.log('Headers extended: %s', missing.join(', '));
    }

    // id 컬럼을 어디에 있든 찾아서 자동 생성
    const idCol = headers.indexOf('id'); // 0-based; -1이면 없음
    let nextId = '';
    if (idCol !== -1) {
      let maxId = 0;
      const lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        const ids = sheet.getRange(2, idCol + 1, lastRow - 1, 1).getValues()
          .map(r => Number(r[0]))
          .filter(n => !isNaN(n));
        if (ids.length) maxId = Math.max.apply(null, ids);
      }
      nextId = maxId + 1;
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
