import { App } from "vue";
import { useStompStore } from "../store/Stomp";

export const WebSocketPlugin = {
  install(app: App) {
    const stomp = useStompStore();
    app.config.globalProperties.$stompConnect = (protocol: string, baseUrl: string) => {
      stomp.init(protocol, baseUrl);
    };
    app.config.globalProperties.$publishMessage = (message: string) => {
      stomp.publishMessage(message);
    }
    app.config.globalProperties.$syncAudio = (audioState) => {
      stomp.syncAudio(audioState);
    }
    app.config.globalProperties.$disconnect = (protocol: string, baseUrl: string) => {
      stomp.disconnect();
    };
  }
}