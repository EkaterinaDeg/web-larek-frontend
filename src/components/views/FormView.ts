import { BaseComponent } from '../base/BaseComponent';

export class FormView<T> extends BaseComponent<T> {
  protected form!: HTMLFormElement;
  protected submitButton!: HTMLButtonElement;
  protected errorBox!: HTMLElement;

  render(data?: T) {
    // форма уже создана в наследниках — здесь просто возвращаем контейнер
    return super.render(data);
  }

  protected setError(msg: string) {
    if (this.errorBox) this.errorBox.textContent = msg;
  }

  protected setSubmitEnabled(enabled: boolean) {
    if (this.submitButton) this.submitButton.disabled = !enabled;
  }
}