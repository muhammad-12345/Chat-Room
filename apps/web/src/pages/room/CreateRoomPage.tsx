export default function CreateRoomPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Room</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up a new audio chat room for conversations.
          </p>
        </div>

        <div className="card">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Room Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input mt-1"
                placeholder="Enter room name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="input mt-1"
                placeholder="Describe your room..."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrivate"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Make this room private</span>
              </label>
            </div>

            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                Access Code (Required for private rooms)
              </label>
              <input
                id="accessCode"
                name="accessCode"
                type="text"
                className="input mt-1"
                placeholder="Enter access code"
              />
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                Maximum Participants
              </label>
              <select
                id="maxParticipants"
                name="maxParticipants"
                className="input mt-1"
              >
                <option value="5">5 participants</option>
                <option value="10">10 participants</option>
                <option value="20">20 participants</option>
                <option value="50">50 participants</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
