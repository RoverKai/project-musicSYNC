<script setup>
import { ref, onMounted, computed } from 'vue';
const inviteBtnContent = ref('邀请好朋友一起听歌吧')

const copyLink = () => {
  inviteBtnContent.value = 'copied!'
  setTimeout(() => {
    inviteBtnContent.value = '邀请好朋友一起听歌吧'
  }, 3000);
}


const resourceText = ref('这里输入好朋友的链接|')
const visitLinkPlaceholder = ref('')

onMounted(() => {
  const index = ref(0)
  const lastIndex = ref(0)
  const isPositive = computed(() => index.value - lastIndex.value > 0);

  const isEdgeOfRange = index => {
    return index == resourceText.value.length || index == 0
  }

  setInterval(() => {
    if (isEdgeOfRange(index.value) && isPositive.value) {
      index.value--
    } else if (isEdgeOfRange(index.value) && !isPositive.value) {
      index.value++
    } else if (isPositive.value) {
      index.value++
    } else {
      index.value--
    }
    visitLinkPlaceholder.value = resourceText.value.slice(0, index.value)
    lastIndex.value = index.value - 1
  }, 500)
})


// ______________________________________________________________________________________________
const ws = new WebSocket('ws://localhost:8080/ws')

ws.onopen = () => {
  console.log('websocket 已连接')
}

ws.onmessage = (event) => {
  console.log(event)
};

ws.onclose = () => {
  console.log("WebSocket 已断开");
};

function sendMessage() {
  if ( ws.readyState === WebSocket.OPEN ) {
    webRTC()
  } else {
    alert('WebSocket 连接尚未建立，无法发送数据')
  }
}



const webRTC = () => {
  const peerConnection = new RTCPeerConnection()
  const audioElement = document.querySelector('audio') // A 本地播放器

  // 创建 WebRTC 音频轨道
  const stream = audioElement.captureStream();
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

  // 监听信令通道，交换 WebRTC SDP
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(JSON.stringify({ type: 'iceCandidate', data: event.candidate })); // 通过 WebSocket 发送候选者
    }
  };

  // 创建 SDP offer
  peerConnection.createOffer().then((offer) => {
    peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify({ type:' sdpOffer', data: offer })); // 通过 WebSocket 发送 SDP
  });
}


</script>

<template>
  <div>
    <button @click="sendMessage">发送消息</button>
    <input type="text" :placeholder="visitLinkPlaceholder" class="visitLink">
    <button id="visitBtn">加入</button>
    <p class="logo vue">project musicSYNC</p>
    <audio></audio>
    <button id="inviteBtn" @click="copyLink">{{ inviteBtnContent }}</button>
  </div>
</template>

<style scoped>
#visitBtn {
  border-radius: 0px 8px 8px 0px;
}

.visitLink {
  background-color: #e3e3e3d4;
  border-radius: 8px 0px 0px 8px;
}

#inviteBtn {
  width: 13rem;
}

.logo {
  font-size: 64px;
  height: 3em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
