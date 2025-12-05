import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AsyncOperationOptions {
  maxRetries?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncOperation = (
  operation: () => Promise<any>,
  options: AsyncOperationOptions = {}
) => {
  const {
    maxRetries = 2,
    retryDelay = 1000,
    showErrorToast = true,
    successMessage,
    errorMessage = "Операция не удалась"
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();

        if (successMessage) {
          toast({
            title: "Успешно",
            description: successMessage,
          });
        }

        setLoading(false);
        return result;
      } catch (err) {
        lastError = err as Error;
        console.error(`Attempt ${attempt + 1} failed:`, err);

        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    // All retries failed
    setError(lastError!);
    setLoading(false);

    if (showErrorToast) {
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    }

    throw lastError!;
  }, [operation, maxRetries, retryDelay, showErrorToast, successMessage, errorMessage, toast]);

  const retry = useCallback(() => {
    if (!loading) {
      return execute();
    }
  }, [execute, loading]);

  return {
    execute,
    retry,
    loading,
    error,
    hasError: error !== null,
  };
};
