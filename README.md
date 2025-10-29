# Pokedex Pro

## 📖 프로젝트 소개

Pokedex Pro는 Next.js를 기반으로 구축된 인터랙티브한 포켓몬 도감 애플리케이션입니다. PokeAPI를 사용하여 포켓몬 데이터를 가져오며, 다양한 기능을 통해 사용자에게 풍부한 포켓몬 정보를 제공합니다.

## ✨ 주요 기능

-   **포켓몬 목록**: 무한 스크롤을 통해 모든 포켓몬을 탐색할 수 있습니다.
-   **상세 정보**: 각 포켓몬의 능력치, 기술, 진화 과정 등 상세 정보를 확인할 수 있습니다.
-   **포켓몬 비교**: 두 마리의 포켓몬을 선택하여 능력치를 비교할 수 있습니다.
-   **팀 빌더**: 나만의 포켓몬 팀을 구성하고 관리할 수 있습니다.
-   **포켓몬 퀴즈**: 포켓몬에 대한 지식을 테스트하는 재미있는 퀴즈를 즐길 수 있습니다.
-   **즐겨찾기**: 좋아하는 포켓몬을 즐겨찾기에 추가하고 모아볼 수 있습니다.
-   **검색 및 필터링**: 이름, 타입 등으로 원하는 포켓몬을 쉽게 찾을 수 있습니다.

## 🛠️ 기술 스택

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Data Fetching**: TanStack Query, Axios
-   **API**: [PokéAPI](https://pokeapi.co/) (via `pokenode-ts`)
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Icons**: Lucide React

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.