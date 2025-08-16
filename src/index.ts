import './scss/styles.scss';
import { Api } from './api/api';
import { EventBus } from './components/base/EventBus';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { UserModel } from './components/models/UserModel';
import { PageView } from './components/views/PageView';
import { CardView } from './components/views/CardView';
import { BasketView } from './components/views/BasketView';
import { ModalView } from './components/views/ModalView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { OrderSuccessView } from './components/views/OrderSuccessView';
import { ApiProduct, ApiOrder, ApiOrderResponse } from './components/types/type';
import { showError } from './components/views/ErrorView';

// Инициализация
const appContainer = document.querySelector('.gallery') as HTMLElement;
const events = new EventBus();
const api = new Api('http://localhost:8080');
const productModel = new ProductModel(api, events);
const basketModel = new BasketModel(events, productModel);
const orderModel = new OrderModel(events);
const userModel = new UserModel(events);
const pageView = new PageView(events);
const basketView = new BasketView(events);
const modalView = new ModalView(document.createElement('div'), events);
const orderFormView = new OrderFormView(events);
const contactsFormView = new ContactsFormView(events);
const orderSuccessView = new OrderSuccessView(events);

// Монтируем компоненты в app
appContainer.appendChild(pageView.render([])); // Пустой рендер для инициализации

// Получение данных
api.get<ApiProduct[]>('/products')
  .then(products => events.emit('products:loaded', { products }))
  .catch(err => events.emit('ui:error', { message: `Ошибка загрузки товаров на ${new Date().toLocaleString('en-US', { timeZone: 'Europe/Kiev' })}` }));

// Подписка на события
events.on('products:loaded', ({ products }: { products: ApiProduct[] }) => {
  productModel.setProducts(products);
  pageView.renderCatalog(products);
});

events.on('product:add', ({ id }: { id: string }) => {
  basketModel.add(id);
  basketView.render({ items: basketModel.getItems() }); // Обновлено
});

events.on('product:remove', ({ id }: { id: string }) => {
  basketModel.remove(id);
  basketView.render({ items: basketModel.getItems() }); // Обновлено
});

events.on('basket:changed', ({ items, total }: { items: string[]; total: number }) => {
  basketView.render({ items: basketModel.getItems() }); // Обновлено
  basketView.setTotal(total);
});

events.on('basket:open', () => {
  modalView.open(basketView.render({ items: basketModel.getItems() })); // Обновлено
});

events.on('order:open', () => {
  modalView.open(orderFormView.render());
});

events.on('order:contacts', ({ address, payment }: { address: string; payment: 'card' | 'cash' }) => {
  orderModel.setAddress(address);
  orderModel.setPayment(payment);
  modalView.open(contactsFormView.render());
});

events.on('contacts:submit', (contacts: { email: string; phone: string }) => {
  userModel.setEmail(contacts.email);
  userModel.setPhone(contacts.phone);
  const order: ApiOrder = {
    payment: orderModel.order?.payment || 'cash',
    email: contacts.email,
    phone: contacts.phone,
    address: orderModel.order?.address || '',
    total: basketModel.getTotal(),
    items: Array.from(basketModel.items.keys()),
  };
  orderModel.setOrder(order);
  api.post<ApiOrderResponse>('/order', order)
    .then(response => events.emit('order:created', { response }))
    .catch(err => events.emit('ui:error', { message: 'Ошибка оформления заказа' }));
});

events.on('order:created', ({ response }: { response: { id: string; total: number } }) => {
  modalView.open(orderSuccessView.render({ id: response.id }));
  basketModel.clear();
});

events.on('ui:error', ({ message }: { message: string }) => {
  showError(message, modalView);
});