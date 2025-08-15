import type { ApiProduct } from '../types';
import { EventBus } from '../base/EventBus';
import type { IEventPayloads } from '../base/events';
import { ApiClient } from '../base/ApiClient';

export class ProductModel {
  products: ApiProduct[] = [];

  constructor(private api: ApiClient, private bus: EventBus) {
    this.bus.on('products:load', () => this.load());
  }

  async load() {
    const products = await this.api.getProducts();
    this.products = products;
    this.bus.emit('products:loaded', { products } as IEventPayloads['products:loaded']);
  }

  getProductById(id: string) {
    return this.products.find((p) => p.id === id);
  }
}