# STAGEBILL - 뮤지컬 수업 자료 큐레이션 플랫폼

Netflix 스타일의 OTT형 웹사이트로, 뮤지컬 수업 자료를 큐레이션합니다.

## 실행 방법

정적 웹사이트이므로 로컬 웹서버로 실행합니다.

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

브라우저에서 `http://localhost:8000` 접속.

---

## 데이터 구조

모든 콘텐츠는 `data/musicals.json`에서 관리됩니다.

### JSON 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | 정수 | ✅ | 고유 ID (기존 최대값 + 1) |
| `title` | 문자열 | ✅ | 작품명 |
| `category` | 문자열 | ✅ | 카테고리: `일상` / `컬러` / `진로` |
| `curator` | 문자열 | ✅ | 큐레이터 이름 또는 단체명 |
| `year` | 정수 | ✅ | 작품 최초 제작 연도 (예: 2015) |
| `curationYear` | 정수 | ✅ | STAGEBILL 큐레이션 연도 (예: 2026) |
| `description` | 문자열 | ✅ | 작품 소개 (2~4문장 권장) |
| `recommendedNumbers` | 배열 | ✅ | 추천 넘버 목록 (최대 3개) `[{title, description}]` |
| `ideaNotes` | 문자열 | ✅ | 수업 아이디어 노트 |
| `playlistLink` | 문자열 | ✅ | YouTube 플레이리스트 URL |
| `references` | 배열 | ⬜ | 참고자료 링크 (없으면 빈 배열 `[]`) `[{title, url}]` |
| `hashtags` | 배열 | ✅ | 해시태그 배열 (# 포함) `["#일상", "#위로"]` |
| `thumbnail` | 문자열 | ⬜ | 포스터 이미지 URL (없으면 빈 문자열 `""`) |
| `color` | 문자열 | ✅ | 카드 대표 색상 HEX (예: `"#E50914"`) |

### 새 항목 JSON 템플릿

새 작품을 추가할 때 아래 템플릿을 복사하여 사용하세요.

```json
{
  "id": 13,
  "title": "작품명",
  "category": "일상",
  "curator": "큐레이터명",
  "year": 2000,
  "curationYear": 2026,
  "description": "작품 소개 텍스트.",
  "recommendedNumbers": [
    {"title": "넘버 제목1", "description": "한 줄 설명"},
    {"title": "넘버 제목2", "description": "한 줄 설명"},
    {"title": "넘버 제목3", "description": "한 줄 설명"}
  ],
  "ideaNotes": "수업 활용 아이디어 노트.",
  "playlistLink": "https://www.youtube.com/playlist?list=XXXX",
  "references": [
    {"title": "참고자료 제목", "url": "https://example.com"}
  ],
  "hashtags": ["#해시태그1", "#해시태그2", "#해시태그3"],
  "thumbnail": "https://이미지URL.webp",
  "color": "#E50914"
}
```

---

## 이미지(포스터) 제공 방식

이미지는 **외부 URL 방식**으로 제공합니다. 이미지를 직접 파일로 보관하지 않아도 됩니다.

### 권장 이미지 소스
- 나무위키 이미지 링크 (`.webp` 포맷 가능)
- 공식 뮤지컬 홈페이지 이미지 URL
- 퍼블릭 도메인 이미지 URL

### 사용 방법
`thumbnail` 필드에 이미지 URL을 그대로 붙여넣으면 됩니다:

```json
"thumbnail": "https://i.namu.wiki/i/wAKNtOl...webp"
```

이미지가 없는 경우 빈 문자열로 두면 자동으로 색상 그라데이션 배경이 표시됩니다:

```json
"thumbnail": ""
```

---

## 참고자료(References) 제공 방식

`references` 필드에 링크 배열을 작성합니다. 참고자료가 없으면 빈 배열로 둡니다.

```json
"references": [
  {"title": "공식 사이트", "url": "https://example.com"},
  {"title": "관련 기사", "url": "https://news.example.com/article"}
]
```

참고자료가 있으면 모달 내 **플레이리스트와 해시태그 사이**에 자동으로 표시됩니다.

---

## 데이터 업데이트 방법

### 방법 1. JSON 직접 편집 (권장)

`data/musicals.json` 파일을 직접 열어 새 항목을 배열에 추가합니다.

- `id`는 기존 최대값 + 1로 지정
- JSON 형식 오류(쉼표 누락 등)에 주의

### 방법 2. CSV로 일괄 추가

```bash
# 기존 데이터에 추가
python data/convert_csv.py new_data.csv

# 전체 교체
python data/convert_csv.py new_data.csv --replace
```

CSV 템플릿: `data/sample_template.csv`

> **참고**: CSV 방식은 `references`와 `curationYear` 필드 지원을 위해 convert_csv.py 업데이트가 필요할 수 있습니다. JSON 직접 편집을 기본으로 권장합니다.

---

## 큐레이션 연도 vs 작품 제작 연도

| 필드 | 의미 | 화면 표시 |
|------|------|-----------|
| `curationYear` | STAGEBILL에 큐레이션된 연도 | 카드 및 모달에 표시 |
| `year` | 뮤지컬 최초 제작(초연) 연도 | 데이터 보관용 (현재 화면 미표시) |

---

## 다국어 지원

현재 **한국어(KO)**, **영어(EN)**, **일본어(JP)** 3개 언어를 지원합니다.
UI 상단 언어 버튼으로 전환하면 홈페이지 전체 텍스트가 해당 언어로 변경됩니다.

> 작품 소개, 수업 아이디어 노트 등 콘텐츠 본문은 입력된 원문 그대로 표시됩니다.
> 추후 다국어 콘텐츠가 필요한 경우 각 언어별 필드(`description_en`, `description_ja` 등)를 추가하는 방식으로 확장할 수 있습니다.
