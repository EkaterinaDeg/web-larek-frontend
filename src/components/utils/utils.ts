// Файл: /src/utils/utils.ts

/**
 * Модуль содержит вспомогательные функции для приложения.
 */

/**
 * Преобразует строку из PascalCase в kebab-case.
 * @param value - Входная строка в PascalCase.
 * @returns Строка в kebab-case.
 */
export function pascalToKebab(value: string): string {
    return value.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();
  }
  
  /**
   * Проверяет, является ли значение CSS-селектором.
   * @param x - Проверяемое значение.
   * @returns `true`, если значение является строкой-селектором.
   */
  export function isSelector(x: any): x is string {
    return typeof x === 'string' && x.length > 1;
  }
  
  /**
   * Проверяет, является ли значение пустым.
   * @param value - Проверяемое значение.
   * @returns `true`, если значение `null` или `undefined`.
   */
  export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
  }
  
  /**
   * Преобразует селектор или коллекцию элементов в массив элементов.
   * @param selectorElement - Селектор или коллекция элементов.
   * @param context - Контекст для поиска (опционально).
   * @returns Массив элементов.
   */
  export function ensureAllElements<T extends HTMLElement>(
    selectorElement: string | NodeListOf<Element> | T[],
    context: HTMLElement = document as unknown as HTMLElement
  ): T[] {
    if (isSelector(selectorElement)) {
      return Array.from(context.querySelectorAll(selectorElement)) as T[];
    }
    if (selectorElement instanceof NodeList) {
      return Array.from(selectorElement) as T[];
    }
    if (Array.isArray(selectorElement)) {
      return selectorElement;
    }
    throw new Error(`Unknown selector element`);
  }
  
  /**
   * Преобразует селектор или элемент в элемент.
   * @param selectorElement - Селектор или элемент.
   * @param context - Контекст для поиска (опционально).
   * @returns Элемент.
   */
  export function ensureElement<T extends HTMLElement>(
    selectorElement: T | string,
    context?: HTMLElement
  ): T {
    if (isSelector(selectorElement)) {
      const elements = ensureAllElements<T>(selectorElement, context);
      if (elements.length > 1) {
        console.warn(`Selector ${selectorElement} returned more than one element`);
      }
      if (elements.length === 0) {
        throw new Error(`Selector ${selectorElement} returned nothing`);
      }
      return elements[0];
    }
    if (selectorElement instanceof HTMLElement) {
      return selectorElement as T;
    }
    throw new Error('Unknown selector element');
  }
  
  /**
   * Клонирует содержимое шаблона.
   * @param query - Селектор или элемент шаблона.
   * @returns Клонированный элемент.
   */
  export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement;
    return template.content.firstElementChild!.cloneNode(true) as T;
  }
  
  /**
   * Генерирует имя класса BEM.
   * @param block - Блок.
   * @param element - Элемент (опционально).
   * @param modifier - Модификатор (опционально).
   * @returns Объект с именем и селектором класса.
   */
  export function bem(block: string, element?: string, modifier?: string): { name: string; class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
      name,
      class: `.${name}`,
    };
  }
  