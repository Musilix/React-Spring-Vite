import { useEffect, useState } from 'react';
import useInput from '../../Hooks/useInput';
import './TestingUseEffect.css';

interface TesterProps {
  details: {
    user: string;
    favoriteCandy: string;  
  }
}

export default function TestingUseEffect(props: TesterProps){
  // Set up state
  const [age, updateAge, resetInput] = useInput('');
  const [birthName, updateBirthName, resetBirthName] = useInput('');
  const [sex, updateSex, resetSex] = useInput('');
  
  
  // Using the useEffect hook with no dependencies.
  // Equivalent to running the anon function when OnComponentDidMount() is called, aka just once on initialization
  useEffect(() => {
    console.log(`Component was mounted!`)
    
    return (() => {console.log("Component Died")})
  }, [])
  
  // use the useEffect hook with a dependency on the age state
  // It will change everytime that age changes, so it's basically equivalent to onComponentDidUpdate() and onComponentDidMount()
  useEffect(() => {
    console.log(age);
    
  }, [age]);
  
  // use the useEffect hook with a retunred anon funciton and 0 depdencies
  // React will interpret this as something it should do OnComponentWillUnmount()
  // useEffect(() => {
  //   return () => {
  //     alert("Component is gone!")
  //   };
  // }, []);

  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    console.log(`Sending your data to our server: ${JSON.stringify({age, birthName, sex})}`);
    
    // reset state to blank
    resetInput();
    resetBirthName();
    resetSex();
    
    console.log(`Clearing data: ${JSON.stringify({age, birthName, sex})}`);
    
    // send off to indexedDB
  }
  
  
  return (
    <>
      <h2>Ello gov'na, let's utilize the useEffect hook!</h2>
      
      <form className = "user-info">
        <input name="name" type="text" placeholder="Your Name" onChange = {(e) => updateBirthName(e)}></input>
        <input name="age" type="text" placeholder="Your Age" onChange ={(e) => updateAge(e)}></input>
        <input name="gender" type="text" placeholder="Your Gender" onChange ={(e) => updateSex(e)}></input>
        
        <button onClick = {handleSubmit}>Send Us Your Information</button>
      </form>
    </>
  );
}