import { BaseComponent } from '../base/BaseComponent';

export class OrderSuccessView extends BaseComponent<{ total: number }> {
  constructor() {
    const el = new BaseComponent(document.createElement('div'), null as any).cloneTemplate<HTMLElement>('success');
    super(el, null as any);
  }
  render({ total }: { total: number }) {
    this.setText('.order-success__description', Списано $`{total} синапсов`);
    return super.render();
  }
}