import { ModalView } from './ModalView';

export const showError = (message: string, modal: ModalView) => {
  const errorEl = document.createElement('div');
  errorEl.textContent = message;
  modal.open(errorEl);
};