<template>
  <div id="container">
    <div class="room-layout">
      <!-- Left: Chat Section -->
      <div class="chat-section">
        <div class="chat-messages">
          <ul>
            <li v-for="message in messages" :key="message.id" class="message">
              <span class="sender">{{ message.sender }}</span>
              <span class="content">{{ message.content }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right: Music Section -->
      <div class="music-section">
        <div class="upload-section">
          <input type="file" @change="handleFileUpload" accept="audio/*" multiple>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>

        <div class="audio-list" v-if="audioState.audioFiles.length">
          <ul>
            <li v-for="(audio, index) in audioState.audioFiles" :key="index" @dblclick="switchAudio(audio)"
              @touchstart="switchAudio(audio)" :class="{ 'playing': audioState.currentPlaying === audio.name }">
              {{ audio.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="chat-input">
        <input type="text" v-model="messageInput" @keyup.enter="sendMessage(messageInput)"
          placeholder="Type a message...">
        <button @click="sendMessage(messageInput)">Send</button>
      </div>
      <CustomAudioPlayer v-if="audioPlayer" :audioElement="audioPlayer" class="audio-player-container" />
    </div>
    <audio ref="audioPlayer" :src="audioState.src" @ended="handleAudioEnd" @loadeddata="handleLoaded"></audio>
  </div>
</template>

<script setup>
import CustomAudioPlayer from '../components/AudioPlayer/index.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import { useMessageStore } from '../store/Messages'
import { useAudioPlayerStore } from '../store/AudioState'

const audioPlayer = ref(null)
const errorMessage = ref('')
const shouldPlayAfterLoad = ref(false)

// WebSocket refs
const messages = useMessageStore().messages
const roomId = ref(null)
const connected = ref(false)
const instance = getCurrentInstance();
const audioState = useAudioPlayerStore()

const connectWebSocket = () => {
  const protocol = import.meta.env.VITE_APP_IS_SECRET_CONNECT === 'true' ? 'wss' : 'ws'
  const baseUrl = import.meta.env.VITE_APP_BASE_URL
  instance.appContext.config.globalProperties.$stompConnect(protocol, baseUrl)
}

// Send message method
const messageInput = ref('')
const sendMessage = (content) => {
  instance.appContext.config.globalProperties.$publishMessage(content)
  messageInput.value = ''
}

// Send audio sync message
const switchAudio = (audio) => {
  instance.appContext.config.globalProperties.$syncAudio({
    isPlaying: false,
    src: audio.url,
    currentPlaying: audio.name,
    currentTime: audioPlayer.value.currentTime,
    shouldPlayAfterLoad: true
  })
}

// Join room
const joinRoom = () => {
  roomId.value = generateRoomId() // Implement room ID generation
  stompClient.value.send("/app/chat.sendMessage", {}, JSON.stringify({
    sender: "User",
    content: "joined the room",
    roomId: roomId.value,
    type: 'JOIN'
  }))
}

const handleAudioEnd = () => {
  audioState.currentPlaying = ''
}

onMounted(() => {
  setTimeout(() => {
    connectWebSocket()
  }, 1000)
})

onUnmounted(() => {
  instance.appContext.config.globalProperties.$disconnect()
})

const handleFileUpload = (event) => {
  const files = event.target.files
  errorMessage.value = ''

  for (let file of files) {
    if (file.type.startsWith('audio/')) {
      audioState.addAudioFile({
        name: file.name,
        url: URL.createObjectURL(file)
      })
    }
  }
}
</script>

<style scoped>
.audio-player {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #646cff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: #7c82ff;
  transform: scale(1.05);
}

.progress-container {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #646cff;
  border-radius: 3px;
  transition: width 0.1s linear;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  right: -4px;
  top: -4px;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-container:hover .progress-bar::after {
  opacity: 1;
}

.time {
  color: #fff;
  font-size: 0.9rem;
  min-width: 100px;
  text-align: right;
}

.room-layout {
  display: flex;
  height: calc(100vh - 80px);
  /* Adjust for bottom bar */
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input {
  flex: 2;
  display: flex;
  gap: 10px;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.audio-player-container {
  flex: 1;
  position: relative;
}

.chat-section {
  flex: 2;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.music-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.chat-messages {
  height: 100%;
  overflow-y: auto;
}

.chat-messages ul {
  list-style: none;
  padding: 0;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.sender {
  color: #646cff;
  font-weight: bold;
  margin-right: 8px;
}

.content {
  color: #fff;
}

.audio-list {
  margin-top: 20px;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.audio-list ul {
  list-style: none;
  padding: 0;
}

.audio-list li {
  padding: 10px;
  margin: 5px 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

.audio-list li.playing {
  background: #646cff;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: #646cff;
  border-radius: 3px;
}


.chat-section {
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-input {
  padding: 20px;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  outline: none;
}

.chat-input input:focus {
  background: rgba(255, 255, 255, 0.15);
}

.chat-input button {
  padding: 10px 20px;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-input button:hover {
  background: #7c82ff;
}
</style>