import { useState } from "react";

export function useLoading(initialLoadingState = true) {
  const [isLoading, setIsLoading] = useState(initialLoadingState);

  const setLoading = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };

  return { isLoading, setLoading };
}
