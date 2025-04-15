<template>
    <div class="say-box box-shadow">
      <router-link to="/say">
        <a
          class="say-item"
          @mouseleave="$emit('mouseleave')"
          @mouseenter="$emit('mouseenter')"
          v-for="(item, index) in sayList"
          :key="index"
          v-show="index == currentIndex"
        >
          <svg-icon name="say"></svg-icon>
          <span class="say-content" v-html="item.content"></span>
        </a>
      </router-link>
    </div>
  </template>
  
  <script setup>
  defineProps({
    sayList: Array,
    currentIndex: Number
  });
  
  defineEmits(['mouseleave', 'mouseenter']);
  </script>
  
  <style lang="scss"  scoped>
  .say-box {
    background-color: var(--background-color);
    width: 100%;
    margin-bottom: 15px;
    border-radius: 5px;
    overflow: hidden;
  
    a {
      text-decoration: none;
    }
  
    .say-item {
      display: flex;
      padding: 10px;
      color: var(--article-color);
      animation: fade-in 0.45s linear 1;
      align-items: center;
  
      .say-content {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
  
      svg {
        margin-right: 15px;
        width: 22px;
        height: 22px;
        vertical-align: -5px;
        animation: show 1s ease-in-out infinite alternate;
      }
    }
  }
  
  @keyframes fade-in {
    0% {
      transform: translateY(-30px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @keyframes show {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
  </style>