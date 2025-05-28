<template>
  <div class="bug-quotes-generator" :class="theme">
    <!-- 输入区域 -->
    <div class="input-section">
      <h3>错误类型设置</h3>
      <input
        type="text"
        v-model="errorType"
        placeholder="输入错误类型，如: NullPointerException"
        class="error-input"
      />

      <div class="controls">
        <button @click="generateQuote" class="generate-btn">生成语录</button>

        <div class="intensity-control">
          <label>崩溃程度:</label>
          <input
            type="range"
            v-model="intensity"
            min="1"
            max="5"
            class="intensity-slider"
          />
          <div class="intensity-labels">
            <span>轻微 😅</span>
            <span>中等 😫</span>
            <span>严重 😤</span>
            <span>崩溃 🤯</span>
            <span>绝望 💀</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输出区域 -->
    <div class="output-section">
      <h3>生成的Bug语录</h3>
      <div class="quote-display" :class="{ highlight: isHighlighted }">
        <p v-if="errorType" class="error-type">遇到: {{ errorType }}</p>
        <p class="quote-text">{{ currentQuote }}</p>
      </div>

      <button @click="copyToClipboard" class="copy-btn">
        {{ copyButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";

const theme = inject("theme", "dark");

const errorType = ref("");
const intensity = ref(3);
const currentQuote = ref("请先输入错误类型并点击生成按钮");
const isHighlighted = ref(false);
const copyButtonText = ref("复制语录");

// Bug语录数据库
const quotesDatabase = [
  {
    level: 1,
    quotes: [
      "小问题，喝杯咖啡就能解决",
      "这只是个小小的警告，不必在意",
      "我见过比这更糟的情况",
      "加个try-catch就能搞定",
    ],
  },
  {
    level: 2,
    quotes: [
      "为什么这个错误又出现了？",
      "昨天还好好的，今天怎么就...",
      "这不应该发生的啊",
      "我需要再检查一遍文档",
    ],
  },
  {
    level: 3,
    quotes: [
      "我已经改了5次了，怎么还有问题！",
      "这个API文档绝对是错的",
      "到底是哪个天才写的这段代码？",
      "我的周末又要泡汤了",
    ],
  },
  {
    level: 4,
    quotes: [
      "本以为是最后一个Bug，结果它是Bug们的曾祖父",
      "我决定转行去卖煎饼果子",
      "电脑和我必须死一个",
      "这不是Bug，这是特性展览会",
    ],
  },
  {
    level: 5,
    quotes: [
      "毁灭吧，赶紧的，累了",
      "我写的不是代码，是薛定谔的猫",
      "程序员的一生：写Bug → 改Bug → 创造新Bug",
      "如果代码能运行，请不要碰它",
    ],
  },
];

// 根据强度筛选语录
const filteredQuotes = computed(() => {
  const level = Math.ceil(intensity.value);
  const group = quotesDatabase.find((item) => item.level === level);
  return group ? group.quotes : [];
});

// 生成随机语录
const generateQuote = () => {
  if (!errorType.value) {
    currentQuote.value = "请输入错误类型";
    return;
  }

  if (filteredQuotes.value.length === 0) {
    currentQuote.value = "没有找到匹配的语录";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.value.length);
  currentQuote.value = filteredQuotes.value[randomIndex];
  highlightQuote();
};

// 高亮显示语录
const highlightQuote = () => {
  isHighlighted.value = true;
  setTimeout(() => {
    isHighlighted.value = false;
  }, 1000);
};

// 复制到剪贴板
const copyToClipboard = () => {
  if (!currentQuote.value) return;

  const textToCopy = `遇到: ${errorType.value}\n${currentQuote.value}`;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      copyButtonText.value = "✓ 已复制!";
      setTimeout(() => {
        copyButtonText.value = "复制语录";
      }, 2000);
    })
    .catch(() => {
      copyButtonText.value = "复制失败!";
      setTimeout(() => {
        copyButtonText.value = "复制语录";
      }, 2000);
    });
};
</script>

<style lang="scss" scoped>
.bug-quotes-generator {
  // 默认暗色主题变量
  --primary-color: #f472b6;
  --secondary-color: #6bd3ff;
  --accent-color: #ff9e3f;
  --text-color: #ffffff;
  --input-bg: rgba(255, 255, 255, 0.05);
  --input-border: rgba(255, 255, 255, 0.2);
  --panel-bg: rgba(0, 0, 0, 0.1);
  --quote-bg: rgba(0, 0, 0, 0.2);
  --highlight-color: rgba(244, 114, 182, 0.3);
  --slider-bg: rgba(255, 255, 255, 0.1);
  --label-color: rgba(255, 255, 255, 0.7);

  // 亮色主题变量
  &.light {
    --primary-color: #db2777;
    --secondary-color: #0284c7;
    --accent-color: #ea580c;
    --text-color: #1e293b;
    --input-bg: rgba(0, 0, 0, 0.05);
    --input-border: rgba(0, 0, 0, 0.2);
    --panel-bg: rgba(0, 0, 0, 0.01);
    --quote-bg: rgba(0, 0, 0, 0.05);
    --highlight-color: rgba(219, 39, 119, 0.2);
    --slider-bg: rgba(0, 0, 0, 0.1);
    --label-color: rgba(0, 0, 0, 0.7);
  }

  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  color: var(--text-color);

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
}

.input-section,
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-section {
  padding: 1.5rem;
  background: var(--panel-bg);
  border-radius: 12px;
  border: 1px solid var(--input-border);

  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    font-size: 1.2rem;
    font-weight: 600;
  }
}

.error-input {
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.2);
  }

  &::placeholder {
    color: var(--label-color);
    opacity: 0.7;
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: auto;
}

.generate-btn {
  padding: 0.8rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 114, 182, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.intensity-control {
  margin-top: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-size: 0.9rem;
  }
}

.intensity-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  background: var(--slider-bg);
  border-radius: 4px;
  outline: none;
  margin: 0.5rem 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.3);
    }
  }
}

.intensity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--label-color);
}

.output-section {
  padding: 1rem;
  border: 1px solid var(--input-border);
  border-radius: 12px;

  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    font-size: 1.2rem;
    font-weight: 600;
  }
}

.quote-display {
  flex-grow: 1;
  padding: 1.5rem;
  background: var(--quote-bg);
  border-radius: 12px;
  border: 1px solid var(--input-border);
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  transition: all 0.3s;

  &.highlight {
    background-color: var(--highlight-color);
    animation: highlight 1.5s;
  }

  .error-type {
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--accent-color);
  }

  .quote-text {
    white-space: pre-wrap;
  }
}

.copy-btn {
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: var(--secondary-color);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(107, 211, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

@keyframes highlight {
  0% {
    background-color: var(--quote-bg);
  }
  50% {
    background-color: var(--highlight-color);
  }
  100% {
    background-color: var(--quote-bg);
  }
}

@media (max-width: 768px) {
  .bug-quotes-generator {
    flex-direction: column;
    gap: 1.5rem;
  }

  .input-section,
  .output-section {
    width: 100%;
  }

  .output-section {
    margin-top: 1rem;
  }
}
</style>
