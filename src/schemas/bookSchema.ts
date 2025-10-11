import { z } from 'zod';
import { VALIDATION_RULES } from '../constants/validation';

export const bookStatusSchema = z.enum(['W trakcie', 'Przeczytana', 'Porzucona']);

export const bookSchema = z.object({
  id: z.string().min(1, 'ID jest wymagane'),
  title: z
    .string()
    .min(VALIDATION_RULES.BOOK.TITLE.MIN_LENGTH, 'Tytuł jest wymagany')
    .max(VALIDATION_RULES.BOOK.TITLE.MAX_LENGTH, 'Tytuł jest zbyt długi'),
  author: z
    .string()
    .min(VALIDATION_RULES.BOOK.AUTHOR.MIN_LENGTH, 'Autor jest wymagany')
    .max(VALIDATION_RULES.BOOK.AUTHOR.MAX_LENGTH, 'Autor jest zbyt długi'),
  read: bookStatusSchema,
  overallPages: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= VALIDATION_RULES.BOOK.PAGES.MIN && val <= VALIDATION_RULES.BOOK.PAGES.MAX, 
      'Liczba stron musi być liczbą między 1 a 5000'),
  readPages: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0 && val <= VALIDATION_RULES.BOOK.PAGES.MAX, 
      'Przeczytane strony muszą być liczbą między 0 a 5000')
    .optional(),
  cover: z
    .string()
    .optional()
    .or(z.literal('')),
  genre: z.string().min(1, 'Gatunek jest wymagany'),
  rating: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= VALIDATION_RULES.BOOK.RATING.MIN && val <= VALIDATION_RULES.BOOK.RATING.MAX, 
      'Ocena musi być liczbą między 0 a 10'),
  createdAt: z.string().optional(),
  isFavorite: z.boolean().optional().default(false),
});

export const bookFormSchema = bookSchema.omit({ id: true, createdAt: true });

export const bookUpdateSchema = bookSchema.partial().omit({ id: true, createdAt: true });

export const bookToAddSchema = bookSchema.omit({ id: true }).extend({
  userId: z.string().min(1, 'ID użytkownika jest wymagane'),
  createdAt: z.string().min(1, 'Data utworzenia jest wymagana'),
  isFavorite: z.boolean().optional().default(false),
});

export type BookFormData = z.infer<typeof bookFormSchema>;
export type BookUpdateData = z.infer<typeof bookUpdateSchema>;
export type BookToAdd = z.infer<typeof bookToAddSchema>;
