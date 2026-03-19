<script setup lang="ts">
const { isVisible, title, message, confirm, cancel } = useConfirm()
</script>

<template>
  <Transition name="modal">
    <div v-if="isVisible"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
    >
      <div class="flex w-max max-w-lg flex-col items-center justify-center rounded bg-cyan-50 shadow">
        <div class="w-full border-b px-3 py-2 text-lg">
          {{ title }}
        </div>
        <div class="w-full px-3 py-2">
          {{ message }}
        </div>
        <div class="flex w-full items-center justify-end gap-2 border-t px-3 py-2">
          <button
            class="flex items-center justify-center rounded bg-red-100 px-2 py-1 text-red-600 hover:bg-red-200 hover:text-red-800"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            class="flex items-center justify-center rounded bg-cyan-200 px-2 py-1 text-cyan-700 hover:bg-cyan-300 hover:text-cyan-900"
            @click="confirm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
