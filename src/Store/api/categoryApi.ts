import { apiSlice } from "./apiSlice.ts";
export interface category {
  id: string;
  name: string;
  slug: string;
}
export type NewCategory = Omit<category, "id">;
export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<category[], void>({
      query: () => "/categories",
      providesTags: (categories) =>
        categories
          ? [
              ...categories.map(({ id }) => ({
                type: "Categories" as const,
                id,
              })),
              { type: "Categories", id: "LIST" },
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),
    addCategory: builder.mutation<category, NewCategory>({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),
    updateCategory: builder.mutation<category, category>({
      query: (categoryToUpdate) => ({
        url: `/categories/${categoryToUpdate.id}`,
        method: "PUT",
        body: categoryToUpdate,
      }),
      invalidatesTags: (_result, _error, categoryToUpdate) => [
        { type: "Categories", id: categoryToUpdate.id },
        { type: "Categories", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Categories", id },
        { type: "Categories", id: "LIST" },
      ],
    }),
  }),
});
export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
