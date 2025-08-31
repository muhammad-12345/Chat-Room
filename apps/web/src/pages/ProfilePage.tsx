import { useAuthStore } from '@/stores/authStore'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="card">
          <form className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                defaultValue={user?.displayName}
                className="input mt-1"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email}
                disabled
                className="input mt-1 bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password (Leave blank to keep current)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input mt-1"
                placeholder="Enter new password"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
