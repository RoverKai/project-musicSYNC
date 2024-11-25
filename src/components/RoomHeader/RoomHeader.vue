<script setup>
import { useRoomStatusStore } from '../../store/roomStatus';

const roomStatusStore = useRoomStatusStore()

window.onresize = () => {
  console.log(window.innerWidth)
}
</script>

<template>
  <div id="container">
    <p id="roomId">房间号:{{ roomStatusStore.id }}</p>
    <h1>
      musicSYNC
    </h1>
    <div>
      <button>
        退出
      </button>
    </div>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 10%;
  padding: 0px 10px 0px 10px;
}

#container>* {
  flex-basis: 300px;
  text-align: center;
}
</style>