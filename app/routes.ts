import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("tokenSearch", "routes/tokenSearch.tsx"),
  route("infiniteList", "routes/infiniteList.tsx"),
  route("liveSwap", "routes/liveSwap.tsx"),
] satisfies RouteConfig;
