import type { ApiProduct } from '../types';
import { EventBus } from '../base/EventBus';

export class BasketModel {
  items: string[] = [];

  constructor(private bus: EventBus) {}

  add(id: string, products: ApiProduct[]) {
    if (!this.items.includes(id)) {
      this.items.push(id);
      this.emitChange(products);
    }
  }

  remove(id: string, products: ApiProduct[]) {
    this.items = this.items.filter((x) => x !== id);
    this.emitChange(products);
  }

  clear(products: ApiProduct[]) {
    this.items = [];
    this.emitChange(products);
  }

  getTotal(products: ApiProduct[]): number {
    return this.items.reduce((sum, id) => {
      const p = products.find((x) => x.id === id);
      return sum + (p?.price ?? 0);
    }, 0);
  }

  private emitChange(products: ApiProduct[]) {
    this.bus.emit('basket:changed', {
      items: this.items.slice(),
      total: this.getTotal(products),
    });
  }
}