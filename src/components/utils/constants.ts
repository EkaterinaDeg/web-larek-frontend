// Файл: /src/utils/constants.ts

/**
 * Модуль содержит константы приложения.
 */

/**
 * Базовый URL API.
 */
const API_ORIGIN = process.env.API_ORIGIN || 'https://larek-api.nomoreparties.co';

/**
 * URL для API запросов.
 */
export const API_URL = `${API_ORIGIN}/api/weblarek`;

/**
 * URL для контента CDN.
 */
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;