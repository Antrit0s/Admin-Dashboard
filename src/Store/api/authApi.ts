import { User } from "../Slices/authSlice.ts";
import { apiSlice } from "./apiSlice.ts";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.query<User[], { username: string; password: string }>({
      query: ({ username, password }) =>
        `/users?username=${username}&password=${password}`,
    }),
  }),
});
// uselazy to trigger on submit instead of not on mount
export const { useLazyLoginQuery } = authApi;
