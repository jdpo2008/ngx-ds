// Required by Storybook's webpack to compile @tailwind directives in SCSS.
// Angular CLI (@angular/build:application esbuild) does NOT use this file.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
