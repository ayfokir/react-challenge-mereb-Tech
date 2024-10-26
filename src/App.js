import "./App.css";
import Tabs from "./components/Tabs";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Tabs />
      </QueryClientProvider>
    </div>
  );
}

export default App;
