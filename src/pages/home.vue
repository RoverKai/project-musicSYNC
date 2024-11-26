<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useWebSocketStore } from '../store/webSocket';

const inviteBtnContent = ref('');

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(roomStatusStore.roomId)
    inviteBtnContent.value = 'copied!';
  } catch {
    alert('复制失败，请检查权限或浏览器兼容性')
  }
  setTimeout(() => {
    inviteBtnContent.value = '邀请好朋友一起听歌吧';
  }, 3000);
};

const resourceText = ref('这里输入好朋友的链接|')
const visitLinkPlaceholder = ref('')

// dynamic placeholder
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

// get | init websocket
const wsStore = useWebSocketStore()
if ( !wsStore.websocket || wsStore.websocket.readyState !== WebSocket.OPEN ) {
  wsStore.createWebSocket('ws://192.168.1.192:8080/ws')
}
const ws = wsStore.websocket

// 连接成功时
ws.onopen = () => {
  console.log("Connected to WebSocket server.");
  createRoom()
};

// 收到消息时
import { useRoomStatusStore } from '../store/roomStatus';
import { useRouter } from 'vue-router';

const roomStatusStore = useRoomStatusStore()
const router = useRouter()

ws.onmessage = (event) => {
  console.log(event.data)
  if (event.data.toString().substring(0, 7) == 'roomId:') {
    roomStatusStore.setRoomId(event.data.toString().substring(7))
    inviteBtnContent.value = '邀请好朋友一起听歌！'
  }
  if (event.data.toString().substring(0, 19) == 'already join room: ') {
    roomStatusStore.setRoomId(event.data.toString().substring(19))
    router.push('/room')
  }
  if (event.data.toString().indexOf('new Roommate joined') !== -1) {
    router.push('/room')
  }
};

// 创建房间
function createRoom() {
  ws.send(`create:${Math.random().toString().substring(15) + Date.now().toString(36)}`);
}

// setInterval(() => {
//   console.log(roomStatusStore.roomId)
//   if (!roomStatusStore.roomId && ws.readyState === WebSocket.OPEN) {
//     createRoom()
//   }
// }, 3000)

const targetRoomId = ref('')
// 加入房间
function joinRoom() {
  if (targetRoomId.value == roomStatusStore.roomId) {
    alert('我在哪儿☝️🤓')
    return
  }
  ws.send(`join:${targetRoomId.value}`)
}



</script>

<template>
  <div id="container">
    <!-- <button @click="sendMessage">发起请求</button> -->
    <div>
      <input type="text" :placeholder="visitLinkPlaceholder" class="visitLink" v-model="targetRoomId">
      <button id="visitBtn" @click="joinRoom">加入</button>
    </div>
    <p class="logo vue">project musicSYNC</p>
    <!-- <audio controls>
      <source
        src="C:\Users\hahalolo\Downloads\obj_wo3DlMOGwrbDjj7DisKw_4313853605_eef3_4447_83bc_bfdfa6c61ef5ae46b7d6d6fd7ba3f0ff.mp3"
        type="audio/mpeg">
      您的浏览器不支持 audio 标签。
    </audio> -->
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

#container {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
