import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useAuthStore } from '@/stores/authStore'
import { socketManager } from '@/lib/socket'

// Components
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Pages
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import RoomPage from '@/pages/room/RoomPage'
import CreateRoomPage from '@/pages/room/CreateRoomPage'
import ProfilePage from '@/pages/ProfilePage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = socketManager.connect()
      
      return () => {
        socketManager.disconnect()
      }
    }
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } 
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms/create" element={<CreateRoomPage />} />
            <Route path="/rooms/:roomId" element={<RoomPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
