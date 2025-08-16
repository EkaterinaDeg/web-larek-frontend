import type { ApiProduct, IBasketModel } from '../types/type';
import { EventBus } from '../base/EventBus';
import { ProductModel } from './ProductModel';

export class BasketModel implements IBasketModel {
  items: Map<string, number> = new Map();
  events: EventBus;

  constructor(events: EventBus, private productModel: ProductModel) {
    this.events = events;
  }

  add(id: string) {
    const current = this.items.get(id) || 0;
    this.items.set(id, current + 1);
    this.emitChange();
  }

  remove(id: string) {
    this.items.delete(id);
    this.emitChange();
  }

  clear() {
    this.items.clear();
    this.emitChange();
  }

  getItems(): { product: ApiProduct; quantity: number }[] {
    const result: { product: ApiProduct; quantity: number }[] = [];
    this.items.forEach((quantity, id) => {
      const product = this.productModel.getProduct(id);
      if (product) result.push({ product, quantity });
    });
    return result;
  }

  getTotal(): number {
    return Array.from(this.items.entries()).reduce((sum, [id, quantity]) => {
      const p = this.productModel.getProduct(id);
      return sum + (p?.price ?? 0) * quantity;
    }, 0);
  }

  private emitChange() {
    this.events.emit('basket:changed', {
      items: Array.from(this.items.keys()),
      total: this.getTotal(),
    });
  }
}