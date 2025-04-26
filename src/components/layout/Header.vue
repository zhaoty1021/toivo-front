<template>
    <div class="cyber-nav" :class="theme">
        <div class="nav-container">
            <!-- 3D Logo -->
            <div class="logo-box" @click="router.push('/')">
                <div class="logo-3d">
                    <span>T</span>
                    <span>O</span>
                    <span>I</span>
                    <span>V</span>
                    <span>O</span>
                </div>
                <div class="logo-watermelon">🍉</div>
            </div>

            <!-- 导航菜单 -->
            <div class="menu-box">
                <div
                    v-for="item in menuItems"
                    :key="item.path"
                    class="menu-item"
                    @click="handleMenuClick(item)"
                >
                    <component :is="item.icon" class="menu-icon" />
                    <span class="menu-text">{{ item.name }}</span>
                    <div class="menu-line"></div>
                </div>
            </div>

            <!-- 用户控制区 -->
            <div class="control-box">
                <!-- 昼夜模式切换开关 -->
                <div class="theme-switch" @click="toggleTheme">
                    <div class="switch-track">
                        <div class="switch-thumb">
                            <span class="sun-icon">☀️</span>
                            <span class="moon-icon">🌙</span>
                        </div>
                    </div>
                </div>

                <div class="user-avatar" @click="toggleUserMenu">
                    <img :src="userAvatar" alt="User" />
                    <div class="avatar-ring"></div>
                </div>

                <transition name="slide-fade">
                    <div v-if="showUserMenu" class="user-menu">
                        <div
                            class="user-menu-item"
                            @click="router.push('/user')"
                        >
                            <User class="icon" />
                            <span>个人中心</span>
                        </div>
                        <div class="user-menu-item" @click="logout">
                            <Power class="icon" />
                            <span>退出登录</span>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>
  
  <script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import {
    Home,
    Archive,
    Layers,
    Tag,
    MessageSquare,
    Mic,
    Link,
    Info,
    User,
    Power
} from 'lucide-vue-next'

const router = useRouter()
const theme = inject('theme')

// 切换主题
const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

// 菜单配置
const menuItems = [
    { path: '/', name: '首页', icon: Home, color: '#FF5F5F' },
    { path: '/archive', name: '归档', icon: Archive, color: '#5F9EA0' },
    { path: '/category', name: '分类', icon: Layers, color: '#9370DB' },
    { path: '/tags', name: '标签', icon: Tag, color: '#FFA500' },
    { path: '/message', name: '留言', icon: MessageSquare, color: '#20B2AA' },
    { path: '/say', name: '说说', icon: Mic, color: '#FF69B4' },
    { path: '/link', name: '友链', icon: Link, color: '#1E90FF' },
    { path: '/about', name: '关于', icon: Info, color: '#32CD32' }
]

const showUserMenu = ref(false)
const userAvatar = ref('https://img.shiyit.com/default-avatar.jpg')

const handleMenuClick = (item) => {
    router.push(item.path)
}

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

const logout = () => {
    showUserMenu.value = false
}
</script>
  
  <style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@500;600;700&display=swap');

