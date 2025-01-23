import { defineStore } from 'pinia'

interface AudioState {
  currentPlaying: string | null
  isPlaying: boolean
  src: string | null
  currentTime: number
  duration: number
  audioFiles: Array<{
    name: string
    url: string
  }>
  shouldPlayAfterLoad: boolean
}

export const useAudioPlayerStore = defineStore({
  id: 'audioState',

  state: (): AudioState => ({
    currentTime: 0,
    isPlaying: false,
    src: null,
    duration: 0,
    audioFiles: [],
    currentPlaying: null,
    shouldPlayAfterLoad: false
  }),

  actions: {
    updateTime(time: number) {
      this.currentTime = time
    },

    play() {
      this.isPlaying = true
    },

    pause() {
      this.isPlaying = false
    },

    setSrc(src: string) {
      this.src = src
    },

    setDuration(duration: number) {
      this.duration = duration
    },

    addAudioFile(file: { name: string, url: string }) {
      if (!this.audioFiles.some(f => f.name === file.name)) {
        this.audioFiles.push(file)
      }
    },

    setCurrentPlaying(name: string | null) {
      this.currentPlaying = name
    },

    setShouldPlayAfterLoad(shouldPlay: boolean) {
      this.shouldPlayAfterLoad = shouldPlay
    },

    syncState(audioState: { currentTime: number, isPlaying: boolean, src: string, shouldPlayAfterLoad: boolean, currentPlaying: string }) {
      audioState.currentTime !== undefined && (this.currentTime = audioState.currentTime)
      audioState.isPlaying !== undefined && (this.isPlaying = audioState.isPlaying)
      audioState.src !== undefined && (this.src = audioState.src)
      audioState.shouldPlayAfterLoad !== undefined && (this.shouldPlayAfterLoad = audioState.shouldPlayAfterLoad)
      audioState.currentPlaying !== undefined && (this.currentPlaying = audioState.currentPlaying)
    }
  },

  getters: {
    getCurrentAudioFile: (state) => {
      return state.audioFiles.find(file => file.name === state.currentPlaying)
    }
  }
})