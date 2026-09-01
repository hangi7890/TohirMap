<div align="center">

# 🇺🇿 TohirMap

### 지도로 탐색하는 우즈베키스탄 여행·문화 아카이브

React와 Leaflet으로 제작한 JavaScript 수업 팀 프로젝트입니다.  
우즈베키스탄의 여행지, 음식, 문화와 현지 인터뷰를 하나의 인터랙티브 웹 경험으로 연결합니다.

[🌐 Live Demo](https://hangi7890.github.io/TohirMap/) · [📦 Repository](https://github.com/hangi7890/TohirMap)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github)

</div>

> **한눈에 보기**  
> TohirMap은 단순한 관광 정보 목록이 아니라, 여행지·음식·문화·인터뷰 데이터를 지도 탐색 흐름으로 연결한 우즈베키스탄 소개 웹사이트입니다.

## 📌 목차

- [프로젝트 소개](#-프로젝트-소개)
- [핵심 기능](#-핵심-기능)
- [사용 흐름](#-사용-흐름)
- [기술 스택](#-기술-스택)
- [구조와 설계](#-구조와-설계)
- [시작하기](#-시작하기)
- [배포](#-배포)
- [콘텐츠와 외부 서비스](#-콘텐츠와-외부-서비스)
- [프로젝트에서 다룬 과제](#-프로젝트에서-다룬-과제)
- [현재 한계](#-현재-한계)
- [향후 개선 방향](#-향후-개선-방향)

## 🧭 프로젝트 소개

우즈베키스탄을 처음 접하는 사용자가 지역과 문화를 흩어진 정보로 읽지 않고, 한 사이트 안에서 자연스럽게 탐색하도록 만드는 것을 목표로 했습니다.

| 항목 | 내용 |
|---|---|
| 프로젝트 유형 | JavaScript 수업 팀 프로젝트 |
| 주제 | 우즈베키스탄 여행·지도·음식·문화·현지 인터뷰 |
| 핵심 경험 | 콘텐츠를 읽다가 관련 위치와 음식 지도로 바로 이동 |
| 공개 방식 | GitHub Pages 자동 배포 |
| 지원 언어 | 한국어 중심, 일부 영문 지명 병기 |

## ✨ 핵심 기능

### 1. 여행지 아카이브

- 사마르칸트, 타슈켄트, 히바 등 대표 여행지를 카드형 콘텐츠로 소개합니다.
- 도시의 특징과 여행 맥락을 이미지와 함께 확인할 수 있습니다.
- 여행지에서 관련 지도 위치로 이어지는 탐색 흐름을 제공합니다.

### 2. 인터랙티브 지도와 AI 여행 도우미

- Leaflet과 OpenStreetMap으로 우즈베키스탄 주요 지점을 표현합니다.
- `heritage`, `city`, `nature` 분류로 7개 대표 지점을 필터링합니다.
- 메인 지도와 음식 지도를 전환할 수 있습니다.
- 추천 경로, 방문 포인트와 여행 팁을 함께 제공합니다.
- 지도 화면에서는 별도의 Chatling 챗봇을 불러와 질문 기반 탐색을 보조합니다.

> Leaflet은 지도 시각화와 상호작용을 담당하고, AI 대화 기능은 외부 Chatling 서비스가 담당합니다.

### 3. 전통 음식 탐색

- 플로브, 샤실릭, 논, 만티 등 12개 전통 음식을 분류별로 탐색합니다.
- 음식 설명과 이미지를 제공하고 관련 맛집 지도 화면으로 연결합니다.

### 4. 문화 스토리

- 나브루즈, 전통 의상, 음악, 춤과 역사 유산을 슬라이드형 콘텐츠로 소개합니다.
- 추천 지역, 체험 포인트와 여행 팁을 함께 보여 줍니다.

### 5. 현지인 인터뷰

- 우즈베키스탄의 여행, 음식, 역사와 생활 문화를 다루는 25개 문답을 제공합니다.
- 질문 목록과 대화형 카드 UI를 결합해 긴 콘텐츠도 단계적으로 읽을 수 있습니다.

## 🔄 사용 흐름

```text
여행지·음식·문화 콘텐츠 탐색
          ↓
관심 있는 장소 또는 음식 선택
          ↓
메인 지도 / 음식 지도에서 위치 확인
          ↓
추천 경로·여행 팁·외부 챗봇으로 탐색 확장
```

최근에 선택한 화면과 지도 위치 상태는 브라우저 `localStorage`에 저장되어, 새로고침 후에도 탐색 맥락을 이어 갑니다.

## 🛠 기술 스택

| 영역 | 기술 | 사용 목적 |
|---|---|---|
| UI | React 19 | 페이지와 컴포넌트 기반 화면 구성 |
| Build | Vite 8 | 개발 서버와 프로덕션 빌드 |
| Map | Leaflet 1.9, OpenStreetMap | 마커, 확대·축소와 지도 시각화 |
| State | React Hooks, localStorage | 화면 이동과 지도 위치 상태 유지 |
| Styling | CSS | 반응형 레이아웃과 페이지별 시각 설계 |
| Quality | ESLint | 소스 코드 정적 검사 |
| Deployment | GitHub Actions, GitHub Pages | `main` 브랜치 기반 자동 빌드와 배포 |
| External | Chatling embed | 지도 화면의 챗봇 경험 |

## 🧱 구조와 설계

```text
TohirMap/
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 자동 배포
├── public/
│   ├── images/             # 여행·음식·문화 콘텐츠 이미지
│   ├── tohirmap.ico
│   └── tohirmap.png
├── src/
│   ├── components/         # 내비게이션과 공통 UI
│   ├── pages/              # Travel, Map, Food, Culture, Interview
│   ├── utils/              # 자산 경로와 챗봇 생명주기 관리
│   ├── App.jsx             # 화면 이동과 지도 위치 상태 조정
│   ├── data.js             # 여행·문화·인터뷰 데이터
│   ├── foodmapdata.js      # 음식·맛집 지도 데이터
│   └── mapdata.js          # 대표 여행지 지도 데이터
├── package.json
└── vite.config.js
```

### 설계 포인트

- **페이지 간 연결**: 음식과 여행 콘텐츠에서 지도 위치 정보를 전달합니다.
- **새로고침 복원**: 탐색 상태를 `localStorage`에 저장합니다.
- **배포 경로 대응**: Vite `base`를 `/TohirMap/`으로 설정해 GitHub Pages 하위 경로에서 자산을 불러옵니다.
- **외부 스크립트 관리**: 지도 화면을 벗어날 때 Chatling 스크립트와 iframe을 정리합니다.
- **데이터 분리**: 화면 컴포넌트와 여행·음식·지도 데이터를 별도 모듈로 관리합니다.

## 🚀 시작하기

### 요구 환경

- Node.js 22 권장
- npm

### 설치 및 개발 서버

```bash
git clone https://github.com/hangi7890/TohirMap.git
cd TohirMap
npm ci
npm run dev
```

### 품질 확인과 프로덕션 빌드

```bash
npm run lint
npm run build
npm run preview
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run build` | 프로덕션 번들 생성 |
| `npm run preview` | 프로덕션 빌드 로컬 미리보기 |

## 🚢 배포

`main` 브랜치에 push하면 GitHub Actions가 다음 순서로 배포합니다.

1. Node.js 22 환경 준비
2. `npm ci`로 의존성 설치
3. `npm run build` 실행
4. `dist` artifact 업로드
5. GitHub Pages 배포

배포 주소: **https://hangi7890.github.io/TohirMap/**

## 🗂 콘텐츠와 외부 서비스

- 지도 타일과 기본 지도 데이터는 OpenStreetMap attribution을 따릅니다.
- Leaflet은 인터랙티브 지도 표현에 사용합니다.
- 지도 화면의 챗봇은 외부 Chatling 스크립트에 의존합니다.
- 일부 여행·음식·문화 이미지와 음식점 메뉴 이미지는 코드와 별도로 이용 권한과 출처 확인이 필요합니다.
- 현지인 인터뷰 사진과 답변은 공개 동의 범위를 확인한 후 재사용해야 합니다.

> 현재 저장소에는 별도의 루트 `LICENSE` 파일이 없습니다. 코드 재사용 조건과 제3자 콘텐츠 이용 조건은 분리해 정리할 예정입니다.

## 💡 프로젝트에서 다룬 과제

- 여러 주제의 콘텐츠를 단순한 페이지 모음이 아닌 하나의 탐색 흐름으로 연결하기
- Leaflet 마커와 별도 정보 패널의 선택 상태 동기화
- 음식 또는 여행지 선택을 지도 위치 상태로 전달하기
- GitHub Pages의 저장소 하위 경로에서 자산 경로를 안정적으로 처리하기
- 외부 챗봇의 생명주기가 다른 화면에 영향을 주지 않도록 정리하기
- 데스크톱과 모바일에서 긴 콘텐츠와 지도를 함께 탐색할 수 있도록 구성하기

## ⚠️ 현재 한계

- 자동화된 테스트와 접근성 검증 결과가 아직 없습니다.
- 챗봇 기능은 외부 Chatling 서비스의 가용성에 영향을 받습니다.
- 이미지와 음식점 메뉴 자료의 출처·이용 조건을 전체적으로 정리해야 합니다.
- 인터뷰 사진과 답변의 공개·재사용 동의 범위를 문서화해야 합니다.
- 팀 구성원별 역할과 기여 범위가 저장소 문서에 정리되어 있지 않습니다.
- 코드와 콘텐츠에 적용할 라이선스가 아직 명시되지 않았습니다.

## 🧩 향후 개선 방향

- 이미지 용량 최적화와 출처·라이선스 메타데이터 정리
- 실제 사용자 기반 접근성 및 모바일 사용성 점검
- 핵심 화면 이동과 지도 상호작용을 위한 smoke test 추가
- 콘텐츠 데이터 스키마 정규화와 validation
- 외부 챗봇 장애 시 fallback 안내 추가
- 팀 구성원별 역할과 제작 과정 문서화

---

<div align="center">

**TohirMap — Explore Uzbekistan through places, food, culture and local voices.**

</div>

