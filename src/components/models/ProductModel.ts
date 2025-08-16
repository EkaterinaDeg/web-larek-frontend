import type { ApiProduct, IProductModel } from '../types/type';
import { EventBus } from '../base/EventBus';
import { IApiClient } from '../types/type'; // Используем интерфейс

export class ProductModel implements IProductModel {
  products: ApiProduct[] = [];
  events: EventBus;

  constructor(private api: IApiClient, private bus: EventBus) {
    this.events = bus;
    this.bus.on('products:load', () => this.load());
  }

  async load() {
    try {
      const response = await this.api.get<ApiProduct[]>('/products'); // Используем get
      this.setProducts(response);
      this.bus.emit('products:loaded', { products: response });
    } catch (err) {
      this.bus.emit('ui:error', { message: 'Ошибка загрузки товаров' });
    }
  }

  setProducts(products: ApiProduct[]) {
    this.products = products;
  }

  getProduct(id: string) {
    return this.products.find((p) => p.id === id);
  }
}