// Файл: /src/views/CardView.ts

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
        this.emitter.emit('removeFromCard', product.id);
      });
    }

    return cardElement;
  }
}

/**
 * Базовый класс CardView для работы с карточками товаров.
 * Содержит общие методы, которые используются в разных представлениях.
 */
export class CardView {
  /**
   * Возвращает CSS-класс для категории.
   * @param category - название категории.
   */
  protected getCategoryClass(category: string): string | null {
    const categoryClasses: Record<string, string> = {
      'софт-скил': 'card__category_soft',
      'другое': 'card__category_other',
      'жесткий-скил': 'card__category_hard',
      'дополнительное': 'card__category_additional',
      'кнопка': 'card__category_button',
    };

    return categoryClasses[category.toLowerCase()] || null;
  }
}