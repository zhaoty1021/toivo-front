<template>
    <header class="article-header">
        <!-- 背景图 -->
        <div class="header-background">
            <img :src="backgroundImage" :alt="title" class="bg-image" />
            <div class="overlay"></div>
        </div>

        <!-- 内容区域 -->
        <div class="header-content">
            <h1 class="article-title">{{ title }}</h1>

            <div class="article-meta">
                <!-- 作者信息 -->
                <div class="meta-item author-info">
                    <n-avatar round size="small" :src="author.avatar" />
                    <span class="author-name">{{ author.name }}</span>
                </div>

                <!-- 日期信息 -->
                <div class="meta-item">
                    <svg-icon name="calendar" class="meta-icon" />
                    <time :datetime="createdAt">{{
                        formatDate(createdAt)
                    }}</time>
                    <span v-if="updatedAt" class="update-info">
                        (更新于 {{ formatDate(updatedAt) }})
                    </span>
                </div>

                <!-- 阅读统计 -->
                <div class="meta-stats">
                    <div class="stat-item">
                        <svg-icon name="eye" class="meta-icon" />
                        <span>{{ viewCount }} 阅读</span>
                    </div>
                    <div class="stat-item">
                        <svg-icon name="like" class="meta-icon" />
                        <span>{{ likeCount }} 点赞</span>
                    </div>
                    <div class="stat-item">
                        <svg-icon name="comment" class="meta-icon" />
                        <span>{{ commentCount }} 评论</span>
                    </div>
                    <div class="stat-item">
                        <svg-icon name="file-text" class="meta-icon" />
                        <span>{{ wordCount }} 字</span>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
  
  <script setup>
import { ref } from 'vue'
import { NAvatar } from 'naive-ui'

// 组件属性
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    backgroundImage: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        default: () => ({
            name: '匿名作者',
            avatar: '/default-avatar.jpg'
        })
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        default: null
    },
    viewCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    wordCount: {
        type: Number,
        default: 0
    }
})

// 日期格式化函数
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('zh-CN', options)
}
</script>
  
  <style lang="scss" scoped>
.article-header {
    position: relative;
    height: 60vh;
    min-height: 400px;
    max-height: 800px;
    color: white;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.header-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    .bg-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }
}

.header-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    padding: 0 2rem;
}

.article-title {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        font-size: 2rem;
    }
}

.article-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    opacity: 0.9;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.author-info {
        .author-name {
            font-weight: 500;
        }
    }

    .update-info {
        opacity: 0.8;
        font-size: 0.9em;
    }
}

.meta-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.95rem;
}

.meta-icon {
    width: 16px;
    height: 16px;
    opacity: 0.8;
}
</style>