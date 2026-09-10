import React, { useState } from "react";

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
  Customer,
  formatAddress,
  NewCustomer,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
} from "../../Store/api/customersApi.ts";

interface CustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function CustomerDrawerContent({
  open,
  onClose,
  customer: customerToEdit,
}: CustomerDrawerProps) {
  const [formData, setFormData] = useState(() => {
    if (!customerToEdit) {
      return initialFormState;
    }

    return {
      name: customerToEdit.name,
      email: customerToEdit.email,
      phone: customerToEdit.phone ?? "",
      address: formatAddress(customerToEdit.address),
    };
  });

  const [addCustomer, { isLoading: isAdding }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const isEditMode = Boolean(customerToEdit);
  const isLoading = isAdding || isUpdating;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isEditMode && customerToEdit) {
        await updateCustomer({
          id: customerToEdit.id,
          ...formData,
        }).unwrap();
      } else {
        await addCustomer(formData as NewCustomer).unwrap();
      }

      handleClose();
    } catch (error) {
      console.error("Failed to save customer:", error);
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
          {isEditMode ? "Edit Customer" : "Add New Customer"}
        </Typography>

        <IconButton onClick={handleClose} size="small" edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Stack spacing={2.5} sx={{ p: 3, flex: 1, overflowY: "auto" }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            size="small"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            size="small"
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
            size="small"
            helperText="Enter as a single line (street, city, state, zip, country)"
          />
        </Stack>

        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={handleClose}
              disabled={isLoading}
              sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ borderRadius: 2, textTransform: "none", py: 1 }}
            >
              {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default function CustomerDrawer(props: CustomerDrawerProps) {
  const key = props.customer?.id ?? "new";

  return <CustomerDrawerContent key={key} {...props} />;
}
