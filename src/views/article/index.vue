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
                    '# 测试\n## 测试\n这就是我的测试内容\n ## 测试\n\n+ 测试内容\n > 121 \n```java\n public static void main(String[] args) {\n     System.out.println("Hello World");\n }\n ```',
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
    // 修改后的方法
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
        },
        // 新增方法：生成目录结构
        generateToc() {
            const articleEl = document.querySelector('.article-content')
            if (!articleEl) return []

            this.tocItems = Array.from(
                articleEl.querySelectorAll('h1, h2, h3, h4')
            ).map((heading) => ({
                id: heading.id || this.generateHeadingId(heading),
                text: heading.textContent.trim(),
                level: parseInt(heading.tagName.substring(1))
            }))

            // 确保所有标题都有ID
            document
                .querySelectorAll(
                    '.article-content h1, .article-content h2, .article-content h3, .article-content h4'
                )
                .forEach((heading) => {
                    if (!heading.id) {
                        heading.id = this.generateHeadingId(heading)
                    }
                })
        },

        // 生成唯一ID
        generateHeadingId(heading) {
            return 'heading-' + Math.random().toString(36).substr(2, 9)
        },

        // 初始化IntersectionObserver
        initHeadingObserver() {
            // Store visible headings
            const visibleHeadings = new Set()

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        // Add or remove headings from the visible set
                        if (entry.isIntersecting) {
                            visibleHeadings.add(entry.target.id)
                        } else {
                            visibleHeadings.delete(entry.target.id)
                        }
                    })

                    // Find the topmost visible heading
                    if (visibleHeadings.size > 0) {
                        const visibleHeadingsArray = Array.from(visibleHeadings)
                        const headingElements = visibleHeadingsArray.map((id) =>
                            document.getElementById(id)
                        )

                        // Sort headings by their position in the viewport
                        headingElements.sort((a, b) => {
                            return (
                                a.getBoundingClientRect().top -
                                b.getBoundingClientRect().top
                            )
                        })

                        // Set the topmost as active
                        this.activeHeading = headingElements[0].id
                    }
                },
                {
                    rootMargin: '-64px 0px -90% 0px', // Adjust these values based on your layout
                    threshold: [0, 0.25, 0.5, 0.75, 1]
                }
            )

            // Observe all headings
            document
                .querySelectorAll(
                    '.article-content h1, .article-content h2, .article-content h3, .article-content h4'
                )
                .forEach((heading) => {
                    if (heading.id) {
                        this.observer.observe(heading)
                    }
                })
        },

        // 滚动到指定标题
        scrollToHeading(id) {
            const element = document.getElementById(id)
            if (element) {
                const header = document.querySelector('.site-header') || {
                    offsetHeight: 0
                }
                const offset = header.offsetHeight + 20
                const targetPosition = element.offsetTop - offset

                // 暂时停止 Observer 更新
                if (this.observer) {
                    this.observer.disconnect()
                }

                // 滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                })

                // 设置 active，并在滚动完成后恢复 observer
                this.activeHeading = id

                // 恢复 observer 观察（延迟一点避免抢占）
                setTimeout(() => {
                    this.initHeadingObserver()
                }, 800)
            }
        },

        updateReadProgress() {
            const article = document.querySelector('.article-content')
            if (!article) return

            const scrollY = window.scrollY || document.documentElement.scrollTop
            const windowHeight = window.innerHeight
            const rect = article.getBoundingClientRect()
            const articleTop = rect.top + scrollY
            const articleHeight = article.scrollHeight
            const articleBottom = articleTop + articleHeight

            // 如果文章还没进入视口
            if (scrollY + windowHeight < articleTop) {
                this.readProgress = 0
                return
            }

            // 如果已经完全阅读完
            if (scrollY > articleBottom) {
                this.readProgress = 100
                return
            }

            // 计算滚动的相对距离
            const scrolled = scrollY + windowHeight - articleTop
            const totalScrollable = articleHeight + windowHeight
            const progress = Math.min(
                100,
                Math.max(0, Math.round((scrolled / totalScrollable) * 100))
            )

            this.readProgress = progress
        }
    },
    async created() {
        await this.getArticle()
        window.addEventListener('resize', this.updateActionBarPosition)
    },
    mounted() {
        window.addEventListener('scroll', this.updateActiveHeading)
        window.addEventListener('scroll', this.updateReadProgress)
        this.$nextTick(() => {
            this.generateToc()
            this.initHeadingObserver()
            this.updateReadProgress()
        })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.updateActiveHeading)
        window.removeEventListener('resize', this.updateActionBarPosition)
        const images = document.querySelectorAll('.article-content img')
        images.forEach((img) => {
            img.removeEventListener('click', this.handleImageClick)
        })
        if (this.observer) {
            this.observer.disconnect()
        }
        window.removeEventListener('scroll', this.updateReadProgress)
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