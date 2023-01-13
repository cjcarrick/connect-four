import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Init app

let app = createApp(App)

// Use router

app.use(router)

// Global websocket instance

try {
  const address: string = import.meta.env.VITE_SOCKET
  const $socket = new WebSocket(address)
  app.config.globalProperties.$socket = $socket
} catch {
  console.error('error')
  app.config.globalProperties.$socket = undefined
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $socket: WebSocket | undefined
  }
}

app.provide('socket', app.config.globalProperties.$socket)

// Mount app

app.mount('#app')
