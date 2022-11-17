import { extendTheme } from "@chakra-ui/react";

import { buttonTheme } from "./components/Button";

import { rcoinBlue } from "./colors";

let theme = extendTheme({
  components: { Button: buttonTheme, IconButton: buttonTheme },
  colors: {
    rcoinBlue: rcoinBlue,
  },
});

export default theme;
