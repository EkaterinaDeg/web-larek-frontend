// Файл: /src/views/BasketView.ts

import { Product } from '../types';
import { EventEmitter } from '../base/EventBus';
import { Card } from './CardView';

/**
 * Класс `BasketView` отвечает за отображение корзины товаров.
 */
export class BasketView {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;
  private card: Card;

  private basketElement: HTMLElement;
  private listElement: HTMLElement;
  private totalPriceElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;

  /**
   * Создает экземпляр класса `BasketView`.
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

    // Один раз клонируем DOM-элемент корзины
    this.basketElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Ищем внутренние элементы корзины и сохраняем ссылки
    this.listElement = this.basketElement.querySelector('.basket__list') as HTMLElement;
    this.totalPriceElement = this.basketElement.querySelector('.basket__price') as HTMLElement;
    this.checkoutButton = this.basketElement.querySelector('.basket__button') as HTMLButtonElement;

    // Навешиваем обработчик кнопки "Оформить заказ" 1 раз
    this.checkoutButton.addEventListener('click', () => {
      this.emitter.emit('checkout');
    });
  }

  /**
   * Рендерит корзину с товарами.
   * @param items - Список товаров в корзине.
   * @param total - Общая стоимость товаров.
   * @returns Элемент корзины для отображения.
   */
  render(items: Product[], total: number): HTMLElement {
    this.listElement.innerHTML = '';

    items.forEach((item, index) => {
      const listItem = this.card.render(item, index);
      this.listElement.appendChild(listItem);
    });

    this.totalPriceElement.textContent = `${total} синапсов`;
    this.checkoutButton.disabled = items.length === 0;

    return this.basketElement;
  }
}