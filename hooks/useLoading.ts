import { useState } from "react";

const useLoading = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchWithLoading = (fetch: () => Promise<any>) => {
    setIsLoading(true);
    return fetch()
      .then((result) => {
        setIsLoading(false);

        onSuccess?.(result);
      })
      .catch((error) => {
        setIsLoading(false);

        onError?.(error);
      });
  };

  return { isLoading, fetch: fetchWithLoading };
};

export default useLoading;
