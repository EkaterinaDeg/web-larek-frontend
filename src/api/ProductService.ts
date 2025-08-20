// Файл: /src/api/ProductService.ts

/**
 * Модуль предоставляет класс `ProductService` для работы с товарами через API.
 */

import { APIClient } from '../components/types';
import { Product } from '../components/types';

/**
 * Класс `ProductService` предоставляет методы для получения данных о товарах.
 */
export class ProductService {
  private apiClient: APIClient;

  /**
   * Создает экземпляр класса `ProductService`.
   * @param apiClient - Клиент для взаимодействия с API.
   */
  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  /**
   * Получает список всех товаров.
   * @returns Массив товаров.
   */
  async fetchProducts(): Promise<Product[]> {
    const productList = await this.apiClient.getProducts();
    return productList.items;
  }

  /**
   * Получает информацию о товаре по его ID.
   * @param id - Идентификатор товара.
   * @returns Объект товара.
   */
  async fetchProductById(id: string): Promise<Product> {
    return await this.apiClient.getProduct(id);
  }
}