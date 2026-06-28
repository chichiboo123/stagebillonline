# STAGEBILL

> 교실에서 시작하는 뮤지컬 수업 — 큐레이션 자료집

**STAGEBILL**은 브로드웨이 공연장에서 관객에게 제공되는 프로그램 북 'PLAYBILL'에서 영감을 받아 시작된 자료집입니다. **'교육'과 '뮤지컬'의 의미 있는 만남**을 기록하고, 매월 선생님과 함께 교육뮤지컬의 영감을 나누기 위해 만들었습니다.

- 제작 / 경기도뮤지컬교육연구회 STAGE

---

## 주요 기능

### 1. 큐레이션 카탈로그
- Google Sheets에 등록된 작품을 카테고리별 행(行) 레이아웃으로 탐색 (Netflix 스타일 가로 스크롤)
- 상단 히어로 배너: 추천작 자동 슬라이드, 이전/다음 이동, **랜덤 추천** 버튼
- 카테고리 필터, 검색(작품명·해시태그·키워드), 다국어 UI(한·영·일)
- 작품 상세: 소개, 추천 넘버, 수업 아이디어 노트, 참고 영상(YouTube 임베드), 참고자료, 해시태그
- **같은 작품 다른 내용**: 제목이 같고 카테고리가 다른 버전이 있으면 상세 화면에서 서로 전환

### 2. AI 큐레이션 (Gemini)
선생님 조건에 맞춰 Gemini가 STAGEBILL 데이터에서 작품을 추천합니다.

- **다중 대상 선택**: 학년 9개(초1-2 ~ 고3) + **교사**까지 동시에 선택 가능 — 학생 수업뿐 아니라 교사 연수 설계에도 활용
- **조건 입력**: 키워드 · 하고 싶은 수업/연수 유형 · 관심 작품/기타 조건(선택)
- **출력 개수 제한 없음**: 조건에 정말 맞는 작품만, 많으면 많은 대로 / 적으면 적은 대로
- **이런 작품도 있어요**: STAGEBILL에 없더라도 입력 조건과 관련된 실제 뮤지컬 3~5개를 추가 추천 (국내 창작/라이선스 + 해외 작품 혼합, `KR`/`INTL` 구분)
- **다국어 응답**: UI 언어에 따라 추천 이유를 한·영·일 중 선택 언어로 자동 생성
- **모델 자동 선택**: Gemini ListModels API로 사용 가능한 모델 실시간 조회 → 우선순위(flash-latest → 3.x → 2.5 → 2.0) 순으로 폴백. 모델 deprecation에 자동 대응
- **결과 내보내기 4종**
  - 📄 **TXT** 다운로드
  - 🖼️ **JPG** 다운로드 (html2canvas로 고해상도 캡처 카드 생성)
  - 🔗 **공유 링크** (큐레이션을 URL 해시에 base64 인코딩 — 받는 사람은 링크만 열면 동일한 결과 그대로 표시)
  - 📋 **텍스트 복사** (클립보드)
- **모달 복귀**: 추천 카드 클릭 → 작품 상세 → X 버튼 누르면 큐레이션 결과로 자동 복귀

### 3. 새 내용 업로드 (Google Forms 연동)
- 비밀번호 보호된 업로드 모달 → Google Form 임베드
- 폼 제출 → `onFormSubmit` 트리거 → 메인 스프레드시트에 자동 행 추가 (`id` 자동 채번, 헤더 자동 매핑)

### 4. STAGEBILL 소개 탭
- 프로젝트 취지, 제작·기획 정보를 다국어로 안내

---

## 아키텍처

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│  브라우저 (정적 HTML/JS/CSS) │ ◀──────▶│  Google Apps Script (doGet)  │
│  · index.html / app.js      │  GET    │  · handleRead   (시트 → JSON)│
│  · 다국어, 검색, 모달, 캐러셀│         │  · handleAICuration (Gemini) │
│  · html2canvas (JPG export) │         │  · doPost (Form 제출 트리거) │
└─────────────────────────────┘         └──────────────┬───────────────┘
                                                       │
                                          ┌────────────┴────────────┐
                                          ▼                         ▼
                                   ┌──────────────┐         ┌──────────────┐
                                   │ Google Sheet │         │  Gemini API  │
                                   │  (메인 데이터)│         │ (v1beta REST)│
                                   └──────────────┘         └──────────────┘
