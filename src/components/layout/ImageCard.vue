<template>
    <div class="container">
        <!-- 使用 Naive UI 的轮播组件 -->
        <n-carousel
            class="carousel-container"
            v-model:current="currentIndex"
            :show-dots="true"
            :show-arrow="true"
            :autoplay="true"
            :interval="autoPlayDelay"
            @mouseenter="pauseAutoPlay"
            @mouseleave="resumeAutoPlay"
            trigger="hover"
            dot-type="line"
        >
            <n-carousel-item
                v-for="article in articles"
                :key="article.id"
                class="carousel-item"
            >
                <!-- 使用 router-link 替代 div 和 a 标签，以确保路由导航正常工作 -->
                <router-link
                    :to="`/article?id=${article.id}`"
                    class="slide-link"
                >
                    <div class="slide-image">
                        <img
                            :src="article.image"
                            :alt="article.title"
                            loading="lazy"
                        />
                    </div>
                </router-link>
                <div class="slide-content">
                    <router-link
                        :to="`/article?id=${article.id}`"
                        class="handlestyle"
                    >
                        <h2>{{ article.title }}</h2>
                    </router-link>
                    <p>{{ article.description }}</p>
                    <n-button
                        type="primary"
                        size="small"
                        @click.stop="navigateToArticle(article.id)"
                        ghost="true"
                        strong="true"
                    >
                        查看详情
                    </n-button>
                </div>
            </n-carousel-item>
        </n-carousel>

        <!-- 分类按钮组 -->
        <div class="category-group" role="navigation">
            <div
                v-for="category in categories"
                :key="category.id"
                class="category-group-item"
            >
                <!-- 使用 router-link 替代 a 标签 -->
                <router-link
                    :to="category.link"
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
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NCarouselItem, NButton } from 'naive-ui'

const router = useRouter()
const currentIndex = ref(0)
const autoPlayInterval = ref(null)
const autoPlayDelay = 5000

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
])

const navigateToArticle = (id) => {
    router.push(`/article?id=${id}`)
}

const pauseAutoPlay = () => {
    // 可以通过控制 :autoplay 属性来实现暂停
}

const resumeAutoPlay = () => {
    // 可以通过控制 :autoplay 属性来恢复播放
}

// 分类数据
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
])

// 时间格式化
const formatRelativeTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    return `更新于 ${diffDays} 天前`
}

// 生命周期钩子
onMounted(() => {
    // Naive UI 的轮播组件自带自动播放功能
})

onBeforeUnmount(() => {
    // 清理工作
})
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 120%;

    @media (max-width: 768px) {
        gap: 0.75rem;
        padding: 0 15px;
    }
}

.carousel-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative; // 确保定位正确

    // 确保轮播项可点击
    :deep(.n-carousel__slide) {
        pointer-events: auto;
    }

    // 确保导航按钮可点击
    :deep(.n-carousel__arrow) {
        z-index: 10;
        pointer-events: auto;
    }

    // 确保导航点可点击
    :deep(.n-carousel__dots) {
        z-index: 10;
        pointer-events: auto;
    }
}

.carousel-item {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
}

// 轮播图链接样式
.slide-link {
    flex: 1;
    height: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
}

.slide-image {
    flex: 1;
    height: 100%;
    display: flex;
    position: relative;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }
}

.slide-content {
    flex: 1;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;

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
}

/* 响应式设计 */
@media (max-width: 768px) {
    .carousel-slide {
        flex-direction: column;
    }

    .slide-link {
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

/* 分类按钮组样式 */
.category-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-width: 200px;
    height: 180px;
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

.category-button {
    height: 100%;
    width: 100%;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-weight: 700;
    color: var(--text-color);
    transition: all 0.4s cubic-bezier(0.39, 0.575, 0.565, 1);
    transform: scale(1);
    overflow: hidden;
    border: 1.5px solid var(--border-line);
    position: relative;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    &:after {
        top: 50px;
        width: 50%;
        left: 25px;
        height: 2px;
        background: var(--text-color);
        content: '';
        border-radius: 1px;
        position: absolute;
    }
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

.category-button .category-button-icon {
    font-size: 3rem;
    opacity: 1;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.3s;
    width: 60px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 2.5rem;
        right: 10px;
    }
}

.category-button:hover .category-button-icon {
    transform: translateY(-50%) scale(1.2);
}

// 确保所有链接都有足够的点击区域
a,
.slide-link {
    position: relative;
    z-index: 1;
}

// 处理 Naive UI 组件的点击穿透问题
:deep(.n-carousel__slide) {
    pointer-events: auto;
}

:deep(.n-carousel__dots) {
    z-index: 10;
}
</style>