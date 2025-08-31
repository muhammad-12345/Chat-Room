import { useParams } from 'react-router-dom'

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Room: {roomId}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Audio chat and messaging room
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audio Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Audio interface will be implemented here</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button className="btn btn-primary">🎤 Unmuted</button>
                <button className="btn btn-danger">📞 Leave</button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chat</h3>
            <div className="space-y-4">
              <div className="h-64 bg-gray-100 rounded-lg p-4 overflow-y-auto">
                <p className="text-gray-500 text-center">Chat messages will appear here</p>
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <button className="btn btn-primary ml-2">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
