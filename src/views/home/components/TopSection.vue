<template>
    <div class="main-box">
      <div class="banner-box" @wheel="$emit('wheel', $event)">
        <div class="banner">
          <ImageCard />
        </div>
      </div>
      <div class="top-right">
        <SiteInfo />
      </div>
    </div>
  </template>
  
  <script setup>
  import ImageCard from '@/components/layout/ImageCard.vue';
  import SiteInfo from '@/components/authorInfo/index.vue';
  
  defineProps({
    bannerList: Array
  });
  
  defineEmits(['wheel']);
  </script>
  
  <style lang="scss" scoped>
  .main-box {
    width: 100%;
    display: flex;
    margin-top: 20px;
  
    .banner-box {
        height: 350px;
        width: 100%;
  
      @media screen and (max-width: 1118px) {
        width: 100%;
      }
  
      .banner {
        height: 350px;
        border-radius: 5px;
  
        &::before {
          content: "";
          position: absolute;
          top: 95px;
          left: 0;
          width: 100%;
          height: 200px;
          z-index: 2;
        }
      }
    }
  
    .top-right {
        display: inline-block;
        width: 30%;
        height: 420px;
        margin-left: 20px;

        .soft {
          margin-top: 20px;
          background-color: #007aff;
          overflow: hidden;
          height: 125px;
          position: relative;

          &:hover .overlay {
            opacity: 0;
          }

          .overlay {
            background: rgba(0, 0, 0, 0.3);
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            opacity: 1;
            width: 100%;
            height: 100%;
            transition: all 0.5s;
          }

          a {
            display: inline-block;
            width: 100%;
            text-decoration: none;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }

            .soft-title,
            .soft-info {
              display: block;
              padding: 5px;
              text-align: center;
              background: rgba(0, 0, 0, 0.7);
              color: #fff;
            }

            .soft-title {
              position: absolute;
              bottom: 0;
              width: 100%;
            }

            .soft-info {
              position: absolute;
              top: 5px;
              left: 5px;
              font-size: 0.8rem;
            }
          }
        }

        ::v-deep(.el-image) {
          width: 100%;
          height: 47%;

          &:last-child {
            margin-top: 20px;
          }
        }

        ::v-deep(.wh_content_all) {
          background-color: var(--theme-color);
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
    }
    
  }
  </style>