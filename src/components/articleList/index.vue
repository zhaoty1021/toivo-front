<template>
    <div class="article-list-container">
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
import ArticleItem from './ArticleItem.vue'

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
    width: 100%;
    display: flex;
    padding-right: 20px;

    .article-box {
        font-size: 1rem;
        width: 100%;
    }
}
</style>