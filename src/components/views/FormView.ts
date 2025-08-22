// Файл: /src/views/FormView.ts
import { EventEmitter } from '../base/EventBus';

/**
 * Базовый класс формы
 */
export class Form {
  protected emitter: EventEmitter;
  protected currentForm: HTMLFormElement | null = null;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.currentForm = this.createForm();
    this.setupForm();
  }

  /** Создает форму (переопределяется в наследниках) */
  protected createForm(): HTMLFormElement {
    throw new Error('Method createForm() must be implemented in subclass');
  }

  /** Настройка формы: обработчики, валидация (переопределяется в наследниках) */
  protected setupForm(): void {}

  /** Устанавливает состояние кнопки submit */
  protected setSubmitButtonState(enabled: boolean) {
    if (!this.currentForm) return;
    const submitButton = this.currentForm.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) submitButton.disabled = !enabled;
  }

  /** ✅ Возвращает текущую форму */
  public getForm(): HTMLFormElement {
    if (!this.currentForm) {
      throw new Error('Form was not initialized');
    }
    return this.currentForm;
  }
}