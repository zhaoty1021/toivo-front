<template>
    <el-card 
      class="recommended-articles"
      :class="theme"
    >
      <div class="card-header">
        
        <span class="card-title">
            <svg-icon name="recommend" class="card-icon" />
            推荐文章
        </span>
        <router-link to="/articles">
          <a class="more hand-style no-select">
            更多 <el-icon><ArrowRight /></el-icon>
          </a>
        </router-link>
      </div>
  
      <div class="compact-article-list">
        <div
          v-for="article in articles"
          :key="article.id"
          class="compact-article-item"
          @click="handleArticleClick(article.id)"
        >
          <div class="article-cover">
            <img v-lazy="article.cover" :alt="article.title" />
          </div>
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <div class="article-meta">
              <span class="views">
                <el-icon><View /></el-icon>
                {{ article.views }}
              </span>
              <span class="date">{{ article.date }}</span>
            </div>
          </div>
          
        </div>
      </div>
      
      <div class="tech-border-bottom"></div>
    </el-card>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { inject } from 'vue';
  import { ArrowRight, View } from '@element-plus/icons-vue';
  import SvgIcon from "@/components/SvgIcon.vue";
  
  const props = defineProps({
    articles: {
      type: Array,
      default: () => [
        { 
          id: 1, 
          title: 'Vue3组合式API深度解析', 
          views: 1250, 
          date: '2024-05-15',
          cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png' 
        },
        { 
          id: 2, 
          title: 'React 18新特性指南', 
          views: 980, 
          date: '06-22',
          cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png' 
        },
        { 
          id: 3, 
          title: 'TS类型体操技巧', 
          views: 876, 
          date: '07-10',
          cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png' 
        },
        { 
          id: 4, 
          title: 'Webpack优化实战', 
          views: 654, 
          date: '08-05',
          cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png' 
        },
        { 
          id: 5, 
          title: 'Docker部署实践', 
          views: 432, 
          date: '09-18',
          cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png' 
        }
      ]
    }
  });
  
  const theme = inject('theme', 'dark');
  const router = useRouter();
  
  const handleArticleClick = (id) => {
    router.push(`/article/${id}`);
  };
  </script>
  
  
  <style lang="scss" scoped>
  .recommended-articles {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --card-bg: #0a0a12;
    --hover-bg: rgba(0, 240, 255, 0.1);
    --glow-effect: 0 0 15px rgba(0, 240, 255, 0.3);
  
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  
    &.light {
      --primary-color: #0066cc;
      --secondary-color: #cc00ff;
      --accent-color: #00aa66;
      --bg-color: #f0f2f5;
      --text-color: #333344;
      --border-color: rgba(0, 102, 204, 0.3);
      --card-bg: rgba(255, 255, 255, 0.95);
      --hover-bg: rgba(0, 102, 204, 0.1);
      --glow-effect: 0 0 15px rgba(0, 102, 204, 0.2);
    }
  
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
  
      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-color);
        display: flex;
        align-items: center;
        
  
        .card-icon {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            color: var(--primary-color);
        }
      }
  
      .more {
        font-size: 12px;
        color: var(--text-color);
        opacity: 0.7;
        text-decoration: none;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 4px;
  
        &:hover {
          opacity: 1;
          color: var(--primary-color);
          transform: translateX(3px);
        }
  
        .el-icon {
          transition: transform 0.3s ease;
        }
  
        &:hover .el-icon {
          transform: translateX(2px);
        }
      }
    }
  
    .compact-article-list {
    padding: 0 12px 12px;
    
    .compact-article-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: var(--hover-bg);
        transform: translateX(3px);
        
        .article-title {
          color: var(--primary-color);
        }
        
        .article-rank {
          color: var(--primary-color);
          font-weight: bold;
        }
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .article-cover {
        width: 60px;
        height: 40px;
        flex-shrink: 0;
        margin-right: 12px;
        border-radius: 4px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.1);
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
      }
      
      .article-content {
        flex: 1;
        min-width: 0;
        
        .article-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-color);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }
        
        .article-meta {
          display: flex;
          align-items: center;
          margin-top: 4px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          
          .el-icon {
            margin-right: 4px;
            font-size: 12px;
          }
          
          .date {
            margin-left: 12px;
          }
        }
      }
      
      .article-rank {
        width: 24px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.2s ease;
      }
    }
  }
  
  .tech-border-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color), transparent);
  }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .recommended-articles .article-container .article-card {
      width: 100%; // 移动端单列布局
    }
  }
  /* 浅色主题适配 */
.recommended-articles.light {
  .compact-article-list .compact-article-item {
    border-bottom-color: rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: var(--hover-bg);
    }
    
    .article-content {
      .article-meta {
        color: rgba(0, 0, 0, 0.6);
      }
    }
    
    .article-rank {
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
  </style>