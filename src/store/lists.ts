import { defineStore } from "pinia";
import { Recipe, List } from "./type";
import useFetch from "@/composables/useFetch";
import { ref, watch } from "vue";

const useListsStore = defineStore("listsStore", () => {
  const listsData = ref<List[]>([]);
  const state = ref({
    addListState: {
      isFetching: false,
      error: null as string | null,
      data: {
        list: undefined as List | undefined,
        error: "",
      },
    },
    deleteRecipeFromListState: {
      isFetching: false,
      error: null as string | null,
      data: {
        lists: undefined as List[] | undefined,
        error: "",
      },
    },
    addRecipeToListState: {
      isFetching: false,
      error: null as string | null,
      data: {
        list: undefined as List | undefined,
        error: "",
      },
    },
  });

  const {
    data: fetchListsData,
    isFetching: fetchListsIsFetching,
    error: fetchListsError,
  } = useFetch("lists").json<List[]>();

  watch(
    fetchListsData,
    (newData) => {
      listsData.value = newData || [];
    },
    { immediate: true }
  );

  async function addList(title: string, recipe?: Recipe) {
    state.value.addListState.isFetching = true;

    try {
      const res = await useFetch("lists")
        .post({ title, recipe })
        .json<{ list: List; error?: string }>();
      state.value.addListState.data.list = res.data.value?.list;
      state.value.addListState.data.error = res.data.value?.error || "";
      if (res.data.value?.list) {
        listsData.value.push(res.data.value.list);
      }
    } catch (err) {
      state.value.addListState.error = (err as Error).message;
    } finally {
      state.value.addListState.isFetching = false;
    }
  }

  async function deleteRecipeFromList(idList: number, recipeSlug: string) {
    state.value.deleteRecipeFromListState.isFetching = true;

    try {
      const res = await useFetch(`lists/${idList}/recipes/${recipeSlug}`)
        .delete()
        .json<{ lists: List[]; error?: string }>();
      state.value.deleteRecipeFromListState.data.lists = res.data.value?.lists;
      state.value.deleteRecipeFromListState.data.error =
        res.data.value?.error || "";
      if (res.data.value?.lists) {
        listsData.value = res.data.value.lists;
      }
    } catch (err) {
      state.value.deleteRecipeFromListState.error = (err as Error).message;
    } finally {
      state.value.deleteRecipeFromListState.isFetching = false;
    }
  }

  async function addRecipeToList(idList: number, recipe: Recipe) {
    state.value.addRecipeToListState.isFetching = true;

    try {
      const res = await useFetch(`lists/${idList}`)
        .post(recipe)
        .json<{ list: List; error?: string }>();
      state.value.addRecipeToListState.data.list = res.data.value?.list;
      state.value.addRecipeToListState.data.error = res.data.value?.error || "";

      if (res.data.value?.list) {
        const index = listsData.value.findIndex(
          (list) => list.listId === idList
        );
        if (index !== -1) {
          listsData.value[index] = res.data.value.list;
        }
      }
    } catch (err) {
      state.value.addRecipeToListState.error = (err as Error).message;
    } finally {
      state.value.addRecipeToListState.isFetching = false;
    }
  }

  return {
    listsData,
    fetchListsData,
    fetchListsIsFetching,
    fetchListsError,
    state,
    addList,
    deleteRecipeFromList,
    addRecipeToList,
  };
});

export default useListsStore;
