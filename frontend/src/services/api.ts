import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from '../config/demo.config';

const getBaseUrl = (): string => {
  const base = API_CONFIG.baseUrl || 'http://localhost:8000';
  return base.endsWith('/api/v1') ? base : `${base.replace(/\/+$/, '')}/api/v1`;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'demo-api-key',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trustgate_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Exponential Backoff Retry Interceptor
const MAX_RETRIES = 2;
const RETRY_DELAY_BASE_MS = 500;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config: any = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;

    // Retry only on network errors or 5xx server errors
    const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status <= 599);

    if (shouldRetry && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      const delayMs = RETRY_DELAY_BASE_MS * Math.pow(2, config.__retryCount - 1);
      console.warn(`[Axios Retry] Retrying request (${config.__retryCount}/${MAX_RETRIES}) after ${delayMs}ms: ${config.url}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return apiClient(config);
    }

    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn('Unauthorized request to TrustGate AI API');
      } else if (status === 429) {
        console.warn('Rate limit exceeded');
      } else if (status >= 500) {
        console.error('Server error', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.response?.data?.message || error.message;
      throw new Error(`API Error [${error.response?.status || 'Network'}]: ${message}`);
    }
    throw error;
  }
}

