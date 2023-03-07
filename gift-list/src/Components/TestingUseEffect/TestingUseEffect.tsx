import { useEffect, useState } from 'react';

interface TesterProps {
  details: {
    user: string;
    favoriteCandy: string;  
  }
}

export default function TestingUseEffect(props: TesterProps){
  // Set up state
  let [age, setAge] = useState(0);
  let [birthName, setBirthName] = useState('');
  let [sex, setSex] = useState('');
  
  
  // Using the useEffect hook with no dependencies.
  // Equivalent to running the anon function when OnComponentDidMount() is called, aka just once on initialization
  useEffect(() => {
    alert(`Age was initialized as ${age}`)
  }, [])
  
  // use the useEffect hook with a dependency on the age state
  // It will change everytime that age changes, so it's basically equivalent to onComponentDidUpdate()
  useEffect(() => {
    alert(`Age was changed to ${age}`)
  }, [age]);
  
  // use the useEffect hook with a retunred anon funciton
  // React will interpret this as something it hsould do OnComponentUnmount()
  useEffect(() => {
  
    return () => {
      alert("Component is gone!")
    };
    
  });
  
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // reset state to blank
    
    // send off to indexedDB
    
    
  }
  
  
  return (
    <>
      <h2>Ello gov'na, let's utilize the useEffect hook!</h2>
      
      <form>
        <input name="" type="text" placeholder="Your Name"></input>
        <input name="" type="text" placeholder="Your Name"></input>
        <input name="" type="text" placeholder="Your Name"></input>
        
        <button onClick = {handleSubmit}>Send Us Your Information</button>
      </form>
    </>
  );
}