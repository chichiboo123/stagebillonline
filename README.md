# STAGEBILL

뮤지컬 수업 자료 큐레이션 웹앱. Google Sheets 기반 데이터 연동.

---

## 실행

정적 사이트이므로 로컬 웹서버 사용:

```bash
python -m http.server 8000
# 또는
npx serve .
```

---

## 데이터 관리

데이터는 Google Sheets ↔ Apps Script 연동으로 관리합니다.
콘텐츠 추가·수정은 스프레드시트에서 직접 진행하거나, 앱 내 **업로드 버튼**을 사용하세요.

### 주요 스프레드시트 열

| 열 | 설명 |
|----|------|
| `id` | 고유 ID (자동 생성) |
| `title` | 작품명 (필수) |
| `title_en` / `title_ja` | 영문/일문 작품명 |
| `category` | 카테고리 (예: 일상, 힐링, 과학…) |
| `curator` | 큐레이터명 |
| `year` / `curationYear` | 제작 연도 / 큐레이션 연도 |
| `description` | 작품 소개 |
| `number1_title` / `number1_desc` | 추천 넘버 ① 제목·설명 |
| `number1_title_en` / `number1_desc_en` | 영문 추천 넘버 ① |
| `number1_title_jp` / `number1_desc_jp` | 일문 추천 넘버 ① |
| `number2_title` / `number2_desc` | 추천 넘버 ② |
| `ideaNotes` | 수업 아이디어 노트 |
| `playlistLink` | YouTube 링크 |
| `references` | 참고자료 (`제목::URL` 형식, 복수는 `\|` 구분) |
| `hashtags` | 해시태그 (쉼표 구분) |
| `thumbnail` | 포스터 이미지 URL |
| `color` | 카드 색상 HEX |

---

## 새 카테고리 추가

4개 파일 수정 필요 (`js/app.js` CATEGORY_MAP·getCategoryEmoji·translations, `index.html` nav-links·업로드 폼 select, `css/style.css` `.category-{이름}`).

---

## 다국어

UI: 한국어(KO) / 영어(EN) / 일본어(JP) 전환 지원.
콘텐츠 번역은 `_en` / `_ja`(`_jp`) 접미사 열을 스프레드시트에 추가하면 자동 반영됩니다.
