export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;

    // Безопасное объединение headers
    const baseHeaders = {
      'Content-Type': 'application/json',
    };

    this.options = {
      ...options,
      headers: {
        ...baseHeaders,
        ...(options.headers ?? {}),
      },
    };
  }

  protected async handleResponse<T = any>(response: Response): Promise<T> {
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      return data;
    } else {
      const errorMessage = data.error || response.statusText || 'Unknown error';
      return Promise.reject(new Error(errorMessage));
    }
  }

  get<T = any>(uri: string): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: 'GET',
    }).then(this.handleResponse);
  }

  post<T = any>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data),
    }).then(this.handleResponse);
}
}
