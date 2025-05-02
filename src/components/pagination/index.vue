<template>
    <div class="pagination-container" :class="theme">
        <!-- 加载更多按钮 -->
        <div
            v-if="showLoadMore"
            class="load-more"
            @click="handleLoadMore"
            :class="{ loading: isLoading }"
        >
            <span v-if="!isLoading">加载更多</span>
            <span v-else>加载中...</span>
            <svg-icon
                v-if="!isLoading"
                name="arrow-down"
                class="arrow-icon"
            ></svg-icon>
            <svg-icon v-else name="loading" class="loading-icon"></svg-icon>
        </div>

        <!-- 底线提示 -->
        <div v-if="showEndLine" class="end-line">
            <div class="divider"></div>
            <div class="text">😛 我也是有底线的...</div>
            <div class="divider"></div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, computed } from 'vue'

const theme = inject('theme')
const isLoading = ref(false)

const props = defineProps({
    pageNo: {
        type: Number,
        default: 1
    },
    pages: {
        type: Number,
        default: 1
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['changePage'])

// 计算属性控制显示状态
const showLoadMore = computed(() => {
    return props.pageNo < props.pages && !isLoading.value
})

const showEndLine = computed(() => {
    return props.pageNo >= props.pages && !isLoading.value
})

watch(
    () => props.loading,
    (val) => {
        isLoading.value = val
    }
)

const handleLoadMore = () => {
    if (isLoading.value) return

    isLoading.value = true
    emit('changePage', props.pageNo + 1)

    // 3秒超时自动重置，防止父组件忘记更新状态
    setTimeout(() => {
        isLoading.value = false
    }, 3000)
}

defineExpose({
    setLoading: (val) => {
        isLoading.value = val
    }
})
</script>

<style lang="scss" scoped>
.pagination-container {
    --primary-color: #00f0ff;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --hover-bg: rgba(0, 240, 255, 0.1);
    --card-bg: rgba(30, 30, 60, 0.8);

    &.light {
        --primary-color: #0066cc;
        --text-color: #333344;
        --border-color: rgba(0, 102, 204, 0.3);
        --hover-bg: rgba(0, 102, 204, 0.1);
        --card-bg: rgba(255, 255, 255, 0.9);
    }

    margin: 30px 0;
    user-select: none;
}

.load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 40px;
    margin: 0 auto;
    padding: 0 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 30px;
    color: var(--primary-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(.loading) {
        background: var(--hover-bg);
        box-shadow: 0 2px 10px rgba(0, 240, 255, 0.2);

        .arrow-icon {
            transform: translateY(3px);
        }
    }

    &:active:not(.loading) {
        transform: scale(0.95);
    }

    &.loading {
        opacity: 0.7;
        cursor: wait;
    }

    .arrow-icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
        transition: transform 0.3s ease;
    }
}

.end-line {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 40px 0;
    color: var(--text-color);

    .divider {
        flex: 1;
        height: 1px;
        background: var(--border-color);
        opacity: 0.5;
    }

    .text {
        padding: 0 20px;
        font-size: 14px;
        color: var(--text-color);
        opacity: 0.7;
        white-space: nowrap;
    }
}

.loading-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .load-more {
        width: 140px;
        height: 36px;
        font-size: 13px;
    }

    .end-line .text {
        padding: 0 15px;
        font-size: 13px;
    }
}
</style>