// Файл: /src/views/Card.ts

/**
 * Модуль предоставляет класс `Card` для создания карточек товаров.
 */

import { Product } from '../types';
import { EventEmitter } from '../base/EventBus';
import { CDN_URL } from '../utils/constants';

/**
 * Класс `Card` отвечает за формирование карточек товаров для корзины.
 */
export class Card {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;

  /**
   * Создает экземпляр класса `Card`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    const templateElement = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #card-basket not found');
    }
    this.template = templateElement;
  }

  /**
   * Рендерит карточку товара.
   * @param product - Объект товара.
   * @param index - Порядковый номер товара в списке.
   * @returns Элемент карточки товара.
   */
  render(product: Product, index: number): HTMLElement {
    const cardElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const itemIndex = cardElement.querySelector('.basket__item-index');
    if (itemIndex) {
      itemIndex.textContent = (index + 1).toString();
    }

    const cardTitle = cardElement.querySelector('.card__title');
    if (cardTitle) {
      cardTitle.textContent = product.title;
    }

    const cardPrice = cardElement.querySelector('.card__price');
    if (cardPrice) {
      cardPrice.textContent = `${product.price ?? 0} синапсов`;
    }

    const cardImage = cardElement.querySelector('.card__image') as HTMLImageElement;
    if (cardImage) {
      cardImage.src = `${CDN_URL}/${product.image}`;
      cardImage.alt = product.title;
    }

    const deleteButton = cardElement.querySelector('.basket__item-delete') as HTMLButtonElement;
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        this.emitter.emit('removeFromCart', product.id);
      });
    }

    return cardElement;
  }
}