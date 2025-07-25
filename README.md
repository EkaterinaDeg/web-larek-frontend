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

- **Model** — хранение и управление данными (`ProductModel`, `BasketModel`, `OrderModel`, `UserModel`)
- **View** — визуализация данных и обновление UI (`CardView`, `PageView`, `ModalView`, `BasketView`, `FormView` и др.)
- **Controller** — управление логикой приложения (организовано через подписку на события)

**Взаимодействие** происходит через централизованную событийную систему (AppEvent и IEventPayloads), что обеспечивает отделение бизнес-логики от UI и упрощает расширяемость.

Контроллер реализован через подписку на события из централизованного EventBus. Он обрабатывает пользовательские действия, обновляет модели и инициирует обновление представлений.

**Пример подписки на событие:**
```
eventBus.on('product:add', (payload: { id: string }) => {
  basketModel.add(payload.id);
  basketView.render(basketModel.items);
});
```
### Пример взаимодействия:

Пользователь нажимает кнопку "Купить" → происходит событие `product:add` → контроллер обрабатывает событие и обновляет `BasketModel` → модель инициирует событие → `BasketView` обновляется.

---

## Описание ключевых компонентов и классов 

### Api

Базовый HTTP-клиент для взаимодействия с сервером.

```
class Api {
  constructor(baseUrl: string, options: RequestInit = {});
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

**Конструктор:**  
`constructor(baseUrl: string, options: RequestInit = {})`

`baseUrl` — базовый URL API.
`options` — глобальные опции для запросов (заголовки и т.п.).

**Методы:**
```
get<T>(uri: string): Promise<T>;
post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
```

`get` — GET-запрос по URI.
`post` — POST/PUT/DELETE-запрос с данными.

---

### ProductModel

```
class ProductModel {
  constructor(products: ApiProduct[]);
  getProductById(id: string): ApiProduct | undefined;
}
```

**Конструктор:**  
`constructor(products: ApiProduct[])` — принимает список товаров с API.

`products` — массив товаров с сервера.

**Свойства:**

`products: ApiProduct[]` — текущий список товаров.

**Методы:**
```
getProductById(id: string): ApiProduct | undefined
```
Возвращает товар по `id` или `undefined`, если не найден.

---

### BasketModel

```
class BasketModel {
  constructor(items: string[]);
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
}
```

**Конструктор:**  
`constructor(items: string[])` — принимает список ID товаров, уже добавленных в корзину.

**Роль:** Управляет состоянием корзины — добавляет, удаляет товары и очищает корзину.

**Свойства:** `items: string[]` — id товаров в корзине.

**Методы:**
```
add(id: string): void;
remove(id: string): void;
clear(): void;
```
---

### OrderModel

```
class OrderModel {
  constructor(order: ApiOrder);
  setAddress(address: string): void;
  setPayment(payment: string): void;
  getTotal(products: ApiProduct[]): number;
}
```
**Роль:** Хранит данные заказа, адрес, способ оплаты, вычисляет итог.

**Конструктор:**  
`constructor(order: ApiOrder)`

`order` — объект заказа.

**Свойства:**
`order: ApiOrder` — данные заказа.

**Методы:**
```
setAddress(address: string): void;
setPayment(payment: string): void;
getTotal(products: ApiProduct[]): number;
```
---

### UserModel

```
class UserModel {
  constructor(contacts: IUserContacts);
  setEmail(email: string): void;
  setPhone(phone: string): void;
}
```

**Конструктор:**  
`constructor(contacts: IUserContacts)` — принимает контактную информацию пользователя (email и телефон).

`contacts` — объект с email и телефоном.

**Роль:** Хранит контактные данные пользователя.


**Свойства:**
`email: string`
`phone: string`

**Методы:**
```
setEmail(email: string): void;
setPhone(phone: string): void;
```
---

### Component<T>

```
class Component<T> {
  constructor(container: HTMLElement);
  render(data?: T): HTMLElement;
  show(): void;
  hide(): void;
}
```

**Конструктор:**  
`constructor(container: HTMLElement)` — принимает DOM-элемент `container`, в который будет рендериться компонент.

**Методы:**
```
render(data?: T): HTMLElement;
show(): void;
hide(): void;
```
---

### CardView

```
class CardView extends Component<ViewProduct> {
  constructor(product: ViewProduct, inBasket: boolean);
  render(): void;
  update(inBasket: boolean): void;
}
```
**Конструктор:**  
`constructor(product: ViewProduct, inBasket: boolean)` — принимает товар и флаг, находится ли товар в корзине.

`product` — данные товара.
`inBasket` — флаг, есть ли товар в корзине.

**Роль:** Отображает карточку товара.

**Методы:**
render(): void;
update(inBasket: boolean): void;

---

### BasketView

```
class BasketView {
  render(items: IBasketItemView[]): void;
  toggleButton(enabled: boolean): void;
  setTotal(total: number): void;
}
```
**Роль:** Отображает корзину и управляет её состоянием.

---

### ModalView

```
class ModalView {
  constructor(content: HTMLElement);
  show(): void;
  hide(): void;
  setContent(content: HTMLElement): void;
}
```
**Роль:** Управляет модальным окном.

**Конструктор:**  
`constructor(content: HTMLElement)` — принимает начальное содержимое модального окна.

---

### FormView

```
class FormView {
  constructor(onSubmit: (data: object) => void);
  render(): void;
  getData(): object;
  showErrors(errors: string[]): void;
  reset(): void;
}
```
**Роль:** Базовая форма с обработкой данных и ошибок.

**Конструктор:**  
`constructor(onSubmit: (data: object) => void)` — принимает callback-функцию, вызываемую при отправке формы.

**Методы:**
```
render(): void;
getData(): object;
showErrors(errors: string[]): void;
reset(): void;
```
---

### OrderFormView

```
class OrderFormView extends FormView {
  constructor(onSubmit: (data: object) => void);
}
```

---

## Классы форм заказа и контактов
`OrderFormView` и `ContactsFormView` расширяют `FormView` и принимают callback `onSubmit`.

### ContactsFormView

```
class ContactsFormView extends FormView {
  constructor(onSubmit: (data: object) => void);
}
```

---

### OrderSuccessView

```
class OrderSuccessView {
  constructor(container: HTMLElement);
  show(orderId: string): void;
}
```

**Конструктор:**  
`constructor(container: HTMLElement)` — принимает контейнер, в который отображается сообщение об успехе.

---

## Типы данных

```
interface ApiProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

