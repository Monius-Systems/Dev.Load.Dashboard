// Bundler-resolved web workers. The "?worker" suffix hands back a constructor
// that works both in development and in the build, unlike new URL(...) which
// only resolves at build time.
declare module '*?worker' {
  const WorkerConstructor: new () => Worker;
  export default WorkerConstructor;
}

// Vite's build-time constants on import.meta, the one the scanner relies on
// being `SSR`: true in the server builds and false in the browser's, so a branch
// on it is dropped by the bundler rather than decided at run time. Declared here
// rather than by pulling in vite/client, which would also bring in every asset
// module type the app does not use.
interface ImportMeta {
  readonly env: { readonly SSR: boolean };
}
