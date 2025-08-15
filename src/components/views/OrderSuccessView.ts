import { BaseComponent } from '../base/BaseComponent';
import { EventBus } from '../base/EventBus';

export class OrderSuccessView extends BaseComponent<{ total: number }> {
  constructor(bus: EventBus) {
    // Создаем элемент, который будет использоваться в BaseComponent
    const el = document.createElement('div');
    // Передаем элементы в правильном порядке: container, bus, templateId
    super(el, bus, 'success'); // Здесь передаем 'success' как templateId
    // Клонируем шаблон сразу после инициализации
    this.cloneTemplate<HTMLElement>('success');
  }

  render({ total }: { total: number }) {
    this.setText('.order-success__description', `Списано ${total} синапсов`);
    return super.render();
  }
}