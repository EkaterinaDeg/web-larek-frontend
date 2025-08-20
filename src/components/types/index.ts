// Файл: /src/types/index.ts

/**
 * Модуль содержит типы и интерфейсы, используемые в приложении.
 */

/**
 * Интерфейс продукта.
 */
export interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/**
 * Интерфейс списка продуктов.
 */
export interface ProductList {
  total: number;
  items: Product[];
}

/**
 * Тип способа оплаты.
 */
export type PaymentMethod = 'online' | 'cash';

/**
 * Интерфейс заказа.
 */
export interface Order {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

/**
 * Интерфейс ответа сервера на создание заказа.
 */
export interface OrderResponse {
  id: string;
  total: number;
}

/**
 * Интерфейс ошибки API.
 */
export interface APIError {
  error: string;
}

/**
 * Интерфейс клиента API.
 */
export interface APIClient {
  getProducts(): Promise<ProductList>;
  getProduct(id: string): Promise<Product>;
  createOrder(order: Order): Promise<OrderResponse>;
}