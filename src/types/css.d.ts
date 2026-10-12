// Global stylesheets (e.g. `import './globals.css'`) are side-effect imports.
// next/types only declares `*.module.css`, so newer TypeScript versions
// (noUncheckedSideEffectImports on by default) flag plain `.css` imports.
declare module '*.css';
