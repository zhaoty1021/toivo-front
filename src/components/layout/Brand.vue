<template>
    <div class="brand-container" :class="theme">
        <div class="brand">
            <div class="typing-container">
                <div class="typing-text">
                    {{ displayText }}
                    <span class="cursor" :class="{ blinking: isTyping }"
                        >|</span
                    >
                </div>
                <div class="subtitle">每日一句 · 灵感语录</div>
            </div>
        </div>
        <Wave />
    </div>
</template>
  
  <script setup>
import { ref, onMounted, inject } from 'vue'
import Wave from '@/components/layout/Wave.vue'

const theme = inject('theme')
const displayText = ref('')
const isTyping = ref(true)
const obj = reactive({
    output: '',
    isEnd: false,
    speed: 300,
    singleBack: false,
    sleep: 0,
    type: 'rollback',
    backSpeed: 100,
    sentencePause: false
})

const defaultQuotes = [
    '代码如诗，逻辑如画',
    '科技创造未来',
    '创新驱动发展',
    '简洁是智慧的精华',
    '持续学习，持续进步'
]

onMounted(() => {
    fetchHitokoto()
})

const startTyping = (text) => {
    isTyping.value = true
    typeWriter(text, 0)
}

const fetchHitokoto = async () => {
    try {
        const response = await fetch('https://v1.hitokoto.cn/?c=i&encode=json')
        if (response.ok) {
            const data = await response.json()
            startTyping(data.hitokoto)
        } else {
            throw new Error('API请求失败')
        }
    } catch (error) {
        console.error('使用本地语录:', error)
        const randomQuote =
            defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)]
        startTyping(randomQuote)
    }
}

const typeWriter = (text, i) => {
    if (i < text.length) {
        displayText.value = text.substring(0, i + 1)
        setTimeout(() => typeWriter(text, i + 1), 100)
    } else {
        isTyping.value = false
        setTimeout(() => {
            deleteText(text, text.length)
        }, 3000) // 显示3秒后开始删除
    }
}

const deleteText = (text, i) => {
    if (i > 0) {
        displayText.value = text.substring(0, i - 1)
        setTimeout(() => deleteText(text, i - 1), 50)
    } else {
        setTimeout(() => fetchHitokoto(), 1000) // 删除完成后重新获取新语录
    }
}
</script>
  
  <style lang="scss" scoped>
.brand-container {
    --primary-color: #00f0ff;
    --text-color: #ffffff;
    --bg-color: #0a0a12;
    --accent-color: #00ff9d;

    position: relative;
    width: 100%;
    height: 55vh;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg-color);
    overflow: hidden;

    &.light {
        --bg-color: #f0f2f5;
        --text-color: #333344;
        --primary-color: #0066cc;
        --accent-color: #00aa66;
    }
}

.brand {
    position: absolute;
    z-index: 2;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
}

.typing-container {
    display: inline-block;
    max-width: 80%;
    text-align: center;
}

.typing-text {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: var(--text-color);
    text-shadow: 0 0 8px var(--primary-color);
    line-height: 1.4;
    letter-spacing: 0.05em;
}

.cursor {
    display: inline-block;
    width: 0.15em;
    height: 1em;
    background: var(--accent-color);
    vertical-align: middle;
    margin-left: 0.1em;

    &.blinking {
        animation: blink 0.7s infinite;
    }
}

.subtitle {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    opacity: 0;
    animation: fadeIn 1s ease-out 1s forwards;
}

@keyframes blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

/* 响应式调整 */
@media (max-width: 768px) {
    .typing-text {
        font-size: clamp(1.2rem, 5vw, 2rem);
    }

    .subtitle {
        font-size: 0.7rem;
    }
}
</style>