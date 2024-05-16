import { createFetch } from "@vueuse/core";

const useFetch = createFetch({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  options: {
    async beforeFetch() {
      await new Promise((resolve) => setTimeout(resolve, 500)); // add a delay to show the loading state, simulating a slow network
    },
    updateDataOnError: true,
  },
});

export default useFetch;
