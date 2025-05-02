<template>
    <div class="category-container" :class="theme">
        <!-- 导航栏占位 -->
        <div class="nav-placeholder"></div>

        <div class="category-content">
            <!-- 主内容区 -->
            <div class="category-main">
                <!-- 分类统计图表 - 环形进度图 -->
                <div class="category-chart">
                    <div class="section-header">
                        <svg-icon name="chart" class="icon"></svg-icon>
                        <span class="title">分类分布</span>
                    </div>
                    <div class="chart-container">
                        <div class="ring-chart">
                            <svg width="300" height="300" viewBox="0 0 300 300">
                                <circle
                                    v-for="(category, index) in categoryList"
                                    :key="index"
                                    class="ring-segment"
                                    :stroke="getHueColor(index)"
                                    stroke-width="20"
                                    :stroke-dasharray="
                                        getDashArray(category.articleNum)
                                    "
                                    stroke-dashoffset="25"
                                    fill="transparent"
                                    r="120"
                                    cx="150"
                                    cy="150"
                                    :transform="`rotate(${getRotation(
                                        index
                                    )}, 150, 150)`"
                                />
                                <text
                                    x="150"
                                    y="150"
                                    text-anchor="middle"
                                    dominant-baseline="middle"
                                    class="chart-total"
                                >
                                    {{ totalArticles }}
                                </text>
                                <text
                                    x="150"
                                    y="180"
                                    text-anchor="middle"
                                    class="chart-label"
                                >
                                    总文章数
                                </text>
                            </svg>
                            <div class="chart-legend">
                                <div
                                    v-for="(category, index) in categoryList"
                                    :key="index"
                                    class="legend-item"
                                    @click="handleCategoryClick(category.id)"
                                >
                                    <span
                                        class="legend-color"
                                        :style="{
                                            background: getHueColor(index)
                                        }"
                                    ></span>
                                    <span class="legend-name">{{
                                        category.name
                                    }}</span>
                                    <span class="legend-count">{{
                                        category.articleNum
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分类标签云 -->
                <div class="category-cloud">
                    <div class="section-header">
                        <svg-icon name="category" class="icon"></svg-icon>
                        <span class="title"
                            >文章分类({{ categoryList.length }})</span
                        >
                    </div>
                    <div class="tag-cloud">
                        <div
                            v-for="(category, index) in categoryList"
                            :key="index"
                            class="tag-item"
                            :class="{ active: activeCategory === category.id }"
                            :style="{
                                '--tag-size': getTagSize(category.articleNum),
                                '--hue': getHue(index)
                            }"
                            @click="handleCategoryClick(category.id)"
                        >
                            {{ category.name }}
                            <span class="count">{{ category.articleNum }}</span>
                        </div>
                    </div>
                </div>

                <!-- 时间轴文章列表 -->
                <div class="timeline-list" v-if="articleList.length">
                    <div
                        class="timeline-item"
                        v-for="(article, index) in sortedArticles"
                        :key="index"
                    >
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-date">
                                {{ article.formatCreateTime }}
                            </div>
                            <router-link
                                :to="'/article/' + article.id"
                                class="timeline-title"
                            >
                                {{ article.title }}
                            </router-link>
                            <div class="timeline-tags">
                                <span
                                    v-for="tag in article.tagList"
                                    :key="tag.id"
                                    class="tag"
                                    @click.stop="handleTagClick(tag.id)"
                                >
                                    <svg-icon name="tag"></svg-icon>
                                    {{ tag.name }}
                                </span>
                            </div>
                            <div class="timeline-excerpt">
                                {{ article.excerpt }}
                            </div>
                        </div>
                    </div>

                    <!-- 分页 -->
                    <sy-pagination
                        v-if="pages > 1"
                        :pageNo="pageData.pageNo"
                        :pages="pages"
                        :loading="isLoading"
                        @changePage="handlePageChange"
                    />
                </div>

                <sy-empty v-else message="此分类下暂无发布文章" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 更丰富的Mock数据
const mockCategories = [
    { id: 1, name: '前端开发', articleNum: 42 },
    { id: 2, name: '后端技术', articleNum: 36 },
    { id: 3, name: '移动开发', articleNum: 18 },
    { id: 4, name: '人工智能', articleNum: 27 },
    { id: 5, name: '数据库', articleNum: 15 },
    { id: 6, name: 'DevOps', articleNum: 12 },
    { id: 7, name: '云计算', articleNum: 22 },
    { id: 8, name: '区块链', articleNum: 9 },
    { id: 9, name: '物联网', articleNum: 14 },
    { id: 10, name: '大数据', articleNum: 19 }
]

const mockArticles = [
    {
        id: 1,
        title: 'Vue3 Composition API 深度解析',
        formatCreateTime: '2023-09-15',
        excerpt: '本文详细介绍了Vue3的Composition API使用方法和最佳实践...',
        tagList: [
            { id: 1, name: 'Vue3' },
            { id: 2, name: '前端' }
        ]
    },
    {
        id: 2,
        title: 'Spring Boot 3.0新特性全面解析',
        formatCreateTime: '2023-09-10',
        excerpt: 'Spring Boot 3.0带来了许多令人兴奋的新功能，本文将一一介绍...',
        tagList: [
            { id: 3, name: 'Spring' },
            { id: 4, name: 'Java' }
        ]
    },
    {
        id: 3,
        title: 'Flutter 3.0跨平台开发实践',
        formatCreateTime: '2023-09-05',
        excerpt: '分享我们在实际项目中使用Flutter 3.0进行跨平台开发的经验...',
        tagList: [
            { id: 5, name: 'Flutter' },
            { id: 6, name: '移动开发' }
        ]
    },
    {
        id: 4,
        title: 'TensorFlow 2.8模型优化技巧',
        formatCreateTime: '2023-08-28',
        excerpt: '介绍几种在TensorFlow 2.8中优化模型性能的有效方法...',
        tagList: [
            { id: 7, name: 'AI' },
            { id: 8, name: '机器学习' }
        ]
    },
    {
        id: 5,
        title: 'Redis 7.0新数据结构解析',
        formatCreateTime: '2023-08-20',
        excerpt: 'Redis 7.0引入了几个有趣的新数据结构，本文将详细分析...',
        tagList: [
            { id: 9, name: 'Redis' },
            { id: 10, name: '数据库' }
        ]
    },
    {
        id: 6,
        title: 'Kubernetes服务网格实战',
        formatCreateTime: '2023-08-15',
        excerpt: '如何在Kubernetes集群中实现高效的服务网格通信...',
        tagList: [
            { id: 11, name: 'K8s' },
            { id: 12, name: 'DevOps' }
        ]
    },
    {
        id: 7,
        title: 'WebAssembly在现代前端中的应用',
        formatCreateTime: '2023-08-10',
        excerpt: '探索WebAssembly如何提升前端应用性能的几种场景...',
        tagList: [
            { id: 13, name: 'WASM' },
            { id: 2, name: '前端' }
        ]
    },
    {
        id: 8,
        title: 'Serverless架构设计模式',
        formatCreateTime: '2023-08-05',
        excerpt: '介绍几种在Serverless架构中常用的设计模式和实践...',
        tagList: [
            { id: 14, name: 'Serverless' },
            { id: 15, name: '云计算' }
        ]
    }
]

const theme = inject('theme')
const route = useRoute()
const router = useRouter()

// 响应式数据
const categoryList = ref([])
const articleList = ref([])
const activeCategory = ref(null)
const pages = ref(1)
const isLoading = ref(false)

// 计算属性
const sortedArticles = computed(() => {
    return [...articleList.value].sort(
        (a, b) => new Date(b.formatCreateTime) - new Date(a.formatCreateTime)
    )
})

const totalArticles = computed(() => {
    return categoryList.value.reduce(
        (sum, category) => sum + category.articleNum,
        0
    )
})

const pageData = ref({
    pageNo: 1,
    pageSize: 5,
    categoryId: null
})

// 获取分类列表
const getCategoryList = () => {
    isLoading.value = true
    setTimeout(() => {
        categoryList.value = mockCategories
        if (categoryList.value.length) {
            activeCategory.value = route.query.id || categoryList.value[0].id
            pageData.value.categoryId = activeCategory.value
            getArticleList()
        }
        isLoading.value = false
    }, 500)
}

// 获取文章列表
const getArticleList = () => {
    isLoading.value = true
    setTimeout(() => {
        articleList.value = mockArticles
        pages.value = 2
        isLoading.value = false
    }, 100)
}

// 分类点击处理
const handleCategoryClick = (categoryId) => {
    if (activeCategory.value === categoryId) return

    activeCategory.value = categoryId
    pageData.value = {
        pageNo: 1,
        pageSize: 8,
        categoryId: categoryId
    }
    articleList.value = []
    getArticleList()
}

// 标签点击处理
const handleTagClick = (tagId) => {
    router.push({ path: '/tags', query: { id: tagId } })
}

// 分页处理
const handlePageChange = (page) => {
    pageData.value.pageNo = page
    // 模拟加载更多数据
    setTimeout(() => {
        if (page > 1) {
            articleList.value = [...articleList.value, ...mockArticles]
        } else {
            articleList.value = mockArticles
        }
        // 不需要手动设置loading=false，分页组件会自动处理
    }, 800)
}

// 计算标签大小
const getTagSize = (count) => {
    if (count > 50) return '1.4rem'
    if (count > 30) return '1.2rem'
    if (count > 10) return '1rem'
    return '0.9rem'
}

// 环形图计算
const getDashArray = (count) => {
    const total = totalArticles.value
    const percentage = (count / total) * 100
    const circumference = 2 * Math.PI * 120
    return `${(circumference * percentage) / 100} ${circumference}`
}

const getRotation = (index) => {
    if (index === 0) return -90
    let sum = 0
    for (let i = 0; i < index; i++) {
        const percentage =
            (categoryList.value[i].articleNum / totalArticles.value) * 360
        sum += percentage
    }
    return sum - 90
}

// 生成颜色
const getHueColor = (index) => {
    const hues = [180, 200, 220, 240, 260, 280, 300, 320, 340, 360]
    return `hsl(${hues[index % hues.length]}, 80%, 60%)`
}

const getHue = (index) => {
    const hues = [180, 200, 220, 240, 260, 280, 300, 320, 340, 360]
    return hues[index % hues.length]
}

onMounted(() => {
    getCategoryList()
})
</script>

<style lang="scss" scoped>
.category-container {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --card-bg: rgba(30, 30, 60, 0.8);
    --border-color: rgba(0, 240, 255, 0.3);
    --hover-bg: rgba(0, 240, 255, 0.1);
    --tag-bg: rgba(0, 240, 255, 0.15);
    --timeline-line: 2px dashed var(--primary-color);

    min-height: 100vh;
    padding: 20px 0;
    transition: all 0.3s ease;

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --bg-color: #f0f2f5;
        --text-color: #333344;
        --card-bg: rgba(255, 255, 255, 0.9);
        --border-color: rgba(0, 102, 204, 0.3);
        --hover-bg: rgba(0, 102, 204, 0.1);
        --tag-bg: rgba(0, 102, 204, 0.1);
        --timeline-line: 2px dashed var(--primary-color);
    }
}

.nav-placeholder {
    height: 60px;
}

.category-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.category-main {
    width: 100%;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: var(--text-color);

    .icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        color: var(--primary-color);
    }

    .title {
        font-size: 1.3rem;
        font-weight: 600;
    }
}

/* 环形图表样式 */
.category-chart {
    margin-bottom: 40px;
    background: var(--card-bg);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
}

.ring-chart {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 40px;
    width: 100%;
}

.ring-segment {
    transition: all 0.5s ease;
    opacity: 0.9;

    &:hover {
        opacity: 1;
        stroke-width: 24;
    }
}

.chart-total {
    font-size: 2.5rem;
    font-weight: bold;
    fill: var(--primary-color);
}

.chart-label {
    font-size: 1rem;
    fill: var(--text-color);
    opacity: 0.8;
}

.chart-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
}

.legend-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--hover-bg);
        transform: translateX(5px);
    }
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 12px;
}

.legend-name {
    flex: 1;
    color: var(--text-color);
    font-size: 0.95rem;
}

.legend-count {
    color: var(--primary-color);
    font-weight: bold;
    font-size: 0.9rem;
}

/* 标签云样式 */
.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;

    .tag-item {
        position: relative;
        padding: 8px 15px;
        border-radius: 20px;
        background: var(--tag-bg);
        color: var(--text-color);
        font-size: var(--tag-size, 1rem);
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
        backdrop-filter: blur(5px);
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                45deg,
                hsla(var(--hue), 80%, 50%, 0.3),
                hsla(calc(var(--hue) + 30), 80%, 50%, 0.1)
            );
            z-index: -1;
        }

        .count {
            margin-left: 5px;
            font-size: 0.8em;
            background: var(--primary-color);
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
        }

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 240, 255, 0.2);
        }

        &.active {
            background: var(--primary-color);
            color: white;
            font-weight: bold;
            box-shadow: 0 0 15px var(--primary-color);
        }
    }
}

/* 时间轴样式 */
.timeline-list {
    position: relative;
    padding-left: 30px;
    margin-top: 20px;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 15px;
        width: var(--timeline-line);
        transform: translateX(-50%);
    }
}

.timeline-item {
    position: relative;
    padding-bottom: 30px;
    transition: all 0.3s ease;

    &:last-child {
        padding-bottom: 0;
    }

    .timeline-marker {
        position: absolute;
        left: -30px;
        top: 5px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color);
        box-shadow: 0 0 0 4px var(--bg-color), 0 0 0 6px var(--primary-color);
        z-index: 1;
    }

    .timeline-content {
        background: var(--card-bg);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;

        &:hover {
            transform: translateX(5px);
            box-shadow: 0 3px 10px rgba(0, 240, 255, 0.1);
        }
    }

    .timeline-date {
        font-size: 0.85rem;
        color: var(--primary-color);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .timeline-title {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.2s;
        display: block;
        margin-bottom: 8px;

        &:hover {
            color: var(--primary-color);
        }
    }

    .timeline-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;

        .tag {
            display: flex;
            align-items: center;
            padding: 2px 8px;
            background: var(--hover-bg);
            color: var(--text-color);
            border-radius: 12px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
            gap: 4px;

            svg {
                width: 12px;
                height: 12px;
            }

            &:hover {
                background: var(--primary-color);
                color: white;
            }
        }
    }

    .timeline-excerpt {
        margin-top: 10px;
        color: var(--text-color);
        opacity: 0.8;
        font-size: 0.9rem;
        line-height: 1.5;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .ring-chart {
        flex-direction: column;
        gap: 20px;
    }

    .chart-legend {
        max-width: 100%;
    }

    .tag-cloud {
        justify-content: center;
    }

    .timeline-list {
        padding-left: 20px;

        &::before {
            left: 10px;
        }
    }

    .timeline-item {
        .timeline-marker {
            left: -20px;
            width: 12px;
            height: 12px;
        }

        .timeline-content {
            padding: 12px;
        }
    }
}
</style>