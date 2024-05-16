<script setup lang="ts">
import { Recipe } from "@/store/type";
import { useRouter } from "vue-router";
import slugify from "slugify";

// Define component props
type RecipeProps = {
  recipe: Recipe;
};

const { recipe } = defineProps<RecipeProps>();

// Setup router
const router = useRouter();

// Function to navigate to recipe detail page
const openRecipeDetail = (): void => {
  try {
    router.push({
      name: "recipe",
      params: {
        slug: slugify(recipe.Name, {
          lower: true,
          remove: /[*+~.()'"!:@]/g,
        }),
      },
    });
  } catch (error) {
    console.error("Failed to navigate to recipe detail:", error);
  }
};
</script>

<template>
  <Card @click="openRecipeDetail" class="min-w-[220px] hover:drop-shadow-md transition cursor-pointer" role="button"
    aria-label="Open recipe details">
    <CardHeader>
      <h2 class="text-lg font-semibold">{{ recipe.Name }}</h2>
    </CardHeader>
    <CardContent class="flex flex-col">
      <p class="mb-4 line-clamp-3">{{ recipe.Description || 'No description available.' }}</p>
      <p class="font-semibold">By {{ recipe.Author || 'Unknown' }}</p>
    </CardContent>
  </Card>
</template>
