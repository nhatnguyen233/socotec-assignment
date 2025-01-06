import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Source Sans Pro, sans-serif",
    body: "Source Sans Pro, sans-serif",
  },
  colors: {
    primary: "#153376", // Primary color
    secondary: "#4D4F5C", // Secondary color
  },
});

export default theme;
