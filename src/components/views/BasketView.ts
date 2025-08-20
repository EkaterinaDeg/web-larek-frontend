// Файл: /src/views/CartView.ts

/**
 * Модуль предоставляет класс `CartView` для отображения корзины товаров.
 */

import { Product } from '../types';
import { EventEmitter } from '../base/EventBus';
import { Card } from './CardView';

/**
 * Класс `CartView` отвечает за отображение корзины товаров.
 */
export class CartView {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;
  private card: Card;

  /**
   * Создает экземпляр класса `CartView`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    const templateElement = document.getElementById('basket') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #basket not found');
    }
    this.template = templateElement;

    this.card = new Card(emitter);
  }

  /**
   * Рендерит корзину с товарами.
   * @param items - Список товаров в корзине.
   * @param total - Общая стоимость товаров.
   * @returns Элемент корзины для отображения.
   */
  render(items: Product[], total: number): HTMLElement {
    const basketElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const listElement = basketElement.querySelector('.basket__list') as HTMLElement;
    listElement.innerHTML = '';

    items.forEach((item, index) => {
      const listItem = this.card.render(item, index);
      listElement.appendChild(listItem);
    });

    const totalPriceElement = basketElement.querySelector('.basket__price');
    if (totalPriceElement) {
      totalPriceElement.textContent = `${total} синапсов`;
    }

    const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
    if (checkoutButton) {
      checkoutButton.disabled = items.length === 0;
      checkoutButton.addEventListener('click', () => {
        this.emitter.emit('checkout');
      });
    }

    return basketElement;
  }
}