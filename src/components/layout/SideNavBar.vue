<template>
    <div>
        <el-drawer
            class="nav"
            direction="ltr"
            :with-header="false"
            v-model="dialogVisible"
            :show-close="false"
            :style="drawerStyle"
        >
            <!-- 内容 -->
            <div class="warpper">
                <!-- 博主介绍 -->
                <div class="blogger-info">
                    <el-avatar
                        :src="siteStore.getWebInfo.authorAvatar"
                    ></el-avatar>
                    <h2 class="site-title">{{ siteStore.getWebInfo.name }}</h2>
                </div>

                <hr class="divider" />
                <!-- 页面导航 -->
                <div class="menu-container">
                    <div
                        v-for="(item, index) in menuItems"
                        :key="index"
                        class="menus-item"
                        :style="{ animationDelay: `${index * 0.1}s` }"
                    >
                        <a @click="handleClike(item.path)">
                            <component
                                :is="item.icon"
                                class="menu-icon"
                            ></component>
                            {{ item.name }}
                        </a>
                    </div>

                    <template v-if="!isLogin">
                        <div
                            class="menus-item"
                            :style="{
                                animationDelay: `${menuItems.length * 0.1}s`
                            }"
                        >
                            <a @click="openLogin">
                                <User class="menu-icon"></User>登录
                            </a>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            class="menus-item"
                            :style="{
                                animationDelay: `${menuItems.length * 0.1}s`
                            }"
                        >
                            <a @click="handleClike('/user')">
                                <User class="menu-icon"></User>个人中心
                            </a>
                        </div>
                        <div
                            class="menus-item"
                            :style="{
                                animationDelay: `${
                                    (menuItems.length + 1) * 0.1
                                }s`
                            }"
                        >
                            <a @click="handleLogout">
                                <CircleClose class="menu-icon"></CircleClose
                                >退出
                            </a>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 底部扫描线效果 -->
            <div class="scanline"></div>
        </el-drawer>
    </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
    House,
    Folder,
    Film,
    DocumentRemove,
    Message,
    ChatLineRound,
    Link,
    InfoFilled,
    User,
    CircleClose
} from '@element-plus/icons-vue'
import { logout } from '@/api'
import { removeToken, getToken } from '@/utils/cookie'
import { useSiteStore } from '@/store/moudel/site.js'
import { useUserStore } from '@/store/moudel/user.js'

const router = useRouter()
const route = useRoute()
const siteStore = useSiteStore()
const userStore = useUserStore()
const { proxy } = getCurrentInstance()

// 注入主题
const theme = inject('theme')

// 菜单项配置
const menuItems = [
    { path: '/', name: '首页', icon: House },
    { path: '/archive', name: '归档', icon: Folder },
    { path: '/category', name: '分类', icon: Film },
    { path: '/tags', name: '标签', icon: DocumentRemove },
    { path: '/message', name: '留言', icon: Message },
    { path: '/say', name: '说说', icon: ChatLineRound },
    { path: '/link', name: '友链', icon: Link },
    { path: '/about', name: '关于', icon: InfoFilled }
]

// 控制框显示的方法
const dialogVisible = computed({
    get() {
        return siteStore.getNavBarDialogVisible
    },
    set(value) {
        siteStore.setNavBarDialogVisible(value)
    }
})

// 登录状态
const isLogin = computed(() => !!getToken())

