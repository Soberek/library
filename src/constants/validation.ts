export const VALIDATION_RULES = {
  BOOK: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 200,
    },
    AUTHOR: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    PAGES: {
      MIN: 1,
      MAX: 5000,
    },
    RATING: {
      MIN: 0,
      MAX: 10,
    },
    COVER_URL: {
      MAX_LENGTH: 500,
    },
  },
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'To pole jest wymagane',
  INVALID_EMAIL: 'Nieprawidłowy adres e-mail',
  PASSWORD_TOO_SHORT: 'Hasło musi mieć co najmniej 6 znaków',
  TITLE_TOO_LONG: `Tytuł nie może być dłuższy niż ${VALIDATION_RULES.BOOK.TITLE.MAX_LENGTH} znaków`,
  AUTHOR_TOO_LONG: `Autor nie może być dłuższy niż ${VALIDATION_RULES.BOOK.AUTHOR.MAX_LENGTH} znaków`,
  INVALID_PAGES: `Liczba stron musi być między ${VALIDATION_RULES.BOOK.PAGES.MIN} a ${VALIDATION_RULES.BOOK.PAGES.MAX}`,
  INVALID_RATING: `Ocena musi być między ${VALIDATION_RULES.BOOK.RATING.MIN} a ${VALIDATION_RULES.BOOK.RATING.MAX}`,
  INVALID_URL: 'Nieprawidłowy URL',
  NETWORK_ERROR: 'Błąd połączenia z siecią. Spróbuj ponownie.',
  FIREBASE_ERROR: 'Błąd Firebase. Spróbuj ponownie później.',
  VALIDATION_ERROR: 'Błąd walidacji danych.',
  UNKNOWN_ERROR: 'Wystąpił nieoczekiwany błąd.',
} as const;
