import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  NewProduct,
  Product,
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../Store/api/productsApi";
import { useGetCategoriesQuery } from "../../Store/api/categoryApi";

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

const STATUS_OPTIONS = ["Active", "Low Stock", "Out of Stock"] as const;

const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock must be 0 or more"),
  status: z.enum(STATUS_OPTIONS),
  imageUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  description: z.string().trim().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

function getStatusForStock(stock: number): Product["status"] {
  if (stock <= 0) {
    return "Out of Stock";
  }

  if (stock <= 10) {
    return "Low Stock";
  }

  return "Active";
}

function DrawerContent({ open, onClose, product }: ProductDrawerProps) {
  const { data: categories = [] } = useGetCategoriesQuery();

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isEditing = Boolean(product);
  const isSaving = isAdding || isUpdating;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? {
      name: "",
      sku: "",
      category: categories[0]?.name ?? "",
      price: 0,
      stock: 0,
      status: "Out of Stock",
      imageUrl: "",
      description: "",
    },
  });

  const stockValue = watch("stock");

  useEffect(() => {
    setValue("status", getStatusForStock(Number(stockValue) || 0));
  }, [stockValue, setValue]);

  useEffect(() => {
    if (!product && categories.length > 0) {
      const currentCategory = watch("category");

      setValue("category", currentCategory || categories[0].name);
    }
  }, [categories, product, setValue, watch]);

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      if (product) {
        await updateProduct({
          ...product,
          ...values,
        } as Product).unwrap();
      } else {
        await addProduct(values as NewProduct).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Failed to persist product:", error);
    }
  };

  if (!open) {
    return null;
  }

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
          {isEditing ? "Edit Product" : "Add New Product"}
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          edge="end"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Stack spacing={2.5} sx={{ p: 3, flex: 1, overflowY: "auto" }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product Name"
                required
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Stack direction="row" spacing={2}>
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SKU"
                  required
                  fullWidth
                  size="small"
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Category"
                  required
                  fullWidth
                  size="small"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price ($)"
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: "0.01",
                    },
                  }}
                  required
                  fullWidth
                  size="small"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />

            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock"
                  type="number"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: "1",
                    },
                  }}
                  required
                  fullWidth
                  size="small"
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Stack>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Status"
                disabled
                required
                fullWidth
                size="small"
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image URL"
                fullWidth
                size="small"
                error={!!errors.imageUrl}
                helperText={errors.imageUrl?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={3}
                fullWidth
                size="small"
              />
            )}
          />
        </Stack>

        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={onClose}
              disabled={isSaving}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1,
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSaving}
              startIcon={
                isSaving ? <CircularProgress size={18} color="inherit" /> : null
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1,
              }}
            >
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default function ProductDrawer(props: ProductDrawerProps) {
  const drawerKey = props.product?.id ?? "new-product";

  return <DrawerContent key={drawerKey} {...props} />;
}
