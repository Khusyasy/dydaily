<script setup lang="ts">
const { tasks } = useTaskStore()

const editMode = useState('editMode', () => false)

const isMobile = useIsMobile()

// reorder with drag and drop
const dragIndex = ref(-1)
const dragHoverIndex = ref(-1)
function handleDragStart(index: number) {
  return () => {
    if (isMobile.value) return
    if (!editMode.value) return

    dragIndex.value = index
    dragHoverIndex.value = index
  }
}
function handleDragOver(index: number) {
  return () => {
    if (isMobile.value) return
    if (!editMode.value) return

    if (dragIndex.value > -1) {
      dragHoverIndex.value = index
    }
    else {
      dragHoverIndex.value = -1
    }
  }
}
function handleDrop(index: number) {
  return () => {
    if (isMobile.value) return
    if (!editMode.value) return

    const draggedTask = tasks.value[dragIndex.value]
    if (!draggedTask) return

    if (dragIndex.value !== index) {
      tasks.value.splice(dragIndex.value, 1)
      tasks.value.splice(index, 0, draggedTask)
    }
    dragIndex.value = -1
    dragHoverIndex.value = -1
  }
}
</script>

<template>
  <ul class="space-y-2 px-4 py-2">
    <TaskItem v-for="(task, index) in tasks"
              :key="task.id"
              :task="task"
              :index="index"
              :handle-drag-start="handleDragStart(index)"
              :handle-drag-over="handleDragOver(index)"
              :handle-drop="handleDrop(index)"
              :is-drag="dragIndex === index"
              :is-drag-hover="dragHoverIndex === index"
    />
    <li v-if="tasks.length === 0"
        class="p-4 text-center text-gray-500"
    >
      No tasks added yet.
    </li>
  </ul>
</template>
