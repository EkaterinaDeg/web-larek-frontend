// Файл: /src/index.ts

import './scss/styles.scss';
import { APIClientImpl } from '../api/APIClient';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/BasketModel';
import { ProductService } from '../api/ProductService';
import { ProductListView } from './views/ProductListView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/BasketView';
import { Modal } from './views/ModalView';
import { EventEmitter } from './base/EventBus';
import { Product, Order, PaymentMethod } from './types';
import { API_URL } from './utils/constants';
import { Page } from './utils/Page';

// Импортируем новые классы форм
import { ContactsForm } from './views/ContactsFormView';
import { OrderForm } from './views/OrderFormView';

const apiClient = new APIClientImpl(API_URL);
const emitter = new EventEmitter();
const page = new Page();

const productService = new ProductService(apiClient);
const productModel = new ProductModel(emitter);
const cartModel = new CartModel(emitter);

const productContainer = document.querySelector('.gallery') as HTMLElement;
const productListView = new ProductListView(productContainer, emitter);

const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalElement, emitter);

const productDetailView = new ProductDetailView(
  emitter,
  (productId: string) => cartModel.getItems().some((item) => item.id === productId)
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

emitter.on('addToCart', (product: Product) => {
  cartModel.addItem(product);
  modal.close();
});

emitter.on('removeFromCart', (productId: string) => {
  cartModel.removeItem(productId);
});

emitter.on('cartUpdated', () => {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  page.setBasketCount(items.length);

  if (modal.isOpen() && modal.getContentType() === 'cart') {
    const cartView = new CartView(emitter);
    const cartContent = cartView.render(items, total);
    modal.setContent(cartContent, 'cart');
  }
});

const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotal();
    const cartView = new CartView(emitter);
    const cartContent = cartView.render(items, total);
    modal.setContent(cartContent, 'cart');
    modal.open();
    emitter.emit('cartOpened');
  });
}

// Изменяем обработчик на использование нового класса OrderForm
emitter.on('checkout', () => {
  const orderFormInstance = new OrderForm(emitter);
  const formElement = orderFormInstance.getForm();
  modal.setContent(formElement, 'checkout');
  modal.open();
});

// Изменяем обработчик на использование нового класса ContactsForm
emitter.on('orderStepCompleted', (data: { payment: PaymentMethod; address: string }) => {
  const { payment, address } = data;
  cartModel.setOrderDetails({ payment, address });

  const contactsFormInstance = new ContactsForm(emitter);
  const contactsFormElement = contactsFormInstance.getForm();
  modal.setContent(contactsFormElement, 'contacts');
});

emitter.on('formSubmitted', async (data: { email: string; phone: string }) => {
  const orderDetails = cartModel.getOrderDetails();
  const order: Order = {
    payment: orderDetails.payment,
    email: data.email,
    phone: data.phone,
    address: orderDetails.address,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((item) => item.id),
  };

  try {
    await apiClient.createOrder(order);
    cartModel.clearCart();
    const successMessage = getSuccessMessage(order.total);
    modal.setContent(successMessage, 'success');
    emitter.emit('cartUpdated');
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