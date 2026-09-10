import { apiSlice } from "./apiSlice"; // Adjust base apiSlice import path if needed

export interface CustomerAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string | CustomerAddress;
  createdAt?: string;
}

export type NewCustomer = Omit<Customer, "id" | "createdAt">;
export const formatAddress = (
  address?:
    | string
    | {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      },
): string => {
  if (!address) return "—";
  if (typeof address === "string") return address;
  const { street, city, state, zipCode, country } = address;
  return (
    [street, city, state, zipCode, country].filter(Boolean).join(", ") || "—"
  );
};
export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/customers",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Customers" as const, id })),
              { type: "Customers", id: "LIST" },
            ]
          : [{ type: "Customers", id: "LIST" }],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Customers", id }],
    }),
    addCustomer: builder.mutation<Customer, NewCustomer>({
      query: (newCustomer) => ({
        url: "/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: [{ type: "Customers", id: "LIST" }],
    }),
    updateCustomer: builder.mutation<
      Customer,
      Partial<Customer> & { id: string }
    >({
      query: ({ id, ...patch }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customers", id },
        { type: "Customers", id: "LIST" },
      ],
    }),
    deleteCustomer: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Customers", id },
        { type: "Customers", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