```

- 정적 호스팅: GitHub Pages (`CNAME` → `stagebill.chichiboo.link`)
- 데이터: Google Sheets (Apps Script `doGet`로 JSON 노출)
- AI: Apps Script가 Gemini API 프록시 역할(브라우저에 API 키 노출 안 함)
- 업로드: Google Forms → Apps Script `onFormSubmit` 트리거

---

## 프로젝트 구조

```
stagebillonline/
├── index.html              # 단일 페이지 마크업 (네비/히어로/모달/AI·업로드·소개 오버레이)
├── css/style.css           # 전체 스타일 (반응형, 카테고리 색상, 모달, AI 카드 등)
├── js/app.js               # 앱 로직 (데이터 로딩·검색·필터·모달·AI 큐레이션·공유링크·다국어)
├── data/
│   ├── appsscript.gs       # Google Apps Script (doGet/doPost·읽기·Gemini 프록시·Form 트리거)
│   ├── sample_template.csv # 스프레드시트 헤더/입력 예시
│   ├── convert_csv.py      # CSV → 시트 입력 형식 변환 보조 스크립트
│   └── musicals.json       # (미사용/플레이스홀더) 실데이터는 Google Sheets에서 로드
├── CNAME                   # GitHub Pages 커스텀 도메인 (stagebill.chichiboo.link)
└── favicon.svg
```

> 📘 선생님용 사용 안내서는 [`TEACHER_GUIDE.md`](TEACHER_GUIDE.md)를 참고하세요.

---

## 로컬 실행

정적 사이트이므로 어떤 정적 서버든 사용 가능:

```bash
python3 -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000` 열기.

---

## 초기 셋업 (배포자용)

### A. 스프레드시트 + Apps Script

1. Google Sheet를 만들고 첫 행에 헤더 입력 (열 목록은 아래 참조)
2. **확장 프로그램 → Apps Script**로 진입
3. `data/appsscript.gs`의 코드 전체를 에디터에 붙여넣고 **저장(Ctrl+S)**
4. **MAIN_SHEET_NAME** 상수를 실제 시트 탭 이름으로 수정 (기본: `시트1`)
5. **프로젝트 설정 → 스크립트 속성**에 `GEMINI_API_KEY` 추가 (AI 큐레이션 사용 시)
6. `setupFormTrigger()` 함수를 한 번 ▶ 실행 (업로드 폼 연결 시)
7. **배포 → 새 배포**:
   - 유형: **웹 앱**
   - 액세스: **모든 사용자**
   - 배포 후 **웹 앱 URL** 복사
8. `js/app.js`의 `DATA_URL` 상수를 위에서 복사한 URL로 변경

### B. Gemini API 키

1. https://aistudio.google.com/apikey 에서 키 발급
2. Apps Script **스크립트 속성**에 `GEMINI_API_KEY`로 저장
3. **API 키 제한 사항**: Application restrictions는 **None**(없음)으로 두세요. Apps Script의 outbound IP가 고정되지 않아 IP/Referrer 제한이 걸리면 차단됩니다
4. **Generative Language API**가 Google Cloud 프로젝트에서 활성화되어 있어야 합니다

### C. 업로드 폼 (선택)

1. Google Form 만들기. 질문 제목을 **시트 헤더와 동일하게** 작성 (대소문자 포함)
2. 폼 응답 → 스프레드시트 연결(기존 시트 선택)
3. Apps Script에서 `setupFormTrigger()` ▶ 실행
4. 폼 공유 URL을 `js/app.js`의 `UPLOAD_FORM_BASE`로 설정 (모달에 `?embedded=true`로 임베드됨)
5. 업로드 모달 비밀번호는 `js/app.js`의 `UPLOAD_PASSWORD` 상수로 변경 (기본: `stage`)

### D. Apps Script 재배포 (코드 수정 후)

⚠️ **새 배포(New Deployment)를 만들지 마세요.** URL이 바뀝니다.

올바른 순서:
1. 에디터 코드 수정 → **Ctrl+S**
2. **배포 → 배포 관리 → 활성 배포의 ✏️ 편집 아이콘**
3. 버전 드롭다운에서 반드시 **"새 버전"** 선택
4. **배포**

배포가 잘 되었는지 확인:
- 브라우저에서 `<DATA_URL>?action=ping` 열기 → `{"ok":true,"version":"…"}` 가 나오면 ✅
- 뮤지컬 배열이 나오면 옛 코드. 위 절차 다시 확인

---

## 스프레드시트 컬럼

| 열 | 필수 | 설명 |
|----|:----:|------|
| `id` | 자동 | 고유 ID (Form 제출 시 자동 채번) |
| `title` | ✅ | 작품명 (한국어, 필수) |
| `title_en` / `title_ja` |  | 영문/일문 작품명 |
| `category` | ✅ | 카테고리 (예: 일상, 힐링, 과학, 가족, 진로, 성장, 결실, 컬러, 인성 …) |
| `curator` |  | 큐레이터명 |
| `curationYear` |  | 큐레이션 연도 |
| `description` / `_en` / `_ja` |  | 작품 소개 |
| `ideaNotes` / `_en` / `_ja` |  | 수업 아이디어 노트 |
| `number1_title` / `_desc` (+ `_en` / `_ja`) |  | 추천 넘버 ① |
| `number2_title` / `_desc` (+ `_en` / `_ja`) |  | 추천 넘버 ② |
| `playlistLink` |  | YouTube 링크 |
| `references` |  | 참고자료. `제목::URL` 형식, 여러 개는 `\|` 구분 |
| `hashtags` |  | 해시태그 (쉼표 구분) |
| `thumbnail` |  | 포스터 이미지 URL |
| `color` |  | 카드 색상 HEX (예: `#7c3aed`) |

