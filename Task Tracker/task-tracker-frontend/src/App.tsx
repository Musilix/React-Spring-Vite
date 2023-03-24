import { useState } from "react";
import "./App.css";
import Login from "./Components/Login/Login";
import Nav from "./Components/Nav/Nav";
import Tracker from "./Components/Tracker/Tracker";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const showLoginModal = () => {
    setShowLogin(true);
  };

  return (
    <div className="App">
      <Nav showLoginModal={showLoginModal} />

      {showLogin ? <Login /> : <Tracker />}
    </div>
  );
}

export default App;
