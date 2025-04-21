<template>
    <footer class="article-footer">
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
  
  <script>
import CopyrightNotice from './CopyrightNotice.vue'

export default {
    name: 'ArticleFooter',
    components: {
        CopyrightNotice
    },
    props: {
        article: {
            type: Object,
            required: true
        }
    }
}
</script>
  
  <style lang="scss" scoped>
.article-footer {
    padding: 32px;
    border-top: 1px solid #e8e8e8;

    @media (max-width: 768px) {
        padding: 12px;
    }

    .tags-section {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;

        i {
            color: #409eff;
        }

        .tags-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }

        .tag-item {
            padding: 8px 16px;
            background: #f5f7fa;
            color: #666666;
            border-radius: 24px;
            font-size: 0.9em;
            text-decoration: none;
            transition: all 0.3s ease;

            &:hover {
                background: #409eff;
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
                background: #f5f7fa;
                color: #666666;

                &.active {
                    background: #409eff;
                    color: white;
                }

                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }
}
</style>