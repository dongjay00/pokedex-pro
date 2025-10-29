import {
  PokemonClient,
  EvolutionClient,
  Pokemon,
  PokemonSpecies,
  EvolutionChain,
} from "pokenode-ts";

// 싱글톤 패턴으로 클라이언트 생성
class PokeAPI {
  private static instance: PokeAPI;
  private client: PokemonClient;
  private evolutionClient: EvolutionClient;

  private constructor() {
    this.client = new PokemonClient();
    this.evolutionClient = new EvolutionClient();
  }

  public static getInstance(): PokeAPI {
    if (!PokeAPI.instance) {
      PokeAPI.instance = new PokeAPI();
    }
    return PokeAPI.instance;
  }

  // 포켓몬 목록 가져오기 (페이지네이션)
  async getPokemonList(offset: number = 0, limit: number = 20) {
    return await this.client.listPokemons(offset, limit);
  }

  // 특정 포켓몬 상세 정보
  async getPokemonById(id: number) {
    return await this.client.getPokemonById(id);
  }

  async getPokemonByName(name: string) {
    return await this.client.getPokemonByName(name);
  }

  // 포켓몬 종 정보 (설명, 진화 등)
  async getPokemonSpecies(id: number) {
    return await this.client.getPokemonSpeciesById(id);
  }

  // 진화 체인
  async getEvolutionChain(id: number) {
    return await this.evolutionClient.getEvolutionChainById(id);
  }

  // 타입별 포켓몬
  async getPokemonByType(type: string) {
    return await this.client.getTypeByName(type);
  }

  // 능력치
  async getAbility(name: string) {
    return await this.client.getAbilityByName(name);
  }
}

export const pokeAPI = PokeAPI.getInstance();

// React Query 키 팩토리
export const pokemonKeys = {
  all: ["pokemon"] as const,
  lists: () => [...pokemonKeys.all, "list"] as const,
  list: (offset: number, limit: number) =>
    [...pokemonKeys.lists(), { offset, limit }] as const,
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: number) => [...pokemonKeys.details(), id] as const,
  species: (id: number) => [...pokemonKeys.all, "species", id] as const,
  evolution: (id: number) => [...pokemonKeys.all, "evolution", id] as const,
  types: () => [...pokemonKeys.all, "type"] as const,
  type: (type: string) => [...pokemonKeys.types(), type] as const,
};
