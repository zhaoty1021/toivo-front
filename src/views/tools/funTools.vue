<template>
  <div class="fun-tools-container" :class="theme">
    <!-- 主卡片容器 -->
    <div class="fun-card">
      <!-- 动态标题区 -->
      <div class="dynamic-header">
        <h1 class="fun-title">
          <span
            class="title-char"
            v-for="(char, index) in titleChars"
            :key="index"
            :style="charStyle(index)"
          >
            {{ char }}
          </span>
        </h1>
        <p class="fun-subtitle">FUN UTILITIES PLAYGROUND</p>
        <div class="bubble-bg"></div>
      </div>

      <!-- 工具导航 - 采用圆形按钮 -->
      <div class="fun-tool-nav">
        <FunToolButton
          v-for="tool in tools"
          :key="tool.id"
          :active="activeTool === tool.id"
          @click="activeTool = tool.id"
          :text="tool.name"
          :theme="theme"
        ></FunToolButton>
      </div>

      <!-- 工具内容区 - 添加了动画背景 -->
      <div class="fun-tool-content">
        <div class="content-bg">
          <div
            class="floating-shape"
            v-for="n in 15"
            :key="n"
            :style="floatingShapeStyle(n)"
          ></div>
        </div>
        <KeepAlive>
          <component :is="activeComponent" />
        </KeepAlive>
      </div>

      <!-- 卡片底部装饰 - 添加了交互元素 -->
      <div class="fun-card-footer">
        <div class="interactive-line" @mousemove="handleLineHover"></div>
        <div class="footer-info">
          <span>FUN LEVEL: {{ funLevel }}</span>
          <div class="emoji-indicator">
            <span
              v-for="(emoji, index) in emojis"
              :key="index"
              :style="{ opacity: index < funLevel ? 1 : 0.3 }"
            >
              {{ emoji }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import FunToolButton from "@/components/funTools/FunToolButton.vue";
import CommitMessageGenerator from "@/components/funTools/CommitMessageGenerator.vue";
import BugQuotesGenerator from "@/components/funTools/BugQuotesGenerator.vue";
// import EmojiGenerator from "@/components/funTools/EmojiGenerator.vue";
// import ColorPalette from "@/components/funTools/ColorPalette.vue";
// import NameGenerator from "@/components/funTools/NameGenerator.vue";
// import FortuneCookie from "@/components/funTools/FortuneCookie.vue";
// import MiniGame from "@/components/funTools/MiniGame.vue";
// import SoundBoard from "@/components/funTools/SoundBoard.vue";

const theme = inject("theme", "dark");

// 工具列表 - 添加了颜色属性
const tools = ref([
  {
    id: "commit",
    name: "Commit生成器",
    icon: "commit",
    color: "#A78BFA", // 紫色
    component: CommitMessageGenerator,
  },
  {
    id: "bugQuotes",
    name: "Bug语录生成",
    icon: "bug",
    color: "#F472B6", // 粉色
    component: BugQuotesGenerator,
  },
  //   {
  //     id: "emoji",
  //     name: "表情生成器",
  //     icon: "emoji",
  //     color: "#FF9E3F",
  //     component: EmojiGenerator,
  //   },
  //   {
  //     id: "color",
  //     name: "配色方案",
  //     icon: "palette",
  //     color: "#6BD3FF",
  //     component: ColorPalette,
  //   },
  //   {
  //     id: "name",
  //     name: "名字生成",
  //     icon: "name",
  //     color: "#FF6B8B",
  //     component: NameGenerator,
  //   },
  //   {
  //     id: "fortune",
  //     name: "幸运饼干",
  //     icon: "cookie",
  //     color: "#A78BFA",
  //     component: FortuneCookie,
  //   },
  //   {
  //     id: "game",
  //     name: "迷你游戏",
  //     icon: "game",
  //     color: "#4ADE80",
  //     component: MiniGame,
  //   },
  //   {
  //     id: "sound",
  //     name: "音效板",
  //     icon: "sound",
  //     color: "#F472B6",
  //     component: SoundBoard,
  //   },
]);

const activeTool = ref(tools.value[0].id);
const funLevel = ref(3); // 趣味等级
const titleChars = ref("趣味工具乐园".split(""));
const emojis = ref(["😀", "😎", "🤩", "🎉", "🌈"]);

const activeComponent = computed(() => {
  return tools.value.find((t) => t.id === activeTool.value)?.component;
});

// 标题字符动画样式
const charStyle = (index) => {
  const delay = index * 0.1;
  return {
    animationDelay: `${delay}s`,
    color: tools.value[index % tools.value.length].color,
  };
};

// 浮动形状样式
const floatingShapeStyle = (n) => {
  const size = Math.random() * 30 + 10;
  const colorIndex = Math.floor(Math.random() * tools.value.length);
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    backgroundColor: tools.value[colorIndex].color,
    opacity: Math.random() * 0.5 + 0.2,
    animationDuration: `${Math.random() * 20 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    borderRadius: Math.random() > 0.5 ? "50%" : "5px",
  };
};

// 鼠标悬停底部线条时的交互
const handleLineHover = (e) => {
  const line = e.target;
  const rect = line.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = x / rect.width;
  funLevel.value = Math.min(5, Math.max(1, Math.ceil(percent * 5)));
};

// 页面加载时的动画
onMounted(() => {
  setTimeout(() => {
    funLevel.value = 5;
  }, 2000);
});
</script>

<style lang="scss" scoped>
.fun-tools-container {
  --primary-color: #ff9e3f;
  --secondary-color: #6bd3ff;
  --accent-color: #ff6b8b;
  --card-bg: rgba(30, 20, 50, 0.95);
  --card-border: 1px solid rgba(255, 158, 63, 0.3);
  --card-shadow: 0 0 30px rgba(255, 158, 63, 0.2);
  --text-color: #ffffff;
  --bubble-color: rgba(107, 211, 255, 0.1);

  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  font-family: "Comic Neue", "Quicksand", sans-serif;
  margin-top: 70px;
  background: radial-gradient(circle at center, #2a0a4a 0%, #0a0420 100%);

  &.light {
    --primary-color: #ff7043;
    --secondary-color: #42a5f5;
    --accent-color: #ec407a;
    --card-bg: rgba(255, 255, 255, 0.95);
    --card-border: 1px solid rgba(255, 112, 67, 0.3);
    --card-shadow: 0 0 30px rgba(255, 112, 67, 0.2);
    --text-color: #333344;
    --bubble-color: rgba(66, 165, 245, 0.1);
    background: radial-gradient(circle at center, #f5f5ff 0%, #e0e0ff 100%);
  }
}

.fun-card {
  position: relative;
  width: 100%;
  max-width: 1200px;
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  overflow: hidden;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(255, 158, 63, 0.3);
  }
}

.dynamic-header {
  position: relative;
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 158, 63, 0.2);

  .fun-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    .title-char {
      color: var(--primary-color) !important;
      display: inline-block;
      animation: bounce 0.8s ease infinite alternate;
      text-shadow: 0 0 10px currentColor;
    }
  }

  .fun-subtitle {
    color: var(--text-color);
    font-size: 1rem;
    letter-spacing: 3px;
    opacity: 0.8;
    text-transform: uppercase;
    margin-top: 1rem;
  }

  .bubble-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      var(--bubble-color) 0%,
      transparent 70%
    );
    background-size: 50px 50px;
    opacity: 0.5;
    z-index: -1;
  }
}

.fun-tool-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.fun-tool-content {
  position: relative;
  min-height: 400px;
  border-radius: 15px;
  overflow: hidden;
  z-index: 2;
  background: rgba(0, 0, 0, 0.01);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);

  .content-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;

    .floating-shape {
      position: absolute;
      animation: float linear infinite;
      filter: blur(1px);
    }
  }
}

.fun-card-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;

  .interactive-line {
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color),
      var(--accent-color),
      var(--primary-color)
    );
    margin-bottom: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      height: 6px;
      box-shadow: 0 0 10px rgba(255, 158, 63, 0.5);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 20%;
      height: 100%;
      background: white;
      opacity: 0.5;
      animation: slide 3s linear infinite;
    }
  }

  .footer-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text-color);
    opacity: 0.8;

    .emoji-indicator {
      display: flex;
      gap: 0.3rem;
      font-size: 1.2rem;

      span {
        transition: all 0.3s ease;
      }
    }
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-10px) scale(1.2);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(calc(100vw - 100px), calc(100vh - 100px))
      rotate(360deg);
  }
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(500%);
  }
}

@media (max-width: 768px) {
  .fun-tools-container {
    padding: 1rem;
  }

  .fun-card {
    padding: 1.5rem;
  }

  .dynamic-header .fun-title {
    font-size: 1.8rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .fun-tool-nav {
    gap: 1rem;
  }
}
</style>
