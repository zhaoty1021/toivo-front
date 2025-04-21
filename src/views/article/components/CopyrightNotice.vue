<template>
    <div class="copyright-notice">
        <div class="notice-header">
            <i class="fas fa-copyright"></i>
            <span>版权声明</span>
        </div>
        <div class="notice-content">
            <div v-if="isOriginal" class="notice-item">
                <i class="fas fa-check-circle"></i>
                <span>本文由 {{ nickname }} 原创发布</span>
            </div>
            <div v-else class="notice-item">
                <i class="fas fa-share-alt"></i>
                <span
                    >本文转载自：<a
                        :href="originalUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ originalUrl || '未知来源' }}</a
                    ></span
                >
            </div>
            <div class="notice-item">
                <i class="fas fa-calendar-alt"></i>
                <span>发布时间：{{ createTime }}</span>
            </div>
            <div class="notice-item">
                <i class="fab fa-creative-commons-sa"></i>
                <span>
                    版权协议：
                    <a
                        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CC BY-NC-SA 4.0
                    </a>
                </span>
            </div>
            <div class="notice-item notice-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span
                    >未经许可，禁止转载、摘编、复制或建立镜像。欢迎转发分享！</span
                >
            </div>
        </div>
    </div>
</template>
  
  <script>
export default {
    name: 'CopyrightNotice',
    props: {
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
    }
}
</script>
  
  <style lang="scss" scoped>
.copyright-notice {
    margin-bottom: 32px;
    background: rgba(#007aff, 0.03);
    background: var(--hover-bg);
    border-radius: 12px;
    overflow: hidden;

    .notice-header {
        padding: 16px 24px;
        background: rgba(#007aff, 0.1);
        color: #007aff;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notice-content {
        padding: 24px;
        color: #666;
        color: var(--text-secondary);
        font-size: 0.95em;
        line-height: 1.6;

        .notice-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;

            i {
                color: #007aff;
                font-size: 1em;
                width: 16px;
                text-align: center;
            }

            a {
                color: #007aff;
                text-decoration: none;
                border-bottom: 1px dashed #007aff;
                transition: all 0.2s ease;

                &:hover {
                    border-bottom-style: solid;
                }
            }

            &.notice-warning {
                margin-top: 12px;
                padding: 12px;
                background: rgba(#007aff, 0.05);
                border-radius: 6px;

                i {
                    color: #ff9800;
                }
            }
        }
    }
}
</style>