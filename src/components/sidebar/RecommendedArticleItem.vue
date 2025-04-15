<template>
    <div :class="index == 0 ? 'article-item-top1' : 'article-item'" @click="$emit('click')">
      <div class="recom-cover">
        <router-link :to="articleLink">
          <div class="img-box">
            <span>{{ index + 1 }}</span>
            <img
              class="hand-style"
              v-lazy="article.avatar"
              :key="article.avatar"
            />
          </div>
        </router-link>
      </div>
      <p class="info">
        <router-link
          class="article-title hand-style"
          :to="articleLink"
        >
          {{ article.title }}
        </router-link>
        <span class="time">{{ article.createTime }}</span>
      </p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    article: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  });
  
  const articleLink = computed(() => `/article/${props.article.id}`);
  </script>
  
  <style lang="scss">
  .article-item-top1 {
    position: relative;
  
    .recom-cover {
      width: 100%;
  
      .img-box {
        width: 100%;
        height: 150px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid var(--border-line);
        position: relative;
  
        span {
          position: absolute;
          display: inline-block;
          width: 30px;
          border-radius: 2px 8px 8px 2px;
          text-align: right;
          padding-right: 5px;
          font-weight: 700;
          color: #fff;
          margin-top: 5px;
          z-index: 50;
          background-color: #f56c6c;
        }
  
        img {
          width: 100%;
          height: 100%;
          transition: all 0.5s;
        }
  
        &:hover img {
          transform: scale(1.1);
        }
      }
    }
  
    .info {
      .article-title {
        text-align: center;
        width: 100%;
        position: absolute;
        bottom: 30px;
        text-decoration: none;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        background: rgba(0, 0, 0, 0.3);
        padding: 5px 0;
  
        &:hover {
          color: var(--theme-color);
        }
      }
  
      .time {
        display: none;
      }
    }
  }
  
  .article-item {
    height: 100%;
    display: flex;
  
    .recom-cover {
      .img-box {
        width: 120px;
        height: 75px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid var(--border-line);
        position: relative;
  
        span {
          position: absolute;
          display: inline-block;
          width: 30px;
          border-radius: 2px 8px 8px 2px;
          text-align: right;
          padding-right: 5px;
          font-weight: 700;
          color: #fff;
          margin-top: 5px;
          z-index: 50;
          background-color: #818b95;
        }
  
        img {
          width: 100%;
          height: 100%;
          transition: all 0.5s;
        }
  
        &:hover img {
          transform: scale(1.1);
        }
      }
    }
  
    .info {
      display: flex;
      flex-direction: column;
  
      .article-title {
        text-decoration: none;
        color: var(--article-color);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        height: 50%;
  
        &:hover {
          color: var(--theme-color);
        }
      }
  
      .time {
        font-size: 0.8rem;
        color: var(--text-color);
        margin-top: 10px;
      }
    }
  }
  </style>