import { Grid, GridColumn as Column, GridPageChangeEvent, GridSortChangeEvent, GridEvent } from "@progress/kendo-react-grid";
import { useState } from "react";
import { Loader } from "@progress/kendo-react-indicators";
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css'
import { Pokemon, getAllPokemons } from "./services/PokeService";
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
  const [page, setPage] = useState({
    skip: 0,
    take: 50,
  });
  const [sort, setSort] = useState<SortDescriptor[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  const { isLoading, error, data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['pokemons', page.skip],
    queryFn: getAllPokemons,
    getNextPageParam: (lastPage, pages) => lastPage.next,
  });

  if (isLoading) return <Loader size="large" type="pulsing" />;
  if (error) return <p>Um erro aconteceu.</p>

  if (data) {
    const pageChange = (event: GridPageChangeEvent) => {
      setPage(event.page);
    };
  
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
          const allResults = data.pages.reduce((acc, page) => {
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
        data={orderBy(pokemons.length > 0 ? pokemons : data.pages[0].results, sort)}
        total={data.pages[0].count}
        onPageChange={pageChange}
        sortable={true}
        sort={sort}
        onSortChange={sortChange}
        onScroll={scrollHandler}
        fixedScroll={true}
      >
        <Column field="name" title="Name" width="full" />
      </Grid>
    );
  }
}

export default App
