// Файл: /src/views/ModalView.ts

/**
 * Модуль предоставляет класс `Modal` для управления модальным окном.
 */

import { EventEmitter } from '../base/EventBus';

/**
 * Класс Modal отвечает за управление модальным окном.
 */
export class Modal {
  private modalElement: HTMLElement;
  private closeButton: HTMLElement | null;
  private contentContainer: HTMLElement | null;
  private emitter: EventEmitter;
  private contentType: string | null = null;

  constructor(modalElement: HTMLElement, emitter: EventEmitter) {
    this.modalElement = modalElement;
    this.emitter = emitter;

    // Сохраняем ссылки на элементы
    this.closeButton = this.modalElement.querySelector('.modal__close');
    this.contentContainer = this.modalElement.querySelector('.modal__content');

    // Навешиваем обработчики, которые должны жить всё время
    this.initEventListeners();
  }

  private initEventListeners(): void {
    // Обработчик кнопки закрытия
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    // Обработчик клика на фон модального окна
    this.modalElement.addEventListener('click', (event) => {
      if (event.target === this.modalElement) {
        this.close();
      }
    });
  }

  private handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  };

  open(): void {
    document.addEventListener('keydown', this.handleEscapeKey); // ✅ навешиваем только при открытии
    this.modalElement.classList.add('modal_active');
    document.body.classList.add('modal-open');
  }

  close(): void {
    document.removeEventListener('keydown', this.handleEscapeKey); // ✅ снимаем при закрытии
    this.modalElement.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
    this.contentType = null;
  }

  setContent(content: HTMLElement, contentType?: string): void {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = '';
      this.contentContainer.appendChild(content);
    }
    if (contentType) {
      this.contentType = contentType;
    }
  }

  isOpen(): boolean {
    return this.modalElement.classList.contains('modal_active');
  }

  getContentType(): string | null {
    return this.contentType;
  }
}