import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    prepareHeaders: (headers) => {
      // retrieve token if exist
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Users",
    "Products",
    "Categories",
    "Orders",
    "Customers",
    "Analytics",
  ],
  endpoints: () => ({}),
});
