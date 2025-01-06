import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

// Create an Axios client
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
  timeout: 10000, // Timeout after 10 seconds
});

// Request interceptor: Can modify the request before sending it
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token or other headers before each request
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Can modify the response before it is handled
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle response error
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      localStorage.clear();
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);
