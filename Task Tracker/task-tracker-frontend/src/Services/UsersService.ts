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

const incrementTaskGoal = async (_dispatch: Function) => {};

const decrementTaskGoal = async (_dispatch: Function) => {};

const resetTaskGoal = async (_dispatch: Function) => {};

const intitializeTaskGoal = async (_dispatch: Function) => {};

export { setTotalJobs };
