<template>
  <div class="coding-tools-container" :class="theme">
    <!-- 主卡片容器 -->
    <div class="cyber-card">
      <!-- 全息投影标题 -->
      <div class="holographic-header">
        <h1 class="cyber-title">开发辅助工具</h1>
        <p class="cyber-subtitle">DEVELOPER UTILITIES TERMINAL</p>
        <div class="grid-pattern"></div>
      </div>

      <!-- 工具导航 -->
      <div class="tool-nav">
        <ToolButton
          v-for="tool in tools"
          :key="tool.id"
          :active="activeTool === tool.id"
          @click="activeTool = tool.id"
        >
          <template #icon>
            <svg-icon :name="tool.icon" />
          </template>
          {{ tool.name }}
        </ToolButton>
      </div>

      <!-- 工具内容区 -->
      <div class="tool-content">
        <KeepAlive>
          <component :is="activeComponent" />
        </KeepAlive>
      </div>

      <!-- 卡片底部装饰 -->
      <div class="card-footer">
        <div class="footer-line"></div>
        <div class="status-indicator">
          <span>SYSTEM STATUS: OPERATIONAL</span>
          <div class="led-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import JsonTool from "@/components/codingTools/JsonTool.vue";
import TimestampTool from "@/components/codingTools/TimestampTool.vue";
import SqlTool from "@/components/codingTools/SqlTool.vue";
import ToolButton from "@/components/codingTools/ToolButton.vue";
import HttpCodeTool from "@/components/codingTools/HttpCodeTool.vue";
import PicCompressTool from "@/components/codingTools/PicCompressTool.vue";

const theme = inject("theme", "dark");

// 工具列表
const tools = ref([
  { id: "json", name: "JSON工具", icon: "json", component: JsonTool },
  {
    id: "timestamp",
    name: "时间戳转换",
    icon: "clock",
    component: TimestampTool,
  },
  { id: "sql", name: "SQL格式化", icon: "sql", component: SqlTool },
  {
    id: "httpCode",
    name: "HTTP状态码查询",
    icon: "http",
    component: HttpCodeTool,
  },
  {
    id: "picCompress",
    name: "图片压缩",
    icon: "compress",
    component: PicCompressTool,
  },
]);

const activeTool = ref("json");

const activeComponent = computed(() => {
  return tools.value.find((t) => t.id === activeTool.value)?.component;
});
</script>

<style lang="scss" scoped>
.coding-tools-container {
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --card-bg: rgba(20, 20, 40, 0.95);
  --card-border: 1px solid rgba(0, 240, 255, 0.3);
  --card-shadow: 0 0 30px rgba(0, 240, 255, 0.3);
  --text-color: #ffffff;
  --grid-color: rgba(0, 240, 255, 0.1);

  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  font-family: "Orbitron", "Rajdhani", sans-serif;
  margin-top: 70px;

  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --card-bg: rgba(255, 255, 255, 0.95);
    --card-border: 1px solid rgba(0, 102, 204, 0.3);
    --card-shadow: 0 0 30px rgba(0, 102, 204, 0.2);
    --text-color: #333344;
    --grid-color: rgba(0, 102, 204, 0.05);
  }
}

.cyber-card {
  position: relative;
  width: 100%;
  max-width: 1200px;
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 2rem;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.holographic-header {
  position: relative;
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);

  .cyber-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
    letter-spacing: 1px;
  }

  .cyber-subtitle {
    color: var(--text-color);
    font-size: 1rem;
    letter-spacing: 3px;
    opacity: 0.8;
    text-transform: uppercase;
  }

  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    z-index: -1;
  }
}

.tool-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.tool-content {
  position: relative;
  z-index: 2;
}

.card-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 240, 255, 0.2);

  .footer-line {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    margin-bottom: 1rem;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    font-size: 0.8rem;
    color: var(--text-color);
    opacity: 0.7;

    .led-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00ff9d;
      box-shadow: 0 0 8px #00ff9d;
      animation: pulse 1.5s infinite;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .coding-tools-container {
    padding: 1rem;
  }

  .cyber-card {
    padding: 1.5rem;
  }

  .holographic-header .cyber-title {
    font-size: 1.8rem;
  }

  .tool-nav {
    gap: 1rem;
  }
}
</style>
