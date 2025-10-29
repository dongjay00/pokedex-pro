"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { TypeBadge } from "./TypeBadge";
import {
  formatPokemonId,
  getPokemonImageUrl,
  typeGradients,
} from "@/lib/utils";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { Pokemon } from "pokenode-ts";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorite = isFavorite(pokemon.id);

  const mainType = pokemon.types[0]?.type.name || "normal";
  const gradient = typeGradients[mainType] || typeGradients.normal;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div
        className={`
        group relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradient}
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-2
        cursor-pointer
      `}
      >
        {/* 즐겨찾기 버튼 */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm
                     hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* 포켓몬 ID */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-white/90 font-bold text-sm bg-black/20 px-2 py-1 rounded-full">
            {formatPokemonId(pokemon.id)}
          </span>
        </div>

        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
        </div>

        {/* 포켓몬 이미지 */}
        <div className="relative pt-8 pb-4 px-4">
          <div className="relative w-full aspect-square flex items-center justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <img
              src={getPokemonImageUrl(pokemon.id)}
              alt={pokemon.name}
              className={`
                w-full h-full object-contain
                transition-all duration-300
                group-hover:scale-110
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* 포켓몬 정보 */}
        <div className="bg-white p-4 space-y-3">
          <h3 className="text-xl font-bold text-gray-800 capitalize text-center">
            {pokemon.name}
          </h3>

          <div className="flex gap-2 justify-center flex-wrap">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.type.name} type={type.type.name} size="sm" />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 pt-2 border-t">
            <div>
              <div className="font-semibold text-gray-800">
                {pokemon.height / 10}m
              </div>
              <div>Height</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {pokemon.weight / 10}kg
              </div>
              <div>Weight</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {pokemon.base_experience}
              </div>
              <div>EXP</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
