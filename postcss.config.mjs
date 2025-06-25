/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Corrected plugin name
    autoprefixer: {},
  },
};
export default config;
