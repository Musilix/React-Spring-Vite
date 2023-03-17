// UI changes related to button clicks for inc, dec, reset + initial load of goal data
const TaskReducer = (state: any, action: any) => {
  if (action.type === "inc") {
    return {
      amt: state.amt + 1,
    };
    // Update tasks completed only when we remove one... we're just assuming this means you've completed a task
  } else if (action.type === "dec" && state.amt > 0) {
    return {
      amt: state.amt - 1,
    };
  } else if (action.type === "reset") {
    // default tasks set to 5
    return {
      amt: 5,
    };
  } else if (action.type === "init") {
    return {
      amt: action.payload.taskGoals,
    };
  } else {
    return {
      amt: 0,
    };
  }
};

export default TaskReducer;
