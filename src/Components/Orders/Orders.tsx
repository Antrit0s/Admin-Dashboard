import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  Order,
  useDeleteOrderMutation,
  useGetOrdersQuery,
} from "../../Store/api/ordersApi";

import ActionsMenu from "../ActionsMenu/ActionsMenu.tsx";
import OrderDetailsDrawer from "./OrderDetailsDrawer";

const ITEMS_PER_PAGE = 8;

export default function Orders() {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data: rawData, isLoading, isFetching, isError } = useGetOrdersQuery();

  const [deleteOrder] = useDeleteOrderMutation();

  const ordersData = useMemo(
    () => (Array.isArray(rawData) ? rawData : []),
    [rawData],
  );

  const activeSelectedOrder = useMemo(() => {
    if (!selectedOrderId) {
      return null;
    }

    return (
      ordersData.find(
        (order) => String(order.id) === String(selectedOrderId),
      ) ?? null
    );
  }, [ordersData, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const normalizedPaymentStatus = paymentStatus.toLowerCase();
    const normalizedFulfillmentStatus = fulfillmentStatus.toLowerCase();

    return ordersData.filter((order) => {
      if (!order) {
        return false;
      }

      const orderId = String(order.id ?? "").toLowerCase();
      const customerName = String(order.customerName ?? "").toLowerCase();
      const customerEmail = String(order.customerEmail ?? "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        orderId.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch);

      const matchesPayment =
        paymentStatus === "all" ||
        String(order.paymentStatus ?? "").toLowerCase() ===
          normalizedPaymentStatus;

      const matchesFulfillment =
        fulfillmentStatus === "all" ||
        String(order.fulfillmentStatus ?? "").toLowerCase() ===
          normalizedFulfillmentStatus;

      return matchesSearch && matchesPayment && matchesFulfillment;
    });
  }, [ordersData, search, paymentStatus, fulfillmentStatus]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  const handleToggleMenu = (id: string) => {
    setOpenMenuId((currentId) => (currentId === id ? null : id));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setDrawerOpen(true);
    setOpenMenuId(null);
  };

  const handleEditOrder = (orderId: string) => {
    navigate(`/orders/${orderId}/edit`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      return;
    }

    try {
      await deleteOrder(orderId).unwrap();

      if (selectedOrderId === orderId) {
        setDrawerOpen(false);
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setOpenMenuId(null);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ alignItems: "stretch", width: "100%", m: 0 }}
    >
      <Grid
        size={{
          xs: drawerOpen ? 7.5 : 12,
          xl: drawerOpen ? 8.5 : 12,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Orders
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage customer orders and fulfillment workflows
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/orders/new")}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Create New Order
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            display: "flex",
            gap: 1.5,
            p: 2,
            mb: 2,
            border: "1px solid",
            borderColor: "divider",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search by ID, customer name or email"
            size="small"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            sx={{ flex: 2, minWidth: 160 }}
          />

          <Select
            size="small"
            value={paymentStatus}
            onChange={(event) => {
              setPaymentStatus(event.target.value);
              setPage(1);
            }}
            sx={{ flex: 1, minWidth: 130 }}
          >
            <MenuItem value="all">All Payments</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>

          <Select
            size="small"
            value={fulfillmentStatus}
            onChange={(event) => {
              setFulfillmentStatus(event.target.value);
              setPage(1);
            }}
            sx={{ flex: 1, minWidth: 140 }}
          >
            <MenuItem value="all">All Fulfillments</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </Paper>

        {isLoading || isFetching ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Paper sx={{ p: 3 }}>
            <Typography color="error">Failed to load orders.</Typography>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Order ID</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Customer</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Total</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Payment</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Fulfillment
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      minWidth: 160,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No orders match the filter criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        #{order.id}
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.customerName}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {order.customerEmail}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </TableCell>

                      <TableCell>
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
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={order.fulfillmentStatus}
                          size="small"
                          variant="outlined"
                          color={
                            order.fulfillmentStatus === "Delivered"
                              ? "success"
                              : order.fulfillmentStatus === "Shipped"
                                ? "info"
                                : order.fulfillmentStatus === "Processing"
                                  ? "warning"
                                  : "default"
                          }
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: "0.875rem",
                          color: "text.secondary",
                        }}
                      >
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>

                      <TableCell align="center">
                        <ActionsMenu
                          id={order.id}
                          isOpen={openMenuId === order.id}
                          onToggle={handleToggleMenu}
                          onView={() => handleViewOrder(order)}
                          onEdit={() => handleEditOrder(order.id)}
                          onDelete={() => handleDeleteOrder(order.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Grid>

      {drawerOpen && (
        <Grid size={{ xs: 4.5, xl: 3.5 }}>
          <OrderDetailsDrawer
            open={drawerOpen}
            onClose={closeDrawer}
            order={activeSelectedOrder}
          />
        </Grid>
      )}
    </Grid>
  );
}
