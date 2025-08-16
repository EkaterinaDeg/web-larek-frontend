// src/utils/EventBus.ts
import type { AppEvent, IEventPayloads } from '../events';

type Handler<K extends AppEvent> = (payload: IEventPayloads[K]) => void;

export class EventBus {
  private listeners = new Map<AppEvent, Set<Handler<any>>>();

  on<K extends AppEvent>(event: K, handler: Handler<K>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off<K extends AppEvent>(event: K, handler: Handler<K>) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) this.listeners.delete(event);
    }
  }

  emit<K extends AppEvent>(event: K, payload: IEventPayloads[K]) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  clear() {
    this.listeners.clear();
  }
}