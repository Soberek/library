import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import FilterSortPanel from './FilterSortPanel';
import theme from '../../theme/theme';
import type { Book } from '../../types/Book';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Book Z',
    author: 'Author Y',
    genre: 'fiction',
    read: 'W trakcie' as const,
    rating: 8.5,
    overallPages: 300,
    readPages: 150,
    isFavorite: false,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Book A',
    author: 'Author A',
    genre: 'non-fiction',
    read: 'Przeczytana' as const,
    rating: 9.0,
    overallPages: 400,
    readPages: 400,
    isFavorite: true,
    createdAt: '2023-02-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Book B',
    author: 'Author B',
    genre: 'fiction',
    read: 'Porzucona' as const,
    rating: 7.0,
    overallPages: 200,
    readPages: 50,
    isFavorite: false,
    createdAt: '2023-03-01T00:00:00Z',
  },
];

const mockOnFilterChange = jest.fn();

// Simple mock for Select - use input for easy change
jest.mock('@mui/material/Select', () => ({ onChange, value, label }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; value: string; label: string }) => (
  <input 
    value={value} 
    onChange={onChange} 
    data-testid={`${label}-input`}
    placeholder={`${label} all`}
  />
));

// Mock Slider as input
jest.mock('@mui/material/Slider', () => ({ onChange, value }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; value: number | number[] }) => (
  <input type="range" value={Array.isArray(value) ? value.join(',') : value} onChange={onChange} data-testid="slider" />
));

// Mock Switch
jest.mock('@mui/material/Switch', () => ({ onChange, checked }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; checked: boolean }) => (
  <input type="checkbox" checked={checked} onChange={onChange} data-testid="switch" />
));

// Mock TextField
jest.mock('@mui/material/TextField', () => ({ onChange, value, placeholder }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; value: string; placeholder: string }) => (
  <input type="text" value={value} onChange={onChange} placeholder={placeholder} data-testid="author-input" />
));

describe('FilterSortPanel', () => {
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText('Filtry i sortowanie')).toBeInTheDocument();
  });

  it('applies status filter correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    const statusInput = screen.getByTestId('Status-input');
    fireEvent.change(statusInput, { target: { value: 'W trakcie' } });

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(2));

    const calledWith = mockOnFilterChange.mock.calls[1][0];
    expect(calledWith.length).toBe(1);
    expect(calledWith[0].id).toBe('1');
  });

  it('applies genre filter correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    const genreInput = screen.getByTestId('Gatunek-input');
    fireEvent.change(genreInput, { target: { value: 'fiction' } });

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(2));

    const calledWith = mockOnFilterChange.mock.calls[1][0];
    expect(calledWith.length).toBe(2);
    expect(calledWith.map((b: Book) => b.id)).toEqual(expect.arrayContaining(['1', '3']));
  });

  it('applies author filter correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    const authorInput = screen.getByLabelText('Autor');
    fireEvent.change(authorInput, { target: { value: 'Author A' } });

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(2));

    const calledWith = mockOnFilterChange.mock.calls[1][0];
    expect(calledWith.length).toBe(1);
    expect(calledWith[0].id).toBe('2');
  });

  it('applies favorites filter correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    const favoritesSwitch = screen.getByTestId('switch');
    fireEvent.click(favoritesSwitch);

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(2));

    const calledWith = mockOnFilterChange.mock.calls[1][0];
    expect(calledWith.length).toBe(1);
    expect(calledWith[0].id).toBe('2');
  });

  it('sorts by title ascending', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    const sortByInput = screen.getByTestId('Sortuj według-input');
    fireEvent.change(sortByInput, { target: { value: 'title' } });

    const sortOrderInput = screen.getByTestId('Kolejność-input');
    fireEvent.change(sortOrderInput, { target: { value: 'asc' } });

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(2));

    const calledWith = mockOnFilterChange.mock.calls[1][0];
    expect(calledWith[0].title).toBe('Book A');
  });

  it('sorts by author descending', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    const sortByInput = screen.getByTestId('Sortuj według-input');
    fireEvent.change(sortByInput, { target: { value: 'author' } });

    const sortOrderInput = screen.getByTestId('Kolejność-input');
    fireEvent.change(sortOrderInput, { target: { value: 'desc' } });

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(3));

    const calledWith = mockOnFilterChange.mock.calls[2][0];
    expect(calledWith[0].author).toBe('Author Y');
  });

  it('respects primary status sorting', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(1));

    const calledWith = mockOnFilterChange.mock.calls[0][0];
    const statuses = calledWith.map((book: Book) => book.read);
    const expectedOrder = ['W trakcie', 'Przeczytana', 'Porzucona'];
    expect(statuses).toEqual(expectedOrder);
  });

  it('clears all filters correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterSortPanel
          books={mockBooks}
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onToggle={jest.fn()}
        />
      </ThemeProvider>,
    );

    // Apply a filter first
    const statusInput = screen.getByTestId('Status-input');
    fireEvent.change(statusInput, { target: { value: 'W trakcie' } });

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(2));

    // Now clear
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    await waitFor(() => expect(mockOnFilterChange).toHaveBeenCalledTimes(3));

    const finalCalledWith = mockOnFilterChange.mock.calls[2][0];
    expect(finalCalledWith).toEqual(mockBooks);
  });
});
