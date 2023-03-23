import { Users } from "@prisma/client";

const login = async (username: string) => {
  // const res: any = await fetch(`/.netlify/functions/login`);
  // const signedInUser: Users = await thenable(res);

  // return signedInUser;

  const User: Users = await fetch(`/.netlify/functions/login`, {
    method: "POST",
    body: JSON.stringify({ username: username }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));

  return User;
};

const logout = async () => {
  return await fetch(`/.netlify/functions/logout`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));
};

const getUser = async (username: string): Promise<Users> => {
  const User: Users = await fetch(
    `/.netlify/functions/getUser?user=${username}`
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => console.error(e));

  return User;
};

const getCurrentUser = async (): Promise<Users> => {
  const user: Users = await fetch(`/.netlify/functions/getCurrentUser`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((e) => console.error(e));

  return user;
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

const thenable = async (res: any) => {
  const thenned: Users = await res
    .json()
    .then((data: any) => data)
    .catch((e: any) => console.error(e));

  return thenned;
};

export {
  getUser,
  getCurrentUser,
  setTotalJobs,
  incrementTaskGoal,
  decrementTaskGoal,
  resetTaskGoal,
  intitializeTaskGoal,
  login,
  logout,
};
