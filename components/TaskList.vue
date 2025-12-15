<script setup lang="ts">
const { tasks } = useTaskStore()

// reorder with drag and drop
const dragIndex = ref(-1)
const dragHoverIndex = ref(-1)
function handleDragStart(index: number) {
  if (isMobile()) return
  dragIndex.value = index
  dragHoverIndex.value = index
}
function handleDragOver(index: number) {
  if (isMobile()) return
  if (dragIndex.value > -1) {
    dragHoverIndex.value = index
  } else {
    dragHoverIndex.value = -1
  }
}
function handleDrop(index: number) {
  if (isMobile()) return

  const draggedTask = tasks.value[dragIndex.value]
  if (!draggedTask) return

  if (dragIndex.value !== index) {
    tasks.value.splice(dragIndex.value, 1)
    tasks.value.splice(index, 0, draggedTask)
  }
  dragIndex.value = -1
  dragHoverIndex.value = -1
}
</script>

<template>
  <ul class="space-y-2 px-4 py-2">
    <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" @dragstart="handleDragStart(index)"
      @dragover.prevent="handleDragOver(index)" @drop="handleDrop(index)" :isDrag="dragIndex === index"
      :isDragHover="dragHoverIndex === index" />
    <li v-if="tasks.length === 0" class="text-gray-500 text-center p-4">
      No tasks added yet.
    </li>
  </ul>
</template>
