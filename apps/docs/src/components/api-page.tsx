import { createAPIPage } from "fumadocs-openapi/ui";

import { openapi } from "@/lib/openapi";

export const APIPage = createAPIPage(openapi, {
  shikiOptions: {
    themes: {
      dark: "vesper",
      light: "vitesse-light",
    },
  },
});