다국어 콘텐츠: `_en` / `_ja` 접미사 열을 추가하면 언어 전환 시 자동 반영됩니다.

---

## 새 카테고리 추가

4개 파일 수정 필요:

1. `js/app.js`
   - `CATEGORY_MAP` (또는 자동 생성 로직)
   - `getCategoryEmoji()` / 카테고리 라벨
   - `translations` (3개 언어)
2. `index.html` — `nav-links` 항목
3. `css/style.css` — `.category-<이름>` 색상 (있는 경우)
4. 업로드 Google Form — 카테고리 선택지

---

## 진단·디버깅

### Apps Script ping
```
<DATA_URL>?action=ping
```
응답에 `version`, `hasGeminiKey`, `sheet` 정보가 담깁니다.

### Apps Script checkVersion()
에디터에서 `checkVersion()` 함수를 ▶ 실행하면 로그에 현재 코드 버전·키 설정 상태·스프레드시트 정보가 찍힙니다.

### 브라우저 콘솔 로그
- `[STAGEBILL]` 데이터 로딩 상태
- `[STAGEBILL AI]` 큐레이션 응답 raw 데이터 (실패 시 상세 status / snippet)
- `[ListModels]` 실제 사용 가능한 Gemini 모델 목록

---

## 기술 스택

- **Vanilla JS / HTML / CSS** — 의존성 최소화 (html2canvas만 CDN 로드)
- **Google Apps Script** — 데이터 백엔드 + Gemini 프록시
- **Gemini API (v1beta)** — AI 큐레이션
- **GitHub Pages** — 정적 호스팅

---

## 라이선스 / 크레딧

© 2026 경기도뮤지컬교육연구회 STAGE — https://litt.ly/stage  
교육뮤지컬 꿈꾸는 치수쌤 — https://litt.ly/chichiboo
