import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect, useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { inject } from "@vercel/analytics";
import Splash from "~/components/Splash";
import ToastContainer from "~/components/ToastContainer";

inject();

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
          }}
        />
      </head>

      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Splash visible={splashVisible} />
      <Outlet />
      <ToastContainer />
    </>
  );
}

export const meta: Route.MetaFunction = () => [
  { title: "Eukleya - AI Resume Analyzer" },
  { name: "description", content: "Let your work speak well of you. Get AI-powered feedback on your resume -- ATS score, tone, structure, and content." },
  { name: "keywords", content: "resume, AI, resume analyzer, ATS, job application, career" },
  { property: "og:title", content: "Eukleya - AI Resume Analyzer" },
  { property: "og:description", content: "Let your work speak well of you. Get AI-powered feedback on your resume -- ATS score, tone, structure, and content." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
