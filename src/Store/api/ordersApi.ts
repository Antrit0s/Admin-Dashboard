import { apiSlice } from "./apiSlice";
export type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Failed"
  | "Refunded"
  | "Cancelled";
export type FulfillmentStatus =
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
}
export type NewOrder = Omit<Order, "id" | "createdAt">;
export interface UpdateOrderPayload extends Partial<Omit<Order, "id">> {
  id: string;
}
export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/orders?_sort=-createdAt",
      providesTags: (orders) =>
        Array.isArray(orders)
          ? [
              ...orders.map(({ id }) => ({ type: "Orders" as const, id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    addOrder: builder.mutation<Order, NewOrder>({
      query: (newOrder) => ({
        url: "/orders",
        method: "POST",
        body: { ...newOrder, createdAt: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
    updateFulfillmentStatus: builder.mutation<
      Order,
      { id: string; fulfillmentStatus: FulfillmentStatus }
    >({
      query: ({ id, fulfillmentStatus }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { fulfillmentStatus },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
    updatePaymentStatus: builder.mutation<
      Order,
      { id: string; paymentStatus: PaymentStatus }
    >({
      query: ({ id, paymentStatus }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
    updateOrderItems: builder.mutation<Order, UpdateOrderPayload>({
      query: ({ id, ...updates }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});
export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateFulfillmentStatusMutation,
  useUpdatePaymentStatusMutation,
  useUpdateOrderItemsMutation,
} = ordersApi;
