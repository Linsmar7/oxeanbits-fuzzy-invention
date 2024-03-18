import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react';
import { PokemonsResponse, getAllPokemons } from '../services/PokeService';
import App from '../App';

jest.mock('../services/PokeService', () => ({
  getAllPokemons: jest.fn(),
}));

describe("App", () => {
  const mockData: PokemonsResponse = {
    count: 10,
    next: '',
    previous: '',
    results: [
      {
        id: 1,
        name: 'bulbasaur',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'grass', url: '' } },
        ],
      },
      {
        id: 2,
        name: 'ivysaur',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'grass', url: '' } },
        ],
      },
      {
        id: 3,
        name: 'venusaur',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'grass', url: '' } },
        ],
      },
      {
        id: 4,
        name: 'charmander',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'fire', url: '' } },
        ],
      },
      {
        id: 5,
        name: 'charmeleon',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'fire', url: '' } },
        ],
      },
      {
        id: 6,
        name: 'charizard',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'fire', url: '' } },
        ],
      },
      {
        id: 7,
        name: 'squirtle',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'water', url: '' } },
        ],
      },
      {
        id: 8,
        name: 'wartortle',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'water', url: '' } },
        ],
      },
      {
        id: 9,
        name: 'blastoise',
        url: '',
        sprites: {
          front_default: '',
        },
        types: [
          { slot: 0, type: { name: 'water', url: '' } },
        ],
      },
    ],
  };

  test('renders the pokemons when data is loaded', async () => {
    jest.mocked(getAllPokemons).mockResolvedValueOnce(mockData);
  
    const { getByText, getByRole } = render(<App />);
  
    await waitFor(() => expect(getByRole('grid')).toBeInTheDocument());
  
    expect(getByText('bulbasaur')).toBeInTheDocument();
    expect(getByText('ivysaur')).toBeInTheDocument();
    expect(getByText('venusaur')).toBeInTheDocument();
    expect(getByText('charmander')).toBeInTheDocument();
    expect(getByText('charmeleon')).toBeInTheDocument();
    expect(getByText('charizard')).toBeInTheDocument();
    expect(getByText('squirtle')).toBeInTheDocument();
    expect(getByText('wartortle')).toBeInTheDocument();
    expect(getByText('blastoise')).toBeInTheDocument();
  });
});
