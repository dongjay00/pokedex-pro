"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import { getPokemonImageUrl } from "@/lib/utils";
import { EvolutionChain as EvolutionChainType } from "pokenode-ts";

interface EvolutionChainProps {
  evolutionChainId: number;
}

interface EvolutionData {
  id: number;
  name: string;
  minLevel?: number;
  trigger?: string;
  item?: string;
}

export function EvolutionChain({ evolutionChainId }: EvolutionChainProps) {
  const { data: evolutionChain, isLoading } = useQuery({
    queryKey: pokemonKeys.evolution(evolutionChainId),
    queryFn: () => pokeAPI.getEvolutionChain(evolutionChainId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!evolutionChain) return null;

  // 진화 체인 파싱
  const parseEvolutionChain = (): EvolutionData[][] => {
    const stages: EvolutionData[][] = [];
    const currentStage: EvolutionData[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (node: any, level: number = 0) => {
      if (!stages[level]) stages[level] = [];

      const id = parseInt(node.species.url.split("/").slice(-2, -1)[0]);
      const evolutionDetails = node.evolution_details[0];

      stages[level].push({
        id,
        name: node.species.name,
        minLevel: evolutionDetails?.min_level,
        trigger: evolutionDetails?.trigger?.name,
        item: evolutionDetails?.item?.name,
      });

      if (node.evolves_to.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.evolves_to.forEach((evolution: any) =>
          traverse(evolution, level + 1)
        );
      }
    };

    traverse(evolutionChain.chain);
    return stages;
  };

  const stages = parseEvolutionChain();

  if (stages.length <= 1) {
    return (
      <div className="text-center py-8 text-gray-500">
        진화 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">진화 체인</h2>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        {stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="flex items-center gap-4">
            {/* 진화 단계 */}
            <div className="flex flex-col gap-4">
              {stage.map((pokemon) => (
                <Link
                  key={pokemon.id}
                  href={`/pokemon/${pokemon.id}`}
                  className="group"
                >
                  <div
                    className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 
                                hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* 포켓몬 이미지 */}
                    <div className="w-32 h-32 relative mb-3">
                      <img
                        src={getPokemonImageUrl(pokemon.id)}
                        alt={pokemon.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* 포켓몬 이름 */}
                    <p className="text-center font-semibold text-gray-800 capitalize">
                      {pokemon.name}
                    </p>

                    {/* ID */}
                    <p className="text-center text-sm text-gray-500">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* 화살표 */}
            {stageIndex < stages.length - 1 && (
              <div className="flex flex-col items-center gap-2">
                <ChevronRight className="w-8 h-8 text-purple-600" />
                {stage[0].minLevel && (
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Lv. {stage[0].minLevel}
                  </div>
                )}
                {stage[0].item && (
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {stage[0].item.replace("-", " ")}
                  </div>
                )}
                {stage[0].trigger && stage[0].trigger !== "level-up" && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {stage[0].trigger.replace("-", " ")}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
