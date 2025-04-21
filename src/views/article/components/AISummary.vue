<template>
    <div v-if="content" class="ai-description">
        <div class="ai-header" @click="isExpanded = !isExpanded">
            <i class="fas fa-robot"></i>
            <span>AI 摘要</span>
            <i
                class="fas"
                :class="isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"
                style="margin-left: auto"
            ></i>
        </div>
        <transition
            name="expand"
            @enter="startTransition"
            @leave="endTransition"
            mode="out-in"
        >
            <div class="ai-content" v-show="isExpanded">
                <span class="typing-text" ref="typingText"></span>
                <div class="ai-description-text">
                    摘要由平台通过智能技术生成
                </div>
            </div>
        </transition>
    </div>
</template>
  
  <script>
import { marked } from 'marked'

export default {
    name: 'AISummary',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isExpanded: true
        }
    },
    watch: {
        content: {
            immediate: true,
            handler(newContent) {
                if (newContent) {
                    this.$nextTick(() => {
                        const typingText = this.$refs.typingText
                        if (typingText) {
                            // 使用marked解析Markdown文本
                            const htmlContent = marked(newContent)
                            typingText.innerHTML = htmlContent
                        }
                    })
                }
            }
        }
    },
    methods: {
        startTransition(element) {
            element.style.height = 'auto'
            const height = element.scrollHeight
            element.style.height = '0px'
            // 触发回流
            element.offsetHeight
            element.style.height = height + 'px'
        },
        endTransition(element) {
            element.style.height = element.scrollHeight + 'px'
            // 触发回流
            element.offsetHeight
            element.style.height = '0px'
        }
    }
}
</script>
  
  <style lang="scss" scoped>
.ai-description {
    margin: 16px 32px;
    border-radius: 12px;
    background-image: linear-gradient(
        180deg,
        rgba(247, 232, 255, 0.54),
        rgba(191, 223, 255, 0.35)
    );
    border: 1px solid rgba(0, 150, 136, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;

    @media (max-width: 768px) {
        margin: 12px;
    }

    .ai-header {
        padding: 12px 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        justify-content: flex-start;
        color: #a855f7;
        cursor: pointer;

        i {
            font-size: 1.1em;
        }
    }

    .ai-content {
        padding: 16px;
        overflow: hidden;
    }

    .ai-description-text {
        margin-top: 12px;
        color: #8c8a8e;
    }
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    height: 0;
}

.expand-enter-to,
.expand-leave-from {
    opacity: 1;
}
</style>