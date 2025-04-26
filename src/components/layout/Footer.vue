<template>
    <footer v-if="!showFooter" class="footer-container" :class="theme">
        <div class="footer-content">
            <!-- 左侧信息区 -->
            <div class="footer-section info-section">
                <h2 class="site-title">拾壹</h2>
                <div class="site-info">
                    <p class="site-description">Dean【热衷于互联网的发展】</p>
                    <div class="copyright">
                        <span>Copyright©2022-{{ nowYear }}</span>
                        <a
                            href="https://gitee.com/quequnlong/shiyi-blog"
                            target="_blank"
                            class="site-link"
                        >
                            {{ webInfo.name }}
                        </a>
                        <a
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            class="record-link"
                        >
                            {{ webInfo.recordNum }}
                        </a>
                    </div>
                    <div class="runtime">
                        <svg-icon
                            name="shandian"
                            class="lightning-icon"
                        ></svg-icon>
                        <span class="runtime-text">
                            风风雨雨 <strong>{{ day }}</strong> 天
                            <strong>{{ hours }}</strong> 时
                            <strong>{{ minute }}</strong> 分
                            <strong>{{ second }}</strong> 秒
                        </span>
                    </div>
                </div>
            </div>

            <!-- 中间装饰元素 -->
            <div class="footer-section decor-section">
                <div class="hologram-girl">
                    <div class="hologram-image"></div>
                    <div class="hologram-text">
                        <h4>绿水本无忧，因风皱面</h4>
                        <h4>青山原不老，为雪白头</h4>
                    </div>
                </div>
            </div>

            <!-- 右侧交互区 -->
            <div class="footer-section action-section">
                <button class="hologram-button">
                    <span class="btn-text">Ctrl+D收藏本站</span>
                    <span class="btn-glow"></span>
                </button>

                <div class="site-stats">
                    <div class="stat-item pv-stat">
                        <i class="iconfont icon-fangwenliang stat-icon"></i>
                        <span class="stat-label">访问量</span>
                        <span class="stat-value">{{
                            siteStore.getSiteAccess
                        }}</span>
                    </div>
                    <div class="stat-item uv-stat">
                        <i class="el-icon-user-solid stat-icon"></i>
                        <span class="stat-label">访客量</span>
                        <span class="stat-value">{{
                            siteStore.getVsitorAccess
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部扫描线效果 -->
        <div class="scanline"></div>
    </footer>
</template>
  
  <script setup>
import { useSiteStore } from '@/store/moudel/site.js'
import { inject, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const siteStore = useSiteStore()
const webInfo = ref(siteStore.getWebInfo)
const route = useRoute()
const theme = inject('theme')

// 时间相关数据
const day = ref('')
const hours = ref('')
const minute = ref('')
const second = ref('')
const nowYear = ref(new Date().getFullYear())
const showFooter = ref(false)

// 监听路由变化
watch(
    () => route.path,
    (newVal) => {
        showFooter.value = ['/message', '/chat', '/newposts'].includes(newVal)
    },
    { immediate: true }
)

// 运行时间计算
let timer
const runTime = () => {
    const timeold = new Date().getTime() - new Date(1627747200000).getTime()
    const msPerDay = 24 * 60 * 60 * 1000
    const daysold = Math.floor(timeold / msPerDay)
    const time = new Date()
    day.value = daysold
    hours.value = time.getHours().toString().padStart(2, '0')
    minute.value = time.getMinutes().toString().padStart(2, '0')
    second.value = time.getSeconds().toString().padStart(2, '0')
}

onMounted(() => {
    runTime()
    timer = setInterval(runTime, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>
  
  <style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');

.footer-container {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #e0e0ff;
    --border-color: rgba(0, 240, 255, 0.3);
    --grid-color: rgba(0, 240, 255, 0.1);
    --footer-bg: rgba(10, 14, 20, 0.9);
    --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7),
        0 0 20px rgba(0, 240, 255, 0.5);

    position: relative;
    padding: 2rem 0;
    background: var(--footer-bg);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--border-color);
    font-family: 'Roboto Mono', monospace;
    overflow: hidden;
    margin-top: 4rem;
    transition: all 0.3s ease;

    &.light {
        --primary-color: #0066cc;
        --secondary-color: #cc00ff;
        --accent-color: #00aa66;
        --bg-color: #f8f9fa;
        --text-color: #333344;
        --border-color: rgba(0, 102, 204, 0.3);
        --grid-color: rgba(0, 102, 204, 0.1);
        --footer-bg: rgba(248, 249, 250, 0.9);
        --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5),
            0 0 20px rgba(0, 102, 204, 0.3);
    }

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

    .footer-content {
        max-width: 1320px;
        width: 100%;
        margin: 0 auto;
        padding: 0 1.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        z-index: 2;
    }

    .footer-section {
        flex: 1;
        min-width: 250px;
        padding: 0 1rem;
        margin-bottom: 1.5rem;
    }

    // 左侧信息区样式
    .info-section {
        .site-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            margin: 0 0 1rem;
            color: var(--primary-color);
            text-shadow: 0 0 8px var(--primary-color);
            letter-spacing: 2px;
            position: relative;
            display: inline-block;

            &::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(
                    90deg,
                    var(--primary-color),
                    var(--secondary-color),
                    transparent
                );
            }
        }

        .site-info {
            p {
                margin: 0.5rem 0;
                color: var(--text-color);
                font-size: 0.95rem;
            }

            .copyright {
                margin: 1rem 0;
                font-size: 0.85rem;
                color: var(--text-color);

                .site-link,
                .record-link {
                    color: var(--text-color);
                    margin-left: 0.5rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;

                    &:hover {
                        color: var(--primary-color);
                        text-shadow: 0 0 5px var(--primary-color);

                        &::after {
                            width: 100%;
                        }
                    }

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -2px;
                        left: 0;
                        width: 0;
                        height: 1px;
                        background: var(--primary-color);
                        transition: all 0.3s ease;
                    }
                }
            }

            .runtime {
                display: flex;
                align-items: center;
                margin-top: 1rem;
                font-size: 0.9rem;
                color: var(--text-color);

                .lightning-icon {
                    width: 1.2rem;
                    height: 1.2rem;
                    margin-right: 0.5rem;
                    color: var(--accent-color);
                    animation: pulse 1s infinite;
                }

                .runtime-text {
                    strong {
                        color: var(--primary-color);
                        font-weight: 500;
                        margin: 0 0.2rem;
                    }
                }
            }
        }
    }

    // 中间装饰区样式
    .decor-section {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .hologram-girl {
            position: relative;
            width: 100%;
            max-width: 300px;
            text-align: center;
            transition: all 0.3s ease;

            &:hover {
                transform: translateY(-5px);

                .hologram-image::before {
                    opacity: 0.8;
                }
            }

            .hologram-image {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 60%;
                background-image: url(https://img.shiyit.com/cyxy.png);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                margin: 0 auto;
                filter: drop-shadow(0 0 10px var(--primary-color));

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(
                        circle,
                        var(--primary-color) 0%,
                        transparent 70%
                    );
                    opacity: 0.3;
                    z-index: -1;
                    transition: all 0.3s ease;
                }
            }

            .hologram-text {
                margin-top: 1rem;
                color: var(--text-color);
                font-family: 'Orbitron', sans-serif;
                text-shadow: 0 0 5px var(--primary-color);

                h4 {
                    margin: 0.5rem 0;
                    font-size: 1rem;
                    font-weight: 400;
                    letter-spacing: 1px;
                }
            }
        }
    }

    // 右侧交互区样式
    .action-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .hologram-button {
            background: linear-gradient(
                135deg,
                var(--primary-color),
                var(--secondary-color)
            );
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            margin-bottom: 2rem;
            font-family: 'Roboto Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;

            .btn-text {
                position: relative;
                z-index: 3;
            }

            .btn-glow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.3),
                    transparent
                );
                z-index: 2;
                opacity: 0;
                transition: all 0.3s ease;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

                .btn-glow {
                    opacity: 1;
                }
            }

            &::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    to bottom right,
                    rgba(255, 255, 255, 0.1),
                    transparent 50%
                );
                transform: rotate(30deg);
                z-index: 1;
            }
        }

        .site-stats {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 250px;

            .stat-item {
                display: flex;
                align-items: center;
                padding: 0.8rem 1.2rem;
                background: rgba(0, 240, 255, 0.1);
                border-radius: 0.5rem;
                border: 1px solid var(--border-color);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--glow-effect);
                }

                .stat-icon {
                    font-size: 1.2rem;
                    margin-right: 0.8rem;
                    color: var(--primary-color);
                }

                .stat-label {
                    flex: 1;
                    font-size: 0.9rem;
                    color: var(--text-color);
                }

                .stat-value {
                    font-weight: 600;
                    font-size: 1rem;
                    color: var(--primary-color);
                    min-width: 3rem;
                    text-align: right;
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(
                        to bottom,
                        var(--primary-color),
                        var(--secondary-color)
                    );
                }
            }

            .pv-stat {
                .stat-value {
                    color: #d0339b;
                }
            }

            .uv-stat {
                .stat-value {
                    color: #e2c63a;
                }
            }
        }
    }

    // 扫描线效果
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

    // 响应式设计
    @media (max-width: 992px) {
        .footer-content {
            flex-direction: column;
            align-items: center;
        }

        .footer-section {
            width: 100%;
            text-align: center;
            margin-bottom: 2rem;
        }

        .action-section {
            align-items: center;
        }

        .decor-section {
            order: -1;
            margin-bottom: 2rem;
        }
    }

    @media (max-width: 768px) {
        .decor-section {
            display: none;
        }
    }
}

// 动画定义
@keyframes pulse {
    0%,
    100% {
        opacity: 0.7;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
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