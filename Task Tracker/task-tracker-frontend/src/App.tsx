import { useContext } from "react";
import "./App.css";
import Loading from "./Components/Loading/Loading";
import Tracker from "./Components/Tracker/Tracker";
import { LoadingContext } from "./Hooks/LoadingContext";

function App() {
  const { isLoading } = useContext(LoadingContext);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="App">
      <Tracker />
    </div>
  );
}

export default App;
