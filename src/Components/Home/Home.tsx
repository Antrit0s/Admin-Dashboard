import { useNavigate } from "react-router-dom";

import {
  AttachMoneyOutlined,
  PeopleAltOutlined,
  ShoppingCartOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import theme from "../../Theme.tsx";
import { useGetProductsQuery } from "../../Store/api/productsApi.ts";

const KPI_DATA = [
  {
    label: "Revenue",
    value: "$128,540.00",
    change: "18.7%",
    icon: AttachMoneyOutlined,
  },
  {
    label: "Orders",
    value: "1,482",
    change: "12.4%",
    icon: ShoppingCartOutlined,
  },
  {
    label: "Customers",
    value: "3,856",
    change: "9.3%",
    icon: PeopleAltOutlined,
  },
  {
    label: "Conversion Rate",
    value: "2.85%",
    change: "0.6%",
    icon: TrendingUpOutlined,
  },
];

const SALES_DATA = [
  { date: "Apr 24", revenue: 1200 },
  { date: "Apr 25", revenue: 4900 },
  { date: "Apr 26", revenue: 5100 },
  { date: "Apr 27", revenue: 4500 },
  { date: "Apr 28", revenue: 6800 },
  { date: "Apr 29", revenue: 5200 },
  { date: "Apr 30", revenue: 9500 },
  { date: "May 1", revenue: 12800 },
  { date: "May 2", revenue: 15700 },
  { date: "May 3", revenue: 12600 },
  { date: "May 4", revenue: 9800 },
  { date: "May 5", revenue: 7200 },
  { date: "May 6", revenue: 8600 },
  { date: "May 7", revenue: 10400 },
  { date: "May 8", revenue: 9200 },
  { date: "May 9", revenue: 13800 },
  { date: "May 10", revenue: 11700 },
  { date: "May 11", revenue: 8300 },
  { date: "May 12", revenue: 9600 },
  { date: "May 13", revenue: 11100 },
  { date: "May 14", revenue: 13400 },
  { date: "May 15", revenue: 10900 },
  { date: "May 16", revenue: 8700 },
  { date: "May 17", revenue: 7900 },
  { date: "May 18", revenue: 9300 },
  { date: "May 19", revenue: 12200 },
  { date: "May 20", revenue: 10600 },
  { date: "May 21", revenue: 8100 },
  { date: "May 22", revenue: 12700 },
  { date: "May 23", revenue: 9500 },
  { date: "May 24", revenue: 15900 },
];

const DESKTOP_CHART_TICKS = [
  "Apr 24",
  "Apr 29",
  "May 4",
  "May 9",
  "May 14",
  "May 19",
  "May 24",
];

const MOBILE_CHART_TICKS = ["Apr 24", "May 4", "May 14", "May 24"];

const RECENT_ORDERS = [
  {
    id: "#ORD-10582",
    date: "May 24, 2025 • 10:24 AM",
    amount: "$259.99",
    status: "Paid",
    initials: "JD",
  },
  {
    id: "#ORD-10581",
    date: "May 24, 2025 • 9:41 AM",
    amount: "$74.50",
    status: "Paid",
    initials: "AC",
  },
  {
    id: "#ORD-10580",
    date: "May 23, 2025 • 8:15 PM",
    amount: "$149.99",
    status: "Paid",
    initials: "RM",
  },
  {
    id: "#ORD-10579",
    date: "May 23, 2025 • 6:32 PM",
    amount: "$89.00",
    status: "Shipped",
    initials: "YS",
  },
  {
    id: "#ORD-10578",
    date: "May 23, 2025 • 4:05 PM",
    amount: "$199.99",
    status: "Processing",
    initials: "KL",
  },
];

const ORDER_STATUS_COLORS: Record<string, "success" | "info" | "secondary"> = {
  Paid: "success",
  Shipped: "info",
  Processing: "secondary",
};

const CARD_SX = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 3,
  bgcolor: "background.paper",
};

