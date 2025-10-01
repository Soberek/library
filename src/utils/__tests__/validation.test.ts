import {
  isValidUrl,
  isInRange,
  validateBookTitle,
  validateBookAuthor,
  validateBookPages,
  validateBookRating,
  validateCoverUrl,
} from "../validation";

describe("validation utilities", () => {
  describe("isValidUrl", () => {
    it("should return true for valid URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("https://example.com/path")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
      // Note: ftp:// is actually a valid URL, so we'll test with a truly invalid one
      expect(isValidUrl("not-a-url-at-all")).toBe(false);
    });
  });

  describe("isInRange", () => {
    it("should return true for values within range", () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it("should return false for values outside range", () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });

  describe("validateBookTitle", () => {
    it("should return null for valid titles", () => {
      expect(validateBookTitle("Valid Title")).toBe(null);
      expect(validateBookTitle("A")).toBe(null);
    });

    it("should return error for empty titles", () => {
      expect(validateBookTitle("")).toBe("Tytuł jest wymagany");
      expect(validateBookTitle("   ")).toBe("Tytuł jest wymagany");
    });

    it("should return error for titles that are too long", () => {
      const longTitle = "a".repeat(201);
      expect(validateBookTitle(longTitle)).toBe("Tytuł nie może być dłuższy niż 200 znaków");
    });
  });

  describe("validateBookAuthor", () => {
    it("should return null for valid authors", () => {
      expect(validateBookAuthor("Valid Author")).toBe(null);
      expect(validateBookAuthor("A")).toBe(null);
    });

    it("should return error for empty authors", () => {
      expect(validateBookAuthor("")).toBe("Autor jest wymagany");
      expect(validateBookAuthor("   ")).toBe("Autor jest wymagany");
    });

    it("should return error for authors that are too long", () => {
      const longAuthor = "a".repeat(101);
      expect(validateBookAuthor(longAuthor)).toBe("Autor nie może być dłuższy niż 100 znaków");
    });
  });

  describe("validateBookPages", () => {
    it("should return null for valid page counts", () => {
      expect(validateBookPages(1)).toBe(null);
      expect(validateBookPages(100)).toBe(null);
      expect(validateBookPages(5000)).toBe(null);
    });

    it("should return error for invalid page counts", () => {
      expect(validateBookPages(0)).toBe("Liczba stron musi być między 1 a 5000");
      expect(validateBookPages(5001)).toBe("Liczba stron musi być między 1 a 5000");
    });
  });

  describe("validateBookRating", () => {
    it("should return null for valid ratings", () => {
      expect(validateBookRating(0)).toBe(null);
      expect(validateBookRating(5)).toBe(null);
      expect(validateBookRating(10)).toBe(null);
    });

    it("should return error for invalid ratings", () => {
      expect(validateBookRating(-1)).toBe("Ocena musi być między 0 a 10");
      expect(validateBookRating(11)).toBe("Ocena musi być między 0 a 10");
    });
  });

  describe("validateCoverUrl", () => {
    it("should return null for valid URLs", () => {
      expect(validateCoverUrl("https://example.com/cover.jpg")).toBe(null);
      expect(validateCoverUrl("")).toBe(null); // Optional field
    });

    it("should return error for invalid URLs", () => {
      expect(validateCoverUrl("not-a-url")).toBe("Nieprawidłowy URL");
    });

    it("should return error for URLs that are too long", () => {
      const longUrl = "https://example.com/" + "a".repeat(500);
      expect(validateCoverUrl(longUrl)).toBe("URL okładki nie może być dłuższy niż 500 znaków");
    });
  });
});
