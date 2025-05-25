<template>
  <div class="cyber-tool-card" :class="theme">
    <div class="tech-header">
      <h1 class="title">时间戳转换器</h1>
      <div class="tech-underline"></div>
    </div>

    <div class="timestamp-section">
      <div class="input-group">
        <input
          v-model="timestampInput"
          placeholder="输入时间戳或日期"
          class="cyber-input"
        />
      </div>

      <div class="output-grid">
        <div class="output-item">
          <label>日期时间:</label>
          <span>{{ timestampOutput.datetime || "-" }}</span>
        </div>

        <div class="output-item">
          <label>时间戳:</label>
          <span>{{ timestampOutput.timestamp || "-" }}</span>
        </div>

        <div class="output-item">
          <label>UTC时间:</label>
          <span>{{ timestampOutput.utc || "-" }}</span>
        </div>
      </div>

      <!-- 对话框下方按钮组 -->
      <div class="dialog-actions">
        <button class="action-button convert" @click="convertTimestamp">
          <RefreshCw class="button-icon" />
          <span>转换</span>
        </button>

        <button class="action-button current" @click="useCurrentTime">
          <Clock class="button-icon" />
          <span>当前时间</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { getCurrentTimestamp } from "@/utils/codingTools";
import { Clock, RefreshCw } from "lucide-vue-next";

const theme = inject("theme", "dark");

const timestampInput = ref("");
const timestampOutput = ref({
  datetime: "",
  timestamp: "",
  utc: "",
});

const convertTimestamp = () => {
  if (!timestampInput.value) return;

  const date = new Date(Number(timestampInput.value) || timestampInput.value);
  if (isNaN(date.getTime())) {
    timestampOutput.value = {
      datetime: "无效的时间戳或日期",
      timestamp: "",
      utc: "",
    };
    return;
  }

  timestampOutput.value = {
    datetime: date.toLocaleString("zh-CN"),
    timestamp: date.getTime().toString(),
    utc: date.toUTCString(),
  };
};

const useCurrentTime = () => {
  timestampInput.value = getCurrentTimestamp().toString();
  convertTimestamp();
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

  .timestamp-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .input-group {
    .cyber-input {
      width: 95%;
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
  }

  .output-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .output-item {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    label {
      display: block;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    span {
      font-family: "Fira Code", monospace;
      word-break: break-all;
      color: var(--text-color);
    }
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);

    .action-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.2rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-family: inherit;

      &.convert {
        background-color: var(--primary-color);
        color: white;

        &:hover {
          background-color: var(--secondary-color);
          box-shadow: 0 0 10px rgba(var(--primary-color), 0.5);
        }
      }

      &.current {
        background-color: var(--bg-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);

        &:hover {
          background-color: var(--hover-bg);
          border-color: var(--primary-color);
        }
      }

      .button-icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  @media (max-width: 768px) {
    .output-grid {
      grid-template-columns: 1fr;
    }

    .dialog-actions {
      flex-direction: column;

      .action-button {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>
