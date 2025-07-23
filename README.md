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

Приложение реализовано по паттерну MVC (Model–View–Controller) с использованием событийной системы для взаимодействия между слоями:

- *Модели* (IProductModel, IBasketModel, IOrderModel, IUserModel) отвечают за хранение и управление данными, а также инициируют события при изменениях.
- *Представления* (Views) (IPageView, IBasketView, IModalView и др.) подписываются на события, обновляют UI и отображают пользователю актуальную информацию.
- *Контроллеры* (реализованы через слушателей событий в основном коде) связывают действия пользователя с обновлением моделей и представлений.
- *Взаимодействие* происходит через централизованную событийную систему (AppEvent и IEventPayloads), что обеспечивает отделение бизнес-логики от UI и упрощает расширяемость.

### Описание ключевых компонентов и классов

#### Модели

##### IProductModel

- Роль: Управляет списком товаров, хранит данные о товарах, полученных с API.
- Конструктор: Принимает массив товаров products: ApiProduct[].
- Свойства:
  - products: ApiProduct[] — текущий список товаров.
- Методы:
  - getProductById(id: string): ApiProduct | undefined — возвращает товар по его уникальному id или undefined, если товар не найден.
- Использование: Вызывается при необходимости получить информацию о конкретном товаре, например, для отображения подробностей.

##### IBasketModel

- Роль: Управляет состоянием корзины — добавляет, удаляет товары и очищает корзину.
- Конструктор: Принимает массив items: string[] — id товаров, находящихся в корзине.
- Свойства:
  - items: string[] — id товаров в корзине.
- Методы:
  - add(id: string): void — добавляет товар в корзину, вызывается при событии "product:add".
  - remove(id: string): void — удаляет товар из корзины, вызывается при событии "product:remove".
  - clear(): void — очищает корзину, например, после успешного оформления заказа.
- Использование: Обеспечивает логику управления корзиной, хранит состояние между сессиями или действиями пользователя.

##### IOrderModel

- Роль: Хранит данные текущего заказа, управляет адресом и способом оплаты, вычисляет итоговую сумму.
- Конструктор: Принимает объект заказа order: ApiOrder.
- Свойства:
  - order: ApiOrder — данные заказа (список товаров, адрес, способ оплаты).
- Методы:
  - setAddress(address: string): void — устанавливает адрес доставки.
  - setPayment(payment: string): void — устанавливает способ оплаты.
  - getTotal(products: ApiProduct[]): number — вычисляет итоговую сумму заказа на основе списка товаров.
- Использование: Управляет процессом оформления заказа, используется при сборе данных формы и передаче на сервер.

##### IUserModel

- Роль: Управляет контактными данными пользователя (email и телефон).
- Конструктор: Принимает контакты contacts: IUserContacts.
- Свойства:
  - email: string — email пользователя.
  - phone: string — номер телефона.
- Методы:
  - setEmail(email: string): void — обновляет email.
  - setPhone(phone: string): void — обновляет номер телефона.
- Использование: Сохраняет и обновляет контактные данные пользователя, например, для автозаполнения форм.

#### Представления (Views)

##### IComponent

- Роль: Базовый интерфейс UI-компонента.
- Методы:
  - render(): void — отрисовка компонента.
  - show(): void — показать компонент на странице.
  - hide(): void — скрыть компонент.
- Использование: Все UI-компоненты наследуют этот интерфейс для стандартизации рендера и управления видимостью.

##### ICardView

- Роль: Отображение карточки товара с состоянием (в корзине или нет).
- Конструктор: Принимает product: ViewProduct и inBasket: boolean.
- Свойства:
  - product: ViewProduct — данные товара.
  - inBasket: boolean — признак, что товар добавлен в корзину.
- Методы:
  - render(): void — отрисовывает карточку товара.
  - update(inBasket: boolean): void — обновляет состояние (например, кнопка "В корзину" меняет вид).
- Использование: Используется для отображения каждого товара в каталоге и обновления UI при изменении корзины.

##### IPageView

- Роль: Представление главной страницы с каталогом товаров.
- Методы:
  - render(items: IProductItemView[]): void — отрисовывает список карточек товаров.
- Использование: Отвечает за основное отображение товаров на главной странице.

