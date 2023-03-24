import { useState } from "react";

export default function useInput(initialState: any) {
  const [value, setValue] = useState(initialState);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleReset = () => {
    setValue("");
  };

  return [value, handleChange, handleReset];
}
