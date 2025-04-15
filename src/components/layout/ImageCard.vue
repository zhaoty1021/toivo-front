<template>
  <div class="container">
    <!-- 修复后的轮播图 -->
    <div class="carousel-container">
      <div class="carousel" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
        <div class="carousel-track" :style="trackStyle">
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="carousel-slide"
          >
            <div class="slide-image">
              <img :src="article.image" :alt="article.title" loading="lazy" />
            </div>
            <div class="slide-content">
              <h2>{{ article.title }}</h2>
              <p>{{ article.description }}</p>
              <button @click="navigateToArticle(article.id)">查看详情</button>
            </div>
          </div>
        </div>

        <!-- 导航按钮 -->
        <button 
          class="carousel-nav prev" 
          @click="prevSlide" 
          aria-label="Previous slide"
        >
          &#10094;
        </button>
        <button 
          class="carousel-nav next" 
          @click="nextSlide" 
          aria-label="Next slide"
        >
          &#10095;
        </button>

        <!-- 指示器 -->
        <div class="carousel-indicators">
          <button
            v-for="(_, index) in articles"
            :key="index"
            @click="goToSlide(index)"
            :class="{ active: currentIndex === index }"
          />
        </div>
      </div>
    </div>

    <!-- 分类按钮组 -->
    <div class="category-group" role="navigation">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="category-group-item"
      >
        <a 
          :href="category.link" 
          class="category-button" 
          :style="{ backgroundImage: category.gradient }"
        >
          <p class="category-button-title">{{ category.title }}</p>
          <p class="category-button-date">
            <time :datetime="category.updateTime">
              {{ formatRelativeTime(category.updateTime) }}
            </time>
          </p>
          <svg-icon 
            class="category-button-icon" 
            :name="category.icon"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentIndex = ref(0);
const autoPlayInterval = ref(null);
const autoPlayDelay = 5000;

// 计算轮播图位置
const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: 'transform 0.5s ease'
}));

// 轮播图数据
const articles = ref([
  {
    id: 1,
    title: '文章推荐',
    description: '这是一个文章推荐',
    image: 'https://c4.wallpaperflare.com/wallpaper/649/96/56/ankara-cityscape-night-night-sky-wallpaper-preview.jpg'
  },
  {
    id: 2,
    title: '文章推荐2',
    description: '这是第二个文章推荐',
    image: 'https://c4.wallpaperflare.com/wallpaper/620/34/558/turkey-izmir-mountains-wallpaper-preview.jpg'
  },
  {
    id: 3,
    title: '技术分享',
    description: '最新技术动态和开发技巧',
    image: 'https://c4.wallpaperflare.com/wallpaper/393/17/276/technology-code-coding-computer-wallpaper-preview.jpg'
  }
]);

// 自动轮播控制
const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    nextSlide();
  }, autoPlayDelay);
};

const pauseAutoPlay = () => {
  clearInterval(autoPlayInterval.value);
  autoPlayInterval.value = null;
};

const resumeAutoPlay = () => {
  if (!autoPlayInterval.value) {
    startAutoPlay();
  }
};

// 轮播导航
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % articles.value.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + articles.value.length) % articles.value.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

const navigateToArticle = (id) => {
  router.push(`/article/${id}`);
};

// 分类数据（保持不变）
const categories = ref([
  {
    id: 1,
    title: '萤的音乐小屋',
    updateTime: '2024-03-31T16:00:00.000Z',
    link: '/post/70a2ebe4.html',
    gradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    icon: 'music'
  },
  {
    id: 2,
    title: '技术网站分享',
    updateTime: '2024-08-30T16:00:00.000Z',
    link: '/post/22fd52ad.html',
    gradient: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    icon: 'tech'
  },
  {
    id: 3,
    title: '萤的游戏人生',
    updateTime: '2024-09-14T16:00:00.000Z',
    link: '/post/7c3a4efe.html',
    gradient: 'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
    icon: 'game'
  }
]);

// 时间格式化
const formatRelativeTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return `更新于 ${diffDays} 天前`;
};

// 生命周期钩子
onMounted(() => {
  startAutoPlay();
});

onBeforeUnmount(() => {
  pauseAutoPlay();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 0 15px;
  }
}

/* 修复后的轮播图样式 */
.carousel-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel {
  position: relative;
  width: 100%;
  height: 280px;
  
  @media (max-width: 768px) {
    height: 220px;
  }
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.slide-image {
  flex: 1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.slide-content {
  flex: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
  
  p {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  }
  
  button {
    padding: 8px 16px;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    align-self: flex-start;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
    }
  }
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  &.prev {
    left: 15px;
  }
  
  &.next {
    right: 15px;
  }
}

.carousel-indicators {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 2;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  
  &.active {
    background-color: white;
    transform: scale(1.2);
  }
  
  &:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.8);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-slide {
    flex-direction: column;
  }
  
  .slide-image {
    flex: none;
    height: 60%;
  }
  
  .slide-content {
    flex: none;
    height: 40%;
    padding: 1rem;
  }
}

/* 分类按钮组样式（保持不变） */
.category-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 200px;
  height: 120px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
}

.category-group-item {
  flex: 1;
  margin: 0 5px;
  
  @media (max-width: 768px) {
    margin: 5px 0;
    height: 100px;
  }
  
  @media screen and (min-width: 900px) {
    width: calc(100% / 3 - 0.5rem);
    height: 100%;
  }
}

a.category-button {
  height: 100%;
  width: 100%;
  border-radius: 12px;
  display: inline-block;
  font-weight: 700;
  color: var(--text-color);
  transition: all 0.4s cubic-bezier(0.39, 0.575, 0.565, 1);
  transform: scale(1);
  overflow: hidden;
  border: 1.5px solid var(--border-line);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
}

a.category-button:after {
  top: 50px;
  width: 50%;
  left: 25px;
  height: 2px;
  background: var(--text-color);
  content: "";
  border-radius: 1px;
  position: absolute;
}

.category-button-title {
  margin-top: 20px;
  padding-left: 25px;
  line-height: 1.5;
  font-size: 1.2rem;
}

.category-button-date {
  margin-top: 10px;
  padding-left: 25px;
  line-height: 1.5;
  font-size: 0.8rem;
}

a.category-button .category-button-icon {
  font-size: 3rem;
  opacity: 1;
  position: absolute;
  right: 0;
  top: 25%;
  transition: 0.3s;
  width: 100px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

a.category-button .category-button-icon:hover {
  transform: scale(1.4);
}
</style>