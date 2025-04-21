<template>
    <aside v-if="showSidebar" class="article-sidebar desktop-only">
        <div class="toc-container">
            <div class="toc-header">
                <div class="title-wrapper">
                    <i class="fas fa-list"></i>
                    <span>目录</span>
                </div>
                <div
                    class="progress-wrapper"
                    :class="{ completed: readProgress === 100 }"
                >
                    <i class="fas fa-book-reader"></i>
                    <span class="progress-text">{{ readProgress }}</span>
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
                    {{ item.text }}
                </div>
            </div>
        </div>
    </aside>
</template>
  
  <script>
export default {
    name: 'ArticleSidebar',
    props: {
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
    },
    methods: {
        scrollToHeading(id) {
            const element = document.getElementById(id)
            if (element) {
                const header = document.querySelector('.site-header')
                const headerHeight = header ? header.offsetHeight : 0
                const targetPosition = element.offsetTop - headerHeight - 20

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                })
            }
        }
    }
}
</script>
  
  <style lang="scss" scoped>
.article-sidebar {
    .toc-container {
        position: sticky;
        top: 90px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #eef0f3;
        backdrop-filter: blur(10px);

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(74, 144, 226, 0.03),
                transparent
            );
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .toc-header {
            padding: 16px;
            background: #f9fafb;
            color: #1f2937;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            border-bottom: 1px solid #eef0f3;
            justify-content: space-between;

            .title-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;

                i {
                    color: #4a90e2;
                    font-size: 1.1em;
                    transform-origin: center;
                }
            }

            .progress-wrapper {
                font-size: 0.9em;
                color: #6b7280;
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                background: rgba(74, 144, 226, 0.05);
                border-radius: 12px;
                transition: all 0.3s ease;

                i {
                    color: #4a90e2;
                    font-size: 0.9em;
                }

                .progress-text {
                    font-variant-numeric: tabular-nums;
                    min-width: 3em;
                    text-align: right;

                    &::after {
                        content: '%';
                        margin-left: 2px;
                        opacity: 0.7;
                    }
                }
            }
        }

        .toc-content {
            padding: 16px;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                left: 24px;
                top: 0;
                bottom: 0;
                width: 1px;
                background: linear-gradient(
                    to bottom,
                    transparent,
                    rgba(74, 144, 226, 0.1),
                    rgba(74, 144, 226, 0.1),
                    transparent
                );
            }

            .toc-item {
                padding: 8px 12px;
                margin: 2px 0;
                cursor: pointer;
                border-radius: 6px;
                color: #6b7280;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 0.95em;
                line-height: 1.4;
                position: relative;
                display: flex;
                align-items: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: 16px;

                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    background: #4a90e2;
                    border-radius: 50%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    box-shadow: 0 0 4px rgba(74, 144, 226, 0.4);
                }

                &:hover {
                    color: #4a90e2;
                    background: linear-gradient(
                        90deg,
                        rgba(74, 144, 226, 0.05),
                        rgba(74, 144, 226, 0.02)
                    );
                    padding-left: 20px;

                    &::before {
                        width: 6px;
                        height: 6px;
                        opacity: 1;
                    }
                }

                &.active {
                    color: #4a90e2;
                    background: linear-gradient(
                        90deg,
                        rgba(74, 144, 226, 0.1),
                        rgba(74, 144, 226, 0.05)
                    );
                    font-weight: 500;
                    padding-left: 20px;

                    &::before {
                        width: 6px;
                        height: 6px;
                        opacity: 1;
                        animation: tocDotPulse 1.5s infinite;
                    }
                }

                &.level-1 {
                    font-weight: 500;
                    font-size: 1em;
                }

                &.level-2 {
                    font-size: 0.95em;
                }

                &.level-3 {
                    font-size: 0.9em;
                }

                &.level-4 {
                    font-size: 0.88em;
                }

                &.level-5,
                &.level-6 {
                    font-size: 0.86em;
                    opacity: 0.8;

                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }
    }
}

@keyframes tocDotPulse {
    0% {
        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4);
    }
    70% {
        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);
    }
}

// 响应式处理
@media (max-width: 1024px) {
    .desktop-only {
        display: none;
    }
}
</style>