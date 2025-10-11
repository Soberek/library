import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Box,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { BookOpen, Edit, Delete } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';
import { BOOK_STATUS_LABELS, getNextBookStatus } from '../../constants/bookStatus';

interface BookTableProps {
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleRatingChange: (bookId: string, newRating: number) => void;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  handleEdit: (bookId: string) => void;
  handleDelete: (bookId: string) => void;
  handleShare: (book: Book) => void;
}

// Status colors (add after constants):
const statusColors = {
  'W trakcie': { color: 'warning', bg: 'amber' },
  'Przeczytana': { color: 'success', bg: 'green' },
  'Porzucona': { color: 'error', bg: 'red' },
} as const;

export default function BookTable({
  books,
  handleStatusChange,
  handleRatingChange,
  handleToggleFavorite,
  handleEdit,
  handleDelete,
  handleShare,
}: BookTableProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedBookId, setSelectedBookId] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, bookId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookId(bookId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBookId(null);
  };

  const selectedBook = selectedBookId ? books.find(b => b.id === selectedBookId) : null;

  return (
    <TableContainer className="overflow-x-auto mb-4 border rounded-lg shadow-sm">
      <Table className="w-full border-collapse">
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="p-3 font-semibold text-left border-b text-gray-700 min-w-[200px]">Title</TableCell>
            <TableCell className="p-3 font-semibold text-left border-b text-gray-700 min-w-[150px]">Author</TableCell>
            <TableCell className="p-3 font-semibold text-left border-b text-gray-700 min-w-[120px]">Status</TableCell>
            <TableCell className="p-3 font-semibold text-left border-b text-gray-700 min-w-[100px]">Rating</TableCell>
            <TableCell className="p-3 font-semibold text-left border-b text-gray-700 min-w-[150px]">Pages</TableCell>
            <TableCell className="p-3 font-semibold text-left border-b text-gray-700 min-w-[120px]">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => {
            const isFavorite = book.isFavorite ?? false;
            const progress = book.overallPages > 0 ? (book.readPages || 0) / book.overallPages : 0;
            const statusColor = statusColors[book.read];

            return (
              <TableRow key={book.id} className="transition-all duration-200 hover:bg-blue-50 even:bg-gray-50 [&:hover]:shadow-md [&:hover]:-translate-y-0.5">
                <TableCell className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    {book.cover && <img src={book.cover} alt={book.title} className="w-10 h-16 rounded object-cover" />}
                    <div>
                      <Tooltip title={book.title}>
                        <strong className="cursor-pointer text-blue-600 hover:text-blue-800 block" onClick={() => handleEdit(book.id)}>{book.title}</strong>
                      </Tooltip>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-3 border-b">
                  <span className="text-gray-800">{book.author}</span>
                </TableCell>
                <TableCell className="p-3 border-b">
                  <Tooltip title={`Change status: ${BOOK_STATUS_LABELS[getNextBookStatus(book.read)]}`}>
                    <Chip
                      label={BOOK_STATUS_LABELS[book.read]}
                      color={statusColor.color as any}
                      size="small"
                      onClick={() => handleStatusChange(book.id, book.read)}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      sx={{ backgroundColor: `${statusColor.bg}.100` }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell className="p-3 border-b">
                  <Tooltip title={`Rate: ${book.rating}/10`}>
                    <Rating
                      value={book.rating}
                      onChange={(_, newValue) => handleRatingChange(book.id, newValue || 0)}
                      precision={0.5}
                      size="small"
                      className="text-yellow-500"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell className="p-3 border-b">
                  <div className="w-full">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${progress > 0.5 ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <small className="text-center block text-gray-600 mt-1">{(book.readPages || 0)}/{book.overallPages}</small>
                  </div>
                </TableCell>
                <TableCell className="p-3 border-b">
                  <div className="flex gap-1">
                    <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                      <IconButton 
                        onClick={() => { console.log('Toggle favorite for', book.id, 'current:', isFavorite); handleToggleFavorite(book.id, isFavorite); }} 
                        size="small" 
                        sx={{ 
                          color: isFavorite ? 'red' : 'gray', 
                          '&:hover': { color: isFavorite ? 'darkred' : 'darkgray' },
                          '& .MuiSvgIcon-root': { fill: isFavorite ? 'red' : 'none' }  // Ensure fill for filled icon
                        }}
                      >
                        {isFavorite ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton onClick={() => handleShare(book)} size="small" className="text-gray-600">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More options">
                      <IconButton onClick={(e) => handleMenuClick(e, book.id)} size="small" className="text-gray-600">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {selectedBook && (
          <>
            <MenuItem onClick={() => { handleEdit(selectedBook.id); handleMenuClose(); }}>
              <Edit size={16} style={{ marginRight: 8 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => { handleDelete(selectedBook.id); handleMenuClose(); }}>
              <Delete size={16} style={{ marginRight: 8 }} /> Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </TableContainer>
  );
}
