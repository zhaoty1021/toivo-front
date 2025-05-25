<template>
  <div class="cyber-tool-card" :class="theme">
    <div class="tech-header">
      <h1 class="title">HTTP 状态码查询</h1>
      <div class="tech-underline"></div>
    </div>

    <div class="search-controls">
      <div class="search-input">
        <input
          v-model="searchQuery"
          placeholder="输入状态码 (如 404)"
          class="cyber-input"
          @keyup.enter="searchCode"
        />
        <ToolButton @click="searchCode" class="search-button">
          <template #icon>
            <svg-icon name="search" />
          </template>
          查询
        </ToolButton>
      </div>
    </div>

    <div class="status-grid">
      <div
        v-for="code in filteredCodes"
        :key="code.code"
        class="status-card"
        :class="{ highlighted: code.code.toString() === searchQuery }"
      >
        <div class="status-code" :style="{ color: getCodeColor(code.code) }">
          {{ code.code }}
        </div>
        <div class="status-name">{{ code.name }}</div>
        <div class="status-desc">{{ code.description }}</div>
        <div
          class="status-glow"
          :style="{ background: getCodeColor(code.code) }"
        ></div>
      </div>
    </div>

    <div class="legend">
      <div class="legend-item" v-for="(item, index) in legend" :key="index">
        <span class="legend-color" :style="{ background: item.color }"></span>
        <span class="legend-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import ToolButton from "./ToolButton.vue";

const theme = inject("theme", "dark");

const statusCodes = [
  { code: 200, name: "OK", description: "请求成功", category: "success" },
  {
    code: 201,
    name: "Created",
    description: "资源创建成功",
    category: "success",
  },
  {
    code: 204,
    name: "No Content",
    description: "请求成功但无内容返回",
    category: "success",
  },
  {
    code: 301,
    name: "Moved Permanently",
    description: "资源永久重定向",
    category: "redirect",
  },
  {
    code: 302,
    name: "Found",
    description: "资源临时重定向",
    category: "redirect",
  },
  {
    code: 304,
    name: "Not Modified",
    description: "资源未修改",
    category: "redirect",
  },
  {
    code: 400,
    name: "Bad Request",
    description: "客户端请求错误",
    category: "client",
  },
  {
    code: 401,
    name: "Unauthorized",
    description: "未授权访问",
    category: "client",
  },
  { code: 403, name: "Forbidden", description: "禁止访问", category: "client" },
  {
    code: 404,
    name: "Not Found",
    description: "资源未找到",
    category: "client",
  },
  {
    code: 405,
    name: "Method Not Allowed",
    description: "请求方法不被允许",
    category: "client",
  },
  {
    code: 500,
    name: "Internal Server Error",
    description: "服务器内部错误",
    category: "server",
  },
  {
    code: 502,
    name: "Bad Gateway",
    description: "网关错误",
    category: "server",
  },
  {
    code: 503,
    name: "Service Unavailable",
    description: "服务不可用",
    category: "server",
  },
  {
    code: 504,
    name: "Gateway Timeout",
    description: "网关超时",
    category: "server",
  },
];

const searchQuery = ref("");
const filteredCodes = computed(() => {
  if (!searchQuery.value) return statusCodes;
  return statusCodes.filter(
    (code) =>
      code.code.toString().includes(searchQuery.value) ||
      code.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      code.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const legend = [
  { color: "#00ff88", text: "成功 (2xx)" },
  { color: "#ffaa00", text: "重定向 (3xx)" },
  { color: "#ff5555", text: "客户端错误 (4xx)" },
  { color: "#ff00ff", text: "服务器错误 (5xx)" },
];

const getCodeColor = (code) => {
  if (code >= 200 && code < 300) return "#00ff88";
  if (code >= 300 && code < 400) return "#ffaa00";
  if (code >= 400 && code < 500) return "#ff5555";
  if (code >= 500) return "#ff00ff";
  return "#ffffff";
};

const searchCode = () => {
  // 搜索逻辑已在计算属性中处理
};
</script>

<style lang="scss" scoped>
.cyber-tool-card {
  // 默认亮色主题变量
  --primary-color: #0066cc;
  --secondary-color: #0099ff;
  --accent-color: #00cc99;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --text-color: #333344;
  --border-color: rgba(0, 102, 204, 0.2);
  --hover-bg: rgba(0, 102, 204, 0.05);
  --active-bg: rgba(0, 102, 204, 0.1);

  max-width: 1200px;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
  font-family: "Inter", "PingFang SC", sans-serif;

  // 暗色主题变量覆盖
  &.dark {
    --primary-color: #00f0ff;
    --secondary-color: #00a8ff;
    --accent-color: #00ffaa;
    --bg-color: #0a0a12;
    --card-bg: #1a1a2e;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --hover-bg: rgba(0, 240, 255, 0.1);
    --active-bg: rgba(0, 240, 255, 0.2);
  }

  .tech-header {
    text-align: center;
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      text-shadow: 0 0 10px rgba(var(--primary-color), 0.3);
    }

    .tech-underline {
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--primary-color),
        transparent
      );
      margin: 0 auto;
      width: 80px;
    }
  }

  .search-controls {
    margin-bottom: 2rem;

    .search-input {
      display: flex;
      gap: 1rem;
      align-items: center;

      .cyber-input {
        flex: 1;
        padding: 0.8rem 1rem;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-color);
        font-family: "Fira Code", monospace;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 8px var(--primary-color);
        }
      }

      .search-button {
        min-width: 100px;
      }
    }
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .status-card {
    position: relative;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 1;

    &.highlighted {
      border-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(var(--primary-color), 0.5);
    }

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .status-code {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-family: "Orbitron", sans-serif;
      text-shadow: 0 0 8px currentColor;
    }

    .status-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .status-desc {
      color: var(--text-color);
      opacity: 0.8;
      line-height: 1.5;
    }

    .status-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      opacity: 0.3;
      z-index: -1;
    }
  }

  .legend {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .legend-color {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        box-shadow: 0 0 8px currentColor;
      }

      .legend-text {
        color: var(--text-color);
        font-size: 0.9rem;
      }
    }
  }

  @media (max-width: 768px) {
    .status-grid {
      grid-template-columns: 1fr;
    }

    .search-input {
      flex-direction: column;
    }
  }
}
</style>
