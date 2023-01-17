import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CpuMatchView from '../views/CpuMatchView.vue'
import HomeView from '../views/HomeView.vue'
import LocalMatchView from '../views/LocalMatchView.vue'
import MatchmakingView from '../views/MatchmakingView.vue'
import OnlineMatchView from '../views/OnlineMatchView.vue'

// Redirects are needed for Github Pages hosting

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'home' } },
  {
    path: '/connect-four/',
    name: 'home',
    component: HomeView
  },

  { path: '/cpu', redirect: { name: 'cpu' } },
  {
    path: '/connect-four/cpu',
    name: 'cpu',
    component: CpuMatchView
  },

  { path: '/local', redirect: { name: 'local' } },
  {
    path: '/connect-four/local',
    name: 'local',
    component: LocalMatchView
  },

  { path: '/matchmake', redirect: { name: 'matchmake' } },
  {
    path: '/connect-four/matchmake',
    name: 'matchmake',
    component: MatchmakingView
  },

  { path: '/online/:gameId/:teamId/:userId', redirect: { name: 'online' } },

  {
    path: '/connect-four/online/:gameId/:teamId/:userId',
    name: 'online',
    component: OnlineMatchView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
