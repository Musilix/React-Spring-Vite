import { createContext, useState } from "react";

interface LoadingContext {
  isLoading: boolean;
  setLoading: any;
}
const loadingContext = createContext<LoadingContext>({
  isLoading: false,
  setLoading: (newUserData: object) => {},
});

export default function LoadingProvider({ children }: { children: any }) {
  const [isLoading, setLoading] = useState(false);

  const loadingValue = {
    isLoading,
    setLoading,
  };

  return (
    <loadingContext.Provider value={loadingValue}>
      {children}
    </loadingContext.Provider>
  );
}
