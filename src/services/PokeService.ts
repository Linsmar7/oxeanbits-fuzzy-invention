export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  }
}

// Types only what is being used.
interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: Type[];
  sprites: Record<string, string>;
}

export interface PokemonsResponse {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}

/**
 * Requests all pokemons.
 *
 * @param pageParam The url fo the request.
 * @returns The list with all pokemons.
 */
export const getAllPokemons = async ({ pageParam = 'https://pokeapi.co/api/v2/pokemon?limit=50' }) => {
  const res = await fetch(pageParam);
  const {results, next, previous, count} = await res.json();

  const detailedPokemons = await Promise.all(
    results.map(async (pokemon: Pokemon) => getPokemonDetails(pokemon.url)),
  )

  return { results: detailedPokemons, next, previous, count };
}

/**
 * Requests pokemon details.
 *
 * @param url The pokemon link for request.
 * @returns Object with every detail from the pokemon.
 */
export const getPokemonDetails = async (url: string) => {
  const res = await fetch(url);
  return res.json();
}
