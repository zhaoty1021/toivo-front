<template>
    <el-card class="tag-wall" :class="theme">
        <div class="card-header">
            <span class="card-title">
                <svg-icon name="tag" class="icon" />
                标签墙
            </span>
            <router-link to="/tags">
                <a class="more hand-style no-select">
                    更多 <el-icon><ArrowRight /></el-icon>
                </a>
            </router-link>
        </div>
        <div class="tag-container">
            <div
                v-for="(tag, index) in tags"
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
const props = defineProps({
    tags: {
        type: Array,
        default: () => []
    }
})

const router = useRouter()

// 使用霓虹风格的渐变色系
const tagColors = [
    'linear-gradient(135deg, rgba(0, 240, 255, 0.8) 0%, rgba(0, 136, 255, 0.8) 100%)',
    'linear-gradient(135deg, rgba(255, 0, 240, 0.8) 0%, rgba(255, 0, 102, 0.8) 100%)',
    'linear-gradient(135deg, rgba(0, 255, 157, 0.8) 0%, rgba(0, 204, 102, 0.8) 100%)',
    'linear-gradient(135deg, rgba(255, 149, 0, 0.8) 0%, rgba(255, 102, 0, 0.8) 100%)',
    'linear-gradient(135deg, rgba(168, 106, 249, 0.8) 0%, rgba(106, 90, 249, 0.8) 100%)',
    'linear-gradient(135deg, rgba(60, 165, 246, 0.8) 0%, rgba(13, 139, 242, 0.8) 100%)'
]

// 根据标签热度生成不同大小的字体
const tagFontSize = (count) => {
    const baseSize = 12
    const increment = 2
    return `${baseSize + Math.min(count, 5) * increment}px`
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
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            135deg,
            rgba(0, 240, 255, 0.1) 0%,
            transparent 100%
        );
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: -1;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: var(--glow-effect);

        &::before {
            opacity: 1;
        }
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

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-color);
            display: flex;
            align-items: center;
            letter-spacing: 0.5px;

            .icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
                color: var(--primary-color);
                filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.7));
            }
        }

        .more {
            font-size: 13px;
            color: var(--text-color);
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;

            &:hover {
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
        padding: 16px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        .tag-card {
            background: var(--tag-color);
            border-radius: 16px;
            padding: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.1);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            &:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 5px 20px rgba(0, 240, 255, 0.4);

                &::before {
                    opacity: 1;
                }

                .tag-content {
                    transform: scale(0.98);
                }
            }

            .tag-content {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 15px;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
                height: 100%;

                .tag-name {
                    font-size: var(--font-size);
                    font-weight: 500;
                    color: white;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                }

                .tag-count {
                    margin-left: 8px;
                    font-size: calc(var(--font-size) * 0.8);
                    background: rgba(0, 0, 0, 0.3);
                    padding: 2px 8px;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                }
            }
        }
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>