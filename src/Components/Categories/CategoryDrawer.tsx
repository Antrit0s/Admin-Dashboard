import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  category,
  NewCategory,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../Store/api/categoryApi.ts";

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  category?: category | null;
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function CategoryDrawerContent({
  open,
  onClose,
  category: categoryToEdit,
}: CategoryDrawerProps) {
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isEditMode = Boolean(categoryToEdit);
  const isSaving = isAdding || isUpdating;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryToEdit ?? { name: "", slug: "" },
  });

  const nameValue = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    if (!isEditMode) {
      setValue("slug", slugify(nameValue || ""));
    }
  }, [nameValue, isEditMode, setValue]);

  const handleClose = () => {
    reset({ name: "", slug: "" });
    onClose();
  };

  const handleFormSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEditMode && categoryToEdit) {
        await updateCategory({
          ...categoryToEdit,
          ...values,
        } as category).unwrap();
      } else {
        await addCategory(values as NewCategory).unwrap();
      }

      handleClose();
    } catch (error) {
      console.error("Failed to save category:", error);
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
          {isEditMode ? "Edit Category" : "Add New Category"}
        </Typography>

        <IconButton onClick={handleClose} size="small" edge="end">
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
                label="Category Name"
                required
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Slug"
                required
                fullWidth
                size="small"
                error={!!errors.slug}
                helperText={
                  errors.slug?.message ??
                  "URL-friendly identifier (e.g. 'home-appliances')"
                }
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
              onClick={handleClose}
              disabled={isSaving}
              sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSaving}
              sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
            >
              {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default function CategoryDrawer(props: CategoryDrawerProps) {
  const key = props.category?.id ?? "new";

  return <CategoryDrawerContent key={key} {...props} />;
}
