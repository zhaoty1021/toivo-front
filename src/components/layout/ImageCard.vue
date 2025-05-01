<template>
    <div class="container" :class="theme">
        <!-- 轮播图容器 -->
        <div class="carousel-wrapper">
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
                effect="slide"
                slides-per-view="auto"
                :space-between="0"
            >
                <n-carousel-item
                    v-for="(article, index) in articles"
                    :key="article.id"
                    class="carousel-item"
                    :data-index="index"
                >
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
                            <div class="image-overlay"></div>
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
                            class="detail-btn"
                        >
                            查看详情
                            <span class="btn-arrow">→</span>
                        </n-button>
                    </div>
                </n-carousel-item>
            </n-carousel>
        </div>

        <!-- 分类按钮组 -->
        <div class="category-group" role="navigation">
            <div
                v-for="category in categories"
                :key="category.id"
                class="category-group-item"
            >
                <router-link
                    :to="category.link"
                    class="category-button"
                    :style="{ backgroundImage: category.gradient }"
                >
                    <div class="category-bg"></div>
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
                    <div class="category-hover-effect"></div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NCarouselItem, NButton } from 'naive-ui'

const router = useRouter()
const theme = inject('theme')
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
</script>

<style lang="scss" scoped>
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.8;
    }
    50% {
        opacity: 1;
    }
}

@keyframes neon-glow {
    0% {
        box-shadow: 0 0 5px var(--primary-color);
    }
    50% {
        box-shadow: 0 0 20px var(--primary-color);
    }
    100% {
        box-shadow: 0 0 5px var(--primary-color);
    }
}

@keyframes slide-in {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

.container {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --border-line: rgba(0, 240, 255, 0.3);
    --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
    --card-bg: rgba(30, 30, 60, 0.8);
    --grid-color: rgba(0, 240, 255, 0.1);

    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 120%;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
        background-size: 20px 20px;
        pointer-events: none;
        opacity: 0.1;
        z-index: 0;
    }

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --bg-color: #f0f2f5;
        --text-color: #333344;
        --border-color: rgba(0, 102, 204, 0.3);
        --border-line: rgba(0, 102, 204, 0.3);
        --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5);
        --card-bg: rgba(255, 255, 255, 0.9);
        --grid-color: rgba(0, 102, 204, 0.05);
    }

    @media (max-width: 768px) {
        gap: 0.75rem;
        padding: 0 15px;
    }
}

.carousel-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 12px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    animation: neon-glow 3s infinite;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
}

.carousel-container {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    position: relative;
    background-color: var(--bg-color);

    :deep(.n-carousel__slide) {
        flex-shrink: 0;
        width: 100% !important;
        margin-right: 0 !important;
        overflow: hidden;
    }

    :deep(.n-carousel__track) {
        display: flex;
        width: 100% !important;
    }

    :deep(.n-carousel__arrow) {
        z-index: 10;
        pointer-events: auto;
        color: var(--primary-color);
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;

        &:hover {
            background: var(--primary-color) !important;
            color: #fff !important;
            transform: scale(1.2);
        }
    }

    :deep(.n-carousel__dots) {
        z-index: 10;
        pointer-events: auto;

        .n-carousel__dot {
            background-color: var(--text-color);
            opacity: 0.4;
            transition: all 0.3s ease;

            &.n-carousel__dot--active {
                background-color: var(--primary-color);
                opacity: 1;
                transform: scale(1.2);
            }
        }
    }
}

.carousel-item {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    transition: all 0.5s ease;

    &:hover {
        .image-overlay {
            opacity: 0.3;
        }

        .slide-content {
            transform: translateY(0);
            opacity: 1;
        }
    }
}

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
    background: rgba(0, 0, 0, 0.2); /* 添加深色背景增强图片对比度 */

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
        filter: brightness(0.9); /* 轻微降低亮度增强对比 */
        will-change: transform; /* 优化动画性能 */
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 0, 0, 0.3) /* 使用更深的遮罩颜色 */
        );
        opacity: 0.6; /* 降低透明度 */
        transition: opacity 0.3s ease;
        mix-blend-mode: multiply; /* 使用混合模式增强效果 */
    }

    &:hover {
        img {
            transform: scale(1.05);
            filter: brightness(1); /* 悬停时恢复亮度 */
        }

        .image-overlay {
            opacity: 0.4; /* 悬停时降低遮罩透明度 */
        }
    }
}

.slide-content {
    flex: 1;
    padding: 2rem;
    background: var(--bg-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    transform: translateY(20px);
    opacity: 0.9;
    transition: all 0.5s ease;

    h2 {
        font-size: 1.8rem;
        color: var(--text-color);
        margin-bottom: 1rem;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;

        &:hover {
            color: var(--primary-color);
            transform: translateX(5px);
        }
    }

    p {
        font-size: 1rem;
        color: var(--text-color);
        margin-bottom: 1.5rem;
        line-height: 1.5;
        opacity: 0.8;
        animation: pulse 2s infinite;
    }

    .detail-btn {
        align-self: flex-start;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;

        &:hover {
            transform: translateX(10px);

            .btn-arrow {
                transform: translateX(5px);
            }
        }

        .btn-arrow {
            display: inline-block;
            transition: all 0.3s ease;
        }
    }
}

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

.category-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-width: 200px;
    height: 180px;
    margin-bottom: 16px;
    perspective: 1000px;
    margin-top: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
    }
}

.category-group-item {
    flex: 1;
    margin: 0 5px;
    transition: all 0.3s ease;
    animation: float 6s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.2s);

    &:hover {
        transform: translateY(-5px) scale(1.02);
    }

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

    position: relative;
    text-decoration: none;
    cursor: pointer;
    z-index: 1;

    &:hover {
        transform: translateY(-5px);
        box-shadow: var(--glow-effect);

        .category-hover-effect {
            transform: translateX(0);
        }

        .category-button-icon {
            transform: translateY(-50%) scale(1.2);
            filter: drop-shadow(0 0 5px currentColor);
        }
    }

    .category-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--gradient);
        opacity: 0.8;
        z-index: -1;
    }

    .category-hover-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        transform: translateX(-100%);
        transition: transform 0.6s ease;
        z-index: -1;
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
        transition: all 0.3s ease;
    }

    &:hover:after {
        width: 70%;
        background: var(--primary-color);
    }
}

.category-button-title {
    margin-top: 20px;
    padding-left: 25px;
    line-height: 1.5;
    font-size: 1.2rem;
    color: var(--text-color);
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
}

.category-button-date {
    margin-top: 10px;
    padding-left: 25px;
    line-height: 1.5;
    font-size: 0.8rem;
    color: var(--text-color);
    opacity: 0.8;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
}

.category-button .category-button-icon {
    font-size: 3rem;
    opacity: 1;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease;
    width: 60px;
    text-align: center;
    color: var(--text-color);
    z-index: 2;

    @media (max-width: 768px) {
        font-size: 2.5rem;
        right: 10px;
    }
}

a,
.slide-link {
    position: relative;
    z-index: 1;
}

:deep(.n-carousel__slide) {
    pointer-events: auto;
}

:deep(.n-carousel__dots) {
    z-index: 10;
}
</style>