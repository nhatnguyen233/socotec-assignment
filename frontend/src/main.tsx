import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import theme from "./theme.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers/index.tsx";

createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
);
