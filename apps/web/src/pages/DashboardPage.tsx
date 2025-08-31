import { useAuthStore } from '@/stores/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.displayName}!</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your rooms and join conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Public Rooms</h3>
          <p className="mt-1 text-sm text-gray-500">Browse and join public conversations</p>
          <div className="mt-4">
            <button className="btn btn-primary">Browse Rooms</button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Create Room</h3>
          <p className="mt-1 text-sm text-gray-500">Start your own conversation room</p>
          <div className="mt-4">
            <button className="btn btn-primary">Create Room</button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">My Rooms</h3>
          <p className="mt-1 text-sm text-gray-500">Manage rooms you've created</p>
          <div className="mt-4">
            <button className="btn btn-secondary">View My Rooms</button>
          </div>
        </div>
      </div>
    </div>
  )
}
