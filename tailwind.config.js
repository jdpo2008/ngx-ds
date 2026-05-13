// NOTE: No postcss.config.js is needed.
// Angular 21 uses @angular/build:application (esbuild-based) which auto-detects
// TailwindCSS from node_modules and this config file.
// If using ng-packagr library builds with @apply in component SCSS files,
// additional PostCSS setup may be required per component.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './projects/**/*.{html,ts,scss}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
