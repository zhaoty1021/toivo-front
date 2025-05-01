<template>
    <div class="floating-toolbar" :style="{ right: right }" :class="theme">
        <!-- 聊天室按钮 -->
        <el-tooltip effect="dark" content="聊天室" placement="left">
            <div class="toolbar-btn" @click="handleGoIm">
                <el-icon :size="20"><ChatDotSquare /></el-icon>
            </div>
        </el-tooltip>

        <!-- 二维码弹出框 -->
        <el-popover placement="left" trigger="click" :width="240">
            <template #reference>
                <div class="toolbar-btn">
                    <el-icon :size="20"><Picture /></el-icon>
                </div>
            </template>
            <el-tabs v-model="activeName" class="qr-tabs">
                <el-tab-pane label="公众号" name="first">
                    <div class="qr-container">
                        <el-image
                            :src="defaultSetting.wxOpenImg"
                            fit="contain"
                        />
                        <p class="qr-tip">扫码关注公众号</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="小程序" name="second">
                    <div class="qr-container">
                        <el-image
                            :src="defaultSetting.appletImg"
                            fit="contain"
                        />
                        <p class="qr-tip">扫码使用小程序</p>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-popover>

        <!-- 截图按钮 -->
        <el-tooltip effect="dark" content="网页截图" placement="left">
            <div class="toolbar-btn" @click="captureScreen">
                <el-icon :size="20"><Camera /></el-icon>
            </div>
        </el-tooltip>

        <!-- 回到顶部按钮 -->
        <el-tooltip effect="dark" content="回到顶部" placement="left">
            <div
                class="toolbar-btn back-to-top"
                @click="backTop"
                @mouseenter="showPercentage = false"
                @mouseleave="showPercentage = true"
            >
                <svg-icon
                    v-if="!showPercentage || percentage >= 100"
                    name="arrow-up"
                    class="icon"
                />
                <span v-else class="percentage">{{ percentage }}%</span>
            </div>
        </el-tooltip>
    </div>
</template>
  
  <script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import html2canvas from 'html2canvas'

const theme = inject('theme')
const router = useRouter()
const { proxy } = getCurrentInstance()
const defaultSetting = ref(proxy.$setting)

// 工具栏位置控制
const right = ref('20px')
const percentage = ref(0)
const showPercentage = ref(true)
const activeName = ref('first')

// 滚动监听
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
    const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    percentage.value = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100
    )

    if (scrollTop <= 150) {
        right.value = '-80px'
    } else {
        right.value = '20px'
    }
}

function backTop() {
    const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 0) {
        window.requestAnimationFrame(backTop)
        window.scrollTo(0, scrollTop - scrollTop / 8)
    }
}

function handleGoIm() {
    if (!proxy.$store.getters.userInfo) {
        proxy.$store.dispatch('user/showLogin', true)
        return
    }
    router.push({ path: '/chat' })
}

function captureScreen() {
    html2canvas(document.body).then((canvas) => {
        const link = document.createElement('a')
        link.download =
            'screenshot_' + new Date().toISOString().slice(0, 10) + '.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
    })
}
</script>
  
  <style lang="scss" scoped>
.floating-toolbar {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --card-bg: #0a0a12;
    --hover-bg: rgba(0, 240, 255, 0.1);
    --glow-effect: 0 0 15px rgba(0, 240, 255, 0.3);

    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --bg-color: #f0f2f5;
        --text-color: #333344;
        --border-color: rgba(0, 102, 204, 0.3);
        --card-bg: rgba(255, 255, 255, 0.95);
        --hover-bg: rgba(0, 102, 204, 0.1);
        --glow-effect: 0 0 15px rgba(0, 102, 204, 0.2);
    }

    .toolbar-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--card-bg);
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                135deg,
                var(--primary-color),
                var(--secondary-color)
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        &:hover {
            transform: translateY(-3px);
            box-shadow: var(--glow-effect);

            &::before {
                opacity: 0.1;
            }

            .icon {
                color: var(--primary-color);
                filter: drop-shadow(0 0 5px var(--primary-color));
            }
        }

        .icon {
            width: 20px;
            height: 20px;
            transition: all 0.3s ease;
        }
    }

    .back-to-top {
        .percentage {
            font-size: 12px;
            font-weight: bold;
            color: var(--primary-color);
        }
    }
}

.qr-tabs {
    .qr-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;

        .el-image {
            width: 180px;
            height: 180px;
            margin-bottom: 10px;
            border-radius: 8px;
            overflow: hidden;
        }

        .qr-tip {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-top: 8px;
        }
    }

    :deep(.el-tabs__item) {
        padding: 0 12px;
        color: var(--text-color);
    }

    :deep(.el-tabs__nav-wrap::after) {
        background-color: var(--border-color);
    }
}
</style>