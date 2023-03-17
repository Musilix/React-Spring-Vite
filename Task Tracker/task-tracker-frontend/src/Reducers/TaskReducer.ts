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
    return {
      amt: 5,
    };
  } else if (action.type === "initialize") {
    return {
      amt: 0,
    };
  } else {
    return {
      amt: 0,
    };
  }
};

export default TaskReducer;
