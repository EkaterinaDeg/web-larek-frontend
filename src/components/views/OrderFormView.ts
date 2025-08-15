import { FormView } from './FormView';
import { EventBus } from '../base/EventBus';
import { BaseComponent } from '../base/BaseComponent';

export type Payment = 'card' | 'cash';

export class OrderFormView extends FormView<unknown> { 
  private payment: Payment | null = null;
  private address = '';

  constructor(bus: EventBus, templateId: string) {
    super(document.createElement('div'), bus, templateId); // Вызов конструктора BaseComponent
    
    // Теперь используем this для доступа к защищенному методу cloneTemplate
    const root = this.cloneTemplate<HTMLElement>(templateId);

    this.form = root.querySelector('.form') as HTMLFormElement;
    this.submitButton = this.form.querySelector<HTMLButtonElement>('.order__button')!;
    this.errorBox = this.form.querySelector<HTMLElement>('.form__errors')!;

    const btnCard = this.form.querySelector<HTMLButtonElement>('button[name="card"]')!;
    const btnCash = this.form.querySelector<HTMLButtonElement>('button[name="cash"]')!;
    const address = this.form.querySelector<HTMLInputElement>('input[name="address"]')!;

    btnCard.addEventListener('click', () => { this.payment = 'card'; validate(); });
    btnCash.addEventListener('click', () => { this.payment = 'cash'; validate(); });
    address.addEventListener('input', () => { this.address = address.value.trim(); validate(); });

    const validate = () => {
      const ok = !!this.payment && this.address.length > 4;
      this.setSubmitEnabled(ok);
      this.setError(ok ? '' : 'Выберите способ оплаты и введите адрес');
    };

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.payment) return;
      this.bus.emit('order:contacts', { address: this.address, payment: this.payment });
      // Если вам нужно делать что-то при отправке, добавьте здесь нужный код
    });
  }
}