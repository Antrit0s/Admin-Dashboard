import { useMemo, useState } from "react";
import {
  product,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../Store/api/productsApi.ts";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
  AddOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
} from "@mui/icons-material";
import ProductDrawer from "./ProductDrawer.tsx";

const items_per_page = 8;
export default function Products() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<product | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data = [], isLoading, isError } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  // Extract categories for the filter dropdown.
  const categories = useMemo(
    () => Array.from(new Set(data.map((product) => product.category))),
    [data],
  );
  // filtering products
  const filteredProducts = useMemo(
    () =>
      data.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || p.category === selectedCategory;
        const matchesStatus =
          selectedStatus === "all" || p.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [data, search, selectedCategory, selectedStatus],
  );

  // client side pagination
  const totalPages = Math.ceil(filteredProducts.length / items_per_page);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * items_per_page;
    return filteredProducts.slice(start, start + items_per_page);
  }, [filteredProducts, page]);

  // delete function
  const hanleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product ?")) {
      await deleteProduct(id);
    }
  };
  const openAddDrawer = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };
  const openEditDrawer = (product: product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  return (
    <Box>
      {/* header      */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
          startIcon={<AddOutlined />}
          onClick={openAddDrawer}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>
      {/* filter bar  */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search by name or SKU"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        <Select
          size="small"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Low Stock">Low stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
        </Select>
      </Paper>
      {/* table for showing porducts */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <Table>
          {/* table header  */}
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {/* table body  */}
          <TableBody>
            {/* is Loading  */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}
            {/* is Error  */}
            {isError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 4, color: "error.main" }}
                >
                  Failed to load Products.
                </TableCell>
              </TableRow>
            )}
            {/* no products found >>filtered products ==0  */}
            {!isLoading && !isError && filteredProducts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No products found matching your search
                </TableCell>
              </TableRow>
            )}

            {paginatedProducts.map((data) => (
              <TableRow key={data.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      variant="rounded"
                      src={data.imageUrl}
                      alt={data.name}
                      sx={{ width: 44, height: 44, bgcolor: "grey.100" }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {data.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{data.sku}</TableCell>
                <TableCell>{data.category}</TableCell>
                <TableCell> ${Number(data.price).toFixed(2)} </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color:
                      data.stock <= 5
                        ? "error.main"
                        : data.stock <= 15
                          ? "warning.main"
                          : "success.main",
                  }}
                >
                  {data.stock}
                </TableCell>
                <TableCell>
                  <Chip
                    label={data.status}
                    size="small"
                    color={
                      data.status === "Active"
                        ? "success"
                        : data.status === "Low Stock"
                          ? "warning"
                          : "error"
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => openEditDrawer(data)}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => hanleDelete(data.id)}
                  >
                    <DeleteOutlineOutlined fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* pagination to show other products where we set no. of prod to be shown is 8 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{" "}
          {filteredProducts.length === 0 ? 0 : (page - 1) * items_per_page + 1}{" "}
          to {Math.min(page * items_per_page, filteredProducts.length)} of{" "}
          {filteredProducts.length} results
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, val) => setPage(val)}
          size="small"
          color="primary"
        />
      </Box>
      <ProductDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        product={editingProduct}
      />
    </Box>
  );
}
