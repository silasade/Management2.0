"use client"; // Mark as a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  // Ensure queryClient is created only on the client side
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
