import { useState } from "react";
import "./App.css";
import TestingUseEffect from "./Components/TestingUseEffect/TestingUseEffect";
import UseEffectChatRoomWrap from "./Components/UseEffectChatRoomWrap/UseEffectChatRoomWrap";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="App">
      {/* <TestingUseEffect details = {{user: "Testy", favoriteCandy: "jolly ranchers"}}></TestingUseEffect> */}
      <UseEffectChatRoomWrap />
    </div>
  );
}

export default App;
