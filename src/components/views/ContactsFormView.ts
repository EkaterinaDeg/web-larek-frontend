// Файл: /src/views/ContactsForm.ts

/**
 * Модуль предоставляет класс `ContactsForm` для обработки формы контактов.
 */

import { Form } from './FormView';
import { EventEmitter } from '../base/EventBus';
import { FormValidator } from '../utils/FormValidator';
import { validateEmail, validatePhone } from '../utils/validators';

/**
 * Класс `ContactsForm` отвечает за отображение и валидацию формы контактов.
 */
export class ContactsForm extends Form {
  private contactsTemplate: HTMLTemplateElement;
  private formValidator: FormValidator | undefined;

  /**
   * Создает экземпляр класса `ContactsForm`.
   * @param emitter - Экземпляр EventEmitter для событийного взаимодействия.
   */
  constructor(emitter: EventEmitter) {
    super(emitter);
    this.contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    if (!this.contactsTemplate) {
      throw new Error('Template #contacts not found');
    }
  }

  /**
   * Создает форму контактов из шаблона.
   * @returns Элемент формы.
   */
  protected createForm(): HTMLFormElement {
    const form = this.contactsTemplate.content.firstElementChild!.cloneNode(
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

    const emailInput = this.currentForm.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const phoneInput = this.currentForm.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;
    const submitButton = this.currentForm.querySelector(
      '.modal__actions .button'
    ) as HTMLButtonElement;

    emailInput.required = true;
    phoneInput.required = true;

    emailInput.addEventListener('input', () => {
      this.validateForm();
    });

    phoneInput.addEventListener('input', () => {
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
   * Валидирует форму контактов и отображает ошибки.
   * @returns `true`, если форма валидна, иначе `false`.
   */
  validateForm(): boolean {
    if (!this.currentForm) return false;

    const isValid = this.formValidator.validate();
    this.setSubmitButtonState(isValid);

    const emailInput = this.currentForm.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const phoneInput = this.currentForm.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;
    const errorsElement = this.currentForm.querySelector('.form__errors') as HTMLElement;

    let errors = '';

    // Проверка Email
    const emailError = validateEmail(emailInput.value);
    if (emailError) {
      errors += emailError + '<br>';
      emailInput.classList.add('input_error');
    } else {
      emailInput.classList.remove('input_error');
    }

    // Проверка телефона
    const phoneError = validatePhone(phoneInput.value);
    if (phoneError) {
      errors += phoneError + '<br>';
      phoneInput.classList.add('input_error');
    } else {
      phoneInput.classList.remove('input_error');
    }

    // Отображение ошибок
    if (errorsElement) {
      errorsElement.innerHTML = errors;
    }

    return isValid && errors === '';
  }

  /**
   * Обработчик отправки формы контактов.
   */
  protected onSubmit(): void {
    const email = (this.currentForm.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement).value.trim();
    const phone = (this.currentForm.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement).value.trim();

    this.emitter.emit('formSubmitted', { email, phone });
  }
}