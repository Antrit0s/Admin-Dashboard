import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  OrderItem,
  PaymentStatus,
  useGetOrdersQuery,
  useUpdateOrderItemsMutation,
} from "../../Store/api/ordersApi";
import { Product, useGetProductsQuery } from "../../Store/api/productsApi";
import { formatAddress } from "../../Store/api/customersApi.ts";

const PAYMENT_STATUSES: PaymentStatus[] = [
  "Pending",
  "Paid",
  "Refunded",
  "Failed",
];

const FULFILLMENT_STATUSES = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const editOrderSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerEmail: z.string().trim().email("Must be a valid email"),
  shippingAddress: z.string().trim().min(1, "Shipping address is required"),
  paymentStatus: z.enum(["Pending", "Paid", "Refunded", "Failed"]),
  fulfillmentStatus: z.enum([
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});

type EditOrderFormValues = z.infer<typeof editOrderSchema>;

export default function EditOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: orders = [], isLoading: isLoadingOrders } = useGetOrdersQuery();
  const { data: products = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const [updateOrderItems, { isLoading: isUpdating }] =
    useUpdateOrderItemsMutation();

  const currentOrder = orders.find((order) => String(order.id) === String(id));

  // The tax rate is derived from the existing order rather than edited directly.
  const [taxRate, setTaxRate] = useState(0.08);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditOrderFormValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      shippingAddress: "",
      paymentStatus: "Pending",
      fulfillmentStatus: "Processing",
      items: [],
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

  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    if (!currentOrder) {
      return;
    }

    const paymentStatus = PAYMENT_STATUSES.includes(
      currentOrder.paymentStatus as PaymentStatus,
    )
      ? (currentOrder.paymentStatus as EditOrderFormValues["paymentStatus"])
      : "Pending";

    const fulfillmentStatus = FULFILLMENT_STATUSES.includes(
      currentOrder.fulfillmentStatus as (typeof FULFILLMENT_STATUSES)[number],
    )
      ? (currentOrder.fulfillmentStatus as EditOrderFormValues["fulfillmentStatus"])
      : "Processing";

    reset({
      customerName: currentOrder.customerName || "",
      customerEmail: currentOrder.customerEmail || "",
      shippingAddress: formatAddress(currentOrder.shippingAddress),
      paymentStatus,
      fulfillmentStatus,
      items: currentOrder.items || [],
    });

    if (currentOrder.subtotal && currentOrder.tax) {
      setTaxRate(currentOrder.tax / currentOrder.subtotal || 0.08);
    }
  }, [currentOrder, reset]);

  const currentItems = useWatch({
    control,
    name: "items",
  });

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
    } else {
      append({
        productId: String(selectedProduct.id),
        name: selectedProduct.name,
        price: Number(selectedProduct.price || 0),
        quantity: 1,
      });
    }

    setSelectedProductId("");
  };

  if (isLoadingOrders || isLoadingProducts) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentOrder) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>
          Order #{id} not found.
        </Typography>

        <Button variant="outlined" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </Paper>
    );
  }

  const subtotal = currentItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const tax = subtotal * taxRate;
  const shipping = Number(currentOrder.shipping ?? 0);
  const totalAmount = subtotal + tax + shipping;

  const onSubmit = async (values: EditOrderFormValues) => {
    try {
      await updateOrderItems({
        id: currentOrder.id,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        shippingAddress: values.shippingAddress,
        paymentStatus: values.paymentStatus,
        fulfillmentStatus: values.fulfillmentStatus,
        items: values.items as OrderItem[],
        subtotal,
        tax,
        shipping,
        totalAmount,
      }).unwrap();

      navigate("/orders");
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 900, mx: "auto", p: 3 }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
        <IconButton onClick={() => navigate("/orders")} edge="start">
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Edit Order #{currentOrder.id}
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Customer Information
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customerName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Customer Name"
                  size="small"
                  fullWidth
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customerEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Customer Email"
                  type="email"
                  size="small"
                  fullWidth
                  error={!!errors.customerEmail}
                  helperText={errors.customerEmail?.message}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="shippingAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Shipping Address"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.shippingAddress}
                  helperText={errors.shippingAddress?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Order Status
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="paymentStatus"
              control={control}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel id="payment-status-label">
                    Payment Status
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="payment-status-label"
                    label="Payment Status"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="fulfillmentStatus"
              control={control}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel id="fulfillment-status-label">
                    Fulfillment Status
                  </InputLabel>

                  <Select
                    {...field}
                    labelId="fulfillment-status-label"
                    label="Fulfillment Status"
                  >
                    {FULFILLMENT_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
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
          <FormControl size="small" fullWidth sx={{ maxWidth: 400 }}>
            <InputLabel id="add-product-label">
              Select Product to Add
            </InputLabel>

            <Select
              labelId="add-product-label"
              label="Select Product to Add"
              value={selectedProductId}
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
                <TableCell align="center" sx={{ width: 120 }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ width: 140 }}>
                  Unit Price ($)
                </TableCell>
                <TableCell align="right" sx={{ width: 140 }}>
                  Total ($)
                </TableCell>
                <TableCell align="center" sx={{ width: 60 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No items in this order. Add products using the dropdown
                      above.
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

                      <TableCell align="center">
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

                      <TableCell align="right">
                        ${Number(item.price || 0).toFixed(2)}
                      </TableCell>

                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        ${lineTotal.toFixed(2)}
                      </TableCell>

                      <TableCell align="center">
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

        <Box sx={{ mt: 3, ml: "auto", maxWidth: 300 }}>
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
              <Typography variant="body2">Tax:</Typography>
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

        <Button type="submit" variant="contained" disabled={isUpdating}>
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
