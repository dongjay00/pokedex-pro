import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 포켓몬 타입별 색상
export const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

// 타입별 그라데이션
export const typeGradients: Record<string, string> = {
  normal: "from-gray-400 to-gray-600",
  fire: "from-red-400 to-orange-600",
  water: "from-blue-400 to-cyan-600",
  electric: "from-yellow-300 to-yellow-600",
  grass: "from-green-400 to-emerald-600",
  ice: "from-cyan-300 to-blue-400",
  fighting: "from-red-600 to-red-800",
  poison: "from-purple-400 to-purple-700",
  ground: "from-yellow-600 to-yellow-800",
  flying: "from-indigo-300 to-indigo-600",
  psychic: "from-pink-400 to-purple-600",
  bug: "from-lime-400 to-green-600",
  rock: "from-yellow-700 to-gray-600",
  ghost: "from-purple-600 to-indigo-900",
  dragon: "from-indigo-500 to-purple-700",
  dark: "from-gray-700 to-black",
  steel: "from-gray-400 to-gray-700",
  fairy: "from-pink-300 to-pink-500",
};

// 포켓몬 ID를 3자리 형식으로 변환 (예: 1 -> #001)
export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, "0")}`;
}

// 스탯 이름 포맷팅
export const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

// 스탯 색상
export const statColors: Record<string, string> = {
  hp: "bg-green-500",
  attack: "bg-red-500",
  defense: "bg-blue-500",
  "special-attack": "bg-purple-500",
  "special-defense": "bg-yellow-500",
  speed: "bg-pink-500",
};

// 포켓몬 이미지 URL 가져오기
export function getPokemonImageUrl(
  id: number,
  variant: "official" | "dream" | "home" = "official"
): string {
  const baseUrl =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

  switch (variant) {
    case "official":
      return `${baseUrl}/other/official-artwork/${id}.png`;
    case "dream":
      return `${baseUrl}/other/dream-world/${id}.svg`;
    case "home":
      return `${baseUrl}/other/home/${id}.png`;
    default:
      return `${baseUrl}/other/official-artwork/${id}.png`;
  }
}

// 한글 번역 (간단한 타입 번역)
export const typeKorean: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
};
