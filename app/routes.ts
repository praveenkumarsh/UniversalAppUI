import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "login", file: "routes/login.tsx" }, // Add the login route
] satisfies RouteConfig;
