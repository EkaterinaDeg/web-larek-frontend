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
## Архитектура

Основной использующийся паттерн приложения - MVC (Model–View–Controller) делит код на такие слои как:
1. Model (Модель)
Хранит данные и бизнес-логику:

IProductModel, IBasketModel, IOrderModel, IUserModel — управляют состоянием данных и предоставляют методы работы с ними.
2. View (Представление)
Отвечает за визуализацию:

ICardView, IBasketView, IModalView, IFormView, IOrderFormView и т.д.
Представления подписаны на события, но не знают о моделях напрямую.

3. Controller (Контроллер)
Связывает Model и View:
Используется событийная система (AppEvent, IEventPayloads), которая играет роль посредника между слоями.

Данный проект включает следующие основные слои:

# 1. 📡 API слой
Работа с сервером:
ApiProduct — описание товара с сервера;
ApiOrder — структура заказа, отправляемая на сервер;
IApiClient — интерфейс клиента API.

# 2. 📦 Model (Модели)
Хранят и обрабатывают данные приложения:
IProductModel — список товаров;
IBasketModel — список id товаров в корзине;
IOrderModel — данные текущего заказа;
IUserModel — контактная информация пользователя.

# 3. 🎨 View (Представления)
UI-компоненты:
IProductItemView, ICardView, IBasketView, IOrderFormView, IContactsFormView и др.
IModalView — модальное окно;
IPageView — каталог на главной странице.

# 4. ⚙ Controller & Events
Коммуникация между слоями:
IEventPayloads — типы событий и их полезные нагрузки;
AppEvent — типы всех возможных событий.

# 5. 🧩 Вспомогательные типы
ViewProduct — уточненная модель товара для отображения;
IFormState — состояние форм;
IUserContacts — контактные данные пользователя.