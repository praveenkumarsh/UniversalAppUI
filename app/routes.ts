import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // { path: "pastebin", file: "components/PasteBin.tsx" }, // Add the login route
//   { path: "login", file: "routes/home.tsx" }, // Add the login route
] satisfies RouteConfig;
