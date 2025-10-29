"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Ruler, Weight, Zap } from "lucide-react";
import { TypeBadge } from "@/components/TypeBadge";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import {
  formatPokemonId,
  getPokemonImageUrl,
  typeGradients,
  statNames,
  statColors,
} from "@/lib/utils";
import { useFavoriteStore } from "@/store/useFavoriteStore";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorite = isFavorite(id);

  // 포켓몬 기본 정보
  const { data: pokemon, isLoading } = useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => pokeAPI.getPokemonById(id),
    enabled: !!id,
  });

  // 포켓몬 종 정보 (설명 등)
  const { data: species } = useQuery({
    queryKey: pokemonKeys.species(id),
    queryFn: () => pokeAPI.getPokemonSpecies(id),
    enabled: !!id,
  });

  if (isLoading || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const mainType = pokemon.types[0]?.type.name || "normal";
  const gradient = typeGradients[mainType];

  // 한국어 설명 찾기
  const koreanEntry = species?.flavor_text_entries.find(
    (entry) => entry.language.name === "ko"
  );
  const description =
    koreanEntry?.flavor_text.replace(/\f/g, " ") ||
    species?.flavor_text_entries[0]?.flavor_text.replace(/\f/g, " ") ||
    "설명이 없습니다.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div
        className={`bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </button>

            <button
              onClick={() => toggleFavorite(id)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorite ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* 포켓몬 이미지 */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl" />
              <img
                src={getPokemonImageUrl(id)}
                alt={pokemon.name}
                className="relative w-full max-w-md mx-auto drop-shadow-2xl animate-bounce-slow"
              />
            </div>

            {/* 기본 정보 */}
            <div className="space-y-6">
              <div>
                <p className="text-white/80 text-lg font-semibold">
                  {formatPokemonId(id)}
                </p>
                <h1 className="text-5xl font-bold capitalize mt-2">
                  {pokemon.name}
                </h1>
              </div>

              <div className="flex gap-3 flex-wrap">
                {pokemon.types.map((type) => (
                  <TypeBadge
                    key={type.type.name}
                    type={type.type.name}
                    size="lg"
                  />
                ))}
              </div>

              <p className="text-white/90 text-lg leading-relaxed bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                {description}
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Ruler className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {pokemon.height / 10}m
                  </div>
                  <div className="text-sm text-white/80">Height</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Weight className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {pokemon.weight / 10}kg
                  </div>
                  <div className="text-sm text-white/80">Weight</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {pokemon.base_experience}
                  </div>
                  <div className="text-sm text-white/80">Base EXP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 능력치 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">능력치</h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => {
                const statName = stat.stat.name;
                const percentage = (stat.base_stat / 255) * 100;
                const color = statColors[statName] || "bg-gray-500";

                return (
                  <div key={statName}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {statNames[statName] || statName}
                      </span>
                      <span className="font-bold text-gray-900">
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 총 능력치 */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-purple-600">
                  {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* 특성 & 기술 */}
          <div className="space-y-6">
            {/* 특성 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">특성</h2>
              <div className="space-y-2">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="capitalize font-medium text-gray-700">
                      {ability.ability.name.replace("-", " ")}
                    </span>
                    {ability.is_hidden && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 주요 기술 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                주요 기술
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {pokemon.moves.slice(0, 8).map((move) => (
                  <div
                    key={move.move.name}
                    className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg text-center"
                  >
                    <span className="text-sm capitalize font-medium text-gray-700">
                      {move.move.name.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
