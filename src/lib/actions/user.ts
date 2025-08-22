import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createData, getData, updateData } from "../requests";
type UserType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  provider_token:string
};
const useGetUserDetails = () => {
  return useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getData<UserType>("/api/user/me"),
  });
};

const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await createData("/api/auth/forgot-password", "application/json", {
        email,
      });
    },
  });
};
const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      await updateData(
        "/api/auth/reset-password",
        {
          password,
        },
        "application/json"
      );
    },
  });
};
export { useGetUserDetails, useForgotPassword, useUpdatePassword };


