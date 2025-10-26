import { eventHandler } from "#imports";
import { onRequestCORSMiddleware } from "nitro-cors";

export default eventHandler(
  onRequestCORSMiddleware({
  origin: "*",
  methods: "*",
  }),
);
