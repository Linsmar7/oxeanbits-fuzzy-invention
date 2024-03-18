import { QueryClient, QueryClientProvider } from 'react-query';
import { PokemonList } from './components/PokemonList';
import { LogoComponent } from './components/LogoComponent';
import { Container } from './components/Container';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <LogoComponent></LogoComponent>
        <PokemonList></PokemonList>
      </Container>
    </QueryClientProvider>
  )
}

export default App
