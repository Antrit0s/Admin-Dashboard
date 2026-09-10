import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Chip,
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
import { ArrowBack, Image as ImageIcon } from "@mui/icons-material";

import ActionsMenu from "../ActionsMenu/ActionsMenu.tsx";
import ProductDrawer from "../Products/ProductDrawer.tsx";
import {
  Product,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../Store/api/productsApi.ts";
import { useGetCategoriesQuery } from "../../Store/api/categoryApi.ts";

interface ViewCatProdProps {
  categoryId: string;
  onBack: () => void;
}

const ITEMS_PER_PAGE = 8;

const getStatusChipColor = (status: Product["status"]) => {
  switch (status) {
    case "Active":
      return "success";
    case "Low Stock":
      return "warning";
    case "Out of Stock":
      return "error";
    default:
      return "default";
  }
};

export default function ViewCatProd({ categoryId, onBack }: ViewCatProdProps) {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (item) => item.id === categoryId || item.slug === categoryId,
      ),
    [categories, categoryId],
  );

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    const normalizedSearch = search.toLowerCase();
    const categoryName = selectedCategory.name.toLowerCase();

    return products.filter((product) => {
      const belongsToCategory = product.category.toLowerCase() === categoryName;

      const matchesSearch =
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);

      return belongsToCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    await deleteProduct(id);
  };

  const openEditDrawer = (productToEdit: Product) => {
    setEditingProduct(productToEdit);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const toggleMenuActions = (id: string) => {
    setExpandedMenuId((currentId) => (currentId === id ? null : id));
  };

  const goToProductDetails = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ alignItems: "stretch", width: "100%", m: 0 }}
    >
      <Grid size={{ xs: drawerOpen ? 7.5 : 12, xl: drawerOpen ? 8.5 : 12 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onBack}
            startIcon={<ArrowBack />}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Back
          </Button>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {selectedCategory
                ? `${selectedCategory.name} Products`
                : "Category Products"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Viewing products registered under this category taxonomy
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "divider" }}
        >
          <TextField
            placeholder="Search category products by name or SKU"
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
            <Typography color="error">
              Failed to load category products.
            </Typography>
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
                  <TableCell sx={{ whiteSpace: "nowrap", width: 60 }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Product</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>SKU</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    Price
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    Stock
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                    Status
                  </TableCell>
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
                        No products found in this category matching criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell
                        onClick={() => goToProductDetails(product.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Avatar
                          src={product.imageUrl}
                          alt={product.name}
                          variant="rounded"
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "action.hover",
                          }}
                        >
                          <ImageIcon color="action" />
                        </Avatar>
                      </TableCell>

                      <TableCell
                        onClick={() => goToProductDetails(product.id)}
                        sx={{ fontWeight: 600, cursor: "pointer" }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {product.name}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {product.sku}
                      </TableCell>

                      <TableCell align="right">
                        ${product.price.toFixed(2)}
                      </TableCell>

                      <TableCell align="right">{product.stock}</TableCell>

                      <TableCell align="center">
                        <Chip
                          label={product.status}
                          size="small"
                          color={getStatusChipColor(product.status)}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <ActionsMenu
                          id={product.id}
                          isOpen={expandedMenuId === product.id}
                          onToggle={toggleMenuActions}
                          onEdit={() => openEditDrawer(product)}
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
          <ProductDrawer
            open={drawerOpen}
            onClose={closeDrawer}
            product={editingProduct}
          />
        </Grid>
      )}
    </Grid>
  );
}
