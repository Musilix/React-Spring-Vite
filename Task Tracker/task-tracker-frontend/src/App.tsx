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
import TaskReducer from "./Reducers/TaskReducer";
import { totalJobsHelper } from "./Services/UsersService";

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
  const reducer = TaskReducer;
  const [ticker, setTicker] = useState(tickerUp);
  const [totalJobsApplied, setTotalJobsApplied] = useState(0);
  const [taskAction, setTaskAction] = useState({ type: "" });
  // Handling adding, removing, or resetting tasks
  const [baseGoal, dispatch] = useReducer(reducer, { amt: 5 });

  // State for React Spring Animations
  const transition = useTransition(baseGoal.amt, ticker);
  const clickerVisualRef = useRef<HTMLObjectElement>(null);

  // Initialize jobs applied for on component load
  useEffect(() => {
    async function getTotalJobsApplied() {
      const totalJobsApplied = await fetch(`/.netlify/functions/getUser`)
        .then((res) => res.json())
        .then((data) => data.count);

      setTotalJobsApplied(totalJobsApplied);
    }

    getTotalJobsApplied();
  }, []);

  // Add extra styling for when daily tasks are completed
  useEffect(() => {
    if (clickerVisualRef.current) {
      if (baseGoal.amt === 0) {
        clickerVisualRef.current.style.backgroundColor = "rgb(0 255 43 / .5%)";
        clickerVisualRef.current.style.filter =
          "invert(0) drop-shadow(rgba(0, 255, 43, 1) 0px 0px 0.3rem)";
      } else {
        clickerVisualRef.current.style.backgroundColor = "rgb(0 255 43 / 0%)";
        clickerVisualRef.current.style.filter =
          "invert(0) drop-shadow(rgba(0, 255, 43, 0.1) 0px 0px 0.3rem)";
      }
    }

    if (taskAction.type === "dec") {
      if (baseGoal.amt > 0) {
        totalJobsHelper(totalJobsApplied, setTotalJobsApplied);
      }
    }
  }, [baseGoal.amt]);

  const handleClick = (type: string) => {
    // TODO: find out how to incorporate this into the useEffect hook without the strange behavior explained below...
    // The behavior of this is strange if i put the check in useEffect, as with the case where we go from adding tasks to removing one, it will still use the tickerUp settings for the decerement removal
    // only after then, if I decrement again will it properly use the tickerDown settings instead. That's because it doesnt actively update the ticker direction setting until AFTER the value itself has update
    // this means that it will use the previously set ticker direction setting, and THEN update the ticker setting properly... This is the only solution I have for this now.
    if (taskAction.type === "dec") {
      ticker !== tickerUp ? setTicker(tickerUp) : "";
    } else if (taskAction.type === "dec") {
      ticker !== tickerDown ? setTicker(tickerDown) : "";
    }

    setTaskAction({ type });
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
        <p style={{ fontSize: "10px" }}>
          You've applied for {totalJobsApplied} jobs
        </p>
      </section>

      <section id="tracker-list-form">
        <button onClick={() => handleClick("inc")}>Add Task</button>
        <button
          onClick={() => handleClick("dec")}
          disabled={baseGoal.amt === 0}
        >
          Mark a Task Done
        </button>
        <button onClick={() => handleClick("reset")}>Reset Tasks</button>
      </section>
    </div>
  );
}

export default App;
