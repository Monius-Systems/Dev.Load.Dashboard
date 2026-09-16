// Bundler-resolved web workers. The "?worker" suffix hands back a constructor
// that works both in development and in the build, unlike new URL(...) which
// only resolves at build time.
declare module '*?worker' {
  const WorkerConstructor: new () => Worker;
  export default WorkerConstructor;
}
