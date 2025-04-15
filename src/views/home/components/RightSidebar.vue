<template>
    <div class="right-box">
      
      <RecommendedArticles :articles="newArticleList" />
      <FollowMe :webInfo="webInfo" />
      <TagWall :tags="tagList" />
      <WeatherWidget />
      <Announcement/>
    </div>
  </template>
  
  <script setup>
  import QrCodeCard from '@/components/sidebar/QrCodeCard.vue';
  import RecommendedArticles from '@/components/sidebar/RecommendedArticles.vue';
  import FollowMe from '@/components/sidebar/FollowMe.vue';
  import TagWall from '@/components/sidebar/TagWall.vue';
  import WeatherWidget from '@/components/sidebar/WeatherWidget.vue';
  import Announcement from '@/components/sidebar/Announcement.vue';
  
  defineProps({
    newArticleList: Array,
    tagList: Array,
    webInfo: Object
  });
  </script>
  
  <style lang="scss" scoped>
  .right-box {
    width: 30%;
    margin-left: 20px;
  
    @media screen and (max-width: 1118px) {
      display: none;
    }
  
    .box-card {
      font-size: 16px;
      padding: 12px;
      background-color: var(--background-color);
      color: var(--article-color);
      margin-bottom: 15px;
      
      border-radius: 10px;
      border: 2px solid var(--card-border);
    }
  }
  </style>