import { defineStore } from "pinia";

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    ws: null
  }),

  getters: {
    websocket: (state) => state.ws 
  },

  actions: {
    createWebSocket (url) {
      if (this.ws) {
        this.ws.close()
      }
      this.ws = new WebSocket(url)
    }
  }
})