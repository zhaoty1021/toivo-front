<template>
    <el-card class="box-card tag-wall">
      <div class="card-header">
        <SvgIcon name="announce" class="card-icon" />
        <span class="card-title">标签墙</span>
        <router-link to="/tags">
          <a class="more hand-style no-select">更多</a>
        </router-link>
      </div>
      <div class="tag-box">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="tag-item hand-style"
          :style="{
            backgroundColor: randomColor(),
            fontSize: tag.font,
          }"
          @click="handleTagClick(tag.id)"
        >
          {{ tag.name }}
        </span>
      </div>
    </el-card>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import SvgIcon from "@/components/SvgIcon.vue";
  
  const props = defineProps({
    tags: {
      type: Array,
      default: () => []
    }
  });
  
  const router = useRouter();
  
  const randomColor = () => {
    // 随机颜色生成逻辑
  };
  
  const handleTagClick = (id) => {
    router.push({
      path: '/tags',
      query: { id }
    });
  };
  </script>
  
  <style lang="scss">
  .tag-wall {
    font-size: 0.9rem;
    background-color: var(--background-color);
  
    &:hover {
      transition: all 0.3s;
    }
  
    .card-header {
      font-size: 16px;
      .card-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
      .more {
        float: right;
        margin-right: 10px;
        font-size: 13px;
        color: var(--text-color);
        text-decoration: none;
  
        &:hover {
          color: var(--theme-color);
        }
      }
    }
  
    .tag-box {
      padding-bottom: 10px;
      height: auto;
      margin-top: 10px;
  
      .tag-item {
        display: inline-block;
        margin: 5px;
        padding: 3px 8px;
        border-radius: 3px;
        color: white;
        cursor: pointer;
      }
    }
  }
  </style>