import { signInSchema, signUpSchema, resetPasswordSchema } from '../authSchema';

describe('authSchema', () => {
  describe('signInSchema', () => {
    it('should validate valid email and password', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should trim and lowercase email', () => {
      const result = signInSchema.safeParse({
        email: '  User@Example.COM  ',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });

    it('should reject invalid email', () => {
      const result = signInSchema.safeParse({
        email: 'notanemail',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signUpSchema', () => {
    it('should validate password with number or special character', () => {
      const result = signUpSchema.safeParse({
        email: 'newuser@example.com',
        password: 'Secret123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject password without numbers or special characters', () => {
      const result = signUpSchema.safeParse({
        email: 'newuser@example.com',
        password: 'secretpassword',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate email for reset password', () => {
      const result = resetPasswordSchema.safeParse({
        email: 'reset@example.com',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('reset@example.com');
      }
    });

    it('should reject empty or invalid email', () => {
      expect(resetPasswordSchema.safeParse({ email: '' }).success).toBe(false);
      expect(resetPasswordSchema.safeParse({ email: 'invalid' }).success).toBe(false);
    });
  });
});
