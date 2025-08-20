// Файл: /src/api/APIClient.ts

/**
 * Модуль предоставляет класс `APIClientImpl` для взаимодействия с API сервера.
 */

import {
  APIClient,
  Product,
  ProductList,
  Order,
  OrderResponse,
  APIError,
} from '../components/types';

/**
 * Класс `APIClientImpl` реализует методы для работы с API: получение товаров и создание заказа.
 */
export class APIClientImpl implements APIClient {
  private baseUrl: string;

  /**
   * Создает экземпляр класса `APIClientImpl`.
   * @param baseUrl - Базовый URL API.
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получает список товаров.
   * @returns Список товаров.
   */
  async getProducts(): Promise<ProductList> {
    const response = await fetch(`${this.baseUrl}/product/`);
    if (!response.ok) {
      throw new Error('Не удалось получить список товаров');
    }
    return (await response.json()) as ProductList;
  }

  /**
   * Получает информацию о товаре по его ID.
   * @param id - Идентификатор товара.
   * @returns Информация о товаре.
   */
  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/product/${id}`);
    if (!response.ok) {
      throw new Error('Товар не найден');
    }
    return (await response.json()) as Product;
  }

  /**
   * Создает новый заказ.
   * @param order - Данные заказа.
   * @returns Ответ сервера о создании заказа.
   */
  async createOrder(order: Order): Promise<OrderResponse> {
    const response = await fetch(`${this.baseUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      const errorData: APIError = await response.json();
      throw new Error(errorData.error || 'Не удалось создать заказ');
    }
    return (await response.json()) as OrderResponse;
  }
}