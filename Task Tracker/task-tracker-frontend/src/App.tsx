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
import Loading from "./Components/Loading/Loading";
import Tracker from "./Components/Tracker/Tracker";
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

function App() {
  const reducer = TaskReducer;

  const [ticker, setTicker] = useState(tickerUp);
  const [totalJobsApplied, setTotalJobsApplied]: [number | string, Function] =
    useState("...");
  const [taskAction, setTaskAction] = useState({ type: "" });

  // Handling adding, removing, or resetting tasks
  const [baseGoal, dispatch] = useReducer(reducer, { amt: 5 });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize jobs applied for on component load
  useEffect(() => {
    async function getUserData() {
      const User: Users = await getUser();

      // Set total jobs applied to + current task goal amount
      setTotalJobsApplied(User.count);
      intitializeTaskGoal(dispatch, User.currentGoal);

      // Wait a quarter second after the data has loaded in before setting loading to false, just to be SURE the DOM is ready..
      setTimeout(() => setIsLoading(false), 250);
    }

    getUserData();
  }, []);

  useEffect(() => {
    if (taskAction.type === "dec") {
      if (baseGoal.amt > 0) {
        setTotalJobs(totalJobsApplied, setTotalJobsApplied);
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

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Tracker
            handleClick={handleClick}
            baseGoal={baseGoal}
            totalJobsApplied={totalJobsApplied}
            ticker={ticker}
            taskAction={taskAction}
          />
        </>
      )}
    </div>
  );
}

export default App;
