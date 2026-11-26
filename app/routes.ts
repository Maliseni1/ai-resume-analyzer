import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/signup", "routes/signup.tsx"),
    route("/signin", "routes/signin.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/auth/callback", "routes/auth-callback.tsx"),
    route("/upload", "routes/upload.tsx"),
    route("/resume/:id", "routes/resume.tsx"),
    route("/subscribe", "routes/subscribe.tsx"),
    route("/api/analyze", "routes/api.analyze.ts"),
    route("/api/extract-job", "routes/api.extract-job.ts"),
    route("/privacy", "routes/privacy.tsx"),
    route("/terms", "routes/terms.tsx"),
] satisfies RouteConfig;
