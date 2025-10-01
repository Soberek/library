import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BookForm from "./BookForm";

// type BookFormProps = {n
//   handleBookSubmit: (e: React.ChangeEvent<HTMLFormElement>) => Promise<any>;
//   handleStarClick: (index: number) => void;
//   stars: number;
//   handleFormVisibility: () => void;
//   isFormVisible: boolean;
// };
// To run tests with Jest, use the following command in your terminal:
// npx jest
// or if you have it installed globally:
// jest
// This will execute all test files (e.g., *.test.tsx) using Jest.

const mockOnSubmit = jest.fn();
const mockBookModalOpen = jest.fn();
const mockBookModalClose = jest.fn();

describe("BookForm", () => {
  test.only("renders form fields", () => {
    const { container } = render(
      <BookForm
        handleBookSubmit={mockOnSubmit}
        mode="add"
        handleBookModalOpen={mockBookModalOpen}
        handleBookModalClose={mockBookModalClose}
        isFormVisible={true}
      />,
    );

    expect(screen.getByLabelText(/Tytuł/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Autor/i)).toBeInTheDocument();

    const selectRead = container.querySelector("select[name='read']");
    expect(selectRead).toBeInTheDocument();

    const selectGenre = container.querySelector("select[name='genre']");
    expect(selectGenre).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Przeczytane strony/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Liczba stron/i)).toBeInTheDocument();

    expect(screen.getByTestId("star-rating")).toBeInTheDocument();
    expect(screen.getByTestId("cover-input")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /dodaj książkę/i }),
    ).toBeInTheDocument();
  });
});
