import { EventBus } from '../base/EventBus';

// ===== 1. Данные API =====
export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

export interface ApiOrder {
  payment: 'online' | 'cash' | 'card';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: object): Promise<T>;
}

export interface IUserContacts {
  email: string;
  phone: string;
}

export interface ApiOrderResponse {
  id: string;
  total: number;
}

// ===== 2. Представление продуктов (UI) =====
export interface ViewProduct extends ApiProduct {
  inBasket: boolean; // Дополнительное поле для UI
}

// ===== 2. Модели =====
export interface IModel {
  events: EventBus; // Используем класс EventBus
}

export interface IProductModel extends IModel {
  products: ApiProduct[];
  setProducts(products: ApiProduct[]): void;
  getProduct(id: string): ApiProduct | undefined;
}

export interface IBasketModel extends IModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  getItems(): { product: ApiProduct; quantity: number }[];
  getTotal(): number;
}

export interface IOrderModel extends IModel {
  order: ApiOrder | null;
  setOrder(order: ApiOrder): void;
  setAddress(address: string): void;
  setPayment(payment: 'online' | 'cash' | 'card'): void;
  setItems(items: string[]): void;
}

// ===== 3. UI-компоненты =====
export interface IPageView {
  renderCatalog(products: ApiProduct[]): void;
}

export interface ICardView {
  render(product: ApiProduct): HTMLElement;
}

export interface IBasketView {
  render(items: { product: ApiProduct; quantity: number }[]): HTMLElement;
}

export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
}

export interface IFormView {
  render(): HTMLElement;
  getData(): Record<string, string>;
}

export interface IOrderFormView extends IFormView {}
export interface IContactsFormView extends IFormView {}
export interface IOrderSuccessView {
  render(orderId: string): HTMLElement;
}

// ===== 4. События =====
export { AppEvent, IEventPayloads } from '../events';