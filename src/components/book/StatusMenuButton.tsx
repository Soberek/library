import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import type { BookStatus } from "../../types/Book";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "../../constants/bookStatus";
import { STATUS_STYLE, STATUS_PILL } from "../../constants/bookUi";

interface StatusMenuButtonProps {
  status: BookStatus;
  onSelect: (next: BookStatus) => void;
  variant?: "solid" | "pill";
  size?: "sm" | "md";
}

const StatusMenuButton: React.FC<StatusMenuButtonProps> = ({
  status,
  onSelect,
  variant = "solid",
  size = "sm",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const style = STATUS_STYLE[status];
  const pill = STATUS_PILL[status];
  const StatusIcon = style.Icon;

  const isSolid = variant === "solid";

  return (
    <>
      <Tooltip title="Zmień status" arrow>
        <Box
          component="button"
          type="button"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          aria-label={`Status: ${BOOK_STATUS_LABELS[status]}. Kliknij, aby zmienić.`}
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={{
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: size === "sm" ? 1 : 1.25,
            py: size === "sm" ? 0.4 : 0.5,
            borderRadius: 999,
            bgcolor: isSolid ? style.bg : pill.bg,
            color: isSolid ? "#fff" : pill.color,
            fontSize: size === "sm" ? "0.65rem" : "0.6875rem",
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            boxShadow: isSolid ? "0 2px 8px rgba(15,23,42,0.18)" : "none",
            transition: "filter 0.15s ease",
            "&:hover": { filter: "brightness(0.96)" },
          }}
        >
          <StatusIcon sx={{ fontSize: size === "sm" ? 12 : 14 }} />
          {isSolid ? style.short : BOOK_STATUS_LABELS[status]}
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 200,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.100",
            boxShadow: "0 8px 24px rgba(26, 32, 44, 0.1)",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {BOOK_STATUSES.map((option) => {
          const optionStyle = STATUS_STYLE[option];
          const OptionIcon = optionStyle.Icon;
          const selected = option === status;
          return (
            <MenuItem
              key={option}
              selected={selected}
              onClick={() => {
                setAnchorEl(null);
                if (option !== status) onSelect(option);
              }}
              sx={{ py: 1.1, gap: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    bgcolor: optionStyle.bg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <OptionIcon sx={{ fontSize: 13 }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={BOOK_STATUS_LABELS[option]}
                primaryTypographyProps={{
                  fontWeight: selected ? 700 : 500,
                  fontSize: "0.875rem",
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default StatusMenuButton;
