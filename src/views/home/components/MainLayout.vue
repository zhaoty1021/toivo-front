<template>
    <Brand />
    <BrandImage />
    <div class="main-container container" v-sy-loading="fullscreenLoading">
        <TopSection :bannerList="bannerList" @wheel="$emit('wheel', $event)" />

        <HotCategories
            v-model:activeName="activeName"
            :categoryList="categoryList"
            @tab-click="handleTabClick"
        />

        <SaySection
            :sayList="sayList"
            :currentIndex="currentIndex"
            @mouseenter="$emit('mouseenter-say')"
            @mouseleave="$emit('mouseleave-say')"
        />

        <div class="article-content">
            <ArticleList
                :articleList="articleList"
                :pages="pages"
                :pageNo="pageData.pageNo"
                @page-change="$emit('page-change', $event)"
            />

            <RightSidebar
                :newArticleList="newArticleList"
                :tagList="tagList"
                :webInfo="webInfo"
            />
        </div>
    </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import Brand from '@/components/layout/Brand.vue'
import BrandImage from '@/components/layout/BrandImage.vue'
import TopSection from './TopSection.vue'
import HotCategories from './HotCategories.vue'
import SaySection from './SaySection.vue'
import ArticleList from '@/components/articleList/index.vue'
import RightSidebar from './RightSidebar.vue'

defineProps({
    fullscreenLoading: Boolean,
    bannerList: Array,
    categoryList: Array,
    activeName: String,
    sayList: Array,
    currentIndex: Number,
    articleList: Array,
    pages: Number,
    pageNo: Number,
    newArticleList: Array,
    tagList: Array,
    webInfo: Object,
    pageData: {
        type: Object,
        required: true,
        default: () => ({ pageNo: 1, pageSize: 10 })
    }
})
const activeName = ref('0')
const categoryList = ref([
    {
        id: null,
        name: '最新',
        icon: 'new',
        desc: 'create_time'
    },
    {
        id: null,
        name: '阅读最多',
        icon: 'hot2',
        desc: 'quantity'
    },
    {
        id: null,
        name: '评论最多',
        icon: 'commenthot',
        desc: 'quantity'
    }
])
const articleList = ref([
    {
        id: 1,
        title: '测试文章璐璐璐璐璐璐璐璐璐',
        quantity: 100,
        createTime: '2024-07-18 10:08:21',
        updateTime: '2024-07-18 10:08:21',
        cover: 'http://124.70.85.121:9000/t-blog/cover/371476.png',
        isOriginal: true,
        isStick: true,
        summary: '测试文章',
        author: {
            avatar: 'http://124.70.85.121:9000/t-blog/test/20240718-100821.jpeg',
            nickname: 'Tyrone'
        },
        category: {
            id: 1,
            name: '测试分类'
        },
        tag: [
            {
                id: 3,
                name: '前端开发'
            }
        ]
    },
    {
        id: 2,
        title: '测试文章璐璐璐璐璐璐璐璐璐',
        quantity: 100,
        createTime: '2025-04-18 10:08:21',
        updateTime: '2025-04-18 10:08:21',
        isOriginal: true,
        isStick: false,
        summary: '这是第二个测试文章',
        author: {
            avatar: 'http://124.70.85.121:9000/t-blog/test/20240718-100821.jpeg',
            nickname: 'Tyrone'
        },
        category: {
            id: 2,
            name: '测试分类2'
        },
        tag: [
            {
                id: 2,
                name: '测试标签2'
            },
            {
                id: 3,
                name: '测试标签3'
            }
        ]
    }
])

function handleTabClick(tab) {
    const item = categoryList.value[tab.index]
    // 处理点击逻辑...
}

defineEmits([
    'wheel',
    'tab-click',
    'page-change',
    'mouseenter-say',
    'mouseleave-say'
])
</script>
  
  <style lang="scss" scoped>
.main-container {
    width: 90%;
    display: table;

    .main {
        width: 100%;
        margin-top: 30px;
        display: flex;

        @media screen and (max-width: 1118px) {
            width: 100%;
        }
    }
}
.article-content {
    width: 100%;
    display: flex;
    margin-top: 20px;
}
</style>