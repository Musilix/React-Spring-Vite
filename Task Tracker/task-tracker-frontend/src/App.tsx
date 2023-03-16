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
  const [ticker, setTicker] = useState(tickerUp);
  const [totalJobsApplied, setTotalJobsApplied] = useState(0);

  const reducer = TaskReducer;

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
  }, [baseGoal.amt]);

  const handleClick = (type: string | void) => {
    dispatch({ type: type });

    // Refactor Incoming - Find a better pattern for setting these state variables on button click
    // TODO: move this logic to the useEffect hook some how
    // This work is definitely more fit for something like the useEffect hook, but currently i NEED the type information to conditionally update the ticker state and totalJobsApplied state properly
    // Maybe theres a way to accomplish this while using useEffect?
    if (type === "inc") {
      ticker !== tickerUp ? setTicker(tickerUp) : "";
    } else if (type === "dec") {
      ticker !== tickerDown ? setTicker(tickerDown) : "";

      // TODO: add a column for usrs currTaskGoal (baseGoal)
      // We only need to update the count in the DB if we are removing a task (i.e. we finished it) and the current tasks are greater than 0
      // If not, we can just keep clicking the remove tasks button even when we have 0 tasks and it will update the DB... a user COULD always alter the code to
      // remove this check for any reason, but currently I have no clue how to keep a user from completing tasks when they have no tasks. I think we need to keep track
      // of curr task amt in the DB as well...
      if (baseGoal.amt > 0) {
        totalJobsHelper(totalJobsApplied, setTotalJobsApplied);
      }
    }
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
        <button onClick={() => handleClick("inc")}>Add To Goal</button>
        <button
          onClick={() => handleClick("dec")}
          disabled={baseGoal.amt === 0}
        >
          Mark a Goal Done
        </button>
        <button onClick={() => handleClick("reset")}>Reset Goal</button>
      </section>
    </div>
  );
}

export default App;
