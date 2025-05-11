<template>
    <el-card class="site-info-card" :class="theme">
      <div class="card-header">
        
        <span class="card-title">
            <svg-icon name="dashboard" class="card-icon" />
            网站资讯
        </span>
        <el-tooltip content="刷新数据" placement="top">
          <el-icon class="refresh" @click="refreshData">
            <SvgIcon name="refresh" />
          </el-icon>
        </el-tooltip>
      </div>
  
      <div class="info-content">
        <div v-if="loading" class="loading">
          <SvgIcon name="loading" class="spin-icon" />
          <span>数据加载中...</span>
        </div>
        <div v-else-if="stats" class="info-list">
          <div class="info-line">
            <span class="label">文章数目：</span>
            <span class="value">{{ stats.articleCount }}</span>
          </div>
          <div class="info-line">
            <span class="label">已运行时间：</span>
            <span class="value">{{ stats.uptime }}</span>
          </div>
          <div class="info-line">
            <span class="label">本站总字数：</span>
            <span class="value">{{ stats.wordCount }}</span>
          </div>
          <div class="info-line">
            <span class="label">本站访客数：</span>
            <span class="value">{{ stats.visitorCount }}</span>
          </div>
          <div class="info-line">
            <span class="label">本站总访问量：</span>
            <span class="value">{{ stats.totalViews }}</span>
          </div>
          <div class="info-line">
            <span class="label">最后更新时间：</span>
            <span class="value">{{ stats.lastUpdated }}</span>
          </div>
        </div>
        <div v-else class="error-message">
          <SvgIcon name="error" class="error-icon" />
          <span>{{ errorMessage || '数据加载失败' }}</span>
          <el-button class="retry-btn" @click="refreshData">重试</el-button>
        </div>
      </div>
  
      <div class="tech-border"></div>
    </el-card>
  </template>
  
  <script setup>
  import { inject, ref, onMounted } from 'vue';
  import SvgIcon from "@/components/SvgIcon.vue";
  
  const theme = inject('theme', 'dark');
  const loading = ref(true);
  const stats = ref(null);
  const errorMessage = ref('');
  
  // 模拟数据获取
  const fetchStats = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          articleCount: '1,258',
          uptime: '328天',
          wordCount: '1,024,568',
          visitorCount: '8,742',
          totalViews: '128,956',
          lastUpdated: '2023-11-15'
        });
      }, 800);
    });
  };
  
  const refreshData = async () => {
    try {
      loading.value = true;
      errorMessage.value = '';
      stats.value = await fetchStats();
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    refreshData();
  });
  </script>
  
  <style lang="scss" scoped>
  .site-info-card {
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
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-bottom: 20px;
    width: 100%;
  
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--glow-effect);
    }
  
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
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
      position: relative;
  
      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        display: flex;
        align-items: center;
  
        .card-icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          color: var(--primary-color);
          filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.5));
        }
      }
  
      .refresh {
        cursor: pointer;
        color: var(--text-color);
        transition: all 0.3s;
        width: 20px;
        height: 20px;
  
        &:hover {
          color: var(--primary-color);
          transform: rotate(180deg);
        }
      }
    }
  
    .info-content {
      padding: 20px;
      min-height: 220px;
      display: flex;
      flex-direction: column;
  
      .loading {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
  
        .spin-icon {
          width: 28px;
          height: 28px;
          animation: spin 1s linear infinite;
          color: var(--primary-color);
        }
  
        span {
          color: var(--text-color);
          font-size: 14px;
        }
      }
  
      .error-message {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
  
        .error-icon {
          width: 36px;
          height: 36px;
          color: #ff4d4f;
        }
  
        span {
          color: var(--text-color);
          font-size: 14px;
        }
  
        .retry-btn {
          margin-top: 12px;
          padding: 6px 16px;
          background: var(--hover-bg);
          color: var(--primary-color);
          border-color: var(--primary-color);
          font-weight: 500;
          transition: all 0.3s;
  
          &:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
          }
        }
      }
  
      .info-list {
        .info-line {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(0, 240, 255, 0.2);
          font-size: 14px;
          line-height: 1.5;
  
          &:last-child {
            border-bottom: none;
          }
  
          .label {
            color: var(--text-color);
            opacity: 0.8;
            min-width: 100px;
          }
  
          .value {
            color: var(--text-color);
            font-weight: 500;
          }
        }
      }
    }
  
    .tech-border {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), transparent);
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  </style>