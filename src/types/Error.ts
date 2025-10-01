export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ValidationError extends AppError {
  code: "VALIDATION_ERROR";
  field?: string;
}

export interface FirebaseError extends AppError {
  code: "FIREBASE_ERROR";
  firebaseCode?: string;
}

export interface NetworkError extends AppError {
  code: "NETWORK_ERROR";
  status?: number;
}

export type ErrorType = ValidationError | FirebaseError | NetworkError;

export const createValidationError = (
  message: string,
  field?: string
): ValidationError => ({
  code: "VALIDATION_ERROR",
  message,
  field,
});

export const createFirebaseError = (
  message: string,
  firebaseCode?: string
): FirebaseError => ({
  code: "FIREBASE_ERROR",
  message,
  firebaseCode,
});

export const createNetworkError = (
  message: string,
  status?: number
): NetworkError => ({
  code: "NETWORK_ERROR",
  message,
  status,
});
