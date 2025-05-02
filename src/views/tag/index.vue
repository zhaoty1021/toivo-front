<template>
    <div class="tags-container" :class="theme">
        <div class="tags-card">
            <div class="tags-header">
                <svg-icon name="tag" class="header-icon" />
                <h1>标签云</h1>
                <span class="tags-count">{{ tags.length }}个标签</span>
            </div>

            <div class="tags-wall">
                <router-link
                    v-for="tag in tags"
                    :key="tag.id"
                    :to="`/tags/${tag.id}`"
                    class="tag-brick"
                    :style="{
                        '--hue': getHue(tag.id),
                        '--size': getSize(tag.count),
                        width: getWidth(tag.count)
                    }"
                >
                    <span class="tag-name">{{ tag.name }}</span>
                    <span class="tag-count">{{ tag.count }}</span>
                    <div class="tag-wave"></div>
                </router-link>
            </div>
        </div>
    </div>
</template>
  
  <script setup>
import { ref, inject } from 'vue'

const theme = inject('theme')

// 模拟标签数据
const tags = ref([
    { id: 1, name: 'Vue3', count: 28 },
    { id: 2, name: 'React', count: 42 },
    { id: 3, name: 'JavaScript', count: 56 },
    { id: 4, name: 'TypeScript', count: 34 },
    { id: 5, name: 'Node.js', count: 19 },
    { id: 6, name: 'CSS3', count: 47 },
    { id: 7, name: 'HTML5', count: 23 },
    { id: 8, name: 'Webpack', count: 15 },
    { id: 9, name: 'Docker', count: 31 },
    { id: 10, name: 'Git', count: 38 },
    { id: 11, name: '算法', count: 27 },
    { id: 12, name: '设计模式', count: 18 },
    { id: 13, name: '机器学习', count: 22 },
    { id: 14, name: '人工智能', count: 36 },
    { id: 15, name: '网络安全', count: 19 }
])

// 生成不同色调
const getHue = (id) => {
    const hues = [180, 200, 220, 240, 260, 280, 300]
    return hues[id % hues.length]
}

// 根据文章数量生成大小
const getSize = (count) => {
    const base = 14
    return Math.min(base + count * 0.3, 22)
}

// 根据文章数量生成宽度
const getWidth = (count) => {
    const base = 80
    return `${Math.min(base + count * 2, 160)}px`
}
</script>
  
  <style lang="scss" scoped>
.tags-container {
    --primary-color: #00f0ff;
    --bg-color: #0a0a12;
    --card-bg: rgba(30, 30, 60, 0.5);
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

.tags-card {
    width: 100%;
    max-width: 1200px;
    background: var(--card-bg);
    border-radius: 16px;
    padding: 30px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.tags-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    color: var(--text-color);
    position: relative;

    .header-icon {
        width: 28px;
        height: 28px;
        margin-right: 12px;
        color: var(--primary-color);
    }

    h1 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-right: 15px;
    }

    .tags-count {
        font-size: 0.9rem;
        opacity: 0.8;
        align-self: flex-end;
        margin-bottom: 5px;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
        opacity: 0.3;
    }
}

.tags-wall {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
}

.tag-brick {
    position: relative;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-size: calc(var(--size) * 1px);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: hsla(var(--hue), 80%, 50%, 0.7);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: calc(var(--size) * 2px);
    min-width: 80px;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px hsla(var(--hue), 80%, 50%, 0.3);

        .tag-wave {
            transform: translateX(0) translateY(-50%);
        }
    }

    .tag-name {
        z-index: 2;
        white-space: nowrap;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .tag-count {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: calc(var(--size) * 0.6px);
        z-index: 2;
    }

    .tag-wave {
        position: absolute;
        top: 50%;
        left: 0;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            90deg,
            hsla(var(--hue), 80%, 60%, 0.3) 0%,
            hsla(var(--hue), 80%, 70%, 0.5) 50%,
            hsla(var(--hue), 80%, 60%, 0.3) 100%
        );
        transform: translateX(-50%) translateY(-50%);
        transition: transform 1s ease;
        z-index: 1;
        animation: wave 3s infinite linear;
    }
}

@keyframes wave {
    0% {
        transform: translateX(-50%) translateY(-50%);
    }
    100% {
        transform: translateX(0%) translateY(-50%);
    }
}

@media (max-width: 768px) {
    .tags-card {
        padding: 20px;
    }

    .tags-header {
        flex-direction: column;
        align-items: flex-start;

        h1 {
            font-size: 1.5rem;
            margin-bottom: 5px;
        }

        .tags-count {
            align-self: flex-start;
        }
    }

    .tag-brick {
        padding: 10px 15px;
        font-size: calc(var(--size) * 0.8px);
        height: calc(var(--size) * 1.8px);
    }
}
</style>