import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90">
        Go Home
      </Link>
    </main>
  );
}

export default NotFoundPage;



