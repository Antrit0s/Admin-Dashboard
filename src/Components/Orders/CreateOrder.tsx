import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DeleteOutlineOutlined,
} from "@mui/icons-material";

import {
  NewOrder,
  OrderItem,
  useAddOrderMutation,
} from "../../Store/api/ordersApi";
import { Product, useGetProductsQuery } from "../../Store/api/productsApi";
import {
  Customer,
  formatAddress,
  useGetCustomersQuery,
} from "../../Store/api/customersApi.ts";

const DEFAULT_TAX_RATE = 0.08;
const DEFAULT_SHIPPING = 10.0;

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const orderSchema = z.object({
  selectedCustomerId: z.string().min(1, "Please select a customer"),
  shippingAddress: z.string().trim().min(1, "Shipping address is required"),
  items: z.array(orderItemSchema).min(1, "Add at least one item to the order"),
  paymentStatus: z.enum(["Pending", "Paid"]),
  fulfillmentStatus: z.enum([
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function CreateOrder() {
  const navigate = useNavigate();

  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  const [createOrder, { isLoading: isCreating }] = useAddOrderMutation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      selectedCustomerId: "",
      shippingAddress: "",
      items: [],
      paymentStatus: "Pending",
      fulfillmentStatus: "Processing",
    },
  });

  const {
    fields: items,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "items",
  });

  const selectedCustomerId = useWatch({
    control,
    name: "selectedCustomerId",
  });
  const currentItems = useWatch({
    control,
    name: "items",
  });

  const selectedCustomer = customers.find(
    (customer: Customer) => String(customer.id) === String(selectedCustomerId),
  );

  useEffect(() => {
    if (selectedCustomer) {
      setValue("shippingAddress", formatAddress(selectedCustomer.address));
    }
  }, [selectedCustomer, setValue]);

  const handleAddProduct = (productId: string) => {
    if (!productId) {
      return;
    }

    const selectedProduct = products.find(
      (product) => String(product.id) === String(productId),
    );

    if (!selectedProduct) {
      return;
    }

    const existingIndex = items.findIndex(
      (item) => String(item.productId) === String(selectedProduct.id),
    );

    if (existingIndex > -1) {
      update(existingIndex, {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + 1,
      });
      return;
    }

    append({
      productId: String(selectedProduct.id),
      name: selectedProduct.name,
      price: Number(selectedProduct.price || 0),
      quantity: 1,
    });
  };

  const subtotal = currentItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const tax = subtotal * DEFAULT_TAX_RATE;
  const shipping = currentItems.length > 0 ? DEFAULT_SHIPPING : 0;
  const totalAmount = subtotal + tax + shipping;

  const onSubmit = async (values: OrderFormValues) => {
    if (!selectedCustomer) {
      return;
    }

    const payload: NewOrder = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      shippingAddress: values.shippingAddress,
      items: values.items as OrderItem[],
      subtotal,
      tax,
      shipping,
      totalAmount,
      paymentStatus: values.paymentStatus,
      fulfillmentStatus: values.fulfillmentStatus,
    };

    try {
      await createOrder(payload).unwrap();
      navigate("/orders");
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  if (isLoadingProducts || isLoadingCustomers) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 3,
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => navigate("/orders")}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Create New Order
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Customer Details
        </Typography>

        <Grid container spacing={2}>
          <Grid sx={{ width: "100%" }}>
            <Controller
              name="selectedCustomerId"
              control={control}
              render={({ field }) => (
                <FormControl
                  size="small"
                  required
                  sx={{ width: "100%" }}
                  error={!!errors.selectedCustomerId}
                >
                  <InputLabel id="select-customer-label">
                    Select Customer
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="select-customer-label"
                    label="Select Customer"
                  >
                    {customers.map((customer: Customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email}) — ID: {customer.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {errors.selectedCustomerId && (
              <Typography variant="caption" color="error">
                {errors.selectedCustomerId.message}
              </Typography>
            )}
          </Grid>

          {selectedCustomer && (
            <>
              <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
                <TextField
                  label="Customer Email"
                  size="small"
                  value={selectedCustomer.email}
                  slotProps={{ input: { readOnly: true } }}
                  sx={{ width: "100%", bgcolor: "action.hover" }}
                />
              </Grid>

              <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
                <TextField
                  label="Customer Phone"
                  size="small"
                  value={selectedCustomer.phone || "N/A"}
                  slotProps={{ input: { readOnly: true } }}
                  sx={{ width: "100%", bgcolor: "action.hover" }}
                />
              </Grid>
            </>
          )}

          <Grid sx={{ width: "100%" }}>
            <Controller
              name="shippingAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Shipping Address"
                  size="small"
                  required
                  multiline
                  rows={2}
                  disabled={!selectedCustomer}
                  error={!!errors.shippingAddress}
                  helperText={errors.shippingAddress?.message}
                  sx={{ width: "100%" }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Initial Order Status
        </Typography>

        <Grid container spacing={2}>
          <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
            <Controller
              name="paymentStatus"
              control={control}
              render={({ field }) => (
                <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel id="payment-status-label">
                    Payment Status
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="payment-status-label"
                    label="Payment Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
            <Controller
              name="fulfillmentStatus"
              control={control}
              render={({ field }) => (
                <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel id="fulfillment-status-label">
                    Fulfillment Status
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="fulfillment-status-label"
                    label="Fulfillment Status"
                  >
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Order Items
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <FormControl size="small" sx={{ width: "100%", maxWidth: 400 }}>
            <InputLabel id="select-product-label">
              Select Product to Add
            </InputLabel>

            <Select
              labelId="select-product-label"
              label="Select Product to Add"
              value=""
              onChange={(event) => handleAddProduct(event.target.value)}
            >
              {products.map((product: Product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} — ${Number(product.price).toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {errors.items && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: "block", mb: 2 }}
          >
            {errors.items.message}
          </Typography>
        )}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell sx={{ width: 120, textAlign: "center" }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ width: 140, textAlign: "right" }}>
                  Unit Price ($)
                </TableCell>
                <TableCell sx={{ width: 140, textAlign: "right" }}>
                  Total ($)
                </TableCell>
                <TableCell sx={{ width: 60, textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No items added to this order yet. Select a product above
                      to add items.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => {
                  const lineTotal =
                    Number(item.price || 0) * Number(item.quantity || 0);

                  return (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.name}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              onChange={(event) =>
                                field.onChange(
                                  parseInt(event.target.value, 10) || 1,
                                )
                              }
                              slotProps={{ htmlInput: { min: 1 } }}
                              sx={{ width: 80 }}
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell sx={{ textAlign: "right" }}>
                        ${Number(item.price || 0).toFixed(2)}
                      </TableCell>

                      <TableCell
                        sx={{
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        ${lineTotal.toFixed(2)}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => remove(index)}
                        >
                          <DeleteOutlineOutlined fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, ml: "auto", maxWidth: 300, width: "100%" }}>
          <Stack spacing={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">
                Tax ({(DEFAULT_TAX_RATE * 100).toFixed(0)}%):
              </Typography>
              <Typography variant="body2">${tax.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">${shipping.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ${totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={() => navigate("/orders")}>
          Cancel
        </Button>

        <Button type="submit" variant="contained" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Order"}
        </Button>
      </Stack>
    </Box>
  );
}
