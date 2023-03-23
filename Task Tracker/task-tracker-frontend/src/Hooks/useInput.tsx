import { useState } from "react";

export default function useInput(initialState: any) {
  const [input, setInput] = useState(initialState);

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleReset = () => {
    setInput("");
  };

  return [input, handleChange];
}