// 根据主题设置样式
const drawerStyle = computed(() => {
    const isDark = theme.value === 'dark'
    return {
        '--primary-color': isDark ? '#00f0ff' : '#0066cc',
        '--secondary-color': isDark ? '#ff00f0' : '#cc00ff',
        '--accent-color': isDark ? '#00ff9d' : '#00aa66',
        '--bg-color': isDark ? '#0a0a12' : '#f8f9fa',
        '--text-color': isDark ? '#e0e0ff' : '#333344',
        '--border-color': isDark
            ? 'rgba(0, 240, 255, 0.3)'
            : 'rgba(0, 102, 204, 0.3)',
        '--grid-color': isDark
            ? 'rgba(0, 240, 255, 0.1)'
            : 'rgba(0, 102, 204, 0.1)',
        '--footer-bg': isDark
            ? 'rgba(10, 14, 20, 0.9)'
            : 'rgba(248, 249, 250, 0.9)',
        '--glow-effect': isDark
            ? '0 0 10px rgba(0, 240, 255, 0.7), 0 0 20px rgba(0, 240, 255, 0.5)'
            : '0 0 10px rgba(0, 102, 204, 0.5), 0 0 20px rgba(0, 102, 204, 0.3)'
    }
})

function handleClike(val) {
    siteStore.setNavBarDialogVisible(false)
    router.push({ path: val })
}

function openLogin() {
    userStore.setLoginFlag(true)
}

function handleLogout() {
    if (route.path === '/user') {
        router.go(-1)
    }
    logout()
        .then((res) => {
            removeToken()
            location.reload()
            proxy.$modal.msgSuccess('注销成功')
        })
        .catch((err) => {
            console.log(err)
        })
}
</script>
  
  <style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');

.nav {
    ::v-deep(.el-drawer) {
        width: 55% !important;
        background: var(--footer-bg);
        backdrop-filter: blur(8px);
        font-family: 'Roboto Mono', monospace;
        transition: all 0.3s ease;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(var(--grid-color) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            opacity: 0.1;
            z-index: 0;
        }
    }

    .warpper {
        position: relative;
        z-index: 1;
        height: 100%;
        overflow: hidden;

        .blogger-info {
            padding: 20px 30px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;

            ::v-deep(.el-avatar) {
                width: 80px;
                height: 80px;
                border: 2px solid var(--primary-color);
                box-shadow: var(--glow-effect);
                transition: all 0.3s ease;

                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 15px var(--primary-color);
                }
            }

            .site-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
                margin: 0;
                color: var(--primary-color);
                text-shadow: 0 0 8px var(--primary-color);
                letter-spacing: 2px;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50%;
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        var(--primary-color),
                        var(--secondary-color),
                        transparent
                    );
                }
            }
        }

        .divider {
            border: none;
            height: 1px;
            background: linear-gradient(
                90deg,
                transparent,
                var(--primary-color),
                transparent
            );
            margin: 20px 30px;
            position: relative;

            &::before {
                content: '//';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: var(--footer-bg);
                padding: 0 20px;
                color: var(--primary-color);
                font-family: 'Roboto Mono', monospace;
                font-size: 1.2em;
            }
        }

        .menu-container {
            padding: 0 20px 40px;
            height: calc(100% - 200px);
            overflow-y: auto;

            .menus-item {
                margin-bottom: 10px;
                animation: sidebarItem 0.5s ease forwards;
                opacity: 0;
                transform: translateX(20px);

                a {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    color: var(--text-color);
                    text-decoration: none;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;

                    &::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 0;
                        height: 2px;
                        background: var(--primary-color);
                        transition: width 0.3s ease;
                    }

                    &:hover {
                        background: rgba(0, 240, 255, 0.05);
                        transform: translateX(5px);

                        &::before {
                            width: 100%;
                        }

                        .menu-icon {
                            color: var(--primary-color);
                            text-shadow: 0 0 5px var(--primary-color);
                        }
                    }
                }

                .menu-icon {
                    margin-right: 15px;
                    width: 20px;
                    height: 20px;
                    color: var(--accent-color);
                    transition: all 0.3s ease;
                }
            }
        }
    }

    .scanline {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            var(--primary-color),
            transparent
        );
        animation: scanline 5s linear infinite;
        opacity: 0.5;
    }
}

@keyframes sidebarItem {
    0% {
        opacity: 0;
        transform: translateX(20px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pulse {
    0% {
        opacity: 0.7;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.7;
    }
}

@keyframes scanline {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(100%);
    }
}
</style>