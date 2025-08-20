// Файл: /src/views/Form.ts

/**
 * Модуль предоставляет базовый класс `Form` для форм приложения.
 */

import { EventEmitter } from '../base/EventBus';

/**
 * Базовый класс `Form` для всех форм приложения.
 */
export abstract class Form {
  protected emitter: EventEmitter;
  protected currentForm: HTMLFormElement | null = null;
  protected submitButton: HTMLButtonElement | null = null;

  /**
   * Создает экземпляр класса `Form`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  /**
   * Возвращает элемент формы для отображения.
   * @returns Элемент формы.
   */
  getForm(): HTMLElement {
    this.currentForm = this.createForm();
    this.submitButton = this.currentForm.querySelector(
      '.modal__actions .button'
    ) as HTMLButtonElement;
    this.setupForm();
    return this.currentForm;
  }

  /**
   * Валидирует форму.
   * @returns `true`, если форма валидна.
   */
  validateForm(): boolean {
    return true; // Реализуется в дочерних классах
  }

  /**
   * Устанавливает состояние кнопки отправки.
   * @param isValid - Валидна ли форма.
   */
  setSubmitButtonState(isValid: boolean): void {
    if (this.submitButton) {
      this.submitButton.disabled = !isValid;
    }
  }

  /**
   * Создает форму из шаблона.
   * @returns Элемент формы.
   */
  protected abstract createForm(): HTMLFormElement;

  /**
   * Настраивает форму: добавляет обработчики и валидацию.
   */
  protected abstract setupForm(): void;

  /**
   * Обработчик отправки формы.
   */
  protected abstract onSubmit(): void;
}