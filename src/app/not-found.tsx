import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border bg-card">
        <div className="flex justify-center">
          <FileQuestion className="h-20 w-20 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Page non trouvée
          </h1>
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <Link
          href="/"
          className="block w-full px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center font-medium"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
