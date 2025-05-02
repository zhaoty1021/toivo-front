<template>
    <div class="tag-articles-container" :class="theme">
        <div class="tag-articles-card">
            <div class="tag-header">
                <div class="tag-badge" :style="{ '--hue': getHue(tagId) }">
                    <svg-icon name="tag" />
                </div>
                <div class="header-content">
                    <h1>{{ tagName }}</h1>
                    <p>共 {{ articles.length }} 篇文章</p>
                </div>
            </div>

            <div class="articles-grid">
                <div
                    v-for="article in articles"
                    :key="article.id"
                    class="article-tile"
                    @mouseenter="hoveredArticle = article.id"
                    @mouseleave="hoveredArticle = null"
                >
                    <router-link
                        :to="`/article/${article.id}`"
                        class="article-content"
                        :class="{ hovered: hoveredArticle === article.id }"
                    >
                        <div
                            class="article-bg"
                            :style="{
                                'background-image': `url(${article.cover})`,
                                'background-size': 'cover',
                                'background-position': 'center'
                            }"
                        ></div>
                        <div class="article-overlay"></div>

                        <div class="article-info">
                            <h3 class="article-title">{{ article.title }}</h3>
                            <div class="article-meta">
                                <span class="meta-item">
                                    <svg-icon name="calendar" />
                                    {{ article.date }}
                                </span>
                                <span class="meta-item">
                                    <svg-icon name="eye" /> {{ article.views }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="article-wave"
                            :class="{ active: hoveredArticle === article.id }"
                        ></div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script setup>
import { ref, computed, inject } from 'vue'
import { useRoute } from 'vue-router'

const theme = inject('theme')
const route = useRoute()
const hoveredArticle = ref(null)

// 从路由参数中获取tagId
const tagId = computed(() => route.params.tagId)

// 生成不同色调
const getHue = (id) => {
    const hues = [180, 200, 220, 240, 260, 280, 300]
    return hues[id % hues.length] || 220
}

// 模拟标签数据
const allTags = [
    { id: '1', name: 'Vue3' },
    { id: '2', name: 'React' },
    { id: '3', name: 'JavaScript' }
]

// 模拟文章数据（添加了封面图和描述字段）
const allArticles = [
    {
        id: 1,
        title: 'Vue3 组合式API详解',
        description: '深度解析Vue3组合式API的设计理念和使用技巧',
        cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        date: '2023-08-20',
        views: 1250,
        commentCount: 42,
        tagId: '1'
    },
    {
        id: 2,
        title: 'React Hooks 最佳实践',
        description: '分享React Hooks在实际项目中的最佳使用方式',
        cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        date: '2023-08-18',
        views: 980,
        commentCount: 28,
        tagId: '2'
    },
    {
        id: 3,
        title: 'React Hooks 最佳实践',
        description: '分享React Hooks在实际项目中的最佳使用方式',
        cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        date: '2023-08-18',
        views: 980,
        commentCount: 28,
        tagId: '2'
    },
    {
        id: 4,
        title: 'React Hooks 最佳实践',
        description: '分享React Hooks在实际项目中的最佳使用方式',
        cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        date: '2023-08-18',
        views: 980,
        commentCount: 28,
        tagId: '2'
    }
    // 其他文章数据...
]

// 获取当前标签名称
const tagName = computed(() => {
    const tag = allTags.find((t) => t.id === tagId.value)
    return tag ? tag.name : '未知标签'
})

// 获取对应文章
const articles = computed(() => {
    return allArticles.filter((article) => article.tagId === tagId.value)
})
</script>
  
  <style lang="scss" scoped>
.tag-articles-container {
    --primary-color: #00f0ff;
    --bg-color: #0a0a12;
    --card-bg: rgba(30, 30, 60, 0.6);
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);

    min-height: 100vh;
    padding: 60px 20px;
    display: flex;
    justify-content: center;
    transition: all 0.3s;

    &.light {
        --primary-color: #0066cc;
        --bg-color: #f5f7fa;
        --card-bg: rgba(255, 255, 255, 0.9);
        --text-color: #333;
        --border-color: rgba(0, 102, 204, 0.3);
    }
}

.tag-articles-card {
    width: 100%;
    max-width: 1200px;
    background: var(--card-bg);
    border-radius: 16px;
    padding: 40px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.tag-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    position: relative;
    padding-bottom: 20px;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, var(--primary-color), transparent);
        opacity: 0.3;
    }

    .tag-badge {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: hsla(var(--hue), 80%, 50%, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        border: 2px solid hsla(var(--hue), 80%, 50%, 0.5);
        box-shadow: 0 0 20px hsla(var(--hue), 80%, 50%, 0.2);

        svg {
            width: 30px;
            height: 30px;
            color: white;
        }
    }

    .header-content {
        h1 {
            font-size: 2rem;
            color: var(--text-color);
            margin-bottom: 5px;
        }

        p {
            font-size: 1rem;
            color: var(--text-color);
            opacity: 0.8;
        }
    }
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px; /* 缩小间距 */
}

.article-tile {
    position: relative;
    height: 200px; /* 缩小高度 */
    perspective: 1000px;
    border-radius: 10px; /* 缩小圆角 */
    overflow: hidden;
}

.article-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    color: white;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &.hovered {
        transform: translateY(-8px); /* 减小悬停上浮距离 */
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 减小阴影 */

        .article-bg {
            transform: scale(1.03); /* 减小放大比例 */
        }
    }
}

.article-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: transform 0.5s ease;
}

.article-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
    z-index: 2;
}

.article-info {
    position: relative;
    padding: 16px; /* 缩小内边距 */
    z-index: 3;

    .article-title {
        font-size: 1.1rem; /* 缩小标题字体 */
        font-weight: 600;
        margin-bottom: 8px; /* 缩小间距 */
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
}

.article-meta {
    display: flex;
    gap: 12px; /* 缩小间距 */
    font-size: 0.8rem; /* 缩小字体 */

    .meta-item {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 3px 8px; /* 缩小内边距 */
        border-radius: 12px; /* 缩小圆角 */
        backdrop-filter: blur(5px);

        svg {
            width: 10px; /* 缩小图标 */
            height: 10px;
            margin-right: 4px; /* 缩小间距 */
        }
    }
}

.article-wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%) rotate(10deg);
    transition: transform 1s ease;
    z-index: 4;

    &.active {
        transform: translateX(100%) rotate(10deg);
        transition-duration: 1.5s;
    }
}

@media (max-width: 768px) {
    .articles-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .article-tile {
        height: 180px; /* 移动端高度 */
    }

    .article-info {
        padding: 12px;

        .article-title {
            font-size: 1rem;
        }
    }
}
</style>