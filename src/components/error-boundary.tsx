'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Une erreur s'est produite
          </h1>
          <p className="text-muted-foreground">
            Une erreur inattendue s'est produite lors du chargement de l'application.
            Veuillez rafraîchir la page ou réessayer plus tard.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    </div>
  );
}
