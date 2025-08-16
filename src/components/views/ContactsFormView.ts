import { FormView } from './FormView';
import type { IUserContacts } from '../types/type';
import { EventBus } from '../base/EventBus';

export class ContactsFormView extends FormView<IUserContacts> {
  private email = '';
  private phone = '';

  constructor(bus: EventBus) {
    super(document.createElement('div'), bus);
    this.el.className = 'form';

    const emailInput = this.createElement('input', '', this.el);
    const phoneInput = this.createElement('input', '', this.el);
    const errorBox = this.createElement('p', 'form__errors');
    this.submitButton = this.createElement('button', '');

    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Email';
    phoneInput.type = 'tel';
    phoneInput.name = 'phone';
    phoneInput.placeholder = 'Телефон';
    this.submitButton.type = 'submit';
    this.submitButton.textContent = 'Оплатить';
    this.submitButton.disabled = true;
    this.errorBox = errorBox;

    emailInput.addEventListener('input', () => {
      this.email = emailInput.value.trim();
      this.validate();
    });

    phoneInput.addEventListener('input', () => {
      this.phone = phoneInput.value.trim();
      this.validate();
    });

    this.el.append(emailInput, phoneInput, errorBox, this.submitButton);
    this.validate();
  }

  protected validate() {
    const ok = /\S+@\S+\.\S+/.test(this.email) && this.phone.replace(/\D/g, '').length >= 10;
    this.setSubmitEnabled(ok);
    this.setError(ok ? '' : 'Введите корректные email и телефон');
  }

  getData() {
    return { email: this.email, phone: this.phone };
  }
}