// src/components/TeamBuilder.tsx
"use client";

import { useState, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Plus, X, Save, Share2, Shield, Swords, Sparkles } from "lucide-react";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import { getPokemonImageUrl, formatPokemonId, typeColors } from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";
import { Pokemon } from "pokenode-ts";

interface Team {
  name: string;
  pokemons: number[];
}

const MAX_TEAM_SIZE = 6;

// 타입 상성표 (간단 버전)
const TYPE_EFFECTIVENESS: Record<string, { strong: string[]; weak: string[] }> =
  {
    fire: {
      strong: ["grass", "ice", "bug", "steel"],
      weak: ["water", "ground", "rock"],
    },
    water: { strong: ["fire", "ground", "rock"], weak: ["electric", "grass"] },
    grass: {
      strong: ["water", "ground", "rock"],
      weak: ["fire", "ice", "poison", "flying", "bug"],
    },
    electric: { strong: ["water", "flying"], weak: ["ground"] },
    psychic: { strong: ["fighting", "poison"], weak: ["bug", "ghost", "dark"] },
    fighting: {
      strong: ["normal", "ice", "rock", "dark", "steel"],
      weak: ["flying", "psychic", "fairy"],
    },
    // ... 나머지 타입들
  };

export function TeamBuilder() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team>({
    name: "My Team",
    pokemons: [],
  });
  const [inputId, setInputId] = useState("");
  const [editingName, setEditingName] = useState(false);

  // localStorage에서 팀 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("pokemon-teams");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTeams(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load teams:", e);
      }
    }
  }, []);

  const pokemonQueries = useQueries({
    queries: currentTeam.pokemons.map((id) => ({
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
      !currentTeam.pokemons.includes(id) &&
      currentTeam.pokemons.length < MAX_TEAM_SIZE
    ) {
      setCurrentTeam({
        ...currentTeam,
        pokemons: [...currentTeam.pokemons, id],
      });
      setInputId("");
    }
  };

  const removePokemon = (id: number) => {
    setCurrentTeam({
      ...currentTeam,
      pokemons: currentTeam.pokemons.filter((i) => i !== id),
    });
  };

  const saveTeam = () => {
    if (currentTeam.pokemons.length === 0) return;

    const newTeams = [...teams, currentTeam];
    setTeams(newTeams);
    localStorage.setItem("pokemon-teams", JSON.stringify(newTeams));
    setCurrentTeam({ name: "My Team", pokemons: [] });
    alert("팀이 저장되었습니다!");
  };

  const loadTeam = (team: Team) => {
    setCurrentTeam(team);
  };

  const deleteTeam = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    localStorage.setItem("pokemon-teams", JSON.stringify(newTeams));
  };

  // 팀 분석
  const analyzeTeam = () => {
    if (pokemons.length === 0) return null;

    const typeCount: Record<string, number> = {};
    const typeCoverage = new Set<string>();

    pokemons.forEach((pokemon) => {
      pokemon.types.forEach((t) => {
        const type = t.type.name;
        typeCount[type] = (typeCount[type] || 0) + 1;

        // 해당 타입이 강한 타입들 추가
        if (TYPE_EFFECTIVENESS[type]) {
          TYPE_EFFECTIVENESS[type].strong.forEach((t) => typeCoverage.add(t));
        }
      });
    });

    const totalStats = pokemons.reduce((sum, p) => {
      return sum + p.stats.reduce((s, stat) => s + stat.base_stat, 0);
    }, 0);
    const avgStats = Math.round(totalStats / pokemons.length);

    return { typeCount, typeCoverage: Array.from(typeCoverage), avgStats };
  };

  const analysis = analyzeTeam();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {editingName ? (
            <input
              type="text"
              value={currentTeam.name}
              onChange={(e) =>
                setCurrentTeam({ ...currentTeam, name: e.target.value })
              }
              onBlur={() => setEditingName(false)}
              onKeyPress={(e) => e.key === "Enter" && setEditingName(false)}
              className="text-2xl font-bold border-b-2 border-purple-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <h2
              className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-purple-600"
              onClick={() => setEditingName(true)}
            >
              {currentTeam.name}
            </h2>
          )}
          <span className="text-sm text-gray-500">
            ({currentTeam.pokemons.length}/{MAX_TEAM_SIZE})
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveTeam}
            disabled={currentTeam.pokemons.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>

      {/* 포켓몬 추가 */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="포켓몬 ID (1-1025)"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addPokemon()}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          min="1"
          max="1025"
        />
        <button
          onClick={addPokemon}
          disabled={currentTeam.pokemons.length >= MAX_TEAM_SIZE}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                   flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {/* 현재 팀 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {currentTeam.pokemons.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">팀에 포켓몬을 추가해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pokemons.map((pokemon) => (
              <div key={pokemon.id} className="relative group">
                <button
                  onClick={() => removePokemon(pokemon.id)}
                  className="absolute -top-2 -right-2 z-10 p-1.5 bg-red-500 text-white rounded-full
                           opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>

                <div
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 
                              hover:shadow-lg transition-all"
                >
                  <img
                    src={getPokemonImageUrl(pokemon.id)}
                    alt={pokemon.name}
                    className="w-full h-24 object-contain mb-2"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    {formatPokemonId(pokemon.id)}
                  </p>
                  <p className="text-sm font-bold text-center capitalize truncate">
                    {pokemon.name}
                  </p>
                  <div className="flex gap-1 justify-center mt-2">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`${
                          typeColors[t.type.name]
                        } w-2 h-2 rounded-full`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 팀 분석 */}
      {analysis && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6" />
              <h3 className="font-bold text-lg">타입 분포</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(analysis.typeCount).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Swords className="w-6 h-6" />
              <h3 className="font-bold text-lg">공격 커버리지</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.typeCoverage.slice(0, 10).map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-white/20 rounded-full text-xs capitalize"
                >
                  {type}
                </span>
              ))}
              {analysis.typeCoverage.length > 10 && (
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  +{analysis.typeCoverage.length - 10}
                </span>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3 className="font-bold text-lg">평균 능력치</h3>
            </div>
            <div className="text-4xl font-bold">{analysis.avgStats}</div>
            <div className="text-sm opacity-90 mt-2">팀 전체 평균</div>
          </div>
        </div>
      )}

      {/* 저장된 팀 목록 */}
      {teams.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">저장된 팀</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {teams.map((team, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800">{team.name}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadTeam(team)}
                      className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => deleteTeam(index)}
                      className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {team.pokemons.slice(0, 6).map((id) => (
                    <div
                      key={id}
                      className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={getPokemonImageUrl(id)}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
