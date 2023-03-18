import { animated, useTransition } from "@react-spring/web";
import { useEffect, useRef } from "react";

interface Goal {
  amt: number;
}

interface TaskAction {
  type: string;
}

export default function Tracker({
  handleClick,
  baseGoal,
  totalJobsApplied,
  ticker,
  taskAction,
}: {
  handleClick: Function;
  baseGoal: Goal;
  totalJobsApplied: number | string;
  ticker: Object;
  taskAction: TaskAction;
}) {
  // State for React Spring Animations
  const transition = useTransition(baseGoal.amt, ticker);
  const clickerVisualRef = useRef<HTMLObjectElement>(null);

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

  return (
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
  );
}
