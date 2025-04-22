<template>
    <AHeader :article="article" />
    <div class="article-page" v-loading="loading">
        <!-- 添加固定操作栏 -->
        <FloatingActionBar
            :article="article"
            :action-bar-left="actionBarLeft"
            @toggle-like="toggleLike"
            @toggle-favorite="toggleFavorite"
            @toggle-sidebar="toggleSidebar"
            @scroll-to-comments="scrollToComments"
        />

        <div
            class="content-layout"
            id="articleBox"
            :class="{ center: !showSidebar }"
        >
            <main class="article-main">
                <!-- 文章头部 -->
                <ArticleHeader :article="article" :read-time="readTime" />

                <!-- AI简短介绍 -->
                <AISummary
                    v-if="article.aiDescribe"
                    :content="article.aiDescribe"
                    :is-expanded="isAiDescriptionExpanded"
                    @toggle="isAiDescriptionExpanded = !isAiDescriptionExpanded"
                />

                <!-- 文章内容 -->
                <ArticleContent
                    :article="article"
                    @upgrade="handleUpgrade"
                    @purchase="handlePurchase"
                />

                <!-- 文章底部 -->
                <ArticleFooter
                    :article="article"
                    @toggle-like="toggleLike"
                    @share="shareToMethod"
                    @copy-link="copyLink"
                />

                <!-- 添加评论组件 -->
                <Comment
                    :article-id="$route.params.id"
                    :comment-count="article.commentNum || 0"
                    :article-author-id="article.userId || ''"
                    @comment-added="handleCommentAdded"
                    @comment-deleted="handleCommentDeleted"
                />
            </main>

            <!-- 侧边栏 -->
            <ArticleSidebar
                v-if="showSidebar"
                :toc-items="tocItems"
                :active-heading="activeHeading"
                :read-progress="readProgress"
                @navigate="scrollToHeading"
            />
        </div>
        <mj-image-preview ref="imagePreview" />
    </div>
</template>
  
  <script>
import { getArticleDetailApi, likeArticleApi } from '@/api/article'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import Comment from '@/components/Comment/index.vue'

import { marked } from 'marked'

import ArticleHeader from './components/ArticleHeader.vue'
import ArticleContent from './components/ArticleContent.vue'
import ArticleFooter from './components/ArticleFooter.vue'
import ArticleSidebar from './components/ArticleSidebar.vue'
import FloatingActionBar from './components/FloatingActionBar.vue'
import AISummary from './components/AISummary.vue'
import AHeader from './components/header.vue'

export default {
    name: 'Article',
    components: {
        Comment,
        ArticleHeader,
        ArticleContent,
        ArticleFooter,
        ArticleSidebar,
        FloatingActionBar,
        AISummary,
        AHeader
    },
    data() {
        return {
            article: {
                title: 'Hexo + Butterfly 一些常见问题',
                cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png',
                createTime: '2023-10-01 12:00:00',
                content:
                    '# 测试\n ## 测试\n\n+ 测试内容\n ```java\n public static void main(String[] args) {\n System.out.println("Hello World");\n }\n ```',
                category: {},
                isOriginal: true,
                readType: 1,
                price: 0
            },
            prevArticle: {
                id: 1,
                title: '默认文章'
            },
            nextArticle: {
                id: 1,
                title: '默认文章'
            },
            tocItems: [],
            readProgress: 0,
            activeHeading: '',
            readTime: 0,
            likeDebounce: false,
            loading: false,
            actionBarLeft: '0px',
            showSidebar: true,
            contentLayout: 'center',
            images: [],
            showPaymentDialog: false,
            showMembershipDialog: false,
            isAiDescriptionExpanded: true
        }
    },
    computed: {
        currentUrl() {
            return window.location.href
        }
    },
    methods: {
        async getArticle() {
            this.loading = true
            hljs.configure({
                ignoreUnescapedHTML: true
            })
            try {
                const res = await getArticleDetailApi(this.$route.params.id)
                this.article = {
                    ...res.data,
                    content: res.data.content
                        ? this.addLazyLoadToImages(res.data.content)
                        : ''
                }

                await this.$nextTick()

                setTimeout(() => {
                    this.generateToc()
                    document.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightBlock(block)
                    })
                    this.addCopyButtons()
                    this.addLineNumbers()
                    this.initImagePreview()
                    this.updateActionBarPosition()
                    this.initializeCodeBlocks()
                }, 100)

                const textContent = this.article.content.replace(
                    /<[^>]+>/g,
                    ' '
                )
                this.readTime = Math.ceil(textContent.split(/\s+/).length / 300)
            } catch (error) {
                this.$message.error('获取文章详情失败')
            } finally {
                this.loading = false
            }
        }
        // ... (其他方法保持不变)
    },
    async created() {
        await this.getArticle()
        window.addEventListener('resize', this.updateActionBarPosition)
    },
    mounted() {
        window.addEventListener('scroll', this.updateActiveHeading)
        this.$nextTick(() => {
            this.initImagePreview()
        })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.updateActiveHeading)
        window.removeEventListener('resize', this.updateActionBarPosition)
        const images = document.querySelectorAll('.article-content img')
        images.forEach((img) => {
            img.removeEventListener('click', this.handleImageClick)
        })
    },
    watch: {
        $route(to, from) {
            if (to.params.id !== from.params.id) {
                this.getArticleData()
            }
        }
    }
}
</script>
  
  <style lang="scss" scoped>
.article-page {
    max-width: 1300px;
    margin: 0 auto;
    padding: 24px;

    @media (max-width: 768px) {
        padding: 12px;
    }
}

.content-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 32px;
    transition: all 0.3s ease;

    &.center {
        grid-template-columns: 1fr;
        max-width: 1100px;
        margin: 0 auto;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 0;
    }
}

.article-main {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
</style>