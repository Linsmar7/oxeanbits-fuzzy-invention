import { useMemo, useState } from "react";
import { PokemonsResponse, Type, getAllPokemons } from "../../services/PokeService";
import { process } from "@progress/kendo-data-query";
import { useInfiniteQuery } from "react-query";
import { Loader } from "@progress/kendo-react-indicators";
import { Grid, GridColumn, GridCustomCellProps, GridEvent } from "@progress/kendo-react-grid";
import { PokemonName } from "../PokemonName";
import '@progress/kendo-theme-default/dist/all.css';

export const PokemonList = () => {
  const {
    isLoading: isLoadingAllPokemons,
    error: errorAllPokemons,
    data: dataAllPokemons,
    fetchNextPage
  } = useInfiniteQuery<PokemonsResponse>({
    queryKey: ['pokemons'],
    queryFn: getAllPokemons,
    getNextPageParam: (lastPage) => lastPage.next,
  });

  const [dataState, setDataState] = useState({});
  const gridData = useMemo(
    () => dataAllPokemons?.pages.flatMap((page) => page.results) ?? [],
    [dataAllPokemons?.pages]
  );
  const dataResult = useMemo(
    () => process(gridData, dataState),
    [dataState, gridData]
  );

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
        data={dataResult}
        sortable={true}
        onScroll={scrollHandler}
        fixedScroll={true}
        filterable={true}
        onDataStateChange={(e) => setDataState(e.dataState)}
        resizable={true}
        {...dataState}
      >
        <GridColumn field="id" title="Entry" filter="numeric" />
        <GridColumn field="name" title="Name" cells={{data: PokemonName}}  />
        <GridColumn field="types" title="Types" cells={{data: typesCell}} filterable={false} />
        <GridColumn field="weight" title="Weight (kg)" filter="numeric" />
      </Grid>
    );
  }
}
