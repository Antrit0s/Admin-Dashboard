import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  FulfillmentStatus,
  Order,
  useDeleteOrderMutation,
  useUpdateFulfillmentStatusMutation,
} from "../../Store/api/ordersApi";

interface OrderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const FULFILLMENT_STATUSES: FulfillmentStatus[] = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderDetailsDrawer({
  open,
  onClose,
  order,
}: OrderDetailsDrawerProps) {
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateFulfillmentStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  if (!open || !order) {
    return null;
  }

  const handleStatusChange = async (status: FulfillmentStatus) => {
    try {
      await updateStatus({
        id: order.id,
        fulfillmentStatus: status,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await deleteOrder(order.id).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Order #{order.id}
        </Typography>

        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Stack spacing={2.5} sx={{ p: 3, flex: 1, overflowY: "auto" }}>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, textTransform: "uppercase" }}
          >
            Customer Details
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 0.5 }}>
            {order.customerName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {order.customerEmail}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              mb: 1,
              display: "block",
            }}
          >
            Statuses
          </Typography>

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Payment:
              </Typography>

              <Chip
                label={order.paymentStatus}
                size="small"
                color={
                  order.paymentStatus === "Paid"
                    ? "success"
                    : order.paymentStatus === "Pending"
                      ? "warning"
                      : "error"
                }
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Fulfillment:
              </Typography>

              <Select
                size="small"
                fullWidth
                value={order.fulfillmentStatus}
                onChange={(event) =>
                  handleStatusChange(event.target.value as FulfillmentStatus)
                }
                disabled={isUpdating}
              >
                {FULFILLMENT_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              mb: 1,
              display: "block",
            }}
          >
            Items
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          sx={{
            bgcolor: "action.hover",
            p: 2,
            borderRadius: 1.5,
          }}
        >
          <Stack spacing={0.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">
                ${order.subtotal.toFixed(2)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2">${order.tax.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">
                ${order.shipping.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Total Amount:
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ${order.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          p: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            py: 1,
          }}
        >
          Delete Order
        </Button>
      </Box>
    </Box>
  );
}
