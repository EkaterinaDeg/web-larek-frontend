// Файл: /src/components/base/events.ts

/**
 * Модуль предоставляет класс `EventEmitter` для реализации паттерна "издатель-подписчик".
 */

type EventName = string | RegExp;
type Subscriber<T> = (data: T) => void;
type EmitterEvent = {
  eventName: string;
  data: unknown;
};

/**
 * Интерфейс для управления событиями.
 */
export interface IEvents {
  on<T = unknown>(event: EventName, callback: Subscriber<T>): void;
  emit<T = unknown>(event: string, data?: T): void;
  trigger<T = unknown>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Класс `EventEmitter` реализует механизм событийного взаимодействия между компонентами.
 */
export class EventEmitter implements IEvents {
  private _events: Map<EventName, Set<Function>>;

  constructor() {
    this._events = new Map<EventName, Set<Function>>();
  }

  /**
   * Добавляет обработчик для указанного события.
   * @param eventName - Имя или шаблон события.
   * @param callback - Функция-обработчик.
   */
  on<T = unknown>(eventName: EventName, callback: Subscriber<T>): void {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set<Function>());
    }
    this._events.get(eventName)?.add(callback);
  }

  /**
   * Удаляет обработчик для указанного события.
   * @param eventName - Имя или шаблон события.
   * @param callback - Функция-обработчик.
   */
  off(eventName: EventName, callback: Function): void {
    if (this._events.has(eventName)) {
      this._events.get(eventName)?.delete(callback);
      if (this._events.get(eventName)?.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  /**
   * Вызывает событие с переданными данными.
   * @param eventName - Имя события.
   * @param data - Данные для передачи обработчикам.
   */
  emit<T = unknown>(eventName: string, data?: T): void {
    this._events.forEach((subscribers, name) => {
      if (
        name === '*' ||
        (name instanceof RegExp && name.test(eventName)) ||
        name === eventName
      ) {
        subscribers.forEach((callback) => callback(data));
      }
    });
  }

  /**
   * Добавляет обработчик для всех событий.
   * @param callback - Функция-обработчик.
   */
  onAll(callback: (event: EmitterEvent) => void): void {
    this.on('*', callback);
  }

  /**
   * Сбрасывает все обработчики событий.
   */
  offAll(): void {
    this._events = new Map<EventName, Set<Function>>();
  }

  /**
   * Создает триггер для автоматического вызова события.
   * @param eventName - Имя события.
   * @param context - Дополнительный контекст данных.
   * @returns Функцию для вызова события.
   */
  trigger<T = unknown>(
    eventName: string,
    context?: Partial<T>
  ): (data: T) => void {
    return (data: T) => {
      this.emit(eventName, { ...data, ...context });
    };
  }
}