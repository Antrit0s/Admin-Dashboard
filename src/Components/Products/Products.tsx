import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AddOutlined as AddIcon } from "@mui/icons-material";

import {
  Product,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../Store/api/productsApi";
import ActionsMenu from "../ActionsMenu/ActionsMenu";
import ProductDrawer from "./ProductDrawer";

const ITEMS_PER_PAGE = 8;

const STATUS_CHIP_COLORS: Record<
  Product["status"],
  "success" | "warning" | "error"
> = {
  Active: "success",
  "Low Stock": "warning",
  "Out of Stock": "error",
};

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    setStatus(searchParams.get("status") ?? "all");
  }, [searchParams]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm);

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesStatus = status === "all" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const nextStatus = event.target.value;

    setStatus(nextStatus);
    setPage(1);

    const updatedParams = new URLSearchParams(searchParams);

    if (nextStatus === "all") {
      updatedParams.delete("status");
    } else {
      updatedParams.set("status", nextStatus);
    }

    setSearchParams(updatedParams);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    await deleteProduct(id);
  };

  const handleOpenAddDrawer = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (productToEdit: Product) => {
    setEditingProduct(productToEdit);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleToggleMenu = (id: string) => {
    setActiveMenuId((currentId) => (currentId === id ? null : id));
  };

  const handleRowClick = (id: string) => {
    navigate(`/products/${id}`);
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
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Products
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage your store inventory
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDrawer}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}
          >
            Add Product
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
            placeholder="Search by name or SKU"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ flex: 2, minWidth: 140 }}
          />

          <Select
            size="small"
            value={category}
            onChange={handleCategoryChange}
            sx={{ flex: 1, minWidth: 120 }}
          >
            <MenuItem value="all">All Categories</MenuItem>

            {categories.map((categoryName) => (
              <MenuItem key={categoryName} value={categoryName}>
                {categoryName}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            value={status}
            onChange={handleStatusChange}
            sx={{ flex: 1, minWidth: 120 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </Select>
        </Paper>

        {isLoading ? (
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
            <Typography color="error">Failed to load products.</Typography>
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
            <Table sx={{ minWidth: 550 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Product</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>SKU</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Category</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Stock</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No products match your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      hover
                      onClick={() => handleRowClick(product.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            src={product.imageUrl}
                            variant="rounded"
                            sx={{ width: 36, height: 36 }}
                          />

                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 150,
                            }}
                          >
                            {product.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                        }}
                      >
                        {product.sku}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                        }}
                      >
                        {product.category}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: "nowrap",
                          fontSize: "0.875rem",
                        }}
                      >
                        {product.stock}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Chip
                          label={product.status}
                          size="small"
                          color={STATUS_CHIP_COLORS[product.status]}
                        />
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={(event: MouseEvent) => event.stopPropagation()}
                      >
                        <ActionsMenu
                          id={product.id}
                          isOpen={activeMenuId === product.id}
                          onToggle={handleToggleMenu}
                          onEdit={() => handleOpenEditDrawer(product)}
                          onDelete={() => handleDelete(product.id)}
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
          <ProductDrawer
            open={drawerOpen}
            onClose={handleCloseDrawer}
            product={editingProduct}
          />
        </Grid>
      )}
    </Grid>
  );
}
