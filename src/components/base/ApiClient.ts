import { IApiClient } from '../types/type';

export class ApiClient implements IApiClient {
  constructor(private baseUrl: string, private headers: Record<string, string>) {}

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers: this.headers });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }

  async post<T>(endpoint: string, data: object): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }
}

// api.ts
export class Api {
  constructor(private baseUrl: string, private options: Record<string, any>) {}

  get<T>(endpoint: string): Promise<T> {
    return new ApiClient(this.baseUrl, this.options.headers).get<T>(endpoint);
  }

  post<T>(endpoint: string, data: object): Promise<T> {
    return new ApiClient(this.baseUrl, this.options.headers).post<T>(endpoint, data);
  }
}