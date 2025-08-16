import type { ApiOrder, ApiOrderResponse, ApiProduct } from './types/type';

// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = AppEvent | RegExp | '*';
type Subscriber = (payload: any) => void;
type EmitterEvent = {
  eventName: string;
  data: unknown;
};

export interface IEvents {
  on<K extends AppEvent>(event: K, callback: (payload: IEventPayloads[K]) => void): void;
  emit<K extends AppEvent>(event: K, payload?: IEventPayloads[K]): void;
}

export class EventEmitter implements IEvents {
  _events: Map<EventName, Set<Subscriber>>;

  constructor() {
    this._events = new Map<EventName, Set<Subscriber>>();
  }

  on<K extends AppEvent>(eventName: K, callback: (payload: IEventPayloads[K]) => void) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set());
    }
    this._events.get(eventName)?.add(callback);
  }

  off<K extends AppEvent>(eventName: K, callback: (payload: IEventPayloads[K]) => void) {
    const subscribers = this._events.get(eventName);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this._events.delete(eventName);
      }
    }
  }

  emit<K extends AppEvent>(eventName: K, payload?: IEventPayloads[K]) {
    this._events.forEach((subscribers, name) => {
      if (name === '*') {
        subscribers.forEach(callback => callback({ eventName, data: payload }));
      } else if ((name instanceof RegExp && name.test(eventName)) || name === eventName) {
        subscribers.forEach(callback => callback(payload));
      }
    });
  }
}

export type AppEvent =
  | 'products:load'
  | 'products:loaded'
  | 'product:preview'
  | 'product:add'
  | 'product:remove'
  | 'basket:open'
  | 'basket:changed'
  | 'modal:open'
  | 'modal:close'
  | 'order:open'
  | 'order:contacts'
  | 'contacts:submit'      // <--- добавить
  | 'order:submit'
  | 'order:created'
  | 'ui:error';

export interface IEventPayloads {
  'products:load': undefined;
  'products:loaded': { products: ApiProduct[] };
  'product:preview': { id: string };
  'product:add': { id: string };
  'product:remove': { id: string };
  'basket:open': undefined;
  'basket:changed': { items: string[]; total: number };
  'modal:open': { content: HTMLElement };
  'modal:close': undefined;
  'order:open': undefined;
  'order:contacts': { address: string; payment: 'card' | 'cash' };
  'contacts:submit': { email: string; phone: string }; // <--- добавить
  'order:submit': { order: ApiOrder };
  'order:created': { response: ApiOrderResponse };
  'ui:error': { message: string };
}