import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/signup", "routes/signup.tsx"),
    route("/signin", "routes/signin.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/auth/callback", "routes/auth-callback.tsx"),
    route("/upload", "routes/upload.tsx"),
    route("/resume/:id", "routes/resume.tsx"),
] satisfies RouteConfig;
