import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useGetProductsQuery } from "../../Store/api/productsApi.ts";
import ProductDrawer from "./ProductDrawer.tsx";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const product = products.find((item) => String(item.id) === String(id));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>
          Product #{id} not found.
        </Typography>

        <Button variant="outlined" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </Paper>
    );
  }

  const statusColor =
    product.status === "Active"
      ? "success"
      : product.status === "Low Stock"
        ? "warning"
        : "error";

  const closeDrawer = () => {
    setDrawerOpen(false);
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
        <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 3,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <IconButton onClick={() => navigate("/products")} edge="start">
                <ArrowBackIcon />
              </IconButton>

              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Product Details
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Edit
            </Button>
          </Stack>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Avatar
                src={product.imageUrl}
                variant="rounded"
                sx={{ width: 72, height: 72 }}
              >
                {product.name?.[0]}
              </Avatar>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  ${Number(product.price).toFixed(2)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Stock
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {product.stock}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {product.category}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>

              <Chip label={product.status} size="small" color={statusColor} />
            </Box>

            {product.description && (
              <>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Description
                  </Typography>

                  <Typography variant="body2">{product.description}</Typography>
                </Box>
              </>
            )}

            {product.createdAt && (
              <>
                <Divider sx={{ mb: 3 }} />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Added On
                  </Typography>

                  <Typography variant="body2">
                    {new Date(product.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Grid>

      {drawerOpen && (
        <Grid size={{ xs: 4.5, xl: 3.5 }}>
          <ProductDrawer
            open={drawerOpen}
            onClose={closeDrawer}
            product={product}
          />
        </Grid>
      )}
    </Grid>
  );
}
