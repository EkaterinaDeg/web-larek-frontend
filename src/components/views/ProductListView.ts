// Файл: /src/views/ProductListView.ts

/**
 * Модуль предоставляет класс `ProductListView` для отображения списка товаров.
 */

import { Product } from '../types';
import { EventEmitter } from '../base/EventBus';
import { CDN_URL } from '../utils/constants';

/**
 * Класс `ProductListView` отвечает за отображение списка товаров на главной странице.
 */
export class ProductListView {
  private container: HTMLElement;
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;

  /**
   * Создает экземпляр класса `ProductListView`.
   * @param container - Контейнер для размещения списка товаров.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(container: HTMLElement, emitter: EventEmitter) {
    this.container = container;
    this.emitter = emitter;
    const templateElement = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #card-catalog not found');
    }
    this.template = templateElement;
  }

  /**
   * Рендерит список товаров.
   * @param products - Массив товаров для отображения.
   */
  render(products: Product[]): void {
    this.container.innerHTML = '';
    products.forEach((product) => {
      const productCard = this.createProductCard(product);
      this.container.appendChild(productCard);
    });
  }

  /**
   * Создает карточку товара для каталога.
   * @param product - Объект товара.
   * @returns Элемент карточки товара.
   */
  private createProductCard(product: Product): HTMLElement {
    const cardElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const cardTitle = cardElement.querySelector('.card__title');
    if (cardTitle) {
      cardTitle.textContent = product.title;
    }

    const cardImage = cardElement.querySelector('.card__image') as HTMLImageElement;
    if (cardImage) {
      cardImage.src = `${CDN_URL}/${product.image}`;
      cardImage.alt = product.title;
    }

    const cardPrice = cardElement.querySelector('.card__price');
    if (cardPrice) {
      cardPrice.textContent = `${product.price ?? 0} синапсов`;
    }

    const cardCategory = cardElement.querySelector('.card__category');
    if (cardCategory) {
      cardCategory.textContent = product.category;

      // Применяем класс категории для цвета
      const categoryClass = this.getCategoryClass(product.category);
      if (categoryClass) {
        cardCategory.classList.add(categoryClass);
      }
    }

    cardElement.addEventListener('click', () => {
      this.emitter.emit('productSelected', product.id);
    });

    return cardElement;
  }

  /**
   * Возвращает класс категории на основе имени категории.
   * @param category - Название категории.
   * @returns Имя класса категории.
   */
  private getCategoryClass(category: string): string | null {
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