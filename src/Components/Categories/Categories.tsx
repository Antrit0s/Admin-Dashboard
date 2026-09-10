import { useMemo, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
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
import { AddOutlined } from "@mui/icons-material";

import ActionsMenu from "../ActionsMenu/ActionsMenu.tsx";
import CategoryDrawer from "./CategoryDrawer";
import ViewCatProd from "./viewCatProd.tsx";
import {
  category,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../Store/api/categoryApi.ts";

const ITEMS_PER_PAGE = 8;

export default function Categories() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  const { data = [], isLoading, isError } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase();

    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query),
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    await deleteCategory(id);
  };

  const openAddDrawer = () => {
    setEditingCategory(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (categoryToEdit: category) => {
    setEditingCategory(categoryToEdit);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
  };

  const toggleMenuActions = (id: string) => {
    setExpandedMenuId((currentId) => (currentId === id ? null : id));
  };

  if (selectedCategoryId) {
    return (
      <ViewCatProd
        categoryId={selectedCategoryId}
        onBack={() => setSelectedCategoryId(null)}
      />
    );
  }

  return (
    <Grid
      container
      spacing={2}
      sx={{ alignItems: "stretch", width: "100%", m: 0 }}
    >
      <Grid size={{ xs: drawerOpen ? 7.5 : 12, xl: drawerOpen ? 8.5 : 12 }}>
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
              Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage product categorization taxonomy
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openAddDrawer}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}
          >
            Add Category
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "divider" }}
        >
          <TextField
            placeholder="Search categories by name or slug"
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
            <Typography color="error">Failed to load categories.</Typography>
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
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Name</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Slug</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No categories found matching criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCategories.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => setSelectedCategoryId(item.id)}
                          sx={{
                            fontWeight: 600,
                            textDecoration: "none",
                            color: "primary.main",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {item.name}
                        </Link>
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {item.slug}
                      </TableCell>

                      <TableCell align="right">
                        <ActionsMenu
                          id={item.id}
                          isOpen={expandedMenuId === item.id}
                          onToggle={toggleMenuActions}
                          onEdit={() => openEditDrawer(item)}
                          onDelete={() => handleDelete(item.id)}
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
          <CategoryDrawer
            open={drawerOpen}
            onClose={closeDrawer}
            category={editingCategory}
          />
        </Grid>
      )}
    </Grid>
  );
}
