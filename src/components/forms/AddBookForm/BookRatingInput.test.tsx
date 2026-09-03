import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookRatingInput } from './BookRatingInput';

describe('BookRatingInput', () => {
  it('renders correctly with default empty state', () => {
    render(<BookRatingInput value={0} onChange={jest.fn()} />);

    expect(screen.getByText('Twoja ocena')).toBeInTheDocument();
    expect(screen.getByText('Brak oceny')).toBeInTheDocument();
    expect(screen.getByLabelText(/5 gwiazdek/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/10 gwiazdek/i)).toBeInTheDocument();
  });

  it('displays rating score and verbal description when value > 0', () => {
    render(<BookRatingInput value={8} onChange={jest.fn()} />);

    expect(screen.getByText(/8 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByText('Bardzo dobra')).toBeInTheDocument();
  });

  it('calls onChange when clicking a star', () => {
    const handleChange = jest.fn();
    render(<BookRatingInput value={0} onChange={handleChange} />);

    fireEvent.click(screen.getByLabelText(/7 gwiazdek/i));
    expect(handleChange).toHaveBeenCalledWith(7);
  });

  it('calls onChange when clicking a numbered pill', () => {
    const handleChange = jest.fn();
    render(<BookRatingInput value={0} onChange={handleChange} />);

    const pill9 = screen.getByRole('button', { name: '9' });
    fireEvent.click(pill9);
    expect(handleChange).toHaveBeenCalledWith(9);
  });

  it('resets rating when clicking the already selected star', () => {
    const handleChange = jest.fn();
    render(<BookRatingInput value={6} onChange={handleChange} />);

    fireEvent.click(screen.getByLabelText(/6 gwiazdek/i));
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('resets rating when clicking clear X button', () => {
    const handleChange = jest.fn();
    render(<BookRatingInput value={10} onChange={handleChange} />);

    const clearBtn = screen.getByRole('button', { name: /usuń ocenę/i });
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith(0);
  });
});
