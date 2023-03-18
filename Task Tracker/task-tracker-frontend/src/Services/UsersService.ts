import { Users } from "@prisma/client";

const getUser = async (): Promise<Users> => {
  const User: Users = await fetch(`/.netlify/functions/getUser`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));

  return User;
};

const setTotalJobs = async (
  _totalJobsApplied: any,
  setTotalJobsApplied: any
) => {
  // Update the current count of the user in the DB if the type is dec
  await fetch(`/.netlify/functions/setUserCount`, { method: "POST" })
    .then(() => {
      // Just call the state setter for the total jobs applied if this db update functio nretturns with a 200
      // Basically just emulating realtime update in UI... when they refresh, the changes will persist though
      setTotalJobsApplied((prevTotalApplied: number) => prevTotalApplied + 1);
    })
    .catch((e) => console.error(e));
};

const incrementTaskGoal = async (dispatch: Function, currTaskGoal: number) => {
  await fetch(
    `/.netlify/functions/setUserTaskGoal?taskGoal=${currTaskGoal + 1}`,
    {
      method: "POST",
    }
  )
    .then(() => {
      dispatch({ type: "inc" });
    })
    .catch((e) => console.error(e));
};

const decrementTaskGoal = async (dispatch: Function, currTaskGoal: number) => {
  await fetch(
    `/.netlify/functions/setUserTaskGoal?taskGoal=${currTaskGoal - 1}`,
    {
      method: "POST",
    }
  )
    .then(() => {
      dispatch({ type: "dec" });
    })
    .catch((e) => console.error(e));
};

const resetTaskGoal = async (dispatch: Function) => {
  await fetch(`/.netlify/functions/setUserTaskGoal?taskGoal=5`, {
    method: "POST",
  })
    .then(() => {
      dispatch({ type: "reset" });
    })
    .catch((e) => console.error(e));
};

// No need to call API here; we're basically just update our baseGoal.amt state value with our dispatch method (sending in the user.count) we retrieved on component mount
const intitializeTaskGoal = async (
  dispatch: Function,
  currTaskGoal: number
) => {
  dispatch({ type: "init", payload: { taskGoals: currTaskGoal } });
};

export {
  getUser,
  setTotalJobs,
  incrementTaskGoal,
  decrementTaskGoal,
  resetTaskGoal,
  intitializeTaskGoal,
};
