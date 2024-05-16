<script setup lang="ts">
import useFetch from "@/composables/useFetch";
import { computed, ref, watch } from "vue";
import {
  PaginationRoot as Pagination,
  PaginationList,
  PaginationListItem,
} from "radix-vue";
import { useRoute, useRouter } from "vue-router";
import { useUrlSearchParams } from "@vueuse/core";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton.vue";
import { Recipe } from "@/store/type";

// Define the types for the API response
type RecipesResponse = {
  data: Recipe[];
  pagination: RecipePagination;
};

// Define the type for pagination
type RecipePagination = {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  nextPage: number;
  prevPage: number | null;
};

// Use URL search params for handling pagination state
const urlParams = useUrlSearchParams("history");
const router = useRouter();
const route = useRoute();

const page = ref(urlParams.page ? parseInt(urlParams.page as string) : 1);
const itemPerPage = ref(urlParams.itemPerPage ? parseInt(urlParams.itemPerPage as string) : 12);
const totalPages = ref<number | undefined>();

const url = computed(() => `recipes/all/${page.value}/${itemPerPage.value}`);

// Fetch data using the custom useFetch hook
const { data, isFetching, error, execute, onFetchResponse } =
  useFetch(url).json<RecipesResponse>();

onFetchResponse(() => {
  totalPages.value = data.value?.pagination.totalPages;
});

// Handle page navigation
const goToPage = (pageNumber: number): void => {
  router.push({
    query: { page: pageNumber },
  });
};

const prevPage = (): void => {
  if (page.value > 1) {
    goToPage(page.value - 1);
  }
};

const nextPage = (): void => {
  if (page.value < totalPages.value!) {
    goToPage(page.value + 1);
  }
};

// Watch for changes in the URL and fetch data accordingly
watch(url, () => {
  data.value = null;
  execute();
});

watch(
  () => route.query.page as unknown as number,
  (newPage) => {
    page.value = newPage;
  },
);
</script>

<template>
  <BasePage page-title="Recipes">
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      <RecipeCardSkeleton v-if="isFetching" :number="itemPerPage" />
      <RecipeCard v-if="data" v-for="(recipe, index) in data.data" :key="index" :recipe="recipe" />
      <div v-if="error">Error: {{ error }}</div>
    </div>

    <Pagination v-slot="{ page }" class="my-12 flex justify-center" :total="totalPages" :sibling-count="1" show-edges
      :default-page="1">
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev @click="prevPage()" />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-9 h-9 p-0" @click="goToPage(item.value)"
              :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>
        <PaginationNext @click="nextPage()" />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </BasePage>
</template>
