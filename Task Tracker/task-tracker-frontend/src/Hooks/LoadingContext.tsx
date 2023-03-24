import { createContext, useState } from "react";

interface LoadingContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps>({
  loading: false,
  setLoading: (loading: boolean) => {},
});

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const values = { loading, setLoading };

  return (
    <LoadingContext.Provider value={values}>{children}</LoadingContext.Provider>
  );
}
