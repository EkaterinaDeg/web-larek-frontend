// Файл: /src/views/ProductDetailView.ts

/**
 * Модуль предоставляет класс `ProductDetailView` для отображения деталей продукта.
 */

import { Product } from '../types';
import { EventEmitter } from '../base/EventBus';
import { CDN_URL } from '../utils/constants';
import { CardView } from '../views/CardView';

/**
 * Класс `ProductDetailView` отвечает за отображение детальной информации о товаре.
 */
export class ProductDetailView extends CardView {   // 👈 теперь наследуемся
  private emitter: EventEmitter;
  private template: HTMLTemplateElement;
  private isProductInCard: (productId: string) => boolean;

  constructor(emitter: EventEmitter, isProductInCard: (productId: string) => boolean) {
    super(); // 👈 вызываем конструктор родителя
    this.emitter = emitter;
    this.isProductInCard = isProductInCard;

    const templateElement = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!templateElement) {
      throw new Error('Template #card-preview not found');
    }
    this.template = templateElement;
  }

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

      const categoryClass = this.getCategoryClass(product.category); // 👈 используем базовый метод
      if (categoryClass) {
        cardCategory.classList.add(categoryClass);
      }
    }

    const cardText = detailElement.querySelector('.card__text');
    if (cardText) {
      cardText.textContent = product.description;
    }

    const button = detailElement.querySelector('.button.card__button') as HTMLButtonElement;

    if (!product.price) {
      button.disabled = true;
      button.textContent = 'Недоступно';
      button.classList.add('button_disabled');
    } else {
      const updateButtonState = () => {
        if (this.isProductInCard(product.id)) {
          button.textContent = 'Удалить из корзины';
          button.classList.add('button_remove');
        } else {
          button.textContent = 'В корзину';
          button.classList.remove('button_remove');
        }
      };

      updateButtonState();

      button.addEventListener('click', () => {
        if (this.isProductInCard(product.id)) {
          this.emitter.emit('removeFromCard', product.id);
        } else {
          this.emitter.emit('addToCard', product);
        }
        updateButtonState();
      });

      this.emitter.on('cardUpdated', updateButtonState);
    }

    return detailElement;
  }
}