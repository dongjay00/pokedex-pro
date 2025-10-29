"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Search, Loader2 } from "lucide-react";
import { PokemonCard } from "@/components/PokemonCard";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import { Pokemon } from "pokenode-ts";
import Image from "next/image";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const { ref, inView } = useInView();

  // 무한 스크롤 쿼리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: pokemonKeys.lists(),
      queryFn: async ({ pageParam = 0 }) => {
        const response = await pokeAPI.getPokemonList(pageParam, 20);
        const pokemonDetails = await Promise.all(
          response.results.map(async (p) => {
            const id = parseInt(p.url.split("/").slice(-2, -1)[0]);
            return await pokeAPI.getPokemonById(id);
          })
        );
        return { pokemon: pokemonDetails, nextOffset: pageParam + 20 };
      },
      getNextPageParam: (lastPage) => lastPage.nextOffset,
      initialPageParam: 0,
    });

  // 모든 포켓몬 데이터 병합
  useEffect(() => {
    if (data) {
      const pokemon = data.pages.flatMap((page) => page.pokemon);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllPokemon(pokemon);
    }
  }, [data]);

  // 스크롤 시 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 검색 필터링
  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={`/pokeball.png`}
                alt="pokeball"
                width={36}
                height={36}
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                PokéDex Pro
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {allPokemon.length} Pokémon
            </div>
          </div>

          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="포켓몬 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 
                       focus:border-purple-500 focus:outline-none transition-colors
                       bg-white shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                )}
              </div>
            )}

            {filteredPokemon.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  &quot;{searchTerm}&quot;에 대한 검색 결과가 없습니다.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
