<script setup>
  
// WebSocket 设置
const ws = new WebSocket('ws://localhost:8080/ws');
const connection = ref({})

ws.onopen = () => {
  console.log('WebSocket 已连接');
};

ws.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    console.log('收到消息:', message);

    if (message.type === 'sdpAnswer' || message.type === 'sdpOffer') {
      // 设置远程描述
      connection.value.setRemoteDescription(new RTCSessionDescription(message.data))
        .then(() => {
          console.log('远程 SDP 设置成功');
        })
        .catch((err) => {
          console.error('设置远程 SDP 失败:', err);
        });
    } else if (message.type === 'iceCandidate') {
      // 添加 ICE 候选者
      connection.value.addIceCandidate(new RTCIceCandidate(message.data))
        .then(() => {
          console.log('添加远程 ICE 候选者成功');
        })
        .catch((err) => {
          console.error('添加 ICE 候选者失败:', err);
        });
    }
  } catch (err) {
    console.error('解析 WebSocket 消息失败:', err);
  }
};

ws.onclose = () => {
  console.log('WebSocket 已断开');
};

const sendMessage = () => {
  if (ws.readyState === WebSocket.OPEN) {
    const localDescription = connection.value.localDescription
    ws.send(JSON.stringify({
      type: 'sdpOffer',
      data: {
        type: localDescription.type,
        sdp: localDescription.sdp
      }
    }))
  } else {
    alert('WebSocket 连接尚未建立，无法发送数据');
  }
}

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:turn.cloudflare.com:3478' }
  ]
}

onMounted(() => {
  connection.value = new RTCPeerConnection(configuration)
  connection.value.createDataChannel("dataChannel");
  connection.value.createOffer()
    .then(offer => connection.value.setLocalDescription(offer))
    .then(() => console.log('Local description set successfully.'))
    .catch(error => console.error('Error during offer creation or setting local description:', error))
})

connection.value.onicecandidate = event => {
  if (event.candidate) {
    // 将 ICE 候选者通过信令通道（如 WebSocket）发送给对方
    console.log('New ICE candidate:', event.candidate);
    ws.send(JSON.stringify({
      type: 'iceCandidate',
      candidate: event.candidate
    }));
  } else {
    // 所有 ICE 候选者已发送完毕
    console.log('All ICE candidates have been sent.');
  }
}

connection.value.oniceconnectionstatechange = () => {
  console.log('ICE connection state:', connection.value.iceConnectionState);
};


// iceCandidate >> Interactive Connectivity Establishment Candidate
</script>

<template>
  <div>
    
  </div>
</template>