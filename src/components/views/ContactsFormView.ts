import { FormView } from './FormView';
import type { IUserContacts } from '../types';
import { EventBus } from '../base/EventBus';

/**
 * Форма контактов (email/phone).
 * Представление: не хранит бизнес-логику, валидирует ввод и
 * эмитит события наружу. Контроллер/индекс подписывается на submit.
 */
export class ContactsFormView extends FormView<IUserContacts> {
  private email = '';
  private phone = '';

  constructor() {
    // FormView сам создаёт корневой элемент; здесь только клонируем шаблон
    const el = document.createElement('div');
    super(el, null as unknown as EventBus, 'contacts'); // Передаем 'contacts' как templateId
    this.el = this.cloneTemplate<HTMLElement>('contacts');
  }

  render(data?: Partial<IUserContacts>) {
    // Возможна предзаполненная форма
    if (data?.email) this.email = data.email;
    if (data?.phone) this.phone = data.phone;

    this.form = this.el as HTMLFormElement;
    this.submitButton = this.form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    this.errorBox = this.form.querySelector<HTMLElement>('.form__errors')!;

    const email = this.form.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phone = this.form.querySelector<HTMLInputElement>('input[name="phone"]')!;

    if (this.email) email.value = this.email;
    if (this.phone) phone.value = this.phone;

    const validate = () => {
      const ok =
        /\S+@\S+\.\S+/.test(this.email) &&
        this.phone.replace(/\D/g, '').length >= 10;

      this.setSubmitEnabled(ok);
      this.setError(ok ? '' : 'Введите корректные email и телефон');
    };

    email.addEventListener('input', () => {
      this.email = email.value.trim();
      validate();
    });

    phone.addEventListener('input', () => {
      this.phone = phone.value.trim();
      validate();
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const detail: IUserContacts = { email: this.email, phone: this.phone };
      // наружу — одно событие, контроллер сам решает, что делать
      this.el.dispatchEvent(new CustomEvent('contacts:submit', { detail, bubbles: true }));
    });

    validate(); // первичная валидация при рендере
    return super.render();
  }
}