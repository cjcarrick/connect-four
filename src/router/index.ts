import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CpuMatchView from '../views/CpuMatchView.vue'
import HomeView from '../views/HomeView.vue'
import LocalMatchView from '../views/LocalMatchView.vue'
import MatchmakingView from '../views/MatchmakingView.vue'
import OnlineMatchView from '../views/OnlineMatchView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/connect-four',
    name: 'home',
    component: HomeView
  },
  {
    path: '/connect-four/cpu',
    name: 'cpu',
    component: CpuMatchView
  },
  {
    path: '/connect-four/local',
    name: 'local',
    component: LocalMatchView
  },
  {
    path: '/conenct-four/matchmake',
    name: 'matchmake',
    component: MatchmakingView
  },
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
