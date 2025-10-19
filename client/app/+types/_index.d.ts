// Minimal type declarations for `import type { Route } from './+types/_index'`
// These provide a lightweight shape for route helper functions used in routes

export type MetaArgs = Record<string, any>;

export type MetaFunction = (args: MetaArgs) => Array<Record<string, any>>;

// Export a type so `import type { Route } from './+types/_index'` works
export type Route = unknown;

export namespace Route {
  export type MetaArgs = import("./_index").MetaArgs | MetaArgs;
  export type MetaFunction = import("./_index").MetaFunction | MetaFunction;
}
