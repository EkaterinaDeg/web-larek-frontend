// ===== 1. Данные API =====
export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

export interface ApiOrder {
  payment: 'online' | 'cash';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IUserContacts {
  email: string;
  phone: string;
}

export interface ApiOrderResponse {
  id: string;
  total: number;
}

// ===== 2. Модели =====
export interface IModel {
  events: IEventEmitter;
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
export enum AppEvent {
  PRODUCTS_LOADED = 'products:loaded',
  ADD_TO_BASKET = 'basket:add',
  REMOVE_FROM_BASKET = 'basket:remove',
  OPEN_BASKET = 'basket:open',
  OPEN_ORDER_FORM = 'order:form:open',
  OPEN_CONTACTS_FORM = 'order:contacts:open',
  ORDER_SUCCESS = 'order:success'
}

export interface IEventPayloads {
  [AppEvent.PRODUCTS_LOADED]: ApiProduct[];
  [AppEvent.ADD_TO_BASKET]: string;
  [AppEvent.REMOVE_FROM_BASKET]: string;
  [AppEvent.ORDER_SUCCESS]: string;
}

// ===== 5. Событийная система =====
export interface IEventEmitter {
  on<T extends keyof IEventPayloads>(event: T, listener: (payload: IEventPayloads[T]) => void): void;
  emit<T extends keyof IEventPayloads>(event: T, payload: IEventPayloads[T]): void;
}

// ===== 6. API клиент =====
export interface IApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: object): Promise<T>;
}

export interface ViewProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  inBasket: boolean;
}