import { renderHook, act } from "@testing-library/react";
import { useBooks } from "../useBooks";
import * as booksService from "../../services/booksService";
import { useUser } from "../useUser";

// Mock the dependencies
jest.mock("../useUser");
jest.mock("../../services/booksService");

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockBooksService = booksService as jest.Mocked<typeof booksService>;

describe("useBooks", () => {
  const mockUser = { 
    uid: "test-user-id",
    email: "test@example.com",
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: "",
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    displayName: null,
    phoneNumber: null,
    photoURL: null,
    providerId: "firebase",
  };
  const mockBooks = [
    {
      id: "1",
      title: "Test Book",
      author: "Test Author",
      read: "W trakcie" as const,
      overallPages: 100,
      readPages: 50,
      cover: "https://example.com/cover.jpg",
      genre: "Fiction",
      rating: 8,
      createdAt: "2023-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch books on mount", async () => {
    mockBooksService.getUserBooksData.mockResolvedValue(mockBooks);

    const { result } = renderHook(() => useBooks());

    expect(result.current.loading).toBe(true);
    expect(result.current.books).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockBooksService.getUserBooksData).toHaveBeenCalledWith("test-user-id");
    expect(result.current.books).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
  });

  it("should handle book deletion", async () => {
    mockBooksService.getUserBooksData.mockResolvedValue(mockBooks);
    mockBooksService.deleteBook.mockResolvedValue();

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleBookDelete("1");
    });

    expect(mockBooksService.deleteBook).toHaveBeenCalledWith("1");
    expect(result.current.books).toEqual([]);
  });

  it("should handle book status change", async () => {
    mockBooksService.getUserBooksData.mockResolvedValue(mockBooks);
    mockBooksService.updateBook.mockResolvedValue(true);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.handleStatusChange("1", "W trakcie");
    });

    expect(mockBooksService.updateBook).toHaveBeenCalledWith("1", { read: "Przeczytana" });
    expect(result.current.books[0].read).toBe("Przeczytana");
  });

  it("should calculate books statistics correctly", async () => {
    const booksWithDifferentStatuses = [
      { ...mockBooks[0], id: "1", read: "Przeczytana" as const },
      { ...mockBooks[0], id: "2", read: "W trakcie" as const },
      { ...mockBooks[0], id: "3", read: "Porzucona" as const },
    ];

    mockBooksService.getUserBooksData.mockResolvedValue(booksWithDifferentStatuses);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.booksStats).toEqual({
      total: 3,
      read: 1,
      inProgress: 1,
      dropped: 1,
    });
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Network error");
    mockBooksService.getUserBooksData.mockRejectedValue(error);

    const { result } = renderHook(() => useBooks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.loading).toBe(false);
  });
});
