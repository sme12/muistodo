import { ClerkApp } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "MuisTODO",
    viewport: "width=device-width,initial-scale=1",
  },
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
function App() {
  return <Outlet />;
}

export default ClerkApp(App);
