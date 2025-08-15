import type { ApiOrder, ApiProduct } from '../types';

export class OrderModel {
  order: ApiOrder = { items: [], address: '', payment: '' };

  setAddress(address: string) {
    this.order.address = address;
  }

  setPayment(payment: string) {
    this.order.payment = payment;
  }

  setItems(items: string[]) {
    this.order.items = items;
  }

  getTotal(products: ApiProduct[]): number {
    return this.order.items.reduce((sum, id) => {
      const p = products.find((x) => x.id === id);
      return sum + (p?.price ?? 0);
    }, 0);
  }
}