<script setup lang="ts">
import { ref, watch } from "vue";
import { useToast } from "./ui/toast";
import useListsStore from "@/store/lists";
import { storeToRefs } from "pinia";
import { Loader2 } from "lucide-vue-next";
import { Recipe } from "@/store/type";

// Define component props and emits
type NewListProps = {
  recipe?: Recipe;
  open: boolean;
};

const props = defineProps<NewListProps>();
const emits = defineEmits(["update:open"]);

// Pinia store setup
const listsStore = useListsStore();
const { state } = storeToRefs(listsStore);

// Local state
const listName = ref("");
const { toast } = useToast();
const isModalOpen = ref(props.open);

// Watchers to sync props and local state
watch(() => props.open, (newVal) => {
  if (isModalOpen.value !== newVal) {
    isModalOpen.value = newVal;
  }
});

watch(isModalOpen, (newVal) => {
  if (newVal !== props.open) {
    emits("update:open", newVal);
  }
});

// Helper function to handle errors
const handleAddListError = () => {
  toast({
    title: "Error!",
    description: "An error occurred while creating the list.",
    variant: 'destructive',
    duration: 5000,
  });
};

// Function to add a new list
const addNewList = async () => {
  try {
    await listsStore.addList(listName.value, props.recipe);

    const { addListState } = state.value;
    if (!addListState?.data.error && addListState?.data.list) {
      isModalOpen.value = false;
      emits("update:open", false);
      listName.value = "";
      toast({
        title: "Success!",
        description: "Your list has been created.",
        duration: 5000,
      });
    } else {
      handleAddListError();
    }
  } catch (error) {
    handleAddListError();
  }
};
</script>

<template>
  <Dialog v-model:open="isModalOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create list</DialogTitle>
        <DialogDescription>
          Choose a name for your new list. Click "Add" when you're done.
        </DialogDescription>
        <DialogDescription v-if="state.addListState?.data.error" class="text-red-800" role="alert">
          <span class="font-medium">{{ state.addListState?.data.error }}</span>
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="list-name" class="text-right"> List name </Label>
          <Input id="list-name" v-model="listName" required class="col-span-3" @keyup.enter="addNewList" />
        </div>
      </div>
      <DialogFooter>
        <Button v-if="!state.addListState.isFetching" type="submit" @click="addNewList"> Add </Button>
        <Button v-else disabled>
          <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          Please wait
        </Button>
        <DialogClose as-child>
          <Button type="button" variant="secondary"> Close </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
