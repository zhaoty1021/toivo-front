<template>
    <footer class="article-footer" :class="theme">
        <!-- 版权声明提示 -->
        <CopyrightNotice :article="article" />
        <!-- 标签部分 -->
        <div class="tags-section">
            <i class="fas fa-tags"></i>
            <div class="tags-list">
                <router-link
                    v-for="tag in article.tags"
                    :key="tag.id"
                    :to="`/tags?tagId=${tag.id}&tagName=${tag.name}`"
                    class="tag-item"
                >
                    {{ tag.name }}
                </router-link>
            </div>
        </div>

        <!-- 操作按钮部分 -->
        <div class="article-actions">
            <button
                class="action-btn like"
                :class="{ active: article.isLike }"
                @click="$emit('toggle-like')"
            >
                <i class="fas fa-heart"></i>
                <span>{{ article.likeNum }}</span>
            </button>
        </div>
    </footer>
</template>

<script setup>
import { inject } from 'vue'
import CopyrightNotice from './CopyrightNotice.vue'

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
})

defineEmits(['toggle-like'])

const theme = inject('theme')
</script>

<style lang="scss" scoped>
.article-footer {
    padding: 32px;
    margin-top: -50px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-color);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        padding: 12px;
    }

    .tags-section {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;

        i {
            color: var(--primary-color);
        }

        .tags-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }

        .tag-item {
            padding: 8px 16px;
            background: var(--tag-bg-color);
            color: var(--tag-text-color);
            border-radius: 24px;
            font-size: 0.9em;
            text-decoration: none;
            transition: all 0.3s ease;

            &:hover {
                background: var(--primary-color);
                color: white;
                transform: translateY(-2px);
            }
        }
    }

    .article-actions {
        display: flex;
        justify-content: center;
        gap: 24px;
        margin-bottom: 32px;

        .action-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 12px 32px;
            border: none;
            border-radius: 20px;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.3s ease;

            &.like {
                background: var(--button-bg-color);
                color: var(--button-text-color);

                &.active {
                    background: var(--primary-color);
                    color: white;
                }

                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }

    &.dark {
        --tag-bg-color: rgba(255, 255, 255, 0.1);
        --tag-text-color: rgba(255, 255, 255, 0.8);
        --button-bg-color: rgba(255, 255, 255, 0.1);
        --button-text-color: rgba(255, 255, 255, 0.8);
    }

    &.light {
        --tag-bg-color: #f5f7fa;
        --tag-text-color: #666666;
        --button-bg-color: #f5f7fa;
        --button-text-color: #666666;
    }
}
</style>