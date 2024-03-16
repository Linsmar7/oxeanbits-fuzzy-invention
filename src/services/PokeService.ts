export interface Pokemon {
  name: string;
  url: string;
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
 * @param pageParam The offset for the request.
 * @returns Pokemons response
 */
export const getAllPokemons = async ({ pageParam = 'https://pokeapi.co/api/v2/pokemon?limit=50' }) => {
  const res = await fetch(pageParam)
  return res.json()
}
