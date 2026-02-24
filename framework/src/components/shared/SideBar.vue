<template>
  <aside
    :class="[
      'fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 overflow-y-auto transition-transform duration-300 z-50 no-print',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <nav class="p-4 flex flex-col gap-1" aria-label="Main navigation">
      <router-link
        to="/"
        class="sidebar-link"
        :class="isActive('/')"
        @click="$emit('close')"
      >
        <LayoutDashboard class="w-4 h-4" />
        <span>Learning Path</span>
      </router-link>

      <router-link
        v-if="features.agendaTracker"
        to="/agendas"
        class="sidebar-link"
        :class="isActive('/agendas')"
        @click="$emit('close')"
      >
        <Calendar class="w-4 h-4" />
        <span>Agenda Tracker</span>
      </router-link>

      <router-link
        v-if="features.issuesPanel"
        to="/issues"
        class="sidebar-link"
        :class="isActive('/issues')"
        @click="$emit('close')"
      >
        <AlertTriangle class="w-4 h-4" />
        <span>Current Issues</span>
      </router-link>

      <router-link
        v-if="features.glossary"
        to="/glossary"
        class="sidebar-link"
        :class="isActive('/glossary')"
        @click="$emit('close')"
      >
        <BookA class="w-4 h-4" />
        <span>Glossary</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { LayoutDashboard, Calendar, AlertTriangle, BookA } from 'lucide-vue-next'

defineProps({
  open: { type: Boolean, default: false },
  features: { type: Object, default: () => ({}) }
})

defineEmits(['close'])

const route = useRoute()

function isActive(path) {
  const current = route.path
  if (path === '/') {
    return current === '/' || current.startsWith('/module')
      ? 'sidebar-link-active'
      : 'sidebar-link-inactive'
  }
  return current.startsWith(path) ? 'sidebar-link-active' : 'sidebar-link-inactive'
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150;
}
.sidebar-link-active {
  @apply bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-l-2 border-emerald-600;
}
.sidebar-link-inactive {
  @apply text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700;
}
</style>
