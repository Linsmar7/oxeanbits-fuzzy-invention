import { Grid, GridColumn as Column, GridSortChangeEvent, GridEvent } from "@progress/kendo-react-grid";
import { useState } from "react";
import { Loader } from "@progress/kendo-react-indicators";
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css'
import { Pokemon, PokemonsResponse, getAllPokemons } from "./services/PokeService";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonList></PokemonList>
    </QueryClientProvider>
  )
}

function PokemonList() {
  const [sort, setSort] = useState<SortDescriptor[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const {
    isLoading: isLoadingAllPokemons,
    error: errorAllPokemons,
    data: dataAllPokemons,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<PokemonsResponse>({
    queryKey: ['pokemons'],
    queryFn: getAllPokemons,
    getNextPageParam: (lastPage) => lastPage.next,
  });

  if (isLoadingAllPokemons) return <Loader size="large" type="pulsing" />;
  if (errorAllPokemons) return <p>Um erro aconteceu.</p>

  if (dataAllPokemons) {  
    const sortChange = (event: GridSortChangeEvent) => {
      setSort(event.sort);
    }

    const scrollHandler = (event: GridEvent) => {
      const e = event.nativeEvent;
      if (
        e.target.scrollTop + 10 >=
        e.target.scrollHeight - e.target.clientHeight
      ) {
        fetchNextPage();
        if (hasNextPage) {
          const allResults = dataAllPokemons.pages.reduce((acc: Pokemon[], page) => {
            acc.push(...page.results);
            return acc;
          }, []);

          setPokemons(allResults);
        }
      }
    };

    return (
      <Grid
        style={{ height: "400px" }}
        data={orderBy(pokemons.length > 0 ? pokemons : dataAllPokemons.pages[0].results, sort)}
        sortable={true}
        sort={sort}
        onSortChange={sortChange}
        onScroll={scrollHandler}
        fixedScroll={true}
      >
        <Column field="name" title="Name" width="full" />
        <Column field="weight" title="Weight" />
      </Grid>
    );
  }
}

export default App
