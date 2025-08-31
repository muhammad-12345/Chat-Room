import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Real-time Audio Chat
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with others through high-quality audio conversations and real-time messaging.
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn btn-primary btn-lg w-full sm:w-auto"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg w-full sm:w-auto"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
