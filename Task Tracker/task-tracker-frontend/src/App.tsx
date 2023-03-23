import { Users } from "@prisma/client";
import { useContext, useEffect, useReducer, useState } from "react";
import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";
import Tracker from "./Components/Tracker/Tracker";
import { AuthContext } from "./Hooks/AuthContext";
import TaskReducer from "./Reducers/TaskReducer";
import {
  decrementTaskGoal,
  getCurrentUser,
  getUser,
  incrementTaskGoal,
  intitializeTaskGoal,
  logout,
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

  const { user, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  // Initialize jobs applied for on component load
  useEffect(() => {
    async function getUserData() {
      console.log(JSON.stringify(user));
      const User: Users = (await getCurrentUser()) ?? (await getUser("jonjon"));

      if (User) {
        setUser({ ...User });
        // Set total jobs applied to + current task goal amount
        setTotalJobsApplied(User.count);
        intitializeTaskGoal(dispatch, User.currentGoal);
      }

      // Wait about a quarter of a second after the data has loaded in before setting loading to false, just to be SURE the DOM is ready..
      setTimeout(() => setIsLoading(false), 350);
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

  // TODO: find a way to refactor this out
  const handleLogout = () => {
    // clear cookie of user
    logout();
    // unset user
    setUser(null);
  };

  const showLoginModal = () => {
    setLoginModalVisible(true);
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <div>
              <a href="/">
                <img src="/tasktracker.svg" alt="Logo Image" />
              </a>
            </div>
          </li>
          <li>
            {user ? (
              <button onClick={() => handleLogout()}>LOGOUT</button>
            ) : (
              <button onClick={() => showLoginModal()}>LOGIN</button>
            )}
          </li>
        </ul>
      </nav>

      {loginModalVisible ? (
        <LoginForm />
      ) : (
        <Tracker
          handleClick={handleClick}
          baseGoal={baseGoal}
          totalJobsApplied={totalJobsApplied}
          ticker={ticker}
          taskAction={taskAction}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;
