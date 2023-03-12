import { useEffect, useState } from "react";
import useInput from "../../Hooks/useInput";
import "./TestingUseEffect.css";

interface TesterProps {
  details: {
    user: string;
    favoriteCandy: string;
  };
}

export default function TestingUseEffect(props: TesterProps) {
  // Set up state
  const [age, updateAge, resetAge] = useInput("");
  const [birthName, updateBirthName, resetBirthName] = useInput("");
  const [sex, updateSex, resetSex] = useInput("");

  // Using the useEffect hook with no dependencies.
  // Equivalent to running the anon function when OnComponentDidMount() is called, aka just once on initialization

  // We can go further and also return a function here in order to indicate some clean up logic when the component is unmounted
  // It is a code smell to seperate out the cleanup logic from the setup logic, and highly recommended to make your cleanup logic symmetric to the setup logic

  // the cleanup logic runs not only during unmounting, but also for every re-render with changed deps AS WELL as the ONE extra time react runs the setup+cleanup logic immediately after component mounting!
  useEffect(() => {
    console.log(`Component was mounted!`);

    return () => {
      console.log("Component Died");
    };
  }, []);

  // use the useEffect hook with a dependency on the age state
  // It will change everytime that age changes, so it's basically equivalent to onComponentDidUpdate() and onComponentDidMount()
  useEffect(() => {
    console.log(`Dependency [age] was changed to ${age}!`);
  }, [age]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // reset state to blank
    resetAge();
    resetBirthName();
    resetSex();

    // send off to indexedDB
  };

  return (
    <>
      <h2>Ello gov'na, let's utilize the useEffect hook!</h2>

      <form className="user-info" autoComplete="off">
        <div className="user-info-fields">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={birthName}
            onChange={(e) => updateBirthName(e)}
          ></input>
          <input
            name="age"
            type="text"
            placeholder="Your Age"
            value={age}
            onChange={(e) => updateAge(e)}
          ></input>
          <input
            name="gender"
            type="text"
            placeholder="Your Gender"
            value={sex}
            onChange={(e) => updateSex(e)}
          ></input>
        </div>
        <div className="user-info-button">
          <button onClick={handleSubmit}>Send Us Your Information</button>
        </div>
      </form>
    </>
  );
}
