import { toast } from "react-toastify";

const generateToast = (
  type: "info" | "success" | "warning" | "error",
  message: string
) => {
  return toast(message, { type: type });
};

export { generateToast };
