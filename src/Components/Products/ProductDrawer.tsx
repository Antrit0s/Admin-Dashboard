import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

// API & Types
import {
  product,
  useAddProductMutation,
  useUpdateProductMutation,
} from "../../Store/api/productsApi.ts";

//  Validation Schema & Types

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  status: z.enum(["Active", "Low Stock", "Out of Stock"]),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const INITIAL_FORM_STATE: ProductFormValues = {
  name: "",
  sku: "",
  category: "",
  price: 0,
  stock: 0,
  status: "Active",
  description: "",
  imageUrl: "",
};

/**
 * in add or edit function stock badge active || Low Stock || out of stock it picks auto based on the number
 *  stock = 0 ? out of stock : stock <10 : low stock : Active 
 */
const calculateProductStatus = (stockCount: number) => {
  if (Number.isNaN(stockCount)) return "Active"; // Safe fallback
  if (stockCount === 0) return "Out of Stock";
  if (stockCount <= 10) return "Low Stock";
  return "Active";
};

//  Main Component

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  product?: product | null; // If passed, we are editing. If undefined/null, we are creating.
}

export default function ProductDrawer({
  open,
  onClose,
  product,
}: ProductDrawerProps) {
  const isEditMode = Boolean(product);

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: INITIAL_FORM_STATE,
  });

  // API Mutations
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSubmitting = isAdding || isUpdating;

  // --- Effects ---

  //  Sync form data when the drawer opens or the target product changes
  useEffect(() => {
    if (open) {
      const formData = product
        ? { ...INITIAL_FORM_STATE, ...product }
        : INITIAL_FORM_STATE;

      reset(formData);
    }
  }, [open, product, reset]);

  //  Watch the stock input and auto-update the status field
  const currentStock = useWatch({ control, name: "stock" });

  useEffect(() => {
    const newStatus = calculateProductStatus(Number(currentStock));
    // We use shouldValidate: true so the form knows this field is good to go
    setValue("status", newStatus, { shouldValidate: true });
  }, [currentStock, setValue]);

  // --- Handlers ---

  const handleClose = () => {
    reset(INITIAL_FORM_STATE);
    onClose();
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEditMode && product) {
        await updateProduct({ ...product, ...values }).unwrap();
      } else {
        await addProduct(values).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          width: 360,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label="Close drawer"
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        </Box>

        {/* Basic Info */}
        <TextField
          label="Product Name"
          fullWidth
          size="small"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="SKU (Stock Keeping Unit)"
          fullWidth
          size="small"
          {...register("sku")}
          error={!!errors.sku}
          helperText={errors.sku?.message}
        />

        {/* Category Dropdown */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              displayEmpty
              size="small"
              fullWidth
              error={!!errors.category}
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
              <MenuItem value="Wearables">Wearables</MenuItem>
              <MenuItem value="Home Appliances">Home Appliances</MenuItem>
            </Select>
          )}
        />
        {errors.category && (
          <Typography variant="caption" color="error.main" sx={{ mt: -1.5 }}>
            {errors.category.message}
          </Typography>
        )}

        {/* Inventory & Pricing */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Price"
            type="number"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { step: "0.01" } }}
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            label="Stock Count"
            type="number"
            size="small"
            fullWidth
            {...register("stock")}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />
        </Box>

        {/* Status (Auto-calculated, disabled for manual entry) */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} size="small" fullWidth disabled>
              <MenuItem value="Active">Active (In Stock)</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          )}
        />

        {/* Image and Description */}
        <TextField
          label="Image URL"
          placeholder="https://example.com/image.jpg"
          fullWidth
          size="small"
          {...register("imageUrl")}
          error={!!errors.imageUrl}
          helperText={errors.imageUrl?.message}
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          size="small"
          {...register("description")}
        />

        {/* cancel -- save | add */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            sx={{ textTransform: "none" }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ textTransform: "none" }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
