import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.js',
    setupNodeEvents(on, config) {
      // require('./cypress/plugins')(on, config);
      return config;
    },
  },
});
