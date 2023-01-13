import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CpuMatchView from '../views/CpuMatchView.vue'
import ErrorPage from '../views/ErrorPage.vue'
import HomeView from '../views/HomeView.vue'
import LocalMatchView from '../views/LocalMatchView.vue'
import MatchmakingView from '../views/MatchmakingView.vue'
import OnlineMatchView from '../views/OnlineMatchView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/cpu',
    name: 'cpu',
    component: CpuMatchView
  },
  {
    path: '/local',
    name: 'local',
    component: LocalMatchView
  },
  {
    path: '/matchmake',
    name: 'matchmake',
    component: MatchmakingView
  },
  {
    path: '/online/:gameId/:teamId/:userId',
    name: 'online',
    component: OnlineMatchView
  },
  {
    path: '/:pathMatch(.*)*',
    component: ErrorPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
