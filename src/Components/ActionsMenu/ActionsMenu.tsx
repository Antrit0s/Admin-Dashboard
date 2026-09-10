import { IconButton } from "@mui/material";
import {
  CloseOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  MoreVertOutlined,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";

interface ActionsMenuProps {
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ActionsMenu({
  id,
  isOpen,
  onToggle,
  onView,
  onEdit,
  onDelete,
}: ActionsMenuProps) {
  if (!isOpen) {
    return (
      <IconButton onClick={() => onToggle(id)}>
        <MoreVertOutlined fontSize="small" />
      </IconButton>
    );
  }

  return (
    <>
      {onView && (
        <IconButton onClick={onView} title="View Details">
          <RemoveRedEyeOutlined fontSize="small" />
        </IconButton>
      )}

      <IconButton onClick={onEdit} title="Edit Order">
        <EditOutlined fontSize="small" />
      </IconButton>

      <IconButton color="error" onClick={onDelete} title="Delete Order">
        <DeleteOutlineOutlined fontSize="small" />
      </IconButton>

      <IconButton onClick={() => onToggle(id)} title="Close">
        <CloseOutlined fontSize="small" />
      </IconButton>
    </>
  );
}
