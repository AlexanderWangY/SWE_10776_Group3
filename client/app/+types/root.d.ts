// Minimal type declarations for `import type { Route } from './+types/root'`
// These provide just enough shape to satisfy the project's usage in root.tsx

export type LinkDescriptor = {
  rel?: string;
  href: string;
  crossOrigin?: string;
  media?: string;
};

export type LinksFunction = () => LinkDescriptor[];

export type ErrorBoundaryProps = {
  error: unknown;
};

// Export a type so `import type { Route } from './+types/root'` works
export type Route = unknown;

// Provide nested types accessible as `Route.LinksFunction` and `Route.ErrorBoundaryProps`
export namespace Route {
  export type LinksFunction = import("./root").LinksFunction | LinksFunction;
  export type ErrorBoundaryProps = import("./root").ErrorBoundaryProps | ErrorBoundaryProps;
}
