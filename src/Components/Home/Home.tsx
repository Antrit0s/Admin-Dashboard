import {
  AttachMoneyOutlined,
  Inventory2Outlined,
  PeopleAltOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import theme from "../../Theme.tsx";

// fake data to fill website
const KPIS = [
  {
    label: "Total Revenue",
    value: "$128,450",
    icon: AttachMoneyOutlined,
    color: "primary.main",
  },
  {
    label: "Total Products",
    value: "4",
    icon: Inventory2Outlined,
    color: "secondary.main",
  },
  {
    label: "Low stock Alerts",
    value: "3",
    icon: WarningAmberOutlined,
    color: "warning.main",
  },
  {
    label: "Active Customers",
    value: "1,240",
    icon: PeopleAltOutlined,
    color: "info.main",
  },
];

const revenue_data = [
  { month: "Jan", revenue: 8200 },
  { month: "Feb", revenue: 9700 },
  { month: "Mar", revenue: 15500 },
  { month: "Apr", revenue: 17800 },
  { month: "May", revenue: 18200 },
  { month: "Jun", revenue: 22000 },
  { month: "Jul", revenue: 26300 },
  { month: "Aug", revenue: 29500 },
  { month: "Sep", revenue: 19000 },
  { month: "Oct", revenue: 30000 },
  { month: "Nov", revenue: 40000 },
  { month: "Dec", revenue: 100000 },
];
const recent_orders = [
  {
    id: "#ORD-1038",
    customer: "Oliver scott",
    amount: "$54.30",
    status: "pending",
  },
  {
    id: "#ORD-1039",
    customer: "scott lang",
    amount: "$554.30",
    status: "shipped",
  },
  {
    id: "#ORD-1040",
    customer: "Lex Luthor",
    amount: "$350",
    status: "delivered",
  },
  {
    id: "#ORD-1041",
    customer: "clark kent",
    amount: "$155.30",
    status: "pending",
  },
  {
    id: "#ORD-1042",
    customer: "Louis Lane",
    amount: "$99.99",
    status: "shipped",
  },
];
const status_color: Record<string, "success" | "warning" | "info"> = {
  delivered: "success",
  pending: "warning",
  shipped: "info",
};

export default function Home() {
  return (
    // page heading
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Welcome back - here's what's happening with the store today
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {KPIS.map(({ label, value, icon: Icon, color }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar sx={{ bgcolor: color, width: 44, height: 44 }}>
                  <Icon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* charts ,recent orders ,etc */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "background.paper",
              minHeight: 300,
              p: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Revenue overview
            </Typography>
            <Box sx={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={revenue_data}>
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="0"
                    >
                      <stop
                        offset="5%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v / 1000}k`}
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
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    fill="url(#revenueFill"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* recent order chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              bgcolor: "background.paper",
              height: "100%",
              p: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontWeight: 700, mb: 1.5 }}
            >
              Recent orders
            </Typography>
            <Box>
              {recent_orders.map((order, index) => (
                <Box key={order.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.customer}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.id}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.amount}
                      </Typography>
                      <Chip
                        label={order.status}
                        size="small"
                        color={status_color[order.status]}
                        sx={{ height: 20, fontSize: 11, mt: 0.3 }}
                      />
                    </Box>
                  </Box>
                  {index < recent_orders.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
