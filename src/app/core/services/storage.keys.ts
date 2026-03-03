export const STORAGE_KEYS = {
  AUTH_SESSION: 'mw_auth_session',
  AUTH_REGISTERED_USER: 'mw_auth_registered_user',
  TRANSACCIONES: 'mw_transacciones',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
