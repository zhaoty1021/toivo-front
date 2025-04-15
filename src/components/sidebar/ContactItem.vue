<template>
    <div :class="['contact-item', type]">
      <svg-icon :name="type" />
      <a v-if="link" class="contact-value" :href="link" target="_blank">
        {{ value }}
      </a>
      <span v-else class="contact-value">
        {{ value }}
      </span>
      <span class="copy-btn" @click="$emit('copy', value)">
        {{ label }}
      </span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: ''
    }
  });
  
  defineEmits(['copy']);
  </script>
  
  <style lang="scss">
  .contact-item {
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    display: flex;
    position: relative;
    border-radius: 3px;
    border: 1px solid #333;
  
    svg {
      width: 20px;
      height: 20px;
      margin-left: 5px;
      position: relative;
      bottom: -10px;
      margin-right: 10px;
    }
  
    .contact-value {
      text-decoration: none;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      flex: 1;
  
      &:hover {
        color: var(--theme-color);
      }
    }
  
    .copy-btn {
      position: absolute;
      right: 0;
      width: 60px;
      text-align: center;
      color: #fff;
      transition: width 0.35s;
  
      &:hover {
        width: 80px;
      }
    }
  
    &.qq {
      border-color: #409eff;
  
      .copy-btn {
        background-color: #409eff;
      }
    }
  
    /* 其他类型样式 */
  }
  </style>