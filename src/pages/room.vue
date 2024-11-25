<script setup>
import RoomHeader from '../components/RoomHeader/RoomHeader.vue';
import RoomFooter from '../components/RoomFooter/RoomFooter.vue';

</script>

<template>
  <div class="container">
    <RoomHeader />
    <div id="body">
      <div>
        <input type="file" id="fileInput" />
        <button id="sendFileButton">Send File</button>
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
}
</style>