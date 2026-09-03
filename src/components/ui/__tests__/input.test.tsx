import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';
import { SearchInput } from '../SearchInput';

describe('Input component', () => {
  it('renders standard input with placeholder', () => {
    render(<Input placeholder="Wpisz tekst..." />);
    expect(screen.getByPlaceholderText('Wpisz tekst...')).toBeInTheDocument();
  });

  it('renders label and required indicator', () => {
    render(<Input label="Adres email" required placeholder="twoj@email.com" />);
    expect(screen.getByText(/Adres email/i)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders string error message with alert role', () => {
    render(<Input label="Nazwa" error="Pole jest wymagane" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Pole jest wymagane');
  });

  it('renders helper text when no error is present', () => {
    render(<Input helperText="Podaj minimum 6 znaków" />);
    expect(screen.getByText('Podaj minimum 6 znaków')).toBeInTheDocument();
  });

  it('toggles password visibility when showPasswordToggle is enabled', () => {
    render(<Input type="password" showPasswordToggle placeholder="Hasło" />);
    const input = screen.getByPlaceholderText('Hasło');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /pokaż hasło/i });
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByRole('button', { name: /ukryj hasło/i });
    fireEvent.click(hideBtn);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('supports clearable functionality', () => {
    const handleClear = jest.fn();
    render(<Input defaultValue="Przykładowy tekst" clearable onClear={handleClear} />);
    const clearBtn = screen.getByRole('button', { name: /wyczyść/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders prefix and suffix text', () => {
    render(<Input prefixText="https://" suffixText=".com" placeholder="twojadomena" />);
    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
  });

  it('forwards ref to the native input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} defaultValue="Test ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.value).toBe('Test ref');
  });
});

describe('SearchInput component', () => {
  it('renders search input with shortcut badge', () => {
    render(<SearchInput placeholder="Szukaj książki..." shortcutBadge="⌘K" />);
    expect(screen.getByPlaceholderText('Szukaj książki...')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('calls onClear on Escape key', () => {
    const handleClear = jest.fn();
    render(<SearchInput defaultValue="Tolkien" onClear={handleClear} />);
    const input = screen.getByDisplayValue('Tolkien');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
