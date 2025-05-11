<template>
    <el-card class="tag-wall" :class="theme">
        <div class="card-header">
            <span class="card-title">
                <svg-icon name="tagwall" class="icon" />
                热门标签
            </span>
            <router-link to="/tags">
                <a class="more hand-style no-select">
                    更多 <el-icon><ArrowRight /></el-icon>
                </a>
            </router-link>
        </div>
        <div class="tag-container">
            <div
                v-for="(tag, index) in mockTags"
                :key="index"
                class="tag-card"
                :style="{
                    '--tag-color': tagColors[index % tagColors.length],
                    '--font-size': tagFontSize(tag.count),
                    '--delay': index * 0.05 + 's'
                }"
                @click="handleTagClick(tag.id)"
            >
                <div class="tag-content">
                    <span class="tag-name">{{ tag.name }}</span>
                    <span class="tag-count">{{ tag.count }}</span>
                </div>
            </div>
        </div>
    </el-card>
</template>
  
  <script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const theme = inject('theme')
const router = useRouter()

// Mock数据 - 热门标签
const mockTags = [
    { id: 1, name: 'Vue3', count: 1 },
    { id: 2, name: 'React', count: 9 },
    { id: 3, name: 'JavaScript', count: 1 },
    { id: 4, name: 'TypeScript', count: 8 },
    { id: 5, name: 'Node.js', count: 6 },
    { id: 6, name: 'CSS3', count: 7 },
    { id: 7, name: 'Webpack', count: 3 },
    { id: 8, name: 'Docker', count: 4 },
    { id: 9, name: 'Git', count: 2 },
    { id: 10, name: '算法', count: 6 }
]

// 霓虹风格渐变色
const tagColors = [
    'linear-gradient(135deg, rgba(0, 240, 255, 0.8) 0%, rgba(0, 136, 255, 0.8) 100%)',
    'linear-gradient(135deg, rgba(255, 0, 240, 0.8) 0%, rgba(255, 0, 102, 0.8) 100%)',
    'linear-gradient(135deg, rgba(0, 255, 157, 0.8) 0%, rgba(0, 204, 102, 0.8) 100%)',
    'linear-gradient(135deg, rgba(255, 149, 0, 0.8) 0%, rgba(255, 102, 0, 0.8) 100%)',
    'linear-gradient(135deg, rgba(168, 106, 249, 0.8) 0%, rgba(106, 90, 249, 0.8) 100%)',
    'linear-gradient(135deg, rgba(60, 165, 246, 0.8) 0%, rgba(13, 139, 242, 0.8) 100%)'
]

// 根据标签热度生成字体大小
const tagFontSize = (count) => {
    const baseSize = 12
    const increment = 1.5
    return `${baseSize + Math.min(Math.floor(count / 20), 6) * increment}px`
}

const handleTagClick = (id) => {
    router.push({
        path: '/tags',
        query: { id }
    })
}
</script>
  
  <style lang="scss" scoped>
.tag-wall {
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

            .icon {
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

    .tag-container {
        padding: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .tag-card {
            background: var(--tag-color);
            border-radius: 14px;
            padding: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: fadeInUp 0.5s ease-out forwards;
            animation-delay: var(--delay);
            opacity: 0;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

            &:hover {
                transform: translateY(-3px) scale(1.03);
                box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
            }

            .tag-content {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 13px;
                padding: 6px 12px;
                display: flex;
                align-items: center;
                transition: all 0.2s ease;
                backdrop-filter: blur(4px);
                height: 100%;

                .tag-name {
                    font-size: var(--font-size);
                    font-weight: 500;
                    color: white;
                    white-space: nowrap;
                }

                .tag-count {
                    margin-left: 6px;
                    font-size: calc(var(--font-size) * 0.8);
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1px 6px;
                    border-radius: 8px;
                    color: white;
                }
            }
        }
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
</style>