// Файл: /src/views/OrderForm.ts

/**
 * Модуль предоставляет класс `OrderForm` для обработки формы заказа.
 */

import { Form } from './FormView';
import { EventEmitter } from '../base/EventBus';
import { PaymentMethod } from '../types';
import { FormValidator } from '../utils/FormValidator';
import { validateAddress, validatePaymentMethod } from '../utils/validators';

/**
 * Класс `OrderForm` отвечает за отображение и валидацию формы заказа.
 */
export class OrderForm extends Form {
  private orderTemplate: HTMLTemplateElement;
  private formValidator: FormValidator;

  /**
   * Создает экземпляр класса `OrderForm`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    super(emitter);
    this.orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    if (!this.orderTemplate) {
      throw new Error('Template #order not found');
    }
  }

  /**
   * Создает форму заказа из шаблона.
   * @returns Элемент формы.
   */
  protected createForm(): HTMLFormElement {
    const form = this.orderTemplate.content.firstElementChild!.cloneNode(
      true
    ) as HTMLFormElement;
    this.currentForm = form;
    return form;
  }

  /**
   * Настраивает форму: добавляет обработчики и валидацию.
   */
  protected setupForm(): void {
    if (!this.currentForm) return;

    this.formValidator = new FormValidator(this.currentForm);

    const paymentButtons = this.currentForm.querySelectorAll('.order__buttons .button');
    const addressInput = this.currentForm.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;
    const submitButton = this.currentForm.querySelector(
      '.modal__actions .button'
    ) as HTMLButtonElement;

    addressInput.required = true;

    paymentButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        paymentButtons.forEach((btn) => btn.classList.remove('button_selected'));
        button.classList.add('button_selected');
        this.validateForm();
      });
    });

    addressInput.addEventListener('input', () => {
      this.validateForm();
    });

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.validateForm()) {
        this.onSubmit();
      }
    });
  }

  /**
   * Валидирует форму заказа и отображает ошибки.
   * @returns `true`, если форма валидна, иначе `false`.
   */
  validateForm(): boolean {
    if (!this.currentForm) return false;

    const isValid = this.formValidator.validate();
    this.setSubmitButtonState(isValid);

    const paymentSelected = this.currentForm.querySelector('.button_selected')
      ?.textContent || null;
    const addressInput = this.currentForm.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;
    const errorsElement = this.currentForm.querySelector('.form__errors') as HTMLElement;

    let errors = '';

    // Валидация способа оплаты
    const paymentError = validatePaymentMethod(paymentSelected);
    if (paymentError) {
      errors += paymentError + '<br>';
    }

    // Валидация адреса
    const addressError = validateAddress(addressInput.value);
    if (addressError) {
      errors += addressError + '<br>';
      addressInput.classList.add('input_error');
    } else {
      addressInput.classList.remove('input_error');
    }

    // Отображение ошибок
    if (errorsElement) {
      errorsElement.innerHTML = errors;
    }

    return isValid && errors === '';
  }

  /**
   * Обработчик отправки формы заказа.
   */
  protected onSubmit(): void {
    const paymentText = this.currentForm?.querySelector('.button_selected')
      ?.textContent || '';
    let paymentMethod: PaymentMethod = 'cash';

    if (paymentText === 'Онлайн') {
      paymentMethod = 'online';
    } else if (paymentText === 'При получении') {
      paymentMethod = 'cash';
    }

    const address = (this.currentForm.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement).value.trim();

    this.emitter.emit('orderStepCompleted', { payment: paymentMethod, address });
  }
}