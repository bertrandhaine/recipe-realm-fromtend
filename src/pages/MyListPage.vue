<script setup lang="ts">
import { ref, computed } from 'vue';
import useListsStore from '@/store/lists';
import { Loader2 } from "lucide-vue-next";
import { storeToRefs } from 'pinia';

const listsStore = useListsStore();
const { listsData, fetchListsIsFetching } = storeToRefs(listsStore);

const newListModalOpen = ref(false);

function createList() {
  newListModalOpen.value = true;
}

const hasLists = computed(() => listsData.value.length > 0);
</script>

<template>
  <BasePage page-title="My recipe lists">
    <template #header-right-content>
      <Button @click="createList">Create a list</Button>
    </template>

    <NewList v-model:open="newListModalOpen" />

    <div class="flex flex-1 p-6 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <!-- Loader -->
      <Loader2 v-if="fetchListsIsFetching" class="w-12 h-12 animate-spin" />

      <!-- Accordion Lists and recipes -->
      <Accordion v-else-if="hasLists" type="single" class="w-full" collapsible>
        <AccordionItem v-for="list in listsData" :key="list.listId" :value="list.title">
          <AccordionTrigger>
            <div class="flex justify-between w-full">
              {{ list.title }}
              <Badge class="text-sm px-2 py-1 rounded-full mr-2">
                {{ list.recipes.length }} {{ list.recipes.length <= 1 ? 'recipe' : 'recipes' }}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
              <RecipeCard v-if="list.recipes && list.recipes.length > 0" v-for="(recipe, index) in list.recipes"
                :key="index" :recipe="recipe" />
              <div v-else class="text-center col-span-full">
                <p class="text-muted-foreground">No recipes found in this list. You can add one from a recipe details
                  page.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div v-else class="flex flex-col items-center gap-1 text-center">
        <h3 class="text-2xl font-bold tracking-tight">
          You have not yet created a list
        </h3>
        <p class="text-sm text-muted-foreground">
          You can start creating a list in order to find your recipe more easily.
        </p>
      </div>
    </div>
  </BasePage>
</template>
