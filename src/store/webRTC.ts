import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useWebRTCStore = defineStore('webRTC', () => {
  const webRTC = ref<RTCPeerConnection | null>(null)

  // const getPeerConnection = computed((): RTCPeerConnection => {
  //   if (!webRTC.value) {
  //     webRTC.value = new RTCPeerConnection()
  //   }
  //   return webRTC.value!
  // })

  function initIfNull() {
    if (!webRTC.value) {
      webRTC.value = new RTCPeerConnection()
    }
  }

  function setLocalDescription(desc: RTCSessionDescriptionInit) {
    if (webRTC.value) {
      webRTC.value.setLocalDescription(desc)
        .then(() => {
          console.log('set local description successfully')
        })
        .catch((err) => {
          console.log('error setting local description', err)
        })
    }
  }

  return ({
    webRTC,
    initIfNull,
    setLocalDescription
  })
},{
  persist: true
})