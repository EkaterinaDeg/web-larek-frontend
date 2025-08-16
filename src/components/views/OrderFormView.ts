import { FormView } from './FormView';
import { EventBus } from '../base/EventBus';

export type Payment = 'card' | 'cash';

export class OrderFormView extends FormView<unknown> {
  private payment: Payment | null = null;
  private address = '';

  constructor(bus: EventBus) {
    super(document.createElement('div'), bus);
    this.el.className = 'form';

    const paymentOptions = this.createElement('div', 'payment-options');
    const btnCard = this.createElement('button', '', paymentOptions);
    const btnCash = this.createElement('button', '', paymentOptions);
    const addressInput = this.createElement('input', '', this.el);
    const errorBox = this.createElement('p', 'form__errors');
    this.submitButton = this.createElement('button', 'order__button');

    btnCard.type = 'button';
    btnCard.name = 'card';
    btnCard.textContent = 'Онлайн';
    btnCash.type = 'button';
    btnCash.name = 'cash';
    btnCash.textContent = 'При получении';
    addressInput.type = 'text';
    addressInput.name = 'address';
    addressInput.placeholder = 'Адрес доставки';
    this.submitButton.type = 'submit';
    this.submitButton.textContent = 'Далее';
    this.submitButton.disabled = true;
    this.errorBox = errorBox;

    btnCard.addEventListener('click', () => { this.payment = 'card'; this.validate(); });
    btnCash.addEventListener('click', () => { this.payment = 'cash'; this.validate(); });
    addressInput.addEventListener('input', () => { this.address = addressInput.value.trim(); this.validate(); });

    this.el.append(paymentOptions, addressInput, errorBox, this.submitButton);
    this.validate();
  }

  protected validate() {
    const ok = !!this.payment && this.address.length > 4;
    this.setSubmitEnabled(ok);
    this.setError(ok ? '' : 'Выберите способ оплаты и введите адрес');
  }

  getData() {
    return { address: this.address, payment: this.payment || 'cash' };
  }
}