interface ApiOrder {
  items: string[];
  address: string;
  payment: string;
}

interface ApiOrderResponse {
  id: string;
  total: number;
}

interface ViewProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  inBasket: boolean;
}

interface IUserContacts {
  email: string;
  phone: string;
}
```

---

## События

| Событие         | Описание                       | Payload                             |
|----------------|--------------------------------|-------------------------------------|
| product:add     | Добавление товара              | `{ id: string }`                    |
| product:remove  | Удаление товара                | `{ id: string }`                    |
| basket:open     | Открытие корзины               | `undefined`                         |
| order:submit    | Отправка заказа                | `{ order: ApiOrder }`               |
### EventPayloads 

Данные, передаваемые с событиями: 

``` 

interface IEventPayloads { 
  'product:add': { id: string }; 
  'product:remove': { id: string }; 
  'basket:open': undefined; 
  'order:submit': { order: ApiOrder }; 
} 
```
---

## Интерфейсы

```
interface IProductModel {
  new (products: ApiProduct[]): IProductModel;
  products: ApiProduct[];
  getProductById(id: string): ApiProduct | undefined;
}

IBasketModel {
  new (items: string[]): IBasketModel;
  items: string[];
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
}

interface IOrderModel {
  new (order: ApiOrder): IOrderModel;
  order: ApiOrder;
  setAddress(address: string): void;
  setPayment(payment: string): void;
  getTotal(products: ApiProduct[]): number;
}

interface IUserModel {
  new (contacts: IUserContacts): IUserModel;
  email: string;
  phone: string;
  setEmail(email: string): void;
  setPhone(phone: string): void;
}
```

---

## Контроль событий

```
interface IEventPayloads {
  'product:add': { id: string };
  'product:remove': { id: string };
  'basket:open': undefined;
  'order:submit': { order: ApiOrder };
}
```

---

## Финальная структура

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