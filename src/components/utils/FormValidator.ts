// Файл: /src/utils/FormValidator.ts

/**
 * Модуль предоставляет класс `FormValidator` для валидации форм.
 */

/**
 * Класс `FormValidator` обеспечивает базовую валидацию форм.
 */
export class FormValidator {
  private formElement: HTMLFormElement;

  /**
   * Создает экземпляр класса `FormValidator`.
   * @param formElement - Элемент формы для валидации.
   */
  constructor(formElement: HTMLFormElement) {
    this.formElement = formElement;
    this.attachEventListeners();
  }

  /**
   * Добавляет обработчик событий для валидации при вводе данных.
   */
  private attachEventListeners(): void {
    this.formElement.addEventListener('input', () => this.validate());
  }

  /**
   * Валидирует форму.
   * @returns `true`, если форма валидна, иначе `false`.
   */
  validate(): boolean {
    let isValid = true;
    const inputs = this.formElement.querySelectorAll<HTMLInputElement>(
      'input[required], select[required]'
    );
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('input_error');
      } else {
        input.classList.remove('input_error');
      }
    });
    return isValid;
  }
}