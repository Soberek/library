import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BookForm from './BookForm';

const mockOnSubmit = jest.fn();

describe('BookForm', () => {
  test('renders form fields', () => {
    render(
      <BookForm
        initialData={undefined}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByLabelText(/Tytuł/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Autor/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gatunek/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Przeczytane strony/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Liczba stron/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/5 gwiazdek/i)).toBeInTheDocument();
    expect(screen.getByTestId('cover-input')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /dodaj książkę/i }),
    ).toBeInTheDocument();
  });
});
