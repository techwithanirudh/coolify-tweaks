---
"@repo/docs": patch
---

Fix the dynamic-config installer writing a bind address into `APP_PORT`, which broke Coolify on restart with `strconv.ParseUint: parsing "0.0.0.0:3000": invalid syntax`. `APP_PORT` is now a plain port number (default `3000`), user input is validated, and port `8000` is rejected since it is reserved for the Traefik dashboard entrypoint.
