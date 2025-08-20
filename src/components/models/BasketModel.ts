// Файл: /src/models/CartModel.ts

/**
 * Модуль предоставляет класс `CartModel` для управления корзиной товаров.
 */

import { EventEmitter } from '../base/EventBus';
import { Product, PaymentMethod } from '../types';

/**
 * Интерфейс для хранения деталей заказа.
 */
interface OrderDetails {
  payment: PaymentMethod;
  address: string;
}

/**
 * Класс `CartModel` управляет состоянием корзины и деталями заказа.
 */
export class CartModel {
  private items: Product[] = [];
  private emitter: EventEmitter;
  private orderDetails: OrderDetails | null = null;

  /**
   * Создает экземпляр класса `CartModel`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  /**
   * Добавляет товар в корзину.
   * @param item - Товар для добавления.
   */
  addItem(item: Product): void {
    if (this.items.some((existingItem) => existingItem.id === item.id)) {
      alert('Этот товар уже в корзине');
      return;
    }

    this.items.push(item);
    this.emitter.emit('cartUpdated');
  }

  /**
   * Удаляет товар из корзины по его ID.
   * @param id - Идентификатор товара.
   */
  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.emitter.emit('cartUpdated');
  }

  /**
   * Возвращает список товаров в корзине.
   * @returns Массив товаров.
   */
  getItems(): Product[] {
    return this.items;
  }

  /**
   * Вычисляет общую стоимость товаров в корзине.
   * @returns Общая стоимость.
   */
  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  /**
   * Очищает корзину и сбрасывает детали заказа.
   */
  clearCart(): void {
    this.items = [];
    this.orderDetails = null;
    this.emitter.emit('cartUpdated');
  }

  /**
   * Устанавливает детали заказа.
   * @param details - Детали заказа.
   */
  setOrderDetails(details: OrderDetails): void {
    this.orderDetails = details;
  }

  /**
   * Возвращает детали заказа.
   * @returns Детали заказа.
   */
  getOrderDetails(): OrderDetails {
    if (!this.orderDetails) {
      throw new Error('Детали заказа не установлены');
    }
    return this.orderDetails;
  }

  /**
   * Проверяет наличие товара в корзине по его ID.
   * @param id - Идентификатор товара.
   * @returns `true`, если товар есть в корзине, иначе `false`.
   */
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}