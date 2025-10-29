"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { X, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import {
  getPokemonImageUrl,
  formatPokemonId,
  statNames,
  typeColors,
} from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";
import { Pokemon } from "pokenode-ts";

interface PokemonCompareProps {
  initialPokemonIds?: number[];
}

export function PokemonCompare({
  initialPokemonIds = [],
}: PokemonCompareProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialPokemonIds);
  const [inputId, setInputId] = useState("");

  const pokemonQueries = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: pokemonKeys.detail(id),
      queryFn: () => pokeAPI.getPokemonById(id),
      enabled: !!id,
    })),
  });

  const pokemons = pokemonQueries
    .map((q) => q.data)
    .filter((p): p is Pokemon => p !== undefined);

  const addPokemon = () => {
    const id = parseInt(inputId);
    if (
      id &&
      id > 0 &&
      id <= 1025 &&
      !selectedIds.includes(id) &&
      selectedIds.length < 4
    ) {
      setSelectedIds([...selectedIds, id]);
      setInputId("");
    }
  };

  const removePokemon = (id: number) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const getStatComparison = (stat: string) => {
    if (pokemons.length < 2) return null;

    const values = pokemons.map((p) => {
      const statData = p.stats.find((s) => s.stat.name === stat);
      return statData?.base_stat || 0;
    });

    const max = Math.max(...values);
    const min = Math.min(...values);

    return { max, min, values };
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">포켓몬 비교</h2>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="포켓몬 ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addPokemon()}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none w-32"
            min="1"
            max="1025"
          />
          <button
            onClick={addPokemon}
            disabled={selectedIds.length >= 4}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>
      </div>

      {selectedIds.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg mb-2">
            비교할 포켓몬을 추가해주세요
          </p>
          <p className="text-gray-400 text-sm">
            최대 4마리까지 비교 가능합니다
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* 포켓몬 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden relative"
              >
                <button
                  onClick={() => removePokemon(pokemon.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full 
                           hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6">
                  <img
                    src={getPokemonImageUrl(pokemon.id)}
                    alt={pokemon.name}
                    className="w-full h-32 object-contain"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {formatPokemonId(pokemon.id)}
                  </p>
                  <h3 className="text-lg font-bold capitalize mb-2">
                    {pokemon.name}
                  </h3>
                  <div className="flex gap-1 flex-wrap">
                    {pokemon.types.map((t) => (
                      <TypeBadge
                        key={t.type.name}
                        type={t.type.name}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 능력치 비교 */}
          {pokemons.length >= 2 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                능력치 비교
              </h3>
              <div className="space-y-4">
                {[
                  "hp",
                  "attack",
                  "defense",
                  "special-attack",
                  "special-defense",
                  "speed",
                ].map((statName) => {
                  const comparison = getStatComparison(statName);
                  if (!comparison) return null;

                  return (
                    <div key={statName}>
                      <div className="font-semibold text-gray-700 mb-2">
                        {statNames[statName] || statName}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {pokemons.map((pokemon, idx) => {
                          const stat = pokemon.stats.find(
                            (s) => s.stat.name === statName
                          );
                          const value = stat?.base_stat || 0;
                          const isMax =
                            value === comparison.max &&
                            comparison.max !== comparison.min;
                          const isMin =
                            value === comparison.min &&
                            comparison.max !== comparison.min;

                          return (
                            <div
                              key={pokemon.id}
                              className={`
                                flex items-center justify-between p-3 rounded-lg
                                ${
                                  isMax
                                    ? "bg-green-100 border-2 border-green-500"
                                    : isMin
                                    ? "bg-red-100 border-2 border-red-500"
                                    : "bg-gray-50"
                                }
                              `}
                            >
                              <span className="font-bold text-gray-900">
                                {value}
                              </span>
                              {isMax && (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              )}
                              {isMin && (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                              {!isMax && !isMin && (
                                <Minus className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* 총 능력치 */}
                <div className="pt-4 border-t">
                  <div className="font-bold text-gray-800 mb-2">총 능력치</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {pokemons.map((pokemon) => {
                      const total = pokemon.stats.reduce(
                        (sum, s) => sum + s.base_stat,
                        0
                      );
                      const maxTotal = Math.max(
                        ...pokemons.map((p) =>
                          p.stats.reduce((sum, s) => sum + s.base_stat, 0)
                        )
                      );
                      const isMax = total === maxTotal;

                      return (
                        <div
                          key={pokemon.id}
                          className={`
                            p-3 rounded-lg text-center font-bold text-lg
                            ${
                              isMax
                                ? "bg-purple-100 border-2 border-purple-500 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          {total}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
