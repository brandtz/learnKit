<template>
  <div class="py-3">
    <dt class="font-semibold text-gray-900 dark:text-gray-100">{{ term.term }}</dt>
    <dd class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1">{{ term.definition }}</dd>
  </div>
</template>

<script setup>
defineProps({
  term: { type: Object, required: true }
})
</script>
