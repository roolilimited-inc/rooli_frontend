import axios, { AxiosError, AxiosInstance } from 'axios'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rooli-backend.onrender.com/api/v1'

// Track active requests
let activeRequests = 0

const updateProgress = () => {
  if (activeRequests === 0) {
    NProgress.done()
  } else {
    NProgress.start()
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiResponse<T> {
  data: T
  message: string
  status: string
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Request interceptor to set token dynamically before every request
axiosInstance.interceptors.request.use((config) => {
  const token =
    Cookies.get('token') ||
    (typeof window !== 'undefined' && window.localStorage.getItem('token'))

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  // Start progress bar for API calls
  if (typeof window !== 'undefined') {
    activeRequests++
    updateProgress()
  }

  return config
})

// ✅ Response interceptor to handle 401 and other errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Complete progress bar for successful requests
    if (typeof window !== 'undefined') {
      activeRequests = Math.max(0, activeRequests - 1)
      updateProgress()
    }
    return response
  },
  (error: AxiosError<{ message: string }>) => {
    // Complete progress bar for failed requests
    if (typeof window !== 'undefined') {
      activeRequests = Math.max(0, activeRequests - 1)
      updateProgress()
    }

    const status = error.response?.status

    if (status === 401 && typeof window !== 'undefined') {
      Cookies.remove('token')
      Cookies.remove('user')
      window.localStorage.clear()
      // window.location.href = '/auth/login'
    }

    if (error.response) {
      throw new ApiError(
        error.response.status,
        error.response.data?.message || 'An error occurred'
      )
    }

    throw new ApiError(500, 'Network error')
  }
)

export const client = {
  async get<T>(endpoint: string, params?: Record<string, string>) {
    const response = await axiosInstance.get<ApiResponse<T>>(endpoint, { params })
    return response.data
  },

  async post<T>(endpoint: string, data: unknown) {
    const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data)
    return response.data
  },

  async put<T>(endpoint: string, data: unknown) {
    const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data)
    return response.data.data
  },
  
  async patch<T>(endpoint: string, data: unknown) {
    const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, data)
    return response.data.data
  },

  async delete<T>(endpoint: string) {
    const response = await axiosInstance.delete<ApiResponse<T>>(endpoint)
    return response.data.data
  },
}

export type Response<T> = {
  data: T;
  message: string;
  status: string;
}

