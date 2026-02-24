<template>
  <div class="module-nav-bar mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
    <!-- Previous -->
    <router-link
      v-if="prevModule"
      :to="`/module/${prevModule.id}`"
      class="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
    >
      <ChevronLeft class="w-4 h-4" />
      {{ prevModule.title }}
    </router-link>
    <div v-else />

    <!-- Mark Complete -->
    <button
      v-if="status !== 'complete'"
      class="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors inline-flex items-center gap-2"
      @click="$emit('mark-complete')"
    >
      <CheckCircle class="w-4 h-4" />
      Mark Complete
    </button>
    <span
      v-else
      class="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-medium"
    >
      <CheckCircle class="w-4 h-4" />
      Completed
    </span>

    <!-- Next -->
    <router-link
      v-if="nextModule"
      :to="`/module/${nextModule.id}`"
      class="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
    >
      {{ nextModule.title }}
      <ChevronRight class="w-4 h-4" />
    </router-link>
    <div v-else />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-vue-next'
import { useContent } from '@/composables/useContent'

const props = defineProps({
  currentId: { type: String, required: true },
  status: { type: String, default: 'not_started' }
})

defineEmits(['mark-complete'])

const { loadModules } = useContent()
const allModules = ref([])

const currentIndex = computed(() => allModules.value.findIndex(m => m.id === props.currentId))
const prevModule = computed(() => currentIndex.value > 0 ? allModules.value[currentIndex.value - 1] : null)
const nextModule = computed(() => currentIndex.value < allModules.value.length - 1 ? allModules.value[currentIndex.value + 1] : null)

onMounted(async () => {
  allModules.value = await loadModules()
})
</script>