export default function Home() {
  const navigate = useNavigate();
  const { data: products = [] } = useGetProductsQuery();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const lowStockProducts = products
    .filter((product) => product.status === "Low Stock")
    .slice(0, 3);

  const chartTicks = isXs ? MOBILE_CHART_TICKS : DESKTOP_CHART_TICKS;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Dashboard
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Store performance overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPI_DATA.map(({ label, value, change, icon: Icon }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ ...CARD_SX, p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "text.secondary",
                      lineHeight: 1.4,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "1.5rem", md: "1.75rem" },
                      fontWeight: 700,
                      color: "text.primary",
                      my: 0.5,
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {value}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "success.main",
                        lineHeight: 1,
                      }}
                    >
                      ↗ {change}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        color: "text.secondary",
                        lineHeight: 1,
                      }}
                    >
                      vs last 30 days
                    </Typography>
                  </Box>
                </Box>

                <Avatar
                  sx={(currentTheme) => ({
                    bgcolor: alpha(currentTheme.palette.primary.main, 0.1),
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                  })}
                >
                  <Icon sx={{ color: "primary.main", fontSize: 32 }} />
                </Avatar>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card elevation={0} sx={{ ...CARD_SX, p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Sales Overview
                </Typography>

                <Select
                  size="small"
                  defaultValue="30"
                  sx={{
                    minWidth: 140,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: { xs: 220, sm: 260, md: 300 },
                }}
              >
                <ResponsiveContainer>
                  <LineChart data={SALES_DATA}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme.palette.divider}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="date"
                      stroke={theme.palette.text.secondary}
                      fontSize={isXs ? 10 : 12}
                      tickLine={false}
                      axisLine={false}
                      ticks={chartTicks}
                      interval={0}
                    />

                    <YAxis
                      stroke={theme.palette.text.secondary}
                      fontSize={isXs ? 10 : 12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}K`}
                      width={isXs ? 36 : 60}
                    />

                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                      formatter={(value) => [
                        `$${Number(value ?? 0).toLocaleString()}`,
                        "Revenue",
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: theme.palette.primary.main,
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>

            <Card elevation={0} sx={{ ...CARD_SX, p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Low Stock Products
              </Typography>

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        SKU
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                        }}
                      >
                        Category
                      </TableCell>

                      <TableCell>Stock</TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      >
                        Threshold
                      </TableCell>

                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {lowStockProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          sx={{ py: 3, color: "text.secondary" }}
                        >
                          No low-stock products right now.
                        </TableCell>
                      </TableRow>
                    ) : (
                      lowStockProducts.map((product) => (
                        <TableRow key={product.sku} hover>
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
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor: "grey.100",
                                }}
                              />

                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {product.name}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell
                            sx={{
                              display: {
                                xs: "none",
                                sm: "table-cell",
                              },
                            }}
                          >
                            {product.sku}
                          </TableCell>

                          <TableCell
                            sx={{
                              display: {
                                xs: "none",
                                md: "table-cell",
                              },
                            }}
                          >
                            {product.category}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: "error.main",
                              fontWeight: 700,
                            }}
                          >
                            {product.stock}
                          </TableCell>

                          <TableCell
                            sx={{
                              display: {
                                xs: "none",
                                sm: "table-cell",
                              },
                            }}
                          >
                            10
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={product.status}
                              size="small"
                              color="warning"
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: "none" }}
                              onClick={() =>
                                navigate(
                                  `/products?status=${encodeURIComponent(
                                    product.status,
                                  )}`,
                                )
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                  onClick={() => navigate("/products?status=Low%20Stock")}
                >
                  View all low stock products
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ ...CARD_SX, height: "100%", p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Recent Orders
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/orders")}
              >
                View all orders
              </Typography>
            </Box>

            <Box>
              {RECENT_ORDERS.map((order, index) => (
                <Box key={order.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      py: 1.2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: 13,
                        bgcolor: "action.selected",
                        color: "text.primary",
                      }}
                    >
                      {order.initials}
                    </Avatar>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.id}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {order.date}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.amount}
                      </Typography>

                      <Chip
                        label={order.status}
                        size="small"
                        color={ORDER_STATUS_COLORS[order.status]}
                        sx={{ height: 20, fontSize: 11, mt: 0.3 }}
                      />
                    </Box>
                  </Box>

                  {index < RECENT_ORDERS.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
