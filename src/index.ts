import './scss/styles.scss';
import { Api } from './api/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';

import { PageView } from './components/views/PageView';
import { CardView } from './components/views/CardView';
import { BasketView } from './components/views/BasketView';
import { ModalView } from './components/views/ModalView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { OrderSuccessView } from './components/views/OrderSuccessView';

import { AppEvent, ApiProduct } from '../src/components/types';

// ==== 1. Инициализация системы событий ====
const events = new EventEmitter();

// ==== 2. Инициализация API ====
const api = new Api('https://api.example.com', { headers: { 'Content-Type': 'application/json' } });

// ==== 3. Инициализация моделей ====
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// ==== 4. Инициализация представлений ====
const pageView = new PageView(events);
const basketView = new BasketView(events);
const modalView = new ModalView(events);
const orderFormView = new OrderFormView(events);
const contactsFormView = new ContactsFormView(events);
const orderSuccessView = new OrderSuccessView(events);

// ==== 5. Получение данных с API ====
api.get<ApiProduct[]>('/products')
  .then(products => events.emit(AppEvent.PRODUCTS_LOADED, products))
  .catch(err => console.error('Ошибка загрузки товаров', err));

// ==== 6. Подписка на события ====
events.on(AppEvent.PRODUCTS_LOADED, (products: ApiProduct[]) => {
  productModel.setProducts(products);
  pageView.renderCatalog(products);
});

events.on(AppEvent.ADD_TO_BASKET, (productId: string) => {
  basketModel.add(productId);
  basketView.render(basketModel.getItems());
});

events.on(AppEvent.REMOVE_FROM_BASKET, (productId: string) => {
  basketModel.remove(productId);
  basketView.render(basketModel.getItems());
});

events.on(AppEvent.OPEN_BASKET, () => {
  modalView.open(basketView.render(basketModel.getItems()));
});

events.on(AppEvent.OPEN_ORDER_FORM, () => {
  modalView.open(orderFormView.render());
});

events.on(AppEvent.OPEN_CONTACTS_FORM, () => {
  modalView.open(contactsFormView.render());
});

events.on(AppEvent.ORDER_SUCCESS, (orderId: string) => {
  modalView.open(orderSuccessView.render(orderId));
  basketModel.clear();
});

