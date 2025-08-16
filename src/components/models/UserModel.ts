import type { IUserContacts, IModel } from '../types/type';
import { EventBus } from '../base/EventBus';

export class UserModel implements IModel {
  email = '';
  phone = '';
  events: EventBus;

  constructor(events: EventBus, contacts?: IUserContacts) {
    this.events = events;
    if (contacts) {
      this.email = contacts.email;
      this.phone = contacts.phone;
    }
  }

  setEmail(email: string) {
    this.email = email;
    // Предположим, что это событие не используется, или добавим его в events.ts
  }

  setPhone(phone: string) {
    this.phone = phone;
    // Предположим, что это событие не используется, или добавим его в events.ts
  }
}