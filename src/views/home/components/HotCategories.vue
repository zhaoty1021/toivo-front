<template>
    <div class="hot-category" :class="theme">
        <el-tabs
            :model-value="activeName"
            class="category-tabs"
            @update:modelValue="$emit('update:activeName', $event)"
            @tab-click="$emit('tab-click', $event)"
        >
            <el-tab-pane
                v-for="(item, index) in categoryList"
                :key="index"
                :name="index + ''"
            >
                <template #label>
                    <span class="custom-tabs-label">
                        <span>{{ item.name }}</span>
                        <el-icon style="margin-left: 5px">
                            <svg-icon :name="item.icon" />
                        </el-icon>
                    </span>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { inject } from 'vue'

const theme = inject('theme')

defineProps({
    categoryList: Array,
    activeName: String
})

defineEmits(['update:activeName', 'tab-click'])
</script>

<style lang="scss" scoped>
.hot-category {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #000;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --border-line: rgba(0, 240, 255, 0.3);
    --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
    --card-bg: rgba(30, 30, 60, 0.8);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --hover-bg: rgba(0, 240, 255, 0.2); /* 增加透明度使hover更明显 */
    --hover-color: #00f0ff; /* 新增hover文字颜色变量 */

    margin-top: 50px;
    transition: all 0.3s ease;

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
        --hover-bg: rgba(0, 102, 204, 0.15); /* 亮色主题hover背景 */
        --hover-color: #0066cc; /* 亮色主题hover文字颜色 */
    }

    .category-tabs {
        ::v-deep(.el-tabs__nav-wrap::after) {
            background-color: transparent !important;
        }

        ::v-deep(.el-tabs__item) {
            background-color: transparent;
            border-radius: 8px;
            padding: 0 15px;
            margin-right: 5px;
            height: 36px;
            line-height: 36px;
            color: var(--text-secondary);
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            font-weight: 500; /* 增加字体权重 */

            &:hover {
                background-color: var(--hover-bg);
                color: var(--hover-color); /* 使用专门的hover颜色 */
                transform: translateY(-2px);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }

            &.is-active {
                background-color: var(--primary-color);
                color: white;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
            }

            &.is-top:last-child {
                padding-right: 20px;
            }

            &.is-top:nth-child(2) {
                padding-left: 20px;
            }
        }

        ::v-deep(.el-tabs__active-bar) {
            background-color: transparent;
            height: 2px;
        }

        ::v-deep(.el-tabs__nav-scroll) {
            border: 1px solid var(--border-color);
            background-color: var(--bg-color);
            border-radius: 10px;
            padding: 5px;
            display: flex;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            &:hover {
                box-shadow: var(--glow-effect);
                border-color: var(--primary-color);
            }
        }
    }

    .custom-tabs-label {
        display: flex;
        align-items: center;
        font-size: 14px;
        transition: all 0.3s ease;

        .el-icon {
            font-size: 18px;
            height: 18px;
            width: 18px;
            transition: all 0.3s ease;

            .svg-icon {
                height: 100%;
                width: 100%;
                color: inherit;
            }
        }

        &:hover {
            .el-icon {
                transform: scale(1.2);
                color: var(--hover-color); /* 使用hover颜色 */
            }
        }
    }
}
</style>