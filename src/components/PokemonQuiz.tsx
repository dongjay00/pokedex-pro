"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Check, X, Trophy, Target } from "lucide-react";
import { pokeAPI, pokemonKeys } from "@/lib/api";
import { getPokemonImageUrl } from "@/lib/utils";

type QuizMode = "silhouette" | "type" | "stats";

interface QuizState {
  pokemonId: number;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  score: number;
  totalQuestions: number;
  showResult: boolean;
}

export function PokemonQuiz() {
  const [mode, setMode] = useState<QuizMode>("silhouette");
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const { data: pokemon } = useQuery({
    queryKey: pokemonKeys.detail(quiz?.pokemonId || 1),
    queryFn: () => pokeAPI.getPokemonById(quiz?.pokemonId || 1),
    enabled: !!quiz?.pokemonId,
  });

  const generateQuiz = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1; // 1세대만
    const correct = await pokeAPI.getPokemonById(randomId);

    // 오답 생성
    const wrongIds = new Set<number>();
    while (wrongIds.size < 3) {
      const id = Math.floor(Math.random() * 151) + 1;
      if (id !== randomId) wrongIds.add(id);
    }

    const wrongPokemons = await Promise.all(
      Array.from(wrongIds).map((id) => pokeAPI.getPokemonById(id))
    );

    const allOptions = [correct, ...wrongPokemons]
      .map((p) => p.name)
      .sort(() => Math.random() - 0.5);

    setQuiz({
      pokemonId: randomId,
      options: allOptions,
      correctAnswer: correct.name,
      selectedAnswer: null,
      score: quiz?.score || 0,
      totalQuestions: (quiz?.totalQuestions || 0) + 1,
      showResult: false,
    });
    setIsRevealed(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateQuiz();
  }, []);

  const handleAnswer = (answer: string) => {
    if (!quiz || quiz.selectedAnswer) return;

    const isCorrect = answer === quiz.correctAnswer;
    setQuiz({
      ...quiz,
      selectedAnswer: answer,
      score: isCorrect ? quiz.score + 1 : quiz.score,
      showResult: true,
    });

    if (mode === "silhouette") {
      setIsRevealed(true);
    }
  };

  const nextQuestion = () => {
    generateQuiz();
  };

  if (!quiz || !pokemon) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">포켓몬 퀴즈</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-purple-700">
              {quiz.score} / {quiz.totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* 퀴즈 모드 선택 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setMode("silhouette")}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${
              mode === "silhouette"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          실루엣 맞추기
        </button>
        <button
          onClick={() => setMode("type")}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${
              mode === "type"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          타입 맞추기
        </button>
        <button
          onClick={() => setMode("stats")}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${
              mode === "stats"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          능력치 맞추기
        </button>
      </div>

      {/* 퀴즈 카드 */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* 이미지/힌트 영역 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
          {mode === "silhouette" && (
            <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center">
              <img
                src={getPokemonImageUrl(quiz.pokemonId)}
                alt="Pokemon"
                className={`
                  w-full h-full object-contain transition-all duration-500
                  ${!isRevealed ? "brightness-0" : ""}
                `}
                style={{
                  filter: !isRevealed
                    ? "drop-shadow(0 0 20px rgba(0,0,0,0.5))"
                    : "none",
                }}
              />
              {!isRevealed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-gray-600">
                    이 포켓몬은 누구?
                  </p>
                </div>
              )}
            </div>
          )}

          {mode === "type" && (
            <div className="text-center">
              <img
                src={getPokemonImageUrl(quiz.pokemonId)}
                alt="Pokemon"
                className="w-64 h-64 mx-auto object-contain mb-4"
              />
              <p className="text-xl font-bold text-gray-700">
                이 포켓몬의 이름은?
              </p>
            </div>
          )}

          {mode === "stats" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-xl font-bold text-gray-700">
                  능력치로 맞춰보세요!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">HP</div>
                  <div className="text-2xl font-bold text-green-600">
                    {pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Attack</div>
                  <div className="text-2xl font-bold text-red-600">
                    {
                      pokemon.stats.find((s) => s.stat.name === "attack")
                        ?.base_stat
                    }
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Defense</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      pokemon.stats.find((s) => s.stat.name === "defense")
                        ?.base_stat
                    }
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Speed</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      pokemon.stats.find((s) => s.stat.name === "speed")
                        ?.base_stat
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 선택지 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quiz.options.map((option) => {
            const isSelected = quiz.selectedAnswer === option;
            const isCorrect = option === quiz.correctAnswer;
            const showCorrect = quiz.showResult && isCorrect;
            const showWrong = quiz.showResult && isSelected && !isCorrect;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!quiz.selectedAnswer}
                className={`
                  p-4 rounded-xl font-semibold text-lg capitalize transition-all
                  ${!quiz.selectedAnswer && "hover:scale-105 hover:shadow-lg"}
                  ${showCorrect && "bg-green-500 text-white"}
                  ${showWrong && "bg-red-500 text-white"}
                  ${
                    !quiz.showResult &&
                    "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }
                  ${
                    quiz.showResult &&
                    !showCorrect &&
                    !showWrong &&
                    "bg-gray-100 text-gray-400"
                  }
                  disabled:cursor-not-allowed
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  {showCorrect && <Check className="w-5 h-5" />}
                  {showWrong && <X className="w-5 h-5" />}
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        {/* 결과 */}
        {quiz.showResult && (
          <div
            className={`
            p-4 rounded-xl text-center font-bold text-lg
            ${
              quiz.selectedAnswer === quiz.correctAnswer
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
          >
            {quiz.selectedAnswer === quiz.correctAnswer
              ? "정답입니다! 🎉"
              : `틀렸습니다! 정답은 ${quiz.correctAnswer}입니다.`}
          </div>
        )}

        {/* 다음 문제 버튼 */}
        {quiz.showResult && (
          <button
            onClick={nextQuestion}
            className="w-full mt-4 py-3 bg-purple-600 text-white rounded-xl font-bold
                     hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            다음 문제
          </button>
        )}
      </div>

      {/* 통계 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">정답률</div>
            <div className="text-3xl font-bold">
              {quiz.totalQuestions > 0
                ? Math.round((quiz.score / quiz.totalQuestions) * 100)
                : 0}
              %
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">맞춘 문제</div>
              <div className="text-2xl font-bold">{quiz.score}개</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
