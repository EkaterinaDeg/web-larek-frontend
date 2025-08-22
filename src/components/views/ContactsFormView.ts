import { Form } from '../views/FormView';
import { EventEmitter } from '../base/EventBus';
import { FormValidator } from '../utils/FormValidator';
import { validateEmail, validatePhone } from '../utils/validators';

export class ContactsForm extends Form {
  private formValidator!: FormValidator;

  private emailInput!: HTMLInputElement;
  private phoneInput!: HTMLInputElement;
  private submitButton!: HTMLButtonElement;
  private errorsElement!: HTMLElement;

  constructor(emitter: EventEmitter) {
    super(emitter);
  }

  protected createForm(): HTMLFormElement {
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    if (!contactsTemplate) {
      throw new Error('Template #contacts not found in DOM');
    }

    const form = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    this.currentForm = form;

    this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = form.querySelector('.modal__actions .button') as HTMLButtonElement;
    this.errorsElement = form.querySelector('.form__errors') as HTMLElement;

    return form;
  }

  protected setupForm(): void {
    if (!this.currentForm) return;

    this.formValidator = new FormValidator(this.currentForm);

    this.emailInput.required = true;
    this.phoneInput.required = true;

    this.emailInput.addEventListener('input', () => this.validateForm());
    this.phoneInput.addEventListener('input', () => this.validateForm());

    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.validateForm()) this.onSubmit();
    });
  }

  validateForm(): boolean {
    if (!this.currentForm) return false;

    const isValid = this.formValidator.validate();
    this.setSubmitButtonState(isValid);

    const errors: string[] = [];

    const emailError = validateEmail(this.emailInput.value);
    if (emailError) {
      errors.push(emailError);
      this.emailInput.classList.add('input_error');
    } else {
      this.emailInput.classList.remove('input_error');
    }

    const phoneError = validatePhone(this.phoneInput.value);
    if (phoneError) {
      errors.push(phoneError);
      this.phoneInput.classList.add('input_error');
    } else {
      this.phoneInput.classList.remove('input_error');
    }

    this.errorsElement.innerHTML = errors.join('<br>');

    return isValid && errors.length === 0;
  }

  protected onSubmit(): void {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    this.emitter.emit('formSubmitted', { email, phone });
  }
}