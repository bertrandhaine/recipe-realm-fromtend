<script setup lang="ts">
type BasePageProps = {
  pageTitle: string;
  slug?: string;
};

const { pageTitle } = defineProps<BasePageProps>();
</script>

<template>
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl grow">
      {{ pageTitle }}
    </h1>
    <slot name="header-right-content" />
  </div>
  <slot name="breadcrumb" />
  <Separator />
  <div>
    <slot />
  </div>
</template>
