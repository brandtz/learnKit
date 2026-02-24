<template>
  <div
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2"
  >
    <div
      class="bg-emerald-500 h-2 rounded-full transition-all duration-500"
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>

<script setup>
defineProps({
  percent: { type: Number, default: 0 }
})
</script>
