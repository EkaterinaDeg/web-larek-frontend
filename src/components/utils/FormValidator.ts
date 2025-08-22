// Файл: /src/components/utils/FormValidator.ts

/**
 * Класс `FormValidator` обеспечивает базовую валидацию форм.
 */
export class FormValidator {
  private formElement: HTMLFormElement;
  private inputList: NodeListOf<HTMLInputElement | HTMLSelectElement>;
  private submitButton: HTMLButtonElement | null;

  /**
   * Создает экземпляр класса `FormValidator`.
   * @param formElement - Элемент формы для валидации.
   */
  constructor(formElement: HTMLFormElement) {
    this.formElement = formElement;
    this.inputList = this.formElement.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      'input[required], select[required]'
    );
    this.submitButton = this.formElement.querySelector<HTMLButtonElement>('button[type="submit"]');
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

    this.inputList.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('input_error');
      } else {
        input.classList.remove('input_error');
      }
    });

    if (this.submitButton) {
      this.submitButton.disabled = !isValid;
    }

    return isValid;
  }
}