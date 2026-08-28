import { apiSlice } from "./apiSlice.ts";

export interface product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
  imageUrl?: string;
  description?: string;
}

export type NewProduct = Omit<product, "id">;

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<product[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    addProduct: builder.mutation<product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      //   refetching prod after success add
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<product, product>({
      query: (product) => ({
        url: `/products/${product.id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
