import { FormView } from './FormView';
import { BaseComponent } from '../base/BaseComponent';
import type { IUserContacts } from '../types';

export class ContactsFormView extends FormView<IUserContacts> {
  private email = '';
  private phone = '';

  constructor() {
    const root = document.createElement('div'); // Создаем элемент div
    super(root, null as any); // Передаем его в базовый класс
    this.el = this.cloneTemplate<HTMLElement>('contacts'); // Клонируем шаблон
  }

  render(_: IUserContacts) {
    this.form = this.el as HTMLFormElement;
    this.submitButton = this.form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    this.errorBox = this.form.querySelector<HTMLElement>('.form__errors')!;
    const email = this.form.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phone = this.form.querySelector<HTMLInputElement>('input[name="phone"]')!;

    const validate = () => {
      const ok = /\S+@\S+\.\S+/.test(this.email) && this.phone.replace(/\D/g, '').length >= 10;
      this.setSubmitEnabled(ok);
      this.setError(ok ? '' : 'Введите корректные email и телефон');
    };

    email.addEventListener('input', () => { this.email = email.value.trim(); validate(); });
    phone.addEventListener('input', () => { this.phone = phone.value.trim(); validate(); });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const detail: IUserContacts = { email: this.email, phone: this.phone };
      // передаём наружу через кастомное событие submit формы (обработчик навесится снаружи)
      this.el.dispatchEvent(new CustomEvent('contacts:submit', { detail, bubbles: true }));
    });

    return super.render();
  }
}