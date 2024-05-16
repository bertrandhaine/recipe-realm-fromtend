<template>
    <!-- Skeleton placeholders Title - Breadcrumb -->
    <div>
        <Skeleton class="h-4 mb-4 w-full text-lg font-semibold md:text-2xl grow my-4" />
        <Skeleton class="h-4 mb-4 w-3/4 mt-10" />
    </div>
    <Separator class="my-5" />
    <div>
        <!-- Skeleton placeholders when data is loading -->
        <Skeleton class="h-4 my-6 w-full" />
        <Skeleton class="h-4 my-6 w-3/4" />
        <Skeleton class="h-4 my-6 w-1/2" />
    </div>

    <div class="grid md:grid-cols-2 gap-6 mt-8">
        <!-- Ingredients Column -->
        <div>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">Ingredients</h2>
            <Skeleton class="h-32 w-full" />
        </div>

        <!-- Method Column -->
        <div>
            <h2 class="text-xl font-semibold text-blue-600 mb-4">Method</h2>
            <Skeleton class="h-64 w-full" />
        </div>
    </div>
</template>