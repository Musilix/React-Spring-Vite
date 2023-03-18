import { Users } from "@prisma/client";
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
import {
  decrementTaskGoal,
  getUser,
  incrementTaskGoal,
  intitializeTaskGoal,
  resetTaskGoal,
  setTotalJobs,
} from "./Services/UsersService";

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

// TODO: it's getting bullky in here. We may want to start modularizing this ish
function App() {
  const reducer = TaskReducer;
  const [ticker, setTicker] = useState(tickerUp);
  const [totalJobsApplied, setTotalJobsApplied]: [number | string, Function] =
    useState("...");
  const [taskAction, setTaskAction] = useState({ type: "" });
  // Handling adding, removing, or resetting tasks
  const [baseGoal, dispatch] = useReducer(reducer, { amt: 5 });
  const [isLoading, setIsLoading] = useState(true);

  // State for React Spring Animations
  const transition = useTransition(baseGoal.amt, ticker);
  const clickerVisualRef = useRef<HTMLObjectElement>(null);

  // Initialize jobs applied for on component load
  useEffect(() => {
    async function getUserData() {
      const User: Users = await getUser();

      // Set total jobs applied to + current task goal amount
      setTotalJobsApplied(User.count);
      intitializeTaskGoal(dispatch, User.currentGoal);
      setIsLoading(false);
    }

    getUserData();
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
        setTotalJobs(totalJobsApplied, setTotalJobsApplied);
      }
    }
  }, [baseGoal.amt]);

  // TODO: Refactor and abstract out some of this logic... or break it down completely
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

    // Real DB connectors for not updating UI, but updating the real data
    if (type === "dec") {
      decrementTaskGoal(dispatch, baseGoal.amt);
    } else if (type === "inc") {
      incrementTaskGoal(dispatch, baseGoal.amt);
    } else if (type === "reset") {
      resetTaskGoal(dispatch);
    }
  };

  return (
    <div className="App">
      {isLoading ? (
        // TODO: put in seperate component
        <>
          <section id="loading-wrap">
            <div>
              <img src="/loadinggraphic.png" alt="Loading Page Graphic"></img>
            </div>
          </section>
        </>
      ) : (
        <>
          <section id="tracker-wrap" ref={clickerVisualRef}>
            <div id="spring-wrap">
              {transition((style, taskGoalAmt) => {
                return (
                  <animated.div style={{ ...style, position: "absolute" }}>
                    <h2>{taskGoalAmt}</h2>
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
        </>
      )}
    </div>
  );
}

export default App;
