// Файл: /src/components/index.ts

import './scss/styles.scss';
import { APIClientImpl } from './api/APIClient';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { ProductService } from './api/ProductService';
import { ProductListView } from './components/views/ProductListView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { BasketView } from './components/views/BasketView';
import { Modal } from './components/views/ModalView';
import { EventEmitter } from './components/base/EventBus';
import { Product, Order, PaymentMethod } from './components/types';
import { API_URL } from './components/utils/constants';
import { Page } from './components/utils/Page';

// Импортируем новые классы форм
import { ContactsForm } from './components/views/ContactsFormView';
import { OrderFormView } from './components/views/OrderFormView';

const apiClient = new APIClientImpl(API_URL);
const emitter = new EventEmitter();
const page = new Page();

const productService = new ProductService(apiClient);
const productModel = new ProductModel(emitter);
const cardModel = new BasketModel(emitter);

const productContainer = document.querySelector('.gallery') as HTMLElement;
const productListView = new ProductListView(productContainer, emitter);

const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalElement, emitter);

const productDetailView = new ProductDetailView(
  emitter,
  (productId: string) => cardModel.getItems().some((item) => item.id === productId)
);

// Загрузка продуктов
productService.fetchProducts().then((products) => {
  productModel.setProducts(products);
  emitter.emit('productsLoaded', products);
});

// Обработчики событий
emitter.on('productsLoaded', (products: Product[]) => {
  productListView.render(products);
});

emitter.on('productSelected', (productId: string) => {
  const product = productModel.getProductById(productId);
  if (product) {
    const content = productDetailView.render(product);
    modal.setContent(content, 'product');
    modal.open();
  }
});

emitter.on('addToCard', (product: Product) => {
  cardModel.addItem(product);
  modal.close();
});

emitter.on('removeFromCard', (productId: string) => {
  cardModel.removeItem(productId);
});

emitter.on('cardUpdated', () => {
  const items = cardModel.getItems();
  const total = cardModel.getTotal();
  page.setBasketCount(items.length);

  if (modal.isOpen() && modal.getContentType() === 'card') {
    const cardView = new BasketView(emitter);
    const cardContent = cardView.render(items, total);
    modal.setContent(cardContent, 'card');
  }
});

const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', () => {
    const items = cardModel.getItems();
    const total = cardModel.getTotal();
    const cardView = new BasketView(emitter);
    const cardContent = cardView.render(items, total);
    modal.setContent(cardContent, 'card');
    modal.open();
    emitter.emit('cardOpened');
  });
}

// Изменяем обработчик на использование нового класса OrderFormView
emitter.on('checkout', () => {
  const orderFormInstance = new OrderFormView(emitter);
  const formElement = orderFormInstance.getForm();
  modal.setContent(formElement, 'checkout');
  modal.open();
});

// Изменяем обработчик на использование нового класса ContactsForm
emitter.on('orderStepCompleted', (data: { payment: PaymentMethod; address: string }) => {
  const { payment, address } = data;
  cardModel.setOrderDetails({ payment, address });

  const contactsFormInstance = new ContactsForm(emitter);
  const contactsFormElement = contactsFormInstance.getForm();
  modal.setContent(contactsFormElement, 'contacts');
});

emitter.on('formSubmitted', async (data: { email: string; phone: string }) => {
  const orderDetails = cardModel.getOrderDetails();
  const order: Order = {
    payment: orderDetails.payment,
    email: data.email,
    phone: data.phone,
    address: orderDetails.address,
    total: cardModel.getTotal(),
    items: cardModel.getItems().map((item) => item.id),
  };

  try {
    await apiClient.createOrder(order);
    cardModel.clearCard();
    const successMessage = getSuccessMessage(order.total);
    modal.setContent(successMessage, 'success');
    emitter.emit('cardUpdated');
    emitter.emit('orderSuccess');
  } catch (error) {
    alert(`Ошибка оформления заказа: ${(error as Error).message}`);
  }
});

emitter.on('orderSuccess', () => {
  const successCloseButton = document.querySelector('.order-success__close') as HTMLButtonElement;
  if (successCloseButton) {
    successCloseButton.addEventListener('click', () => {
      modal.close();
      emitter.emit('navigateToProducts');
    });
  }
});

emitter.on('navigateToProducts', () => {
  productListView.render(productModel.getProducts());
});

// Функция для получения сообщения об успешном заказе
function getSuccessMessage(total: number): HTMLElement {
  const successTemplate = document.getElementById('success') as HTMLTemplateElement;
  if (!successTemplate) {
    throw new Error('Template #success not found');
  }
  const successMessage = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const description = successMessage.querySelector('.order-success__description');
  if (description) description.textContent = `Списано ${total} синапсов`;
  return successMessage;
}