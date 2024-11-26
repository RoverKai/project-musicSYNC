<script setup>
import RoomHeader from '../components/RoomHeader/RoomHeader.vue';
import RoomFooter from '../components/RoomFooter/RoomFooter.vue';
import { useWebRTCStore } from '../store/webRTC';

// 初始化RTC
const webRTCStore = useWebRTCStore()
webRTCStore.initIfNull()
const webRTC = webRTCStore.webRTC
console.log(webRTC.value)


</script>

<template>
  <div class="container">
    <RoomHeader />
    <div id="body">
      <div class="fileTranslator">
        <input type="file" id="fileInput" multiple />
        <button id="sendFileButton" >发送文件</button>
      </div>
    </div>
    <RoomFooter />
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fileTranslator {
  margin-top: 10%;
  display: flex;
  flex-direction: column;
}
</style>