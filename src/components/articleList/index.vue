<template>
    <div class="article-list-container" :class="theme">
        <div class="article-box" v-if="articleList.length > 0">
            <ArticleItem
                v-for="(item, index) in articleList"
                :key="index"
                :article="item"
            />

            <sy-pagination
                :pageNo="pageNo"
                :pages="pages"
                @changePage="$emit('page-change', $event)"
            />
        </div>
        <sy-empty v-else message="很抱歉，暂无文章" />
    </div>
</template>

<script setup>
import { inject } from 'vue'
import ArticleItem from './ArticleItem.vue'

const theme = inject('theme')

defineProps({
    articleList: {
        type: Array,
        default: () => []
    },
    pages: {
        type: Number,
        default: 1
    },
    pageNo: {
        type: Number,
        required: true
    }
})

defineEmits(['page-change'])
</script>

<style lang="scss" scoped>
.article-list-container {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --border-line: rgba(0, 240, 255, 0.3);
    --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
    --card-bg: rgba(30, 30, 60, 0.8);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --hover-bg: rgba(0, 240, 255, 0.1);

    width: 100%;
    display: flex;
    padding-right: 20px;

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --bg-color: #f0f2f5;
        --text-color: #333344;
        --border-color: rgba(0, 102, 204, 0.3);
        --border-line: rgba(0, 102, 204, 0.3);
        --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5);
        --card-bg: rgba(255, 255, 255, 0.9);
        --text-primary: #333344;
        --text-secondary: rgba(51, 51, 68, 0.7);
        --hover-bg: rgba(0, 102, 204, 0.1);
    }

    .article-box {
        font-size: 1rem;
        width: 100%;
    }
}
</style>
