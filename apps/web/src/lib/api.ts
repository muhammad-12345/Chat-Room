import axios, { AxiosInstance, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

import config from '@/config/env'
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse } from '@chat-room/shared'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: config.apiUrl,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState()
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response
      },
      (error) => {
        const response = error.response?.data as ApiResponse

        // Handle authentication errors
        if (error.response?.status === 401) {
          const { clearAuth } = useAuthStore.getState()
          clearAuth()
          
          // Only show toast if it's not a login attempt
          if (!error.config.url?.includes('/auth/login')) {
            toast.error('Your session has expired. Please log in again.')
          }
          
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }

        // Handle other errors
        if (response?.error && response?.message) {
          // Don't show toast for validation errors (handled by forms)
          if (error.response?.status !== 422) {
            toast.error(response.message)
          }
        } else if (error.message === 'Network Error') {
          toast.error('Network error. Please check your connection.')
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please try again.')
        }

        return Promise.reject(error)
      }
    )
  }

  // Generic request method
  async request<T = any>(config: any): Promise<T> {
    const response = await this.instance.request<ApiResponse<T>>(config)
    return response.data.data
  }

  // HTTP methods
  async get<T = any>(url: string, config?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...config })
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config })
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, ...config })
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data, ...config })
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, ...config })
  }

  // Raw axios instance access (for special cases)
  get axios() {
    return this.instance
  }
}

export const api = new ApiClient()
export default api
