// Файл: /src/components/base/api.ts

/**
 * Модуль предоставляет базовый класс `Api` для взаимодействия с API сервера.
 */

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
  };
  
  export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
  
  /**
   * Класс `Api` реализует базовые методы для выполнения HTTP-запросов к серверу.
   */
  export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;
  
    /**
     * Создает экземпляр класса `Api`.
     * @param baseUrl - Базовый URL API.
     * @param options - Дополнительные опции для запросов.
     */
    constructor(baseUrl: string, options: RequestInit = {}) {
      this.baseUrl = baseUrl;
      this.options = {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers as object ?? {}),
        },
      };
    }
  
    /**
     * Обрабатывает ответ от сервера.
     * @param response - Ответ от сервера.
     * @returns Объект с данными или ошибку.
     */
    protected handleResponse(response: Response): Promise<object> {
      if (response.ok) return response.json();
      else
        return response
          .json()
          .then((data) => Promise.reject(data.error ?? response.statusText));
    }
  
    /**
     * Выполняет GET-запрос.
     * @param uri - URI запроса.
     * @returns Результат запроса.
     */
    get(uri: string) {
      return fetch(this.baseUrl + uri, {
        ...this.options,
        method: 'GET',
      }).then(this.handleResponse);
    }
  
    /**
     * Выполняет POST-запрос.
     * @param uri - URI запроса.
     * @param data - Данные для отправки.
     * @param method - HTTP-метод (по умолчанию 'POST').
     * @returns Результат запроса.
     */
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
      return fetch(this.baseUrl + uri, {
        ...this.options,
        method,
        body: JSON.stringify(data),
      }).then(this.handleResponse);
    }
  }