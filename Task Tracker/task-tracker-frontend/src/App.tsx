import { animated, useTransition } from "@react-spring/web";
import {
  MutableRefObject,
  ReactHTMLElement,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";

interface Task {
  id: string;
  details: string;
  dateCreated: Date;
}

const tickerUp = {
  keys: null,
  config: { duration: 200 },
  from: { opacity: 0, top: -100 },
  enter: { opacity: 1, top: 0 },
  leave: { opacity: 0, top: 100 },
};

const tickerDown = {
  keys: null,
  config: { duration: 200 },
  from: { opacity: 0, top: 100 },
  enter: { opacity: 1, top: 0 },
  leave: { opacity: 0, top: -100 },
};

function App() {
  const [ticker, setTicker] = useState(tickerUp);

  const reducer = (state: any, action: any) => {
    if (action.type === "inc") {
      ticker !== tickerUp ? setTicker(tickerUp) : "";

      return {
        amt: state.amt + 1,
      };
    } else if (action.type === "dec" && state.amt > 0) {
      ticker !== tickerDown ? setTicker(tickerDown) : "";

      return {
        amt: state.amt - 1,
      };
    } else if (action.type === "reset") {
      return {
        amt: 5,
      };
    } else {
      return {
        amt: 0,
      };
    }
  };

  const [baseGoal, dispatch] = useReducer(reducer, { amt: 5 });
  const transition = useTransition(baseGoal.amt, ticker);
  const clickerVisualRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    if (clickerVisualRef.current) {
      if (baseGoal.amt === 0) {
        clickerVisualRef.current.style.backgroundColor = "rgb(0 255 43 / .5%)";
        clickerVisualRef.current.style.filter =
          "invert(0) drop-shadow(rgba(0, 255, 43, 1) 0px 0px 0.3rem)";
      } else {
        clickerVisualRef.current.style.backgroundColor = "rgb(0 255 43 / 0%)";
        clickerVisualRef.current.style.filter =
          "invert(0) drop-shadow(rgba(0, 255, 43, .1) 0px 0px 0.3rem);";
      }
    }
  }, [baseGoal.amt]);

  const handleClick = (type: string | void) => {
    dispatch({ type: type });
  };

  return (
    <div className="App">
      <section id="tracker-wrap" ref={clickerVisualRef}>
        <div id="spring-wrap">
          {transition((style, idx) => {
            return (
              <animated.div style={{ ...style, position: "absolute" }}>
                <h2>{idx}</h2>
              </animated.div>
            );
          })}
        </div>
        <p>Tasks Remaining</p>
      </section>

      <section id="tracker-list-form">
        <button onClick={() => handleClick("inc")}>Add To Goal</button>
        <button onClick={() => handleClick("dec")}>Mark a Goal Done</button>
        <button onClick={() => handleClick("reset")}>Reset Goal</button>
      </section>
    </div>
  );
}

export default App;
