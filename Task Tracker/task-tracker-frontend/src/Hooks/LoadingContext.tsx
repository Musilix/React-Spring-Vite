import { createContext, useState } from "react";

interface LoadingContextProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  setIsLoading: (loading: boolean) => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const values = { isLoading, setIsLoading };

  return (
    <LoadingContext.Provider value={values}>{children}</LoadingContext.Provider>
  );
}
