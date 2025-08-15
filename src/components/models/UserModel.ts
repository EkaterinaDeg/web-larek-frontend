import type { IUserContacts } from '../types';

export class UserModel {
  email = '';
  phone = '';

  constructor(contacts?: IUserContacts) {
    if (contacts) {
      this.email = contacts.email;
      this.phone = contacts.phone;
    }
  }

  setEmail(email: string) { this.email = email; }
  setPhone(phone: string) { this.phone = phone; }
}