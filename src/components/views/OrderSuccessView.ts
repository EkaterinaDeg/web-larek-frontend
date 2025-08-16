import { BaseComponent } from '../base/BaseComponent';
import { EventBus } from '../base/EventBus';

export class OrderSuccessView extends BaseComponent<{ id: string }> {
  constructor(bus: EventBus) {
    super(document.createElement('div'), bus);
    this.el.className = 'order-success';
  }

  render(params?: { id: string } | void) {
    this.el.innerHTML = '';
    const description = this.createElement('p', 'order-success__description');
    const button = this.createElement('button', '');

    const orderId = params?.id;
    description.textContent = orderId ? `Списано ${orderId} синапсов` : 'Списано 0 синапсов';
    button.textContent = 'За новыми покупками!';

    this.el.append(description, button);
    return this.el;
  }
}