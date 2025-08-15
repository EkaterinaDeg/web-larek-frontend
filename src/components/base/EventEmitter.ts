type EventHandler<T> = (payload: T) => void;

export class EventEmitter {
  private events: { [key: string]: EventHandler<any>[] } = {};

  // Метод для подписки на событие
  on<T>(event: string, handler: EventHandler<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  // Метод для вызова всех обработчиков события
  emit<T>(event: string, payload: T): void {
    const handlers = this.events[event];
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  // Метод для отписки от события
  off<T>(event: string, handler: EventHandler<T>): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  // Метод для очистки всех обработчиков события
  clear(event: string): void {
    if (this.events[event]) {
      delete this.events[event];
    }
  }
}