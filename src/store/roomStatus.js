import { defineStore } from "pinia";

export const useRoomStatusStore = defineStore('roomStatus', {
  state: () => ({
    id: null
  }),

  getters: {
    roomId: (state) => state.id
  },

  actions: {
    setRoomId(id) {
      this.id = id
    }
  },
  persist: true
})