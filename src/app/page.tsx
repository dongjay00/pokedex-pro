"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Search, Loader2, Heart, Users, Brain, Trophy } from "lucide-react";
import { PokemonCard } from "@/components/PokemonCard";
import { FilterBar, GENERATIONS } from "@/components/FilterBar";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { Pokemon } from "pokenode-ts";
import Image from "next/image";
import { PokemonCompare } from "@/components/PokemonCompare";
import { PokemonQuiz } from "@/components/PokemonQuiz";
import { TeamBuilder } from "@/components/TeamBuilder";

type Tab = "all" | "favorites" | "compare" | "quiz" | "team";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(
    null
  );
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { ref, inView } = useInView();
  const { favorites } = useFavoriteStore();

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

  useEffect(() => {
    if (data) {
      const pokemon = data.pages.flatMap((page) => page.pokemon);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllPokemon(pokemon);
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && activeTab === "all") {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, activeTab]);

  // 필터링
  let filteredPokemon = allPokemon.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      !selectedType || pokemon.types.some((t) => t.type.name === selectedType);

    let matchesGeneration = true;
    if (selectedGeneration) {
      const gen = GENERATIONS.find((g) => g.id === selectedGeneration);
      if (gen) {
        matchesGeneration =
          pokemon.id >= gen.range[0] && pokemon.id <= gen.range[1];
      }
    }

    return matchesSearch && matchesType && matchesGeneration;
  });

  // 즐겨찾기 탭
  if (activeTab === "favorites") {
    filteredPokemon = allPokemon.filter((p) => favorites.includes(p.id));
  }

  const tabs = [
    { id: "all" as Tab, label: "전체", icon: Search },
    { id: "favorites" as Tab, label: "즐겨찾기", icon: Heart },
    { id: "compare" as Tab, label: "비교", icon: Users },
    { id: "quiz" as Tab, label: "퀴즈", icon: Brain },
    { id: "team" as Tab, label: "팀 빌더", icon: Trophy },
  ];

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

          {/* 탭 */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                    ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 검색 바 - 전체/즐겨찾기 탭에만 표시 */}
          {(activeTab === "all" || activeTab === "favorites") && (
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
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "all" && (
          <>
            <FilterBar
              selectedType={selectedType}
              selectedGeneration={selectedGeneration}
              onTypeChange={setSelectedType}
              onGenerationChange={setSelectedGeneration}
            />

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

                {hasNextPage && (
                  <div ref={ref} className="flex justify-center py-8">
                    {isFetchingNextPage && (
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    )}
                  </div>
                )}

                {filteredPokemon.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">
                      검색 결과가 없습니다.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "favorites" && (
          <>
            {filteredPokemon.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg mb-2">
                  즐겨찾기한 포켓몬이 없습니다
                </p>
                <p className="text-gray-400 text-sm">
                  포켓몬 카드의 하트 아이콘을 클릭해보세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "compare" && <PokemonCompare />}

        {activeTab === "quiz" && <PokemonQuiz />}

        {activeTab === "team" && <TeamBuilder />}
      </main>
    </div>
  );
}
