import { getRouterParam, H3Event, redirect } from "nitro/h3";

export default (event: H3Event) => {
  const asset = getRouterParam(event, "asset");

  return redirect(
    `/release/latest/?asset=${encodeURIComponent(asset ?? "")}`,
    301,
  );
};
