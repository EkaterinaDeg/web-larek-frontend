// Файл: /src/models/ProductModel.ts

/**
 * Модуль предоставляет класс `ProductModel` для управления данными о товарах.
 */

import { EventEmitter } from '../base/EventBus';
import { Product } from '../types';

/**
 * Класс `ProductModel` хранит и управляет данными о товарах.
 */
export class ProductModel {
  private emitter: EventEmitter;
  private products: Product[] = [];

  /**
   * Создает экземпляр класса `ProductModel`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  /**
   * Устанавливает список товаров.
   * @param products - Массив товаров.
   */
  setProducts(products: Product[]): void {
    this.products = products;
    this.emitter.emit('productsUpdated', this.products);
  }

  /**
   * Возвращает товар по его ID.
   * @param id - Идентификатор товара.
   * @returns Товар или `undefined`, если не найден.
   */
  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * Возвращает список всех товаров.
   * @returns Массив товаров.
   */
  getProducts(): Product[] {
    return this.products;
  }
}