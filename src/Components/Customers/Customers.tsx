import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";

import ActionsMenu from "../ActionsMenu/ActionsMenu.tsx";
import CustomerDrawer from "./CustomerDrawer.tsx";

import { useGetOrdersQuery } from "../../Store/api/ordersApi.ts";
import {
  Customer,
  formatAddress,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "../../Store/api/customersApi.ts";

const ITEMS_PER_PAGE = 8;

export default function Customers() {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  const { data: customers = [], isLoading, isError } = useGetCustomersQuery();
  const { data: orders = [] } = useGetOrdersQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const orderCountByCustomer = useMemo(() => {
    const counts: Record<string, number> = {};

    orders.forEach((order) => {
      counts[order.customerId] = (counts[order.customerId] ?? 0) + 1;
    });

    return counts;
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch),
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    await deleteCustomer(id);
  };

  const openAddDrawer = () => {
    setEditingCustomer(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (customerToEdit: Customer) => {
    setEditingCustomer(customerToEdit);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCustomer(null);
  };

  const toggleMenuActions = (id: string) => {
    setExpandedMenuId((currentId) => (currentId === id ? null : id));
  };

  const goToCustomerOrders = (customerId: string) => {
    navigate(`/orders?customerId=${customerId}`);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ alignItems: "stretch", width: "100%", m: 0 }}
    >
      <Grid size={{ xs: drawerOpen ? 7.5 : 12, xl: drawerOpen ? 8.5 : 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Customers
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage your customer base
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openAddDrawer}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Add Customer
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
            placeholder="Search by name or email"
            size="small"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            fullWidth
          />
        </Paper>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Paper sx={{ p: 3 }}>
            <Typography color="error">Failed to load customers.</Typography>
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
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Customer</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Email</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Phone</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Address</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    Orders
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No customers match your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                            {customer.name
                              .split(" ")
                              .map((namePart) => namePart[0])
                              .join("")
                              .slice(0, 2)}
                          </Avatar>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "primary.main",
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            onClick={() => goToCustomerOrders(customer.id)}
                          >
                            {customer.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {customer.email}
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {customer.phone ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {formatAddress(customer.address)}
                      </TableCell>

                      <TableCell align="right">
                        {orderCountByCustomer[customer.id] ?? 0}
                      </TableCell>

                      <TableCell align="right">
                        <ActionsMenu
                          id={customer.id}
                          isOpen={expandedMenuId === customer.id}
                          onToggle={toggleMenuActions}
                          onEdit={() => openEditDrawer(customer)}
                          onDelete={() => handleDelete(customer.id)}
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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
          <CustomerDrawer
            open={drawerOpen}
            onClose={closeDrawer}
            customer={editingCustomer}
          />
        </Grid>
      )}
    </Grid>
  );
}
