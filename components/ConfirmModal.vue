<script setup lang="ts">
const { isVisible, title, message, open, confirm, cancel } = useConfirm()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black/10 flex items-center justify-center backdrop-blur-sm z-50"
    >
      <div
        class="flex flex-col items-center justify-center w-max max-w-lg bg-cyan-50 shadow rounded"
      >
        <div class="w-full text-lg py-2 px-3 border-b">
          {{ title }}
        </div>
        <div class="w-full py-2 px-3">
          {{ message }}
        </div>
        <div
          class="w-full py-2 px-3 flex items-center justify-end gap-2 border-t"
        >
          <button
            @click="cancel"
            class="flex items-center justify-center px-2 py-1 rounded text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200"
          >
            Cancel
          </button>
          <button
            @click="confirm"
            class="flex items-center justify-center px-2 py-1 rounded text-cyan-700 hover:text-cyan-900 bg-cyan-200 hover:bg-cyan-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
