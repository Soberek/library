import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button component', () => {
  it('renders correctly with label', () => {
    render(<Button>Kliknij mnie</Button>);
    expect(screen.getByRole('button', { name: /kliknij mnie/i })).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Akcja</Button>);
    fireEvent.click(screen.getByRole('button', { name: /akcja/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Zablokowany</Button>);
    const button = screen.getByRole('button', { name: /zablokowany/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading state properly', () => {
    render(
      <Button loading loadingText="Ładowanie danych...">
        Zapisz
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Ładowanie danych...')).toBeInTheDocument();
    expect(screen.queryByText('Zapisz')).not.toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">👈</span>}
        rightIcon={<span data-testid="right-icon">👉</span>}
      >
        Z ikonami
      </Button>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('Z ikonami')).toBeInTheDocument();
  });

  it('applies fullWidth and rounded classes', () => {
    const { container } = render(
      <Button fullWidth rounded="full">
        Pełna szerokość
      </Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('rounded-full');
  });

  it('renders different variants and sizes', () => {
    const { rerender } = render(<Button variant="destructive" size="lg">Usuń</Button>);
    let button = screen.getByRole('button', { name: /usuń/i });
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('h-12');

    rerender(<Button variant="rose" size="xs">Serduszko</Button>);
    button = screen.getByRole('button', { name: /serduszko/i });
    expect(button).toHaveClass('from-rose-500');
    expect(button).toHaveClass('h-7');
  });

  it('maintains horizontal layout with flex-row and flex-nowrap', () => {
    const { container } = render(
      <Button leftIcon={<span data-testid="icon">icon</span>}>
        <span>Text</span>
      </Button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('flex-row');
    expect(button).toHaveClass('flex-nowrap');
    expect(button).toHaveClass('whitespace-nowrap');
    expect(button).toHaveClass('items-center');
  });
});
