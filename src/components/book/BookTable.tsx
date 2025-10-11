import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Book, BookStatus } from '../../types/Book';
import { BOOK_STATUS_LABELS, getNextBookStatus } from '../../constants/bookStatus';

interface BookTableProps {
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleRatingChange: (bookId: string, newRating: number) => void;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  handleEdit: (bookId: string) => void;
  handleDelete: (bookId: string) => void;
  handleShare?: (book: Book) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (field: string, order: 'asc' | 'desc') => void;
}

type SortField = 'title' | 'author' | 'rating' | 'pages' | 'status' | 'dateAdded' | null;
type SortOrder = 'asc' | 'desc';

const statusColors: Record<BookStatus, { color: string; bg: string; text: string; border: string }> = {
  'Chcę przeczytać': { color: 'info', bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-300' },
  'W trakcie': { color: 'warning', bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-300' },
  'Przeczytana': { color: 'success', bg: 'bg-green-600', text: 'text-white', border: 'border-green-300' },
  'Porzucona': { color: 'error', bg: 'bg-red-600', text: 'text-white', border: 'border-red-300' },
};

export default function BookTable({
  books,
  handleStatusChange,
  handleRatingChange,
  handleToggleFavorite,
  handleEdit,
  handleDelete,
  sortField: externalSortField,
  sortOrder: externalSortOrder,
  onSortChange,
}: BookTableProps) {
  // Use external sort state if provided, otherwise use internal state
  const [internalSortField, setInternalSortField] = React.useState<SortField>(null);
  const [internalSortOrder, setInternalSortOrder] = React.useState<SortOrder>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  
  // Use external sort state if provided
  const sortField = externalSortField as SortField || internalSortField;
  const sortOrder = externalSortOrder || internalSortOrder;

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    
    if (onSortChange) {
      // Use external sort handling if provided
      onSortChange(field || '', newOrder);
    } else {
      // Otherwise use internal state
      setInternalSortField(field);
      setInternalSortOrder(newOrder);
    }
  };

  // Filter by favorites
  const filteredBooks = showFavoritesOnly 
    ? books.filter(book => book.isFavorite) 
    : books;

  // Sort books
  const sortedBooks = React.useMemo(() => {
    if (!sortField) return filteredBooks;

    return [...filteredBooks].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'pages':
          comparison = a.overallPages - b.overallPages;
          break;
        case 'status':
          comparison = a.read.localeCompare(b.read);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredBooks, sortField, sortOrder]);

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <TableCell 
      className="p-4 font-bold text-left border-b-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:bg-blue-100 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2 text-gray-800">
        <span className="text-sm uppercase tracking-wide">{label}</span>
        {sortField === field && (
          sortOrder === 'asc' 
            ? <ArrowUpwardIcon fontSize="small" className="text-blue-600" /> 
            : <ArrowDownwardIcon fontSize="small" className="text-blue-600" />
        )}
      </div>
    </TableCell>
  );

  return (
    <div className="mb-4">
      {/* Compact header with filters and info */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-600">
          {sortedBooks.length} z {books.length} książek
          {sortField && <span className="ml-2 text-blue-600">• Sortowanie: {sortField} ({sortOrder === 'asc' ? '↑' : '↓'})</span>}
        </div>
        <FormControlLabel
          control={
            <Switch 
              checked={showFavoritesOnly} 
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              color="error"
              size="small"
            />
          }
          label={
            <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <BookmarkIcon sx={{ fontSize: 14 }} className="text-red-500" />
              Ulubione ({books.filter(b => b.isFavorite).length})
            </span>
          }
          className="m-0"
        />
      </div>

      <TableContainer className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <Table className="w-full border-collapse" size="small">
          <TableHead>
            <TableRow>
              <SortableHeader field="title" label="Tytuł" />
              <SortableHeader field="author" label="Autor" />
              <SortableHeader field="status" label="Status" />
              <SortableHeader field="rating" label="Ocena" />
              <SortableHeader field="pages" label="Strony" />
              <TableCell className="py-2 px-3 font-bold text-left border-b-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                <span className="text-xs uppercase tracking-wide text-gray-800">Akcje</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-8 text-center text-gray-500">
                  {showFavoritesOnly ? 'Brak ulubionych książek' : 'Brak książek'}
                </TableCell>
              </TableRow>
            ) : (
              sortedBooks.map((book, index) => {
                const isFavorite = book.isFavorite ?? false;
                const progress = book.overallPages > 0 ? (book.readPages || 0) / book.overallPages : 0;
                const statusColor = statusColors[book.read];

                return (
                  <TableRow 
                    key={book.id} 
                    className={`
                      transition-colors duration-150
                      hover:bg-blue-50
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      border-b border-gray-100
                    `}
                  >
                    <TableCell className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {book.cover && (
                          <img 
                            src={book.cover} 
                            alt={book.title} 
                            className="w-8 h-12 rounded object-cover border border-gray-200" 
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <Tooltip title={book.title}>
                              <strong 
                                className="cursor-pointer text-blue-700 hover:text-blue-900 hover:underline text-sm font-medium truncate max-w-[180px]" 
                                onClick={() => handleEdit(book.id)}
                              >
                                {book.title}
                              </strong>
                            </Tooltip>
                            {isFavorite && <BookmarkIcon sx={{ fontSize: 14 }} className="text-red-500" />}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <span className="text-gray-700 text-sm truncate block max-w-[120px]">{book.author}</span>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <Tooltip title={`Zmień status: ${BOOK_STATUS_LABELS[getNextBookStatus(book.read)]}`}>
                        <div 
                          className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs 
                            cursor-pointer hover:brightness-95 transition-all
                            ${statusColor.bg} ${statusColor.text}
                          `}
                          onClick={() => handleStatusChange(book.id, book.read)}
                        >
                          {BOOK_STATUS_LABELS[book.read]}
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <Rating
                          value={book.rating / 2}
                          onChange={(_, newValue) => handleRatingChange(book.id, (newValue || 0) * 2)}
                          precision={0.5}
                          size="small"
                          className="text-yellow-500"
                        />
                        <span className="text-xs text-gray-500">{book.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`
                              h-full
                              ${progress === 1 ? 'bg-green-500' : 
                                progress > 0.5 ? 'bg-blue-500' : 
                                'bg-amber-500'}
                            `}
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{(book.readPages || 0)}/{book.overallPages}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1 px-2">
                      <div className="flex gap-1 justify-end">
                        <IconButton 
                          onClick={() => handleToggleFavorite(book.id, isFavorite)} 
                          size="small"
                          sx={{ 
                            padding: '2px',
                            color: isFavorite ? 'red' : 'gray',
                          }}
                        >
                          <BookmarkIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleEdit(book.id)} 
                          size="small"
                          sx={{ padding: '2px', color: '#2563eb' }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(book.id)} 
                          size="small"
                          sx={{ padding: '2px', color: '#dc2626' }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Removed menu since we now have direct action buttons */}
    </div>
  );
}
