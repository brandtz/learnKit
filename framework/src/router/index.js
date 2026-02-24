import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/components/dashboard/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/module/:id',
    name: 'module',
    component: () => import('@/components/module/ModuleView.vue')
  },
  {
    path: '/agendas',
    name: 'agendas',
    component: () => import('@/components/agenda/AgendaTracker.vue')
  },
  {
    path: '/issues',
    name: 'issues',
    component: () => import('@/components/issues/IssuesPanel.vue')
  },
  {
    path: '/glossary',
    name: 'glossary',
    component: () => import('@/components/glossary/GlossaryView.vue')
  },
  {
    path: '/glossary/:term',
    name: 'glossaryTerm',
    component: () => import('@/components/glossary/GlossaryView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
