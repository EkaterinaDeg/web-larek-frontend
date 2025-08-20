// Файл: /src/utils/Page.ts

/**
 * Модуль предоставляет класс `Page` для управления элементами страницы.
 */

/**
 * Класс `Page` управляет общими элементами страницы, например, счётчиком корзины.
 */
export class Page {
  private basketCounter: HTMLElement;

  /**
   * Создает экземпляр класса `Page` и находит элемент счётчика корзины.
   */
  constructor() {
    this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (!this.basketCounter) {
      throw new Error('Счётчик корзины не найден');
    }
  }

  /**
   * Обновляет значение счётчика корзины.
   * @param count - Количество товаров в корзине.
   */
  setBasketCount(count: number): void {
    this.basketCounter.textContent = count.toString();
  }
}