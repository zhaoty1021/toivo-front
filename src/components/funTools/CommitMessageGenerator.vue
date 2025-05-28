<template>
  <div class="commit-generator-container" :class="theme">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <h2>提交类型</h2>
        <select v-model="commitType">
          <option
            v-for="type in commitTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.emoji }} {{ type.label }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <h2>内容设置</h2>
        <input
          type="text"
          v-model="feature"
          placeholder="例如: 用户登录, API端点, 数据库模型"
        />

        <div class="slider-group">
          <label>幽默程度:</label>
          <input
            type="range"
            min="0"
            max="4"
            v-model="humorLevel"
            class="humor-slider"
          />
          <div class="slider-labels">
            <span>正经 😑</span>
            <span>中等 😏</span>
            <span>搞笑 😂</span>
            <span>疯狂 🤪</span>
            <span>离谱 🚀</span>
          </div>
        </div>
      </div>

      <div class="control-group">
        <h2>趣味选项</h2>
        <div class="checkbox-group">
          <label
            v-for="option in humorOptions"
            :key="option.id"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              v-model="selectedHumorOptions"
              :value="option.id"
            />
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>

    <!-- 预览面板 -->
    <div class="preview-panel">
      <h2>生成的Commit Message</h2>
      <div class="commit-preview" :class="{ highlight: isHighlighted }">
        {{ commitMessage }}
      </div>

      <div class="action-buttons">
        <button class="generate-btn" @click="generateCommitMessage">
          生成新消息
        </button>
        <button class="copy-btn" @click="copyToClipboard">
          {{ copyButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";

const theme = inject("theme", "dark");

// 提交类型选项
const commitTypes = ref([
  { value: "feat", label: "新功能 (feat)", emoji: "✨" },
  { value: "fix", label: "错误修复 (fix)", emoji: "🐛" },
  { value: "docs", label: "文档更新 (docs)", emoji: "📚" },
  { value: "style", label: "样式/格式化 (style)", emoji: "💄" },
  { value: "refactor", label: "代码重构 (refactor)", emoji: "🔨" },
  { value: "perf", label: "性能优化 (perf)", emoji: "⚡" },
  { value: "test", label: "测试相关 (test)", emoji: "✅" },
  { value: "chore", label: "构建/工具 (chore)", emoji: "🔧" },
]);

// 用户选择的状态
const commitType = ref("feat");
const feature = ref("");
const humorLevel = ref(2);
const humorOptions = ref([
  { id: "emoji", label: "表情符号 😊" },
  { id: "tech", label: "技术梗 💻" },
  { id: "pop", label: "流行文化 🎬" },
  { id: "self", label: "自嘲模式 😅" },
]);
const selectedHumorOptions = ref(["emoji"]);

// 生成的消息和UI状态
const commitMessage = ref('点击"生成新消息"按钮查看结果');
const isHighlighted = ref(false);
const copyButtonText = ref("复制到剪贴板");

// 幽默数据库
const humorDatabase = {
  tech: [
    "99个小bug，关掉一个...等等，现在有104个了？",
    "这段代码能跑，别问我为什么",
    "临时方案变永久方案",
    "修复了旧bug，引入了新bug",
    "理论上这应该能工作",
    "我不知道这行代码干嘛的，但删掉会出问题",
  ],
  pop: [
    "我发誓我没碰这部分代码... (绝命毒师)",
    "要么提交，要么不提交，没有试试看 (尤达大师)",
    "Winter is coming... 所以提前修复",
    "我会回来的 (终结者)",
    "这不是你想要的提交，但这是你需要的提交 (蝙蝠侠)",
    "无限宝石的力量也修不好这个bug",
  ],
  self: [
    "我可能不知道自己在干嘛",
    "咖啡因驱动的编程",
    "凌晨3点的编码成果",
    "老板说今天必须提交",
    "祈祷这次不会出问题",
    "我的猫踩键盘写出来的代码",
  ],
  emojis: {
    feat: ["✨", "🚀", "🎉", "🌟", "🆕"],
    fix: ["🐛", "🔧", "🛠️", "🚑", "💉"],
    docs: ["📚", "📝", "🔍", "📖", "🗒️"],
    style: ["💄", "🎨", "🌈", "👗", "💅"],
    refactor: ["🔨", "♻️", "⏪", "🔄", "🧹"],
    perf: ["⚡", "🚄", "🏎️", "💨", "📈"],
    test: ["✅", "🧪", "🔬", "📋", "🛡️"],
    chore: ["🔧", "📦", "⬆️", "📌", "🧰"],
  },
};

// 获取当前类型的标签
const currentTypeLabel = computed(() => {
  const type = commitTypes.value.find((t) => t.value === commitType.value);
  return type ? type.label.split(" ")[0] : commitType.value;
});

// 生成提交消息
const generateCommitMessage = () => {
  const type = commitType.value;
  const featureText = feature.value || "某个功能";

  // 生成基本commit
  let message = `${type}: ${featureText}`;

  // 添加表情符号
  if (
    selectedHumorOptions.value.includes("emoji") &&
    humorDatabase.emojis[type]
  ) {
    const emojis = humorDatabase.emojis[type];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    message += ` ${randomEmoji}`;
  }

  // 添加幽默内容
  if (humorLevel.value > 0) {
    message += "\n\n";

    let humorParts = [];

    // 根据幽默等级添加内容
    if (humorLevel.value >= 1) {
      humorParts.push(`更新了${featureText}功能`);
    }

    if (humorLevel.value >= 2) {
      if (
        selectedHumorOptions.value.includes("tech") &&
        humorDatabase.tech.length > 0
      ) {
        humorParts.push(
          humorDatabase.tech[
            Math.floor(Math.random() * humorDatabase.tech.length)
          ]
        );
      }
    }

    if (humorLevel.value >= 3) {
      if (
        selectedHumorOptions.value.includes("pop") &&
        humorDatabase.pop.length > 0
      ) {
        humorParts.push(
          humorDatabase.pop[
            Math.floor(Math.random() * humorDatabase.pop.length)
          ]
        );
      }
    }

    if (humorLevel.value >= 4) {
      if (
        selectedHumorOptions.value.includes("self") &&
        humorDatabase.self.length > 0
      ) {
        humorParts.push(
          humorDatabase.self[
            Math.floor(Math.random() * humorDatabase.self.length)
          ]
        );
      }
    }

    // 组合幽默内容
    message += humorParts.join(" | ");
  }

  commitMessage.value = message;
  highlightPreview();
};

// 高亮显示预览
const highlightPreview = () => {
  isHighlighted.value = true;
  setTimeout(() => {
    isHighlighted.value = false;
  }, 1000);
};

// 复制到剪贴板
const copyToClipboard = () => {
  navigator.clipboard
    .writeText(commitMessage.value)
    .then(() => {
      copyButtonText.value = "✓ 已复制!";
      setTimeout(() => {
        copyButtonText.value = "复制到剪贴板";
      }, 2000);
    })
    .catch((err) => {
      console.error("复制失败: ", err);
      copyButtonText.value = "复制失败!";
      setTimeout(() => {
        copyButtonText.value = "复制到剪贴板";
      }, 2000);
    });
};

// 初始化生成一条消息
generateCommitMessage();
</script>

<style lang="scss" scoped>
.commit-generator-container {
  // 默认暗色主题变量
  --primary-color: #a78bfa;
  --secondary-color: #6bd3ff;
  --text-color: #ffffff;
  --bg-color: #1a1a2e;
  --panel-bg: rgba(255, 255, 255, 0.05);
  --input-bg: rgba(0, 0, 0, 0.2);
  --input-border: rgba(255, 255, 255, 0.2);
  --slider-bg: rgba(255, 255, 255, 0.1);
  --checkbox-color: rgba(255, 255, 255, 0.7);
  --preview-bg: rgba(0, 0, 0, 0.2);
  --highlight-color: rgba(167, 139, 250, 0.3);

  // 亮色主题覆盖
  &.light {
    --primary-color: #7c3aed;
    --secondary-color: #0284c7;
    --text-color: #1e293b;
    --bg-color: #f8fafc;
    --panel-bg: rgba(0, 0, 0, 0.03);
    --input-bg: rgba(0, 0, 0, 0.05);
    --input-border: rgba(0, 0, 0, 0.2);
    --slider-bg: rgba(0, 0, 0, 0.1);
    --checkbox-color: rgba(0, 0, 0, 0.8);
    --preview-bg: rgba(0, 0, 0, 0.05);
    --highlight-color: rgba(167, 139, 250, 0.2);
  }

  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
  }
}

.control-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--panel-bg);
  border-radius: 12px;
  border: 1px solid var(--input-border);
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.control-group {
  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.3rem;
  }
}

input[type="text"],
select {
  width: 95%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
  }
}

.slider-group {
  margin-top: 1rem;
}

.humor-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  background: var(--slider-bg);
  border-radius: 4px;
  outline: none;
  margin: 0.5rem 0;
  transition: all 0.3s ease;

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
    }
  }
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--checkbox-color);
}

.checkbox-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-color);

  input {
    margin: 0;
    accent-color: var(--primary-color);
  }
}

.commit-preview {
  flex-grow: 1;
  padding: 1.5rem;
  background: var(--preview-bg);
  border-radius: 12px;
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-y: auto;
  transition: background-color 0.3s;
  border: 1px solid var(--input-border);

  &.highlight {
    background-color: var(--highlight-color);
    animation: highlight 1.5s;
  }
}

@keyframes highlight {
  0% {
    background-color: var(--preview-bg);
  }
  50% {
    background-color: var(--highlight-color);
  }
  100% {
    background-color: var(--preview-bg);
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: auto;

  button {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
  }
}

.generate-btn {
  background-color: var(--primary-color);
}

.copy-btn {
  background-color: var(--secondary-color);
}

@media (max-width: 768px) {
  .checkbox-group {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
