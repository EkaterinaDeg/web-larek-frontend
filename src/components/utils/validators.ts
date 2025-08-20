// Файл: /src/utils/validators.ts

/**
 * Модуль содержит функции для валидации полей форм.
 */

/**
 * Валидация email.
 * @param email - Значение поля email.
 * @returns Сообщение об ошибке или `null`, если ошибок нет.
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  if (!email.trim()) {
    return 'Введите Email.';
  } else if (!emailRegex.test(email)) {
    return 'Введите корректный Email.';
  }
  return null;
}

/**
 * Валидация номера телефона.
 * @param phone - Значение поля телефона.
 * @returns Сообщение об ошибке или `null`, если ошибок нет.
 */
export function validatePhone(phone: string): string | null {
  const phoneRegex = /^[\d\s()+-]{1,20}$/;
  if (!phone.trim()) {
    return 'Введите номер телефона.';
  } else if (!phoneRegex.test(phone)) {
    return 'Введите корректный номер телефона (цифры, пробелы, скобки, + и -, не более 20 символов).';
  }
  return null;
}

/**
 * Валидация адреса доставки.
 * @param address - Значение поля адреса.
 * @returns Сообщение об ошибке или `null`, если ошибок нет.
 */
export function validateAddress(address: string): string | null {
  if (!address.trim()) {
    return 'Введите адрес доставки.';
  } else if (address.length < 8 || address.length > 40) {
    return 'Адрес должен содержать от 8 до 40 символов.';
  }
  return null;
}

/**
 * Валидация способа оплаты.
 * @param selectedMethod - Выбранный способ оплаты.
 * @returns Сообщение об ошибке или `null`, если ошибок нет.
 */
export function validatePaymentMethod(selectedMethod: string | null): string | null {
  if (!selectedMethod) {
    return 'Выберите способ оплаты.';
  }
  return null;
}