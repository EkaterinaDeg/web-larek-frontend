// src/utils/EventBus.ts
import type { AppEvent, IEventPayloads } from './events';

type Handler<K extends AppEvent> = (payload: IEventPayloads[K]) => void;

export class EventBus {
  private listeners = new Map<AppEvent, Set<Function>>();

  on<K extends AppEvent>(event: K, handler: Handler<K>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off<K extends AppEvent>(event: K, handler: Handler<K>) {
    this.listeners.get(event)?.delete(handler);
  }

  emit<K extends AppEvent>(event: K, payload: IEventPayloads[K]) {
    this.listeners.get(event)?.forEach((h) => (h as Handler<K>)(payload));
  }

  clear() {
    this.listeners.clear();
  }
}