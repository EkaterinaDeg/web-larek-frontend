// base/ApiClient.ts
// адаптер API -> IApiClient (использует Api)
import { Api } from '../../api/api';
import type { ApiProduct, ApiOrder, ApiOrderResponse } from '../types';

export class ApiClient {
  constructor(private baseUrl: string, private options: RequestInit = {}) {}

  private async _request<T>(uri: string, init?: RequestInit): Promise<T> {
    const res = await fetch(this.baseUrl + uri, {
      headers: { 'Content-Type': 'application/json', ...(this.options.headers || {}) },
      ...this.options,
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  getProducts(): Promise<ApiProduct[]> {
    return this._request<ApiProduct[]>('/products');
  }

  getProduct(id: string): Promise<ApiProduct> {
    return this._request<ApiProduct>(`/products/${id}`);
  }

  createOrder(order: ApiOrder): Promise<ApiOrderResponse> {
    return this._request<ApiOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }
}