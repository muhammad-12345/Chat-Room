import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-gray-400">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
            <p className="mt-2 text-gray-600">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
          
          <div>
            <Link to="/" className="btn btn-primary">
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
