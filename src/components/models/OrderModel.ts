import type { ApiOrder, IOrderModel } from '../types/type';
import { EventBus } from '../base/EventBus';

export class OrderModel implements IOrderModel {
  order: ApiOrder | null = null;
  events: EventBus;

  constructor(events: EventBus) {
    this.events = events;
  }

  setOrder(order: ApiOrder) {
    this.order = { ...order, items: [...order.items] };
  }

  setAddress(address: string) {
    if (this.order) this.order.address = address;
  }

  setPayment(payment: 'online' | 'cash' | 'card') { // Добавлен 'card'
    if (this.order) this.order.payment = payment;
  }

  setItems(items: string[]) {
    if (this.order) this.order.items = [...items];
  }
}