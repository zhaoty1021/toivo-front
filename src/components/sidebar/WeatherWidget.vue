<template>
    <el-card class="box-card weather-widget">
      <div class="card-header">
        <span class="card-title">今日天气</span>
      </div>
      <div id="he-plugin-standard"></div>
    </el-card>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  
  onMounted(() => {
    window.WIDGET = {
      CONFIG: {
        layout: "2",
        width: 230,
        height: 270,
        background: "2",
        dataColor: "000000",
        borderRadius: "5",
        key: "632bf35b75f643fda4f7154697df9f47",
      },
    };
    const script = document.createElement("script");
    script.src =
      "https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0";
    document.body.appendChild(script);
  });
  </script>
  
  <style lang="scss">
  .weather-widget {
    ::v-deep(#he-plugin-standard) {
      width: 100% !important;
      background-color: var(--background-color) !important;
  
      span,
      a {
        color: var(--text-color) !important;
      }
    }
  }
  </style>