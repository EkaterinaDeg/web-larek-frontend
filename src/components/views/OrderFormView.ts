import { Form } from '../views/FormView';
import { EventEmitter } from '../base/EventBus';
import { PaymentMethod } from '../types';
import { FormValidator } from '../utils/FormValidator';
import { validateAddress, validatePaymentMethod } from '../utils/validators';

export class OrderFormView extends Form {
  private formValidator!: FormValidator;

  private paymentButtons!: NodeListOf<HTMLButtonElement>;
  private addressInput!: HTMLInputElement;
  private submitButton!: HTMLButtonElement;
  private errorsElement!: HTMLElement;

  constructor(emitter: EventEmitter) {
    super(emitter);
  }

  protected createForm(): HTMLFormElement {
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    if (!orderTemplate) {
      throw new Error('Template #order not found in DOM');
    }

    const form = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    this.currentForm = form;

    this.paymentButtons = form.querySelectorAll('.order__buttons .button');
    this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    this.submitButton = form.querySelector('.modal__actions .button') as HTMLButtonElement;
    this.errorsElement = form.querySelector('.form__errors') as HTMLElement;

    return form;
  }

  protected setupForm(): void {
    if (!this.currentForm) return;

    this.formValidator = new FormValidator(this.currentForm);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.paymentButtons.forEach((btn) =>
          btn.classList.remove('button_selected')
        );
        button.classList.add('button_selected');
        this.validateForm();
      });
    });

    this.addressInput.addEventListener('input', () => this.validateForm());

    this.currentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.validateForm()) this.onSubmit();
    });
  }

  validateForm(): boolean {
    if (!this.currentForm) return false;

    const isValid = this.formValidator.validate();
    this.setSubmitButtonState(isValid);

    const paymentText = this.currentForm.querySelector('.button_selected')?.textContent || null;
    const address = this.addressInput.value.trim();

    const errors: string[] = [];

    const paymentError = validatePaymentMethod(paymentText);
    if (paymentError) errors.push(paymentError);

    const addressError = validateAddress(address);
    if (addressError) {
      errors.push(addressError);
      this.addressInput.classList.add('input_error');
    } else {
      this.addressInput.classList.remove('input_error');
    }

    this.errorsElement.innerHTML = errors.join('<br>');

    return isValid && errors.length === 0;
  }

  protected onSubmit(): void {
    const paymentText = this.currentForm?.querySelector('.button_selected')?.textContent || '';
    const paymentMethod: PaymentMethod = paymentText === 'Онлайн' ? 'online' : 'cash';
    const address = this.addressInput.value.trim();

    this.emitter.emit('orderStepCompleted', { payment: paymentMethod, address });
  }
}