##### IBasketView

- Роль: Отображает содержимое корзины и управляет интерфейсом корзины.
- Методы:
  - render(items: IBasketItemView[]): void — отрисовывает список товаров в корзине.
  - toggleButton(enabled: boolean): void — включает или отключает кнопку оформления заказа.
  - setTotal(total: number): void — отображает итоговую сумму заказа.
- Использование: Управляет интерфейсом корзины, обновляет список и сумму заказа.

##### IModalView

- Роль: Управляет модальным окном для отображения форм и сообщений.
- Конструктор: Принимает content: HTMLElement.
- Методы:
  - show(): void — показать модальное окно.
  - hide(): void — скрыть окно.
  - setContent(content: HTMLElement): void — установить новое содержимое.
- Использование: Отображает формы заказа, подтверждения, ошибки и другие всплывающие окна.

##### IFormView

- Роль: Базовое представление формы с обработкой данных и ошибок.
- Конструктор: Принимает коллбэк onSubmit: (data: object) => void.
- Методы:
  - render(): void — отрисовывает форму.
  - getData(): object — получает данные из формы.
  - showErrors(errors: string[]): void — отображает ошибки валидации.
  - reset(): void — очищает форму.
- Использование: Базовый интерфейс для всех форм, таких как форма заказа и контактов.

##### IOrderFormView, IContactsFormView, IOrderSuccessView

- Специализированные представления форм заказа, контактов и сообщения об успешном заказе.
- Методы аналогичны базовому IFormView, с возможностью отображения ошибок и рендера.
- IOrderSuccessView дополнительно имеет метод close() для закрытия сообщения.

#### События приложения

Все взаимодействия между моделями и представлениями происходят через события.

| Событие       | Описание                    | Payload                              |
|---------------|-----------------------------|------------------------------------|
| product:add   | Добавление товара в корзину | { id: string } — id товара       |
| product:remove| Удаление товара из корзины  | { id: string } — id товара       |
| basket:open   | Открытие корзины            | undefined                        |
| order:submit  | Отправка заказа на сервер   | { order: ApiOrder } — данные заказа |

#### Основные типы и интерфейсы

- ApiProduct — описание товара с API  
- ApiOrder — данные заказа для отправки  
- ApiOrderResponse — ответ сервера на заказ  
- ViewProduct — данные для отображения товара  
- IApiClient — интерфейс клиента API  
- IModel — базовый интерфейс модели данных  
- IView — базовый интерфейс представления  
- AppEvent — типы событий  
- IEventPayloads — payload событий  
- IComponent — базовый UI-компонент  
- IFormState — состояние формы  
- IUserContacts — контактные данные пользователя  
- ICardView, IProductItemView, IBasketItemView — представления карточек товара  
- IPageView, IBasketView, IModalView — основные UI-представления  
- IFormView, IOrderFormView, IContactsFormView, IOrderSuccessView — формы и сообщения  
- IProductModel, IBasketModel, IOrderModel, IUserModel — модели приложения

---

## Типы данных

### ApiProduct

Данные товара, получаемые с сервера:

```
interface ApiProduct {
  id: string;              // Уникальный идентификатор товара
  title: string;           // Название товара
  description: string;     // Описание товара
  image: string;           // Ссылка на изображение
  category: string;        // Категория товара
  price: number | null;    // Цена (может быть null)
}
```

### ApiOrder
Данные заказа для отправки на сервер:
```
interface ApiOrder {
  items: string[];         // Массив id товаров в заказе
  address: string;         // Адрес доставки
  payment: string;         // Способ оплаты
}
```

### ApiOrderResponse

Ответ сервера после оформления заказа:
```
interface ApiOrderResponse {
  id: string;              // Номер заказа
  total: number;           // Итоговая сумма
}
```
### ViewProduct
Данные товара для отображения в UI:
```
interface ViewProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  inBasket: boolean;       // Флаг, что товар в корзине
}
```
## Модели
### IProductModel
Управляет списком товаров и предоставляет методы доступа.
```
interface IProductModel {
  products: ApiProduct[];
  getProductById(id: string): ApiProduct | undefined;
}
```
**products** — массив всех товаров.
**getProductById(id)** — возвращает товар по id или undefined.

