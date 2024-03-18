import { useCallback, useEffect, useState } from "react";
import { Pokemon, PokemonsResponse, Type, getAllPokemons } from "../../services/PokeService";
import { process } from "@progress/kendo-data-query";
import { useInfiniteQuery } from "react-query";
import { Loader } from "@progress/kendo-react-indicators";
import { Grid, GridColumn, GridCustomCellProps, GridDataStateChangeEvent, GridEvent } from "@progress/kendo-react-grid";
import { PokemonName } from "../PokemonName";
import '@progress/kendo-theme-default/dist/all.css';

export const PokemonList = () => {
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

  const onDataStateChange = useCallback((e: GridDataStateChangeEvent) => {
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
  if (errorAllPokemons) return <p>An error occurred.</p>

  if (dataAllPokemons) {
    /**
     * Handles the infinite scroll.
     */
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

    /**
     * Handles showing the pokemon types names.
     */
    const typesCell = (props: GridCustomCellProps) => {
      const types = props.dataItem["types"];
      const typesNames: string[] = [];
      types.forEach((typeObj: Type) => {
        typesNames.push(typeObj.type.name);
      });

      return (
        <td {...props.tdProps} colSpan={1}>
          {typesNames.join(', ')}
        </td>
      );
    };

    return (
      <Grid
        style={{height: '600px', width: '90%'}}
        data={resultState.data}
        sortable={true}
        onScroll={scrollHandler}
        fixedScroll={true}
        filterable={true}
        onDataStateChange={onDataStateChange}
        {...dataState}
      >
        <GridColumn field="id" title="Entry" width="150px" />
        <GridColumn field="name" title="Name" width="full" cells={{data: PokemonName}}  />
        <GridColumn field="types" title="Types" cells={{data: typesCell}} filterable={false} />
        <GridColumn field="weight" title="Weight (kg)" filter="numeric" width="200px" />
      </Grid>
    );
  }
}
