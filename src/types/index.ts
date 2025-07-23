// Типы данных, приходящие с API

/**
 * Описывает товар, который приходит с сервера через API
 * @interface ApiProduct
 * @property {string} id - Уникальный идентификатор товара
 * @property {string} title - Название товара
 * @property {string} description - Описание товара
 * @property {string} image - Ссылка на изображение товара
 * @property {string} category - Категория товара
 * @property {number | null} price - Цена товара (может быть null)
 */
export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

/**
 * Описывает заказ, который отправляется на сервер
 * @interface ApiOrder
 * @property {string[]} items - Массив id товаров, которые заказывает пользователь
 * @property {string} address - Адрес доставки
 * @property {string} payment - Способ оплаты
*/

export interface ApiOrder {
  items: string[];
  address: string;
  payment: string;
}

/**
 * Описывает ответ сервера после оформления заказа
 * @interface ApiOrderResponse
 * @property {string} id - Уникальный номер заказа
 * @property {number} total - Итоговая сумма заказа
 */
export interface ApiOrderResponse {
  id: string;
  total: number;
}

// Типы для отображения на экране

/**
 * Описывает, как товар будет отображаться на экране
 * Может содержать дополнительные поля, например, inBasket
 * @interface ViewProduct
 * @property {string} id
 * @property {string} title
 * @property {string} image
 * @property {number} price
 * @property {boolean} inBasket - true, если товар уже в корзине
 */
export interface ViewProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  inBasket: boolean;
}

// Интерфейс API-клиента

/**
 * Описывает методы для работы с сервером (API)
 * @interface IApiClient
 * @method getProducts - Получить список всех товаров
 * @method getProduct - Получить один товар по id
 * @method createOrder - Создать заказ
 */
export interface IApiClient {
  getProducts(): Promise<ApiProduct[]>;
  getProduct(id: string): Promise<ApiProduct>;
  createOrder(order: ApiOrder): Promise<ApiOrderResponse>;
}

// Интерфейсы модели данных

/**
 * Описывает структуру и методы модели данных приложения
 * @interface IModel
 * @property {ApiProduct[]} products - Список всех товаров
 * @property {string[]} basket - Массив id товаров, добавленных в корзину
 * @method addToBasket - Добавить товар в корзину
 * @method removeFromBasket - Удалить товар из корзины
 */
export interface IModel {
  products: ApiProduct[];
  basket: string[];
  addToBasket(id: string): void;
  removeFromBasket(id: string): void;
}

// Интерфейсы отображений

/**
 * Описывает методы для отображения данных на экране
 * @interface IView
 * @method render - Отрисовать список товаров
 * @method showProduct - Показать подробную информацию о товаре
 */
export interface IView {
  render(products: ViewProduct[]): void;
  showProduct(product: ViewProduct): void;
}

// Перечисление событий и их интерфейсы

/**
 * Список возможных событий в приложении
 * @typedef {('product:add'|'product:remove'|'basket:open'|'order:submit')} AppEvent
 */
export type AppEvent =
  | 'product:add'
  | 'product:remove'
  | 'basket:open'
  | 'order:submit';

/**
 * Описывает структуру данных (payload), которые передаются с каждым событием
 * @interface IEventPayloads
 * @property {{id: string}} 'product:add' - id добавленного товара
 * @property {{id: string}} 'product:remove' - id удалённого товара
 * @property {undefined} 'basket:open' - нет данных, просто открытие корзины
 * @property {{order: ApiOrder}} 'order:submit' - данные заказа
*/

export interface IEventPayloads {
  'product:add': { id: string };
  'product:remove': { id: string };
  'basket:open': undefined;
  'order:submit': { order: ApiOrder };
}

// Интерфейсы базовых классов

/**
 * Базовый интерфейс для всех UI-компонентов
 * @interface IComponent
 * @method render - Отрисовать компонент
 * @method show - Показать компонент
 * @method hide - Скрыть компонент
*/

export interface IComponent {
  render(): void;
  show(): void;
  hide(): void;
}

// Прочие типы (можно расширять по мере необходимости)

/**
 * Описывает состояние формы (валидность и ошибки)
 * @interface IFormState
 * @property {boolean} valid - true, если форма заполнена правильно
 * @property {string[]} errors - список ошибок, если есть
*/

export interface IFormState {
  valid: boolean;
  errors: string[];
}

/**
 * Описывает контактные данные пользователя
 * @interface IUserContacts
 * @property {string} email - Email пользователя
 * @property {string} phone - Телефон пользователя
 */
export interface IUserContacts {
  email: string;
  phone: string;
}

/**
 * Представление карточки товара (Card)
 * @interface ICardView
 * @constructor (product: ViewProduct, inBasket: boolean)
 * @property {ViewProduct} product - Данные товара
 * @property {boolean} inBasket - true, если товар в корзине
 * @method render - Отрисовать карточку товара
 * @method update - Обновить состояние (например, кнопка "В корзину")
*/

