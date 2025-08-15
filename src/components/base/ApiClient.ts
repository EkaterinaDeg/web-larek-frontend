import type { IApiClient, ApiProduct, ApiOrder, ApiOrderResponse } from '../types';
import { Api } from '../../api/api';

/**
 * Обёртка над низкоуровневым Api, реализующая интерфейс IApiClient.
 */
export class ApiClient implements IApiClient {
  constructor(private api: Api) {}
  
  get<T>(endpoint: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
  
  post<T>(endpoint: string, data: object): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async getProducts(): Promise<ApiProduct[]> {
    return this.api.get<ApiProduct[]>('/product');
  }

  async getProduct(id: string): Promise<ApiProduct> {
    return this.api.get<ApiProduct>(`/product/${id}`); // Исправлено
  }

  async createOrder(order: ApiOrder): Promise<ApiOrderResponse> {
    return this.api.post<ApiOrderResponse>('/order', order); // Исправлено
  }
}