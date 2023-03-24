import { Users } from "@prisma/client";

const getUser = async (username?: string): Promise<Users> => {
  const User: Users = await fetch(
    `/.netlify/functions/getUser?user=${username}`
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));
  return User;
};

const getCurrentUser = async (): Promise<Users> => {
  const currentUser: Users = await fetch(`/.netlify/functions/getCurrentUser`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch(() => null);

  return currentUser;
};

const login = async (username: string, password?: string) => {
  const user = await fetch(`/.netlify/functions/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));

  return user;
};

const logout = async () => {
  return await fetch(`/.netlify/functions/logout`, { method: "POST" })
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));
};

const setTotalJobs = async (setTotalJobsApplied: any, username?: any) => {
  // Update the current count of the user in the DB if the type is dec
  await fetch(`/.netlify/functions/setUserCount?user=${username}`, {
    method: "POST",
  })
    .then(() => {
      //TODO: refactor... this is a code smell
      // Just call the state setter for the total jobs applied if this db update functio nretturns with a 200
      // Basically just emulating realtime update in UI... when they refresh, the changes will persist though
      setTotalJobsApplied((prevTotalApplied: number) => prevTotalApplied + 1);
    })
    .catch((e) => console.error(e));
};

const incrementTaskGoal = async (dispatch: Function, currTaskGoal: number) => {
  // To update the UI fast, dispatch an inc type action before we've updated the db. we assume the db will be succesful.
  dispatch({ type: "inc" });
  await fetch(
    `/.netlify/functions/setUserTaskGoal?taskGoal=${currTaskGoal + 1}`,
    {
      method: "POST",
    }
  ).catch((e) => {
    // If the db call failed, decrement in the UI... kinda cryptic, but I mean... its consistent
    dispatch({ type: "dec" });
    console.error(e);
  });
};

const decrementTaskGoal = async (dispatch: Function, currTaskGoal: number) => {
  dispatch({ type: "dec" });
  await fetch(
    `/.netlify/functions/setUserTaskGoal?taskGoal=${currTaskGoal - 1}`,
    {
      method: "POST",
    }
  ).catch((e) => {
    dispatch({ type: "inc" });
    console.error(e);
  });
};

const resetTaskGoal = async (dispatch: Function, currTaskGoal: number) => {
  dispatch({ type: "reset" });
  await fetch(`/.netlify/functions/setUserTaskGoal?taskGoal=5`, {
    method: "POST",
  }).catch((e) => {
    dispatch({ type: "init", payload: { taskGoals: currTaskGoal } });
    console.error(e);
  });
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
  getCurrentUser,
  login,
  logout,
  setTotalJobs,
  incrementTaskGoal,
  decrementTaskGoal,
  resetTaskGoal,
  intitializeTaskGoal,
};
