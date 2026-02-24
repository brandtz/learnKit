import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/components/dashboard/DashboardView.vue'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/auth/LoginView.vue'),
    meta: { public: true }
  },
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

// Auth guard — redirect to /login if not authenticated
router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (!to.meta.public && !isAuthenticated.value) {
    return { name: 'login' }
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'dashboard' }
  }
})

export default router
