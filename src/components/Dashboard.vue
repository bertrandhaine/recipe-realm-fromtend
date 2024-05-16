<script setup lang="ts">
import useFetch from "@/composables/useFetch";
import { Recipe } from "@/store/type";
import { useDebounceFn } from "@vueuse/core";
import { Menu, Search, Banana, CookingPot, AlignLeft } from "lucide-vue-next";
import { ref, watch } from "vue";
import slugify from 'slugify';

// Define reactive variables
const searchTerm = ref<string>('');
const searchResults = ref<Recipe[]>([]);
const showResults = ref<boolean>(false);

// Slugify options
const slugifyOptions = { lower: true, remove: /[*+~.()'"!:@]/g };

// Function to fetch search results with debouncing
const fetchSearchResults = useDebounceFn(async () => {
  if (searchTerm.value.trim()) {
    try {
      const { data: recipes, error } = await useFetch(`/recipes/search?q=${encodeURIComponent(searchTerm.value)}`).get().json<{ recipes: Recipe[] }>();
      if (error.value) {
        console.error('Failed to fetch search results:', error.value);
        searchResults.value = [];
      } else {
        searchResults.value = recipes.value?.recipes ?? [];
      }
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      searchResults.value = [];
    }
    showResults.value = true;
  } else {
    searchResults.value = [];
    showResults.value = false;
  }
}, 300);

// Watcher to trigger search results fetching on searchTerm change
watch(searchTerm, fetchSearchResults);

// Function to close search results
const closeSearchResults = (): void => {
  showResults.value = false;
};
</script>

<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <!-- Sidebar -->
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" class="flex items-center gap-2 font-semibold">
            <Banana class="h-6 w-6" />
            <span>Recipe Realm</span>
          </a>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <RouterLink to="/"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              active-class="bg-muted !text-primary">
              <CookingPot class="h-4 w-4" />
              Recipes
            </RouterLink>
            <RouterLink to="/my-list"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              active-class="bg-muted !text-primary">
              <AlignLeft class="h-4 w-4" />
              My recipe lists
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col">
      <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <!-- Mobile Navigation Sheet -->
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <a href="#" class="flex items-center gap-2 text-lg font-semibold">
                <Banana class="h-6 w-6" />
                <span class="sr-only">Recipe realm</span>
              </a>
              <RouterLink to="/"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                active-class="bg-muted !text-foreground">
                <CookingPot class="h-5 w-5" />
                Recipes
              </RouterLink>
              <RouterLink to="/my-list"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                active-class="bg-muted !text-foreground">
                <AlignLeft class="h-5 w-5" />
                My recipe lists
              </RouterLink>
            </nav>
          </SheetContent>
        </Sheet>

        <!-- Search Bar -->
        <div class="w-full flex-1">
          <form class="search-container" v-click-outside="closeSearchResults">
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input @keydown.enter.prevent v-model="searchTerm" type="search" placeholder="Search recipes..."
                class="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
              <ul v-if="showResults && searchResults.length"
                class="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-60 overflow-auto">
                <li v-for="result in searchResults" :key="result.Name">
                  <RouterLink :to="`/recipe/${slugify(result.Name, slugifyOptions)}`"
                    class="block p-2 hover:bg-gray-100" @click="() => { showResults = false; searchTerm = ''; }">
                    {{ result.Name }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