.cyber-nav {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #1a1a2e;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px; /* 压缩高度 */
    z-index: 1000;
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    font-family: 'Rajdhani', 'Orbitron', sans-serif;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --bg-color: #f0f2f5;
        --text-color: #333344;
        --border-color: rgba(0, 102, 204, 0.3);
        --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5);
    }

    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px; /* 减少内边距 */
    }

    .logo-box {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            .logo-3d span {
                text-shadow: var(--glow-effect);
            }
        }

        .logo-3d {
            display: flex;
            perspective: 500px;

            span {
                display: inline-block;
                font-size: 20px; /* 缩小字体 */
                font-weight: 700;
                color: var(--primary-color);
                text-transform: uppercase;
                transition: all 0.3s ease;
                transform-style: preserve-3d;
                margin-right: 2px;

                &:nth-child(1) {
                    color: #00f0ff;
                }
                &:nth-child(2) {
                    color: #ff00f0;
                }
                &:nth-child(3) {
                    color: #00ff9d;
                }
                &:nth-child(4) {
                    color: #ff9d00;
                }
                &:nth-child(5) {
                    color: #9d00ff;
                }
            }
        }

        .logo-watermelon {
            font-size: 20px; /* 缩小字体 */
            margin-left: 8px;
            transform: rotate(15deg);
            animation: spin 8s linear infinite;
            display: inline-block;

            @keyframes spin {
                0% {
                    transform: rotate(15deg);
                }
                100% {
                    transform: rotate(375deg);
                }
            }
        }
    }

    .menu-box {
        display: flex;
        height: 100%;

        .menu-item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 0 15px; /* 减少内边距 */
            height: 100%;
            cursor: pointer;
            transition: all 0.3s ease;
            gap: 8px; /* 缩小间距 */

            &:hover {
                background: rgba(0, 240, 255, 0.1);

                .menu-icon {
                    filter: drop-shadow(0 0 5px currentColor);
                    transform: scale(1.2);
                }

                .menu-text {
                    color: var(--primary-color);
                    text-shadow: var(--glow-effect);
                }

                .menu-line {
                    width: 100%;
                    opacity: 1;
                }
            }

            .menu-icon {
                width: 18px; /* 缩小图标 */
                height: 18px;
                color: v-bind(
                    'menuItems.find(i => i.name === name)?.color || "var(--text-color)"'
                );
                transition: all 0.3s ease;
            }

            .menu-text {
                font-size: 14px; /* 缩小字体 */
                font-weight: 600;
                transition: all 0.3s ease;
                color: var(--text-color);
                white-space: nowrap;
            }

            .menu-line {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px; /* 变细 */
                background: linear-gradient(
                    90deg,
                    var(--primary-color),
                    var(--secondary-color)
                );
                transition: all 0.3s ease;
                opacity: 0;
            }
        }
    }

    .control-box {
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
            position: relative;
            width: 36px;
            height: 36px;
            border-radius: 50%; /* 确保这是50%圆形 */
            cursor: pointer;
            transition: all 0.3s ease;
            overflow: hidden; /* 添加这行确保图片不会超出圆形边界 */

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%; /* 图片也设置为圆形 */
                object-fit: cover;
                border: 2px solid var(--primary-color);
                box-shadow: var(--glow-effect);
            }

            .avatar-ring {
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border: 2px solid var(--secondary-color);
                border-radius: 50%; /* 光环也保持圆形 */
                opacity: 0;
                transition: all 0.3s ease;
            }

            &:hover {
                transform: scale(1.1);

                .avatar-ring {
                    opacity: 0.7;
                }
            }
        }

        .user-menu {
            position: absolute;
            top: 50px;
            right: 0;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 8px 0;
            min-width: 160px; /* 缩小宽度 */
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 10;

            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 8px 15px;
                color: var(--text-color);
                transition: all 0.3s ease;
                cursor: pointer;
                gap: 8px;

                &:hover {
                    background: var(--primary-color);
                    color: #000;

                    .icon {
                        color: #000;
                    }
                }

                .icon {
                    width: 16px; /* 缩小图标 */
                    height: 16px;
                    color: var(--primary-color);
                    transition: all 0.3s ease;
                }
            }
        }
    }
}

/* 过渡动画 */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

.theme-switch {
    position: relative;
    width: 60px;
    height: 30px;
    margin-right: 20px;
    cursor: pointer;
    z-index: 1;

    .switch-track {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        background: linear-gradient(90deg, #555, #222);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
            0 0 5px rgba(0, 240, 255, 0.5);
        transition: all 0.3s ease;
    }

    .switch-thumb {
        position: absolute;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: linear-gradient(145deg, #fff, #ccc);
        top: 2px;
        left: 2px;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2),
            0 0 10px rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        .sun-icon,
        .moon-icon {
            position: absolute;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .sun-icon {
            opacity: 1;
            transform: translateX(0);
        }

        .moon-icon {
            opacity: 0;
            transform: translateX(20px);
        }
    }

    &:hover {
        .switch-track {
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
                0 0 10px rgba(0, 240, 255, 0.8);
        }
    }
}

/* 白天模式下的开关样式 */
.cyber-nav.light .theme-switch {
    .switch-track {
        background: linear-gradient(90deg, #ffd700, #ff8c00);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2),
            0 0 5px rgba(255, 215, 0, 0.5);
    }

    .switch-thumb {
        transform: translateX(30px);
        background: linear-gradient(145deg, #333, #111);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.5);

        .sun-icon {
            opacity: 0;
            transform: translateX(-20px);
        }

        .moon-icon {
            opacity: 1;
            transform: translateX(0);
        }
    }

    &:hover {
        .switch-track {
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2),
                0 0 10px rgba(255, 215, 0, 0.8);
        }
    }
}

/* 调整控制区布局 */
.control-box {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>