### IBasketModel
Управляет состоянием корзины.
```
interface IBasketModel {
  items: string[];         // id товаров в корзине
  add(id: string): void;   // Добавить товар
  remove(id: string): void;// Удалить товар
  clear(): void;           // Очистить корзину
}
```
### IOrderModel
Хранит данные текущего заказа и вычисляет итог.
```
interface IOrderModel {
  order: ApiOrder;
  setAddress(address: string): void;
  setPayment(payment: string): void;
  getTotal(products: ApiProduct[]): number;
}
```
### IUserModel
Хранит контактные данные пользователя.
```
interface IUserModel {
  email: string;
  phone: string;
  setEmail(email: string): void;
  setPhone(phone: string): void;
}
```
## Представления (View)
### IView
Общий интерфейс для отображения списка товаров и подробностей.
```
interface IView {
  render(products: ViewProduct[]): void;
  showProduct(product: ViewProduct): void;
}
```
### ICardView
Карточка товара.
```
interface ICardView {
  product: ViewProduct;
  inBasket: boolean;
  render(): void;
  update(inBasket: boolean): void;
}
```
### IProductItemView, IBasketItemView
Отдельные товары в каталоге и корзине.
```
interface IProductItemView {
  id: string;
  render(): void;
}

interface IBasketItemView {
  id: string;
  render(): void;
}
```
### IBasketView
Отображение корзины.
```
interface IBasketView {
  render(items: IBasketItemView[]): void;
  toggleButton(enabled: boolean): void;
  setTotal(total: number): void;
}
```
### IModalView
Модальные окна.
```
interface IModalView {
  show(): void;
  hide(): void;
  setContent(content: HTMLElement): void;
}
```
### IFormView, IOrderFormView, IContactsFormView
Формы для ввода данных и заказа.
```
interface IFormView {
  render(): void;
  getData(): object;
  showErrors(errors: string[]): void;
  reset(): void;
}

interface IOrderFormView {
  render(): void;
  showErrors(errors: string[]): void;
}

interface IContactsFormView {
  render(): void;
  showErrors(errors: string[]): void;
}
```
### IOrderSuccessView
Отображение успешного оформления заказа.
```
interface IOrderSuccessView {
  render(): void;
  close(): void;
}
```
## API-клиент
### IApiClient
Методы взаимодействия с сервером.
```
interface IApiClient {
  getProducts(): Promise<ApiProduct[]>;
  getProduct(id: string): Promise<ApiProduct>;
  createOrder(order: ApiOrder): Promise<ApiOrderResponse>;
}
```
## События и взаимодействие компонентов
### AppEvent
Перечисление событий приложения:
```
'product:add' — товар добавлен в корзину
'product:remove' — товар удалён из корзины
'basket:open' — открытие корзины
'order:submit' — отправка заказа
```
### IEventPayloads
Данные, передаваемые с событиями:
```
interface IEventPayloads {
  'product:add': { id: string };
  'product:remove': { id: string };
  'basket:open': undefined;
  'order:submit': { order: ApiOrder };
}
```

### Ключевые компоненты и их роли

| Интерфейс         | Назначение                                           |
|---------------|---------------------------------------------------------|
| IComponent        | Базовый UI-компонент с методами render/show/hide     |
| ICardView         | Карточка товара с состоянием (в корзине или нет)     |
| IProductItemView  | Отображение товара в каталоге                        |
| IBasketItemView   | Отображение товара в корзине                         |
| IPageView         | Главная страница с каталогом товаров                 |
| IBasketView       | Отображение корзины, управление списком и итогом     |
| IModalView        | Модальное окно для форм и сообщений                  |
| IFormView         | Базовая форма с обработкой данных и ошибок           |
| IOrderFormView    | Форма оформления заказа                              |
| IContactsFormView | Форма ввода контактных данных                        |
| IOrderSuccessView | Отображение успешного оформления заказа              |
| IProductModel     | Модель каталога товаров с поиском по id              |
| IBasketModel      | Модель корзины с добавлением, удалением и очисткой   |
| IOrderModel       | Модель заказа с адресом, оплатой и подсчётом итога   |
| IUserModel        | Модель пользователя с контактными данными            |