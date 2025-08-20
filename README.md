# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
---
## Архитектура

Приложение реализовано по паттерну **MVC (Model–View–Controller)** с использованием событийной системы:

- **Model** — хранение и управление данными (`ProductModel`, `BasketModel`)
- **View** — визуализация данных (`ProductListView`, `ProductDetailView`, `CardView`, `BasketView`, `ModalView`, `FormView`, `OrderFormView`, `ContactsFormView`)
- **Controller** — управление логикой приложения (организовано через подписку на события)
- **API слой** — `Api`, `APIClientImpl`, `ProductService`

**Взаимодействие** Все взаимодействие строится через события: пользователь → событие → модель → обновление View.

Контроллер реализован через подписку на события из централизованного **EventBus**. Он обрабатывает пользовательские действия, обновляет модели и инициирует обновление представлений.

---

## Классы и компоненты 

### Base
`Api`

Базовый HTTP-клиент.
##### Методы:

`get(uri: string)` — GET-запрос

`post(uri: string, data: object, method?: ApiPostMethods)` — POST/PUT/DELETE

`EventBus` (`EventBus.ts`)

Реализация паттерна "издатель–подписчик".
##### Методы:

`on(event, callback)` — подписка

`emit(event, data?)` — генерация события

`off(event, callback)` — отписка

`onAll(callback)` — подписка на все события

`offAll()` — очистка

### API слой
`APIClientImpl`

Реализация интерфейса `APIClient`.
##### Методы:

`getProducts(): Promise<ProductList>`

`getProduct(id: string): Promise<Product>`

`createOrder(order: Order): Promise<OrderResponse>`

`ProductService`

Сервис для работы с товарами через API.
##### Методы:

`fetchProducts(): Promise<Product[]>`

`fetchProductById(id: string): Promise<Product>`

### Models
`ProductModel`

Хранит список товаров.
##### Методы:

`setProducts(products: Product[])`

`getProductById(id: string)`

`getProducts()`

`BasketModel`

Управляет корзиной и деталями заказа.
##### Методы:

`addItem(product: Product)`

`removeItem(id: string)`

`getItems(): Product[]`

`getTotal(): number`

`clearCart()`

`setOrderDetails({ payment, address })`

`getOrderDetails()`

`hasItem(id: string)`

### Views
`ProductListView`

Отображает каталог товаров.
##### Метод: `render(products: Product[])`.

`ProductDetailView`

Показывает детальную карточку товара.
##### Метод: `render(product: Product)`.

`CardView`

Рендерит карточку товара в корзине.
##### Метод: `render(product: Product, index: number)`.

`BasketView`

Отображает корзину.
##### Метод: `render(items: Product[], total: number)`.

ModalView

Управляет модальным окном.
##### Методы: `open(), close(), setContent(content, type?)`, `isOpen()`.

`FormView` (абстрактный)

Базовый класс для форм.
##### Методы:

`getForm()`

`setSubmitButtonState(isValid: boolean)`

`OrderFormView`

Форма заказа (оплата + адрес).

`ContactsFormView`

Форма контактов (email, телефон).

### Utils
`Page` (`Page.ts`)

Управляет элементами страницы (например, счётчиком корзины).
##### Метод: `setBasketCount(count: number)`.

`FormValidator` (`FormValidator.ts`)

Базовая валидация форм.
##### Метод: validate(): boolean.

`validators.ts`

Набор функций:

`validateEmail(email)`

`validatePhone(phone)`

`validateAddress(address)`

`validatePaymentMethod(method)`

## События
---
| Событие         | Описание                       | Payload                             |
|-----------------|--------------------------------|-------------------------------------|
| productsLoaded  | Загрузка товаров               | `Product[]`                         |
| productSelected | Выбор товара                   | `productId: string`                 |
| addToCart       | Добавление товара в корзину    | `Product `                          |
| removeFromCart  | Удаление товара из корзины     | `productId: string`                 |
| cartUpdated     | Обновление корзины             | `void`                              |
| cartOpened      | Открытие корзины               | `void`                               |
| checkout        | Начало оформления заказа       | `void`                               |
| orderStepCompleted    | Заполнен шаг оплаты/адреса | `{ payment: PaymentMethod, address: string }` |
| formSubmitted    | Отправка контактов | `email: string, phone: string`               |
| orderSuccess    | Заказ успешно оформлен | `void`                                     |
| navigateToProducts    | Переход обратно в каталог | `void`                            |

# Типы данных

## Интерфейсы

``` 
interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```
```
interface ProductList {
  total: number;
  items: Product[];
}
```
```
interface Order {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```
```
interface OrderResponse {
  id: string;
  total: number;
}
```
```
interface APIError {
  error: string;
}
```
```
interface APIClient {
  getProducts(): Promise<ProductList>;
  getProduct(id: string): Promise<Product>;
  createOrder(order: Order): Promise<OrderResponse>;
}
```

## Финальная структура

| Интерфейс       | Назначение                                              | 
|-----------------|---------------------------------------------------------| 
| api.ts          | Класс Api – базовый HTTP-клиент                         | 
| EventBus.ts     | Класс EventBus – событийная система                     | 
| BasketModel     | Модель корзины (BasketModel)                            | 
| ProductModel    | Модель каталога товаров (ProductModel)                  | 
| BasketView      | Отображение корзины                                     | 
| CardView        | Карточка товара                                         | 
| ContactsFormView| Форма контактов (email, телефон)                        | 
| FormView        | Базовый класс формы                                     | 
| ModalView       | Модальное окно                                          |  
| OrderFormView   | Форма заказа (оплата и адрес)                           | 
| ProductDetailView | Детальная карточка товара                             | 
| ProductListView | Каталог товаров                                         | 
| constants       | Константы проекта                                       | 
| FormValidator   | Класс валидации форм                                    | 
| Page.ts         | Управление состоянием страницы                          | 
| utils.ts        | Утилиты                                                 | 
| validators.ts   | Функции валидации                                       | 