import { useState } from "react";

//  if you dont specify the return typeof the function (in this case a list of string and fns)
// TS will infer. and w/ that infer, it will cause strange behavior... we should explicitly write
// the return type or return our list "as const" to bypass this... why the fuck does it's inference
// cause this behavior though???
export default function useInput(initialState: string): any[]{
  const [input, setInput] = useState(initialState);

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const reset = () => {
    setInput('');
  };

  return [input, handleChange, reset];
}
