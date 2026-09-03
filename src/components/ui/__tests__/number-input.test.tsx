import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '../number-input';

describe('NumberInput component', () => {
  it('renders correctly with label and empty state', () => {
    render(<NumberInput label="Liczba stron" placeholder="Wpisz liczbę" />);
    expect(screen.getByLabelText(/liczba stron/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Wpisz liczbę') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('allows field to be completely cleared and remain empty without snapping to 0', () => {
    const handleValueChange = jest.fn();
    render(<NumberInput defaultValue={350} onValueChange={handleValueChange} placeholder="np. 350" />);

    const input = screen.getByPlaceholderText('np. 350') as HTMLInputElement;
    expect(input.value).toBe('350');

    // Simulate deleting the contents (empty string)
    fireEvent.change(input, { target: { value: '' } });
    expect(input.value).toBe('');
    expect(handleValueChange).toHaveBeenCalledWith(null);
  });

  it('allows typing new numbers when previously empty', () => {
    const handleValueChange = jest.fn();
    render(<NumberInput onValueChange={handleValueChange} placeholder="Wpisz liczbę" />);

    const input = screen.getByPlaceholderText('Wpisz liczbę') as HTMLInputElement;

    // Type digits
    fireEvent.change(input, { target: { value: '42' } });
    expect(input.value).toBe('42');
    expect(handleValueChange).toHaveBeenCalledWith(42);
  });

  it('filters out non-numeric characters', () => {
    render(<NumberInput placeholder="Wpisz liczbę" />);
    const input = screen.getByPlaceholderText('Wpisz liczbę') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'abc123xyz' } });
    expect(input.value).toBe('123');
  });

  it('increments and decrements using stepper buttons', () => {
    const handleValueChange = jest.fn();
    render(
      <NumberInput
        defaultValue={10}
        min={0}
        max={20}
        step={2}
        onValueChange={handleValueChange}
        placeholder="Wpisz"
      />
    );

    const input = screen.getByPlaceholderText('Wpisz') as HTMLInputElement;
    const plusBtn = screen.getByRole('button', { name: /zwiększ wartość/i });
    const minusBtn = screen.getByRole('button', { name: /zmniejsz wartość/i });

    // Increment
    fireEvent.click(plusBtn);
    expect(input.value).toBe('12');
    expect(handleValueChange).toHaveBeenCalledWith(12);

    // Decrement
    fireEvent.click(minusBtn);
    expect(input.value).toBe('10');
    expect(handleValueChange).toHaveBeenCalledWith(10);
  });

  it('respects min and max bounds on steppers', () => {
    render(<NumberInput defaultValue={10} min={10} max={12} placeholder="Wpisz" />);
    const input = screen.getByPlaceholderText('Wpisz') as HTMLInputElement;
    const plusBtn = screen.getByRole('button', { name: /zwiększ wartość/i });
    const minusBtn = screen.getByRole('button', { name: /zmniejsz wartość/i });

    // Decrement button should be disabled when at min
    expect(minusBtn).toBeDisabled();

    // Increment to 11, then 12
    fireEvent.click(plusBtn);
    expect(input.value).toBe('11');
    fireEvent.click(plusBtn);
    expect(input.value).toBe('12');

    // Plus button should now be disabled at max
    expect(plusBtn).toBeDisabled();
  });

  it('supports keyboard ArrowUp and ArrowDown', () => {
    render(<NumberInput defaultValue={5} placeholder="Wpisz" />);
    const input = screen.getByPlaceholderText('Wpisz') as HTMLInputElement;

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('6');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('5');
  });

  it('shows error message when provided as string', () => {
    render(<NumberInput error="Wartość jest wymagana" placeholder="Wpisz" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Wartość jest wymagana');
  });

  it('forwards ref to the underlying input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} placeholder="Test ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
