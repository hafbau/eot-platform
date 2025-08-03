'use client';

import { useEffect } from 'react';
import { Button } from '@eot/ui';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <h2 className="text-lg font-medium text-gray-900">Something went wrong!</h2>
      <p className="text-sm text-gray-600 text-center max-w-md">
        An error occurred while loading this page. Please try again.
      </p>
      <Button onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}