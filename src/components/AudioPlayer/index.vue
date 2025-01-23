<template>
  <div class="audio-player">
    <div class="controls">
      <button class="play-btn" @click="togglePlay">
        <i :class="audioState.isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>
      <div class="progress-container" @click="seek">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="time">
        {{ formatTime(audioState.currentTime) }} / {{ formatTime(audioState.duration) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAudioPlayerStore } from '../../store/AudioState'
import { getCurrentInstance } from 'vue'

const props = defineProps({
  audioElement: {
    type: HTMLAudioElement,
    required: true
  }
})

const progress = ref(0)
const audioState = useAudioPlayerStore();
const instance = getCurrentInstance()

const togglePlay = () => {
  instance.appContext.config.globalProperties.$syncAudio({
    isPlaying: !audioState.isPlaying,
  })
}

const seek = (event) => {
  const container = event.currentTarget
  const clickPosition = event.offsetX / container.offsetWidth
  props.audioElement.currentTime = clickPosition * props.audioElement.duration
  instance.appContext.config.globalProperties.$syncAudio({
    currentTime: props.audioElement.currentTime,
    isPlaying: audioState.isPlaying,
    src: audioState.src,
  })
}

const formatTime = (time) => {
  if (!time) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  // 监听播放状态
  watch(() => audioState.isPlaying, () => {
    if (audioState.isPlaying) {
      props.audioElement.play()
    } else {
      props.audioElement.pause()
    }
  })
  watch(() => audioState.shouldPlayAfterLoad, () => {
    if (audioState.shouldPlayAfterLoad) {
      audioState.isPlaying = true
      audioState.setShouldPlayAfterLoad(false)
    }
  })
  // 监听音频元素的时间更新事件更新状态
  props.audioElement.addEventListener('timeupdate', updateProgress)
})

const updateProgress = () => {
  if (!props.audioElement) return
  audioState.updateTime(props.audioElement.currentTime)
  audioState.setDuration(props.audioElement.duration)
  progress.value = (audioState.currentTime / audioState.duration) * 100
}

onUnmounted(() => {
  props.audioElement.removeEventListener('timeupdate', updateProgress)
})

</script>

<style scoped>
.audio-player {
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: fixed;
  bottom: 0;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #646cff;
  border-radius: 3px;
  transition: width 0.1s linear;
}

.time {
  color: #fff;
  font-size: 0.9rem;
  min-width: 100px;
  text-align: right;
}
</style>