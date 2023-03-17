const totalJobsHelper = (_totalJobsApplied: any, setTotalJobsApplied: any) => {
  console.log("in api");
  const callApis = async () => {
    // Update the current count of the user in the DB if the type is dec
    await fetch(`/.netlify/functions/setUserCount`, { method: "POST" })
      .then(() => {
        // Just call the state setter for the total jobs applied if this db update functio nretturns with a 200
        // Basically just emulating realtime update in UI... when they refresh, the changes will persist though
        setTotalJobsApplied((prevTotalApplied: number) => prevTotalApplied + 1);
      })
      .catch((e) => console.error(e));
  };

  callApis();
};

export { totalJobsHelper };
