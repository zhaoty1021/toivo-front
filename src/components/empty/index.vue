<template>
    <div class="empty-container" :class="theme">
        <div class="empty-content">
            <svg-icon name="empty" class="empty-icon"></svg-icon>
            <div class="empty-message">{{ message }}</div>
            <div class="empty-subtext" v-if="subtext">{{ subtext }}</div>
            <slot name="action"></slot>
        </div>
    </div>
</template>
  
  <script setup>
import { inject } from 'vue'

const theme = inject('theme')

const props = defineProps({
    message: {
        type: String,
        default: '暂无数据'
    },
    subtext: {
        type: String,
        default: ''
    }
})
</script>
  
  <style lang="scss" scoped>
.empty-container {
    --empty-color: #a0a0a0;
    --empty-bg: transparent;
    --text-color: #fff;
    --primary-color: #00f0ff;

    &.light {
        --empty-color: #c0c0c0;
        --text-color: #666;
        --primary-color: #0066cc;
    }

    width: 100%;
    padding: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--empty-bg);
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80%;
    text-align: center;

    .empty-icon {
        width: 180px;
        height: 120px;
        color: var(--empty-color);
        opacity: 0.6;
        transition: all 0.3s ease;

        &:hover {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }

    .empty-message {
        margin-top: 20px;
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
        line-height: 1.5;
    }

    .empty-subtext {
        margin-top: 8px;
        font-size: 14px;
        color: var(--text-color);
        opacity: 0.8;
        line-height: 1.4;
    }

    :slotted(.empty-action) {
        margin-top: 24px;

        .el-button {
            background: var(--primary-color);
            color: white;
            border: none;

            &:hover {
                opacity: 0.9;
            }
        }
    }
}

@media (max-width: 768px) {
    .empty-content {
        max-width: 90%;

        .empty-icon {
            width: 140px;
            height: 100px;
        }

        .empty-message {
            font-size: 15px;
        }
    }
}
</style>