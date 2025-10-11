import React from 'react';
import { Button, Box, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Book, BookStatus } from '../../../types/Book';

interface BookActionsProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onMenuToggle: (bookId: string) => void;
  onStatusChange: (bookId: string, currentStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite?: (bookId: string, currentFavorite: boolean) => void;
}

const ActionsContainer = styled(Box)(() => ({
  display: 'flex',
  gap: 12,
  width: '100%',
}));

const DeleteButton = styled(Button)(() => ({
  flex: 1,
  padding: '12px 24px',
  borderRadius: 16,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.938rem',
  border: `3px solid #ef4444`,
  color: '#dc2626',
  backgroundColor: '#fff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: alpha('#ef4444', 0.05),
    borderColor: '#dc2626',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 16px ${alpha('#ef4444', 0.2)}`,
  },
  
  '& .MuiButton-startIcon': {
    marginRight: 8,
  },
}));

const EditButton = styled(Button)(() => ({
  flex: 1,
  padding: '12px 24px',
  borderRadius: 16,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.938rem',
  color: '#fff',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: `0 4px 12px ${alpha('#6366f1', 0.3)}`,
  border: 'none',
  
  '&:hover': {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha('#6366f1', 0.4)}`,
  },
  
  '& .MuiButton-startIcon': {
    marginRight: 8,
  },
}));

export default function BookActions({
  book,
  onEdit,
  onDelete,
}: BookActionsProps) {
  return (
    <ActionsContainer>
      <DeleteButton
        variant="outlined"
        startIcon={<DeleteIcon sx={{ fontSize: 20 }} />}
        onClick={() => onDelete(book.id)}
      >
        Delete
      </DeleteButton>
      <EditButton
        variant="contained"
        startIcon={<EditIcon sx={{ fontSize: 20 }} />}
        onClick={() => onEdit(book.id)}
      >
        Edit
      </EditButton>
    </ActionsContainer>
  );
}
