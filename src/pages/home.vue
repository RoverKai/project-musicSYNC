<template>
  <div class="home-container">
    <div class="content">
      <h1 class="title">MusicSync</h1>
      <p class="subtitle">Share and listen t<span class="loading-o">o</span> music together</p>
      <!-- roomId -->
      <div class="id-form">
        <input type="text" v-model="userInfo.roomId" placeholder="Enter Room ID" />
        <input type="text" v-model="userInfo.name" placeholder="Enter Your Nickname" />
        <button class="create-room-btn" @click="createRoom">
          Create Room
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router'

const userInfo = reactive({
  roomId: '',
  name: ''
})

import { useUserStore } from '../store/User';
const userStore = useUserStore()
watch(userInfo, ({roomId, name}) => {
  userStore.setUserInfo(roomId, name)
},{
  deep: true
})

const router = useRouter()

const createRoom = () => {
  router.push('/room')
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.content {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 4rem;
  color: #fff;
  margin-bottom: 1rem;
  font-weight: bold;
  background: linear-gradient(45deg, #646cff, #42b883);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: #888;
  margin-bottom: 2rem;
}

.create-room-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-room-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(100, 108, 255, 0.4);
  background: #7c82ff;
}

.id-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.id-form > * {
  margin-top: 2rem;
}
</style>