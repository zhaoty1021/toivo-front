<template>
    <el-card class="box-card recommended-articles">
      <div class="card-header">
        <SvgIcon name="recommend" class="card-icon" />
        <span class="card-title">推荐文章</span>
      </div>
      <ul class="article-list">
        <li v-for="(article, index) in articles" :key="article.id">
          <RecommendedArticleItem 
            :article="article" 
            :index="index" 
            @click="handleArticleClick(article.id)"
          />
        </li>
      </ul>
    </el-card>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import SvgIcon from "@/components/SvgIcon.vue";
  import RecommendedArticleItem from './RecommendedArticleItem.vue';
  
  const props = defineProps({
    articles: {
      type: Array,
      default: () => []
    }
  });
  
  const router = useRouter();
  
  const handleArticleClick = (id) => {
    router.push(`/article/${id}`);
  };
  </script>
  
  <style lang="scss">
  .recommended-articles {
    color: var(--article-color);
  
    .card-header {
      position: relative;
      margin-bottom: 20px;
  
      .card-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
  
      &::before {
        content: "";
        width: 25px;
        border: 2px solid #333;
        position: absolute;
        bottom: -10px;
        transition: width 0.5s;
      }
    }
  
    &:hover {
      .card-header::before {
        content: "";
        width: 70px;
      }
    }
  
    .article-list {
      display: flex;
      padding: 10px;
      list-style: none;
      flex-wrap: wrap;
  
      li {
        width: 100%;
        margin-bottom: 20px;
  
        &:last-child {
          margin-bottom: 10px;
        }
      }
    }
  }
  </style>