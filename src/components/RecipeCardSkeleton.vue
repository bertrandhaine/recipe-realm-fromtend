<script setup lang="ts">
type RecipeCardSkeletonProps = {
  number: number;
};

const { number } = defineProps<RecipeCardSkeletonProps>();
</script>

<template>
  <Card v-for="n in number" :key="n" class="min-w-[220px] hover:drop-shadow-md transition cursor-pointer">
    <CardHeader>
      <h2 class="text-lg font-semibold">
        <Skeleton class="h-8" />
      </h2>
    </CardHeader>
    <CardContent class="flex flex-col">
      <p class="mb-4 line-clamp-3 ">
        <Skeleton class="h-4 mb-2" />
        <Skeleton class="h-4" />
      </p>
      <p class="font-semibold">
        <Skeleton class="h-4 w-32" />
      </p>
    </CardContent>
  </Card>
</template>
