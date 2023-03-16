const totalJobsHelper = (_totalJobsApplied: any, setTotalJobsApplied: any) => {
  const callApis = async () => {
    // Update the current count of the user in the DB if the type is dec
    await fetch(`/.netlify/functions/setUserCount`).catch((e) =>
      console.error(e)
    );

    // Retrieve the newly updated count from the db after updating it
    // This may be unecessary...
    const newCount = fetch(`/.netlify/functions/getUser`)
      .then((res) => res.json())
      .then((data) => setTotalJobsApplied(data.count))
      .catch((e) => console.error(e));
  };

  callApis();
};

export { totalJobsHelper };
