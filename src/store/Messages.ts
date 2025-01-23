import { defineStore } from "pinia";

interface Message {
  sender: string
  content: string
  type: string
}

export const useMessageStore = defineStore({
  id: 'message',
  state: () => ({
    messages: [] as Message[],
  }),
  actions: {
    pushMessage(message: Message) {
      this.messages.push(message)
    }
  }
})