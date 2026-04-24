'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error digest:', error.digest);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border bg-card">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-destructive" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Une erreur s'est produite
          </h1>
          <p className="text-muted-foreground">
            Une erreur inattendue s'est produite lors du chargement de l'application.
          </p>
          {error.message && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive text-left">
              <p className="font-semibold mb-1">Message d'erreur:</p>
              <p className="font-mono text-xs break-all">{error.message}</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
