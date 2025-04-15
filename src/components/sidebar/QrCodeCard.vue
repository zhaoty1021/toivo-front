<template>
    <el-card class="box-card qr-code-card">
      <div class="front">
        <img
          style="width: 100%"
          v-lazy="overturnImg"
          :key="overturnImg"
          alt="二维码正面"
        />
      </div>
      <div class="back">
        <div style="width: 50%">
          <h2>扫一扫</h2>
          <span style="margin-left: 20px">体验小程序</span>
        </div>
        <img
          v-lazy="appletImg"
          :key="appletImg"
          alt="小程序二维码"
        />
      </div>
    </el-card>
  </template>
  
  <script setup>
  defineProps({
    overturnImg: {
      type: String,
      required: true
    },
    appletImg: {
      type: String,
      required: true
    }
  });
  </script>
  
  <style scoped>
  /* 保持原有样式 */
  .qr-code-card {
    perspective: 1000px;
    position: relative;
    height: 120px;
  }
  
  .front,
  .back {
    position: absolute;
    width: 100%;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    transition-duration: 0.5s;
    transition-timing-function: ease-in;
  }
  
  .back {
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
  }
  
  .back img {
    width: 120px;
    height: 120px;
  }
  
  .qr-code-card:hover .front {
    transform: rotateY(180deg);
  }
  
  .qr-code-card:hover .back {
    transform: rotateY(0deg);
  }
  </style>