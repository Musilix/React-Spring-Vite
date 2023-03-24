import { Users } from "@prisma/client";
import { animated, useTransition } from "@react-spring/web";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { AuthContext } from "../../Hooks/AuthContext";
import { LoadingContext } from "../../Hooks/LoadingContext";
import TaskReducer from "../../Reducers/TaskReducer";
import {
  decrementTaskGoal,
  getCurrentUser,
  getUser,
  incrementTaskGoal,
  intitializeTaskGoal,
  resetTaskGoal,
  setTotalJobs,
} from "../../Services/UsersService";
import Loading from "../Loading/Loading";

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

export default function Tracker() {
  const reducer = TaskReducer;

  const [ticker, setTicker] = useState(tickerUp);
  const [baseGoal, dispatch] = useReducer(reducer, { amt: 5 });
  const [totalJobsApplied, setTotalJobsApplied]: [number | string, Function] =
    useState("...");
  const [taskAction, setTaskAction] = useState({ type: "" });
  const [userPage, setUserPage] = useState<Users | null>(null);

  // State for React Spring Animations
  const transition = useTransition(baseGoal.amt, ticker);
  const clickerVisualRef = useRef<HTMLObjectElement>(null);

  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { user, setUser } = useContext(AuthContext);

  // Initialize jobs applied for on component load
  useEffect(() => {
    async function getCurrentUserData() {
      const currUser: Users = await getCurrUser();
      setUser(currUser);

      //TODO: make this dynamic to the route we are looking at...
      const lookingAtUser: Users = await getUser("keemkeem");
      setUserPage(lookingAtUser);
      // Wait a quarter second after the data has loaded in before setting loading to false, just to be SURE the DOM is ready..
      setTimeout(() => setIsLoading(false), 10000);
    }

    getCurrentUserData();
  }, []);

  useEffect(() => {
    // Set total jobs applied to + current task goal amount
    setTotalJobsApplied(userPage ? userPage.count : 0);
    intitializeTaskGoal(dispatch, userPage ? userPage.currentGoal : 0);
  }, [userPage, user]);

  // Add extra styling for when daily tasks are completed
  useEffect(() => {
    // Handling adding, removing, or resetting tasks
    if (taskAction.type === "dec") {
      if (baseGoal.amt > 0) {
        setTotalJobs(totalJobsApplied, setTotalJobsApplied);
      }
    }

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

  const handleClick = (type: string) => {
    // Real DB connectors for not updating UI, but updating the real data
    if (type === "dec") {
      ticker !== tickerDown ? setTicker(tickerDown) : "";
      decrementTaskGoal(dispatch, baseGoal.amt);
    } else if (type === "inc") {
      ticker !== tickerUp ? setTicker(tickerUp) : "";
      incrementTaskGoal(dispatch, baseGoal.amt);
    } else if (type === "reset") {
      resetTaskGoal(dispatch, baseGoal.amt);
    }

    setTaskAction({ type });
  };

  const getCurrUser = async () => {
    // Get the current user using their cookie, and set the total jobs applied and task goal to their current count
    let User: Users = await getCurrentUser();

    // fall back default user to look at if no user is logged in
    if (!User) {
      User = await getUser("keemkeem");
    }

    return User;
  };

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

      {user && userPage && user.username === userPage.username ? (
        <>
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
      ) : (
        <></>
      )}
    </>
  );
}
