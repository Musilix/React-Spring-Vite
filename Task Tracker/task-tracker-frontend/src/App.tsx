import { useContext, useState } from "react";
import "./App.css";
import Loading from "./Components/Loading/Loading";
import Login from "./Components/Login/Login";
import Nav from "./Components/Nav/Nav";
import Tracker from "./Components/Tracker/Tracker";
import { AuthContext } from "./Hooks/AuthContext";
import { LoadingContext } from "./Hooks/LoadingContext";

function App() {
  const { isLoading } = useContext(LoadingContext);
  const { user, setUser } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);

  const showLoginModal = () => {
    setShowLogin(true);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="App">
      <Nav showLoginModal={showLoginModal} />

      {showLogin ? <Login /> : <Tracker />}
    </div>
  );
}

export default App;
