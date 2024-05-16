<script setup lang="ts">
import { CirclePlus, Plus } from "lucide-vue-next";
import useFetch from "@/composables/useFetch";
import { Recipe } from "@/store/type";
import { ref, watch } from "vue";
import { useRoute } from 'vue-router';
import { useToast } from "@/components/ui/toast";
import useListsStore from "@/store/lists";
import { storeToRefs } from "pinia";
import slugify from "slugify";

interface ListCheckedStates {
  [key: number]: boolean;
}

// Set up route and store references
const route = useRoute();
const { toast } = useToast();
const listsStore = useListsStore();
const { state, fetchListsIsFetching, listsData } = storeToRefs(listsStore);

// Reactive properties for state management
const isModalOpen = ref(false);
const recipe = ref<Recipe>();
const slug = ref(route.params.slug as string);
const newListModalOpen = ref(false); // For controlling the new list dialog
const listCheckedStates = ref<ListCheckedStates>({});

// Fetch the recipe based on the current route slug
watch(() => route.params.slug, async (newSlug) => {
  if (!newSlug) return;
  slug.value = newSlug as string;
  const { data } = await useFetch(`recipes/${newSlug}`).json<Recipe>();
  if (data.value) {
    recipe.value = data.value;
  }
}, { immediate: true });

// Update list checked states when lists data changes
watch(listsData, (newLists) => {
  if (!newLists) return;
  newLists.forEach((list) => {
    const isRecipePresent = list.recipes.some(
      (r) => slugify(r.Name, { lower: true, remove: /[*+~.()'"!:@]/g }) === route.params.slug,
    );
    listCheckedStates.value[list.listId] = isRecipePresent;
  });
}, { deep: true, immediate: true });

// Function to open the new list dialog
function createList() {
  newListModalOpen.value = true;
}

// Handle adding or removing a recipe from a list
const handleCheckClick = async (listId: number, checked: boolean) => {
  if (checked) {
    await listsStore.deleteRecipeFromList(listId, slug.value);
    const errorState = state.value.deleteRecipeFromListState?.data.error;
    const listState = state.value.deleteRecipeFromListState?.data.lists;
    if (!errorState && listState) {
      toast({
        title: "Success!",
        description: "The recipe has been removed from the list.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occurred while removing the recipe from the list.",
        duration: 5000,
      });
    }
  } else {
    await listsStore.addRecipeToList(listId, recipe.value || {} as unknown as Recipe);
    const errorState = state.value.addRecipeToListState?.data.error;
    const listState = state.value.addRecipeToListState?.data.list;
    if (!errorState && listState) {
      toast({
        title: "Success!",
        description: "The recipe has been added to the list.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occurred while adding the recipe to the list.",
        variant: 'destructive',
        duration: 5000,
      });
    }
  }
};
</script>

<template>
  <BasePage v-if="recipe && recipe.Name" :page-title="recipe.Name">
    <NewList v-model:open="newListModalOpen" :recipe="recipe" />

    <!-- Breadcrumb -->
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/"> Recipes </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{{ recipe.Name }}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </template>

    <!-- Header Right Content - Add to a custom list -->
    <template #header-right-content>
      <Dialog v-model:open="isModalOpen">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              <CirclePlus class="mr-2" :size="16" /> Add to list
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56">
            <DropdownMenuLabel>My recipe lists</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem v-if="fetchListsIsFetching"> Loading... </DropdownMenuItem>
            <DropdownMenuCheckboxItem v-else-if="listsData && listsData.length > 0" v-for="(list, index) in listsData"
              :key="'custom-list-' + index" :checked="listCheckedStates[list.listId]" @click="
                handleCheckClick(list.listId, listCheckedStates[list.listId])
                ">
              {{ list.title }}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator v-if="listsData && listsData.length > 0" />
            <DropdownMenuItem>
              <DialogTrigger as-child>
                <div @click="createList">
                  <Plus class="mr-2 h-4 w-4 inline" />
                  <Label class="inline">New list</Label>
                </div>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </template>

    <!-- Description, Author, and URL -->
    <div class="mb-6">
      <p v-if="recipe.Description" class="text-md mb-4">
        {{ recipe.Description }}
      </p>
      <p v-if="recipe.Author" class="text-md mb-4">{{ recipe.Author }}</p>
      <p class="text-md">
        <a :href="recipe.url" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
          {{ recipe.url }}
        </a>
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Ingredients Column -->
      <div>
        <h2 class="text-xl font-semibold text-blue-600 mb-4">Ingredients</h2>
        <ul class="space-y-2">
          <li class="p-2 bg-gray-100 rounded hover:bg-blue-50 transition-colors"
            v-for="(ingredient, index) in recipe.Ingredients" :key="'ingredient-' + index">
            {{ ingredient }}
          </li>
        </ul>
      </div>

      <!-- Method Column -->
      <div>
        <h2 class="text-xl font-semibold text-blue-600 mb-4">Method</h2>
        <ol class="space-y-4">
          <li class="p-2 bg-gray-100 rounded hover:bg-blue-50 transition-colors" v-for="(step, index) in recipe.Method"
            :key="'step-' + index">
            <span class="font-medium">Step {{ index + 1 }}:</span>
            <div class="m-2">{{ step }}</div>
          </li>
        </ol>
      </div>
    </div>
  </BasePage>
  <div v-else>
    <!-- Recipe Page Skeleton -->
    <RecipePageSkeleton />
  </div>
</template>
