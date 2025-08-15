import { BaseComponent } from '../base/BaseComponent';

export class PageView extends BaseComponent<HTMLElement[]> {
  render(cards: HTMLElement[]) {
    this.el.replaceChildren(...cards);
    return super.render();
  }
}