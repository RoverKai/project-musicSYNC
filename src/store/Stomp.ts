import { Client } from "@stomp/stompjs";
import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { MessageType } from "../utils/enum/MessageType";
import { useMessageStore } from "./Messages";
import { useAudioPlayerStore } from "./AudioState";
export const useStompStore = defineStore({
  id: "stomp",
  state: () => ({
    isConnected: false as Boolean,
    stompClient: Client,
  }),
  actions: {
    /**
     * Description: 初始化Stomp客户端
     * @param protocol ws | wss
     * @param baseUrl ip:prot
     * @returns {void}
     */
    init(protocol: string, baseUrl: string): void {
      this.stompClient = new Client({
        brokerURL: `${protocol}://${baseUrl}/ws-chat`,
        onConnect: () => {
          console.log("Connected to the broker");
          this.isConnected = true
          this.subscribeToPublicChannel()
        },
        onWebSocketError: (event) => {
          this.isConnected = false
          new Error("WebSocket error: " + event);
          // 切换至sockjs连接
          console.log('switching to SockJS');
          if (protocol === 'ws') {
            this.initBySockJS('http', baseUrl);
          } else {
            this.initBySockJS('https', baseUrl);
          }
        },
        onStompError(frame) {
          this.isConnected = false
          console.log("Broker reported error: " + frame.headers.message);
          console.log("Additional details: " + frame.body);
        },
        onDisconnect() {
          this.isConnected = false
        }
      })
      // 启动连接
      this.stompClient.activate();
    },
    /**
     * Description: 用sockjs初始化Stomp客户端，保证兼容性
     * @param protocol ws | wss
     * @param baseUrl ip:prot
     * @returns {void}
     */
    initBySockJS(protocol: string, baseUrl: string): void {
      if (this.stompClient) {
        this.stompClient.deactivate();  //停止连接
      }
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(`${protocol}://${baseUrl}/sk-chat`),
        onConnect: () => {
          this.isConnected = true
          console.log(this.isConnected)
          console.log("Connected to the broker");
          this.subscribeToPublicChannel()
        },
        onWebSocketError: (event) => {
          this.isConnected = false
          new Error("WebSocket error: " + event);
          console.log('switching to SockJS');
        },
        onStompError(frame) {
          this.isConnected = false
          console.log("Broker reported error: " + frame.headers.message);
          console.log("Additional details: " + frame.body);
        },
        onDisconnect() {
          this.isConnected = false
        }
      })
      // 启动连接
      this.stompClient.activate();
    },
    // 订阅频道ed
    subscribeToPublicChannel() {
      if (!this.isConnected) {
        console.log(new Error("客户端未连接"))
        return
      }
      this.stompClient.subscribe('/topic/public', message => {
        const receivedMessage = JSON.parse(message.body)
        console.log(receivedMessage)
        switch (receivedMessage.type) {
          case MessageType.CHAT:
            console.log('chat message received')
            useMessageStore().pushMessage(receivedMessage)
            break
          case MessageType.AUDIO_SYNC:
            console.log('audio sync message received')
            const syncState = JSON.parse(receivedMessage.content)
            useAudioPlayerStore().syncState(syncState)
            break
          default:
            console.log('unknown message received', receivedMessage)
            break
        }
      })
      console.log('subscribe to /topic/public')
    },
    // 发送消息
    publishMessage(message: string) {
      if (!this.isConnected || message.trim() === '') return
      this.stompClient.publish({
        destination: '/app/public', // 目标地址
        body: JSON.stringify({
          sender: 'User',
          content: message,
          type: MessageType.CHAT
        }), // 消息内容
      });
      console.log('message published')
    },
    // 同步歌曲状态
    syncAudio(audioState: { currentTime: number, isPlaying: boolean, src: string, shouldPlayAfterLoad: boolean, currentPlaying: string}) {
      console.log('syncing audio state')
      if (!this.isConnected) return
      this.stompClient.publish({
        destination: '/app/public', // 目标地址
        body: JSON.stringify({
          sender: "User",
          content: JSON.stringify(audioState),
          // roomId: roomId.value,
          type: MessageType.AUDIO_SYNC
        }), // 消息内容
      });
      console.log('audio state published')
    },
    disconnect() {
      this.stompClient.deactivate();
    }
  },
})