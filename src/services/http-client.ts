import axios, { AxiosInstance, AxiosResponse } from "axios"
declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export abstract class HttpClient {
  readonly axiosInstance: AxiosInstance

  public constructor(url: string) {
    const { protocol, host } = new URL(url)

    this.axiosInstance = axios.create({
      baseURL: `${protocol}//${host}`,
    })
    this.initializeResponseInterceptor()
  }

  private initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleError,
    )
  }

  private handleResponse = ({ data }: AxiosResponse) => data
  private handleError = (error: any) => Promise.reject(error)
}