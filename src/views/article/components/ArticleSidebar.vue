<template>
    <aside
        v-if="showSidebar"
        class="article-sidebar desktop-only"
        :class="theme"
    >
        <div class="toc-container">
            <div class="toc-header">
                <div class="title-wrapper">
                    <i class="icon-global-nav"></i>
                    <span>文章导航</span>
                </div>
                <div
                    class="progress-indicator"
                    :class="{ completed: readProgress === 100 }"
                >
                    <div
                        class="progress-bar"
                        :style="{ width: `${readProgress}%` }"
                    ></div>
                    <span class="progress-text">{{ readProgress }}%</span>
                </div>
            </div>
            <div class="toc-content">
                <div
                    v-for="(item, index) in tocItems"
                    :key="index"
                    class="toc-item"
                    :class="{
                        active: activeHeading === item.id,
                        [`level-${item.level}`]: true
                    }"
                    @click="scrollToHeading(item.id)"
                >
                    <div class="item-content">
                        <span class="item-icon"></span>
                        <span class="item-text">{{ item.text }}</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
    showSidebar: {
        type: Boolean,
        default: true
    },
    tocItems: {
        type: Array,
        default: () => []
    },
    readProgress: {
        type: Number,
        default: 0
    },
    activeHeading: {
        type: String,
        default: ''
    }
})

const theme = inject('theme', 'dark')
const emit = defineEmits(['navigate'])

const scrollToHeading = (id) => {
    emit('navigate', id)
}
</script>

<style lang="scss" scoped>
.article-sidebar {
    --primary-color: #00f0ff;
    --accent-color: #ff2d75;
    --success-color: #00e676;
    --dark-bg: #0d1117;
    --card-bg: rgba(20, 28, 42, 0.95);
    --text-color: #e6edf3;
    --text-muted: #7d8590;
    --border-color: rgba(0, 240, 255, 0.15);
    --highlight-color: rgba(0, 240, 255, 0.1);
    --spacing-xl: 24px;
    --spacing-lg: 20px;
    --spacing-md: 30px;
    --spacing-sm: 12px;
    --border-radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    width: 400px;
    margin-right: -50px;

    .toc-container {
        position: sticky;
        top: 100px;
        background: var(--card-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        transition: var(--transition);
        backdrop-filter: blur(16px);

        &:hover {
            box-shadow: 0 12px 40px rgba(0, 240, 255, 0.2);
            border-color: rgba(0, 240, 255, 0.3);
        }
    }

    .toc-header {
        padding: var(--spacing-lg) var(--spacing-xl);
        background: linear-gradient(90deg, rgba(0, 240, 255, 0.1), transparent);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        border-bottom: 1px solid var(--border-color);

        .title-wrapper {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 18px;
            font-weight: 600;
            color: var(--text-color);

            i {
                font-size: 20px;
                color: var(--primary-color);
            }
        }

        .progress-indicator {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            position: relative;
            overflow: hidden;
            margin-top: var(--spacing-sm);

            &.completed {
                .progress-bar {
                    background: var(--success-color);
                }
            }

            .progress-bar {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                background: var(--primary-color);
                transition: width 0.6s ease;
            }

            .progress-text {
                position: absolute;
                right: 0;
                top: -20px;
                font-size: 12px;
                color: var(--text-muted);
                font-variant-numeric: tabular-nums;
            }
        }
    }

    .toc-content {
        padding: var(--spacing-md) var(--spacing-xl);
        max-height: calc(100vh - 220px);
        overflow-y: auto;

        .toc-item {
            margin: var(--spacing-sm) 0;
            padding: var(--spacing-sm) 0;
            cursor: pointer;
            transition: var(--transition);

            .item-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }

            .item-icon {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--text-muted);
                transition: var(--transition);
            }

            .item-text {
                color: var(--text-muted);
                font-size: 15px;
                transition: var(--transition);
                line-height: 1.5;
            }

            &:hover {
                .item-icon {
                    background: var(--primary-color);
                    box-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
                }
                .item-text {
                    color: var(--text-color);
                    transform: translateX(4px);
                }
            }

            &.active {
                .item-icon {
                    background: var(--primary-color);
                    box-shadow: 0 0 8px rgba(0, 240, 255, 0.8);
                    transform: scale(1.2);
                }
                .item-text {
                    color: var(--primary-color);
                    font-weight: 500;
                    transform: translateX(6px);
                }
            }

            &.level-1 {
                .item-text {
                    font-size: 20px;
                    font-weight: 500;
                }
            }

            &.level-2 {
                margin-left: var(--spacing-md);
                .item-text {
                    font-size: 19px;
                    font-weight: 200;
                }
            }

            &.level-3 {
                margin-left: calc(var(--spacing-md) * 1.5);
                .item-text {
                    font-size: 18px;
                }
            }

            &.level-3 {
                margin-left: calc(var(--spacing-md) * 1.7);
                .item-text {
                    font-size: 17px;
                }
            }
        }
    }

    // 亮色主题
    &.light {
        --primary-color: #0066ff;
        --accent-color: #ff3d71;
        --success-color: #00c853;
        --dark-bg: #f8fafc;
        --card-bg: rgba(255, 255, 255, 0.95);
        --text-color: #1a1a1a;
        --text-muted: #666666;
        --border-color: rgba(0, 0, 0, 0.08);

        .toc-container {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

            &:hover {
                box-shadow: 0 12px 40px rgba(0, 102, 255, 0.15);
                border-color: rgba(0, 102, 255, 0.2);
            }
        }

        .toc-header {
            background: linear-gradient(
                90deg,
                rgba(0, 102, 255, 0.05),
                transparent
            );
        }

        .progress-indicator {
            background: rgba(0, 0, 0, 0.05);
        }
    }
}

// 响应式处理
@media (max-width: 1200px) {
    .article-sidebar {
        width: 260px;
        .toc-container {
            .toc-header,
            .toc-content {
                padding-left: var(--spacing-lg);
                padding-right: var(--spacing-lg);
            }
        }
    }
}

@media (max-width: 1024px) {
    .desktop-only {
        display: none;
    }
}
</style>