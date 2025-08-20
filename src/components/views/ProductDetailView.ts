// Файл: /src/views/ProductDetailView.ts

/**
 * Модуль предоставляет класс `ProductDetailView` для отображения деталей продукта.
 */

import { Product } from '../types';
import { EventEmitter } from '../base/EventBus';
import { CDN_URL } from '../utils/constants';

/**
 * Класс `ProductDetailView` отвечает за отображение детальной информации о товаре.
 */
export class ProductDetailView {
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;
  private isProductInCart: (productId: string) => boolean;

  /**
   * Создает экземпляр класса `ProductDetailView`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   * @param isProductInCart - Функция для проверки наличия товара в корзине.
   */
  constructor(emitter: EventEmitter, isProductInCart: (productId: string) => boolean) {
    this.emitter = emitter;
    this.isProductInCart = isProductInCart;

    const templateElement = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #card-preview not found');
    }
    this.template = templateElement;
  }

  /**
   * Рендерит детальную информацию о товаре.
   * @param product - Объект товара.
   * @returns Элемент с детальной информацией о товаре.
   */
  render(product: Product): HTMLElement {
    const detailElement = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const cardTitle = detailElement.querySelector('.card__title');
    if (cardTitle) {
      cardTitle.textContent = product.title;
    }

    const cardImage = detailElement.querySelector('.card__image') as HTMLImageElement;
    if (cardImage) {
      cardImage.src = `${CDN_URL}/${product.image}`;
      cardImage.alt = product.title;
    }

    const cardPrice = detailElement.querySelector('.card__price');
    if (cardPrice) {
      cardPrice.textContent = `${product.price ?? 0} синапсов`;
    }

    const cardCategory = detailElement.querySelector('.card__category');
    if (cardCategory) {
      cardCategory.textContent = product.category;

      // Применяем класс категории для цвета
      const categoryClass = this.getCategoryClass(product.category);
      if (categoryClass) {
        cardCategory.classList.add(categoryClass);
      }
    }

    const cardText = detailElement.querySelector('.card__text');
    if (cardText) {
      cardText.textContent = product.description;
    }

    const button = detailElement.querySelector('.button.card__button') as HTMLButtonElement;

    // Блокируем кнопку, если цена равна 0
    if (!product.price) {
      button.disabled = true;
      button.textContent = 'Недоступно';
      button.classList.add('button_disabled');
    } else {
      const updateButtonState = () => {
        if (this.isProductInCart(product.id)) {
          button.textContent = 'Удалить из корзины';
          button.classList.add('button_remove');
        } else {
          button.textContent = 'В корзину';
          button.classList.remove('button_remove');
        }
      };

      updateButtonState(); // Устанавливаем начальное состояние кнопки

      button.addEventListener('click', () => {
        if (this.isProductInCart(product.id)) {
          this.emitter.emit('removeFromCart', product.id); // Удаляем товар из корзины
        } else {
          this.emitter.emit('addToCart', product); // Добавляем товар в корзину
        }
        updateButtonState(); // Обновляем состояние кнопки
      });

      this.emitter.on('cartUpdated', updateButtonState); // Следим за обновлением корзины
    }

    return detailElement;
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