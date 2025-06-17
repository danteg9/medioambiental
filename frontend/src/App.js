import Mapa from "./components/Mapa";
import { IdiomaProvider } from "./context/idioma";

function App() {
  return (
    <IdiomaProvider>
      <Mapa />
    </IdiomaProvider>
  );
}

export default App;
