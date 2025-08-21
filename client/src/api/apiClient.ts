// apiClient.ts
import axios, {AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import useAuthStore from '../store/authStore';
// Create an axios instance
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/signin";
      }
      return Promise.reject(error);
    }
  );

 class APIClient {
	get<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "GET" });
	}

	post<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "POST" });
	}

	put<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT" });
	}

	delete<T = any>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "DELETE" });
	}

	request<T = any>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			axiosInstance
				.request<any, AxiosResponse<any>>(config)
				.then((res: AxiosResponse<any>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
}
export default new APIClient();



