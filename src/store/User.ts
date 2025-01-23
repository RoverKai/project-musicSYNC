import { defineStore } from "pinia";

interface User {
  name: string;
  roomId: string;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): User => ({
    roomId: '',
    name: '',
  }),
  actions: {
    setName(name: string) {
      this.name = name
    },
    setRoomId(roomId: string) {
      this.roomId = roomId
    },
    setUserInfo(roomId: string, name: string) {
      this.name = name
      this.roomId = roomId
    }
  },
})