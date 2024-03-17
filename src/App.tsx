import { Grid, GridColumn as Column, GridEvent } from "@progress/kendo-react-grid";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "@progress/kendo-react-indicators";
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css'
import { Pokemon, PokemonsResponse, getAllPokemons } from "./services/PokeService";
import { process } from "@progress/kendo-data-query";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonList></PokemonList>
    </QueryClientProvider>
  )
}

function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [dataState, setDataState] = useState({});
  const [resultState, setResultState] = useState(
    process(pokemons, {})
  );

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

  const onDataStateChange = useCallback((e) => {
    setDataState(e.dataState);
    setResultState(process(pokemons, e.dataState));
  }, [pokemons]);

  useEffect(() => {
    if (dataAllPokemons && !isDataLoaded) {
      setIsDataLoaded(true);
      setPokemons(dataAllPokemons.pages[0].results);
      setResultState(process(dataAllPokemons.pages[0].results, dataState))
    }
  }, [dataAllPokemons, isDataLoaded, dataState]);

  if (isLoadingAllPokemons) return <Loader size="large" type="pulsing" />;
  if (errorAllPokemons) return <p>Um erro aconteceu.</p>

  if (dataAllPokemons) {
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
          setResultState(process(allResults, dataState));
        }
      }
    };

    return (
      <Grid
        style={{ height: "400px" }}
        data={resultState.data}
        sortable={true}
        onScroll={scrollHandler}
        fixedScroll={true}
        filterable={true}
        onDataStateChange={onDataStateChange}
        {...dataState}
      >
        <Column field="name" title="Name" width="full" />
        <Column field="weight" title="Weight" />
      </Grid>
    );
  }
}

export default App