export interface ICardView {
  new (product: ViewProduct, inBasket: boolean): ICardView;
  product: ViewProduct;
  inBasket: boolean;
  render(): void;
  update(inBasket: boolean): void;
}

/**
 * Представление одного товара в каталоге (ProductItemView)
 * @interface IProductItemView
 * @property {string} id - id товара
 * @method render - Отрисовать карточку товара
*/

export interface IProductItemView {
  id: string;
  render(): void;
}

/**
 * Представление одного товара в корзине (BasketItemView)
 * @interface IBasketItemView
 * @property {string} id - id товара
 * @method render - Отрисовать товар в корзине
*/

export interface IBasketItemView {
  id: string;
  render(): void;
}

/**
 * Представление главной страницы (PageView)
 * @interface IPageView
 * @constructor (container: HTMLElement)
 * @method render - Отрисовать список товаров на главной странице
*/

export interface IPageView {
  render(items: IProductItemView[]): void;
}

/**
 * Представление корзины (BasketView)
 * @interface IBasketView
 * @constructor (container: HTMLElement)
 * @method render - Отрисовать список товаров в корзине
*/

export interface IBasketView {
  render(items: IBasketItemView[]): void;
  toggleButton(enabled: boolean): void;
  setTotal(total: number): void;
}

/**
 * Модальное окно (Modal)
 * @interface IModalView
 * @constructor (content: HTMLElement)
 * @method show - Показать модальное окно
 * @method hide - Скрыть модальное окно
 * @method setContent - Задать новое содержимое
*/

export interface IModalView {
  new (content: HTMLElement): IModalView;
  show(): void;
  hide(): void;
  setContent(content: HTMLElement): void;
}

/**
 * Базовое представление формы (FormView)
 * @interface IFormView
 * @constructor (onSubmit: (data: object) => void)
 * @method render - Отрисовать форму
 * @method getData - Получить данные формы
 * @method showErrors - Показать ошибки
 * @method reset - Очистить форму
*/

export interface IFormView {
  new (onSubmit: (data: object) => void): IFormView;
  render(): void;
  getData(): object;
  showErrors(errors: string[]): void;
  reset(): void;
}

/**
 * Представление формы заказа (OrderFormView)
 * @interface IOrderFormView
 * @method showErrors - Показать ошибки валидации
 * @method render - Отрисовать форму заказа
*/

export interface IOrderFormView {
  showErrors(errors: string[]): void;
  render(): void;
}

/**
 * Представление формы контактов (ContactsFormView)
 * @interface IContactsFormView
 * @method showErrors - Показать ошибки валидации
 * @method render - Отрисовать форму контактов
*/

export interface IContactsFormView {
  showErrors(errors: string[]): void;
  render(): void;
}

/**
 * Представление успешного заказа (OrderSuccessView)
 * @interface IOrderSuccessView
 * @constructor (total: number, onClose: () => void)
 * @method render - Отрисовать сообщение об успехе
 * @method close - Закрыть сообщение
 */
export interface IOrderSuccessView {
  new (total: number, onClose: () => void): IOrderSuccessView;
  render(): void;
  close(): void;
}

/**
 * Модель товаров (ProductModel)
 * @interface IProductModel
 * @constructor (products: ApiProduct[])
 * @property {ApiProduct[]} products - Список всех товаров
 * @method getProductById - Получить товар по id
 */
export interface IProductModel {
  new (products: ApiProduct[]): IProductModel;
  products: ApiProduct[];
  getProductById(id: string): ApiProduct | undefined;
}

/**
 * Модель корзины (BasketModel)
 * @interface IBasketModel
 * @constructor (items: string[])
 * @property {string[]} items - Массив id товаров в корзине
 * @method add - Добавить товар в корзину
 * @method remove - Удалить товар из корзины
 * @method clear - Очистить корзину
*/

export interface IBasketModel {
  new (items: string[]): IBasketModel;
  items: string[];
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
}

/**
 * Модель заказа (OrderModel)
 * @interface IOrderModel
 * @constructor (order: ApiOrder)
 * @property {ApiOrder} order - Данные заказа
 * @method setAddress - Установить адрес
 * @method setPayment - Установить способ оплаты
 * @method getTotal - Получить итоговую сумму
*/

export interface IOrderModel {
  new (order: ApiOrder): IOrderModel;
  order: ApiOrder;
  setAddress(address: string): void;
  setPayment(payment: string): void;
  getTotal(products: ApiProduct[]): number;
}

/**
 * Модель пользователя (UserModel)
 * @interface IUserModel
 * @constructor (contacts: IUserContacts)
 * @property {string} email - Email пользователя
 * @property {string} phone - Телефон пользователя
 * @method setEmail - Установить email
 * @method setPhone - Установить телефон
*/

export interface IUserModel {
  new (contacts: IUserContacts): IUserModel;
  email: string;
  phone: string;
  setEmail(email: string): void;
  setPhone(phone: string): void;
}