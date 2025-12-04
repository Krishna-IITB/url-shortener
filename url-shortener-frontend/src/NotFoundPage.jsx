import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
      <div className="max-w-md w-full px-6 py-8 bg-slate-950 rounded-xl shadow-lg text-center space-y-4">
        <p className="text-sm font-semibold text-indigo-400">404</p>
        <h1 className="text-2xl font-bold">Link not found</h1>
        <p className="text-sm text-slate-400">
          The page you’re looking for doesn’t exist or has expired.
        </p>
        <Link
          to="/"
          className="inline-block mt-2 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
