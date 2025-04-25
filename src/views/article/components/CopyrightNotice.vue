<template>
    <div
        class="copyright-notice"
        :class="[{ original: isOriginal, reprinted: !isOriginal }, theme]"
    >
        <div class="notice-header">
            <i class="icon"></i>
            <span class="title">版权声明</span>
        </div>
        <div class="notice-content">
            <div v-if="isOriginal" class="notice-item">
                <i class="fas fa-pen-nib"></i>
                <span
                    >本文由
                    <strong>{{ nickname || '作者' }}</strong> 原创发布</span
                >
            </div>
            <div v-else class="notice-item">
                <i class="fas fa-share-alt"></i>
                <span>本文转载自：</span>
                <a
                    v-if="originalUrl"
                    :href="originalUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="source-link"
                >
                    {{ originalUrlDisplay }}
                </a>
                <span v-else>未知来源</span>
            </div>
            <div class="notice-item">
                <i class="fas fa-calendar-day"></i>
                <span
                    >发布时间：<time>{{ createTime }}</time></span
                >
            </div>
            <div class="notice-item">
                <i class="fab fa-creative-commons"></i>
                <span>
                    版权协议：
                    <a
                        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="license-link"
                    >
                        CC BY-NC-SA 4.0
                    </a>
                    <span class="license-desc"
                        >(署名-非商业性使用-相同方式共享)</span
                    >
                </span>
            </div>
            <div class="notice-warning">
                <i class="fas fa-ban"></i>
                <span>未经许可，禁止转载、摘编、复制或建立镜像</span>
                <div class="notice-tip">
                    <i class="fas fa-lightbulb"></i>
                    <span>如需使用，请遵守协议条款或联系作者授权</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
    isOriginal: {
        type: Boolean,
        default: true
    },
    nickname: {
        type: String,
        default: ''
    },
    originalUrl: {
        type: String,
        default: ''
    },
    createTime: {
        type: String,
        default: ''
    }
})

const theme = inject('theme')

const originalUrlDisplay = computed(() => {
    if (!props.originalUrl) return ''
    try {
        const url = new URL(props.originalUrl)
        return url.hostname + (url.pathname !== '/' ? url.pathname : '')
    } catch {
        return props.originalUrl.length > 40
            ? props.originalUrl.substring(0, 40) + '...'
            : props.originalUrl
    }
})
</script>

<style lang="scss" scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.copyright-notice {
    margin: 2rem 0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }

    &.original {
        .notice-header {
            background: linear-gradient(
                135deg,
                var(--primary-color) 0%,
                var(--accent-color) 100%
            );
        }
    }

    &.reprinted {
        .notice-header {
            background: linear-gradient(
                135deg,
                var(--secondary-color) 0%,
                #fbc2eb 100%
            );
        }
    }

    &.dark {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

        .notice-content {
            background: var(--bg-color);
            color: var(--text-color);

            .notice-item {
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);

                strong {
                    color: var(--text-color);
                }

                i {
                    color: var(--primary-color);
                }
            }

            .source-link,
            .license-link {
                color: var(--primary-color);

                &:hover {
                    color: var(--accent-color);
                }
            }

            .license-desc {
                color: rgba(255, 255, 255, 0.6);
            }

            .notice-warning {
                background: rgba(255, 152, 0, 0.15);
                border-left-color: var(--accent-color);

                span {
                    color: var(--text-color);
                }
            }

            .notice-tip {
                color: rgba(255, 255, 255, 0.7);
            }
        }
    }

    &.light {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

        .notice-content {
            background: var(--bg-color);
            color: var(--text-color);

            .notice-item {
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);

                strong {
                    color: var(--text-color);
                }

                i {
                    color: var(--primary-color);
                }
            }

            .source-link,
            .license-link {
                color: var(--primary-color);

                &:hover {
                    color: var(--accent-color);
                }
            }

            .license-desc {
                color: rgba(0, 0, 0, 0.6);
            }

            .notice-warning {
                background: rgba(255, 152, 0, 0.08);
                border-left-color: var(--primary-color);

                span {
                    color: var(--text-color);
                }
            }

            .notice-tip {
                color: rgba(0, 0, 0, 0.7);
            }
        }
    }

    .notice-header {
        padding: 1rem 1.5rem;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;

        .icon {
            font-size: 1.1rem;
        }

        .title {
            font-size: 1.05rem;
            letter-spacing: 0.5px;
        }
    }

    .notice-content {
        padding: 1.25rem 1.5rem;
        font-size: 0.95rem;
        line-height: 1.7;

        .notice-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;

            &:last-child {
                border-bottom: none;
            }

            i {
                font-size: 0.95rem;
                min-width: 1.25rem;
                text-align: center;
            }

            time {
                font-family: monospace;
            }
        }

        .notice-warning {
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border-left: 3px solid;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            i {
                margin-right: 0.5rem;
            }
        }

        .notice-tip {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
            margin-top: 0.25rem;
        }
    }
}
</style>