"use client";

import { Filter, X } from "lucide-react";
import { TypeBadge } from "./TypeBadge";

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const GENERATIONS = [
  { id: 1, name: "1세대", range: [1, 151] },
  { id: 2, name: "2세대", range: [152, 251] },
  { id: 3, name: "3세대", range: [252, 386] },
  { id: 4, name: "4세대", range: [387, 493] },
  { id: 5, name: "5세대", range: [494, 649] },
  { id: 6, name: "6세대", range: [650, 721] },
  { id: 7, name: "7세대", range: [722, 809] },
  { id: 8, name: "8세대", range: [810, 905] },
  { id: 9, name: "9세대", range: [906, 1025] },
];

interface FilterBarProps {
  selectedType: string | null;
  selectedGeneration: number | null;
  onTypeChange: (type: string | null) => void;
  onGenerationChange: (gen: number | null) => void;
}

export function FilterBar({
  selectedType,
  selectedGeneration,
  onTypeChange,
  onGenerationChange,
}: FilterBarProps) {
  const hasActiveFilters = selectedType || selectedGeneration;

  const clearFilters = () => {
    onTypeChange(null);
    onGenerationChange(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg text-gray-800">필터</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>초기화</span>
          </button>
        )}
      </div>

      {/* 세대 필터 */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">세대</h4>
        <div className="flex flex-wrap gap-2">
          {GENERATIONS.map((gen) => (
            <button
              key={gen.id}
              onClick={() =>
                onGenerationChange(
                  selectedGeneration === gen.id ? null : gen.id
                )
              }
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${
                  selectedGeneration === gen.id
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {gen.name}
            </button>
          ))}
        </div>
      </div>

      {/* 타입 필터 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">타입</h4>
        <div className="flex flex-wrap gap-2">
          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(selectedType === type ? null : type)}
              className={`
                transition-all transform
                ${
                  selectedType === type
                    ? "scale-110 ring-2 ring-purple-600 ring-offset-2"
                    : "hover:scale-105"
                }
              `}
            >
              <TypeBadge type={type} size="md" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GENERATIONS };
