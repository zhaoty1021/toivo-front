<template>
    <div class="cyber-tool-card" :class="theme">
      <div class="tech-header">
        <h1 class="title">SQL 格式化器</h1>
        <div class="tech-underline"></div>
      </div>
  
      <div class="tool-controls">
        <ToolButton 
          @click="formatSql"
          class="action-button"
        >
          <template #icon>
            <svg-icon name="format" />
          </template>
          格式化
        </ToolButton>
        
        <ToolButton 
          @click="clearSql"
          class="action-button danger"
        >
          <template #icon>
            <svg-icon name="clear" />
          </template>
          清空
        </ToolButton>
      </div>
  
      <div class="code-section">
        <div class="code-block">
          <h4>输入</h4>
          <textarea
            v-model="sqlInput"
            placeholder="输入SQL语句..."
            class="cyber-textarea"
          ></textarea>
        </div>
  
        <div class="code-block">
          <h4>输出</h4>
          <pre class="code-output">{{ sqlOutput || '<FORMATTED_SQL>' }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject } from "vue";
  import { formatSQL } from "@/utils/codingTools";
  import ToolButton from "./ToolButton.vue";
  
  const theme = inject("theme", "dark");
  const sqlInput = ref("");
  const sqlOutput = ref("");
  
  const formatSql = () => {
    if (!sqlInput.value) return;
    sqlOutput.value = formatSQL(sqlInput.value);
  };
  
  const clearSql = () => {
    sqlInput.value = "";
    sqlOutput.value = "";
  };
  </script>
  
  <style lang="scss" scoped>
  .cyber-tool-card {
    // 默认亮色主题变量
    --primary-color: #0066cc;
    --secondary-color: #0099ff;
    --accent-color: #00cc99;
    --danger-color: #ff3d3d;
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
      --danger-color: #ff5e5e;
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
  
    .tool-controls {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
  
      .action-button {
        min-width: 100px;
        justify-content: center;
  
        &.danger {
          --button-color: var(--danger-color);
          --button-hover: #ff6b6b;
        }
      }
    }
  
    .code-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
  
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  
    .code-block {
      display: flex;
      flex-direction: column;
  
      h4 {
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
        color: var(--primary-color);
        text-shadow: 0 0 6px rgba(var(--primary-color), 0.3);
      }
    }
  
    .cyber-textarea {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      color: var(--text-color);
      min-height: 240px;
      resize: none;
      transition: all 0.3s ease;
      font-family: "Fira Code", monospace;
  
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 8px var(--primary-color);
      }
    }
  
    .code-output {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      color: var(--text-color);
      min-height: 240px;
      white-space: pre-wrap;
      overflow-x: auto;
      font-family: "Fira Code", monospace;
      text-shadow: 0 0 4px rgba(var(--primary-color), 0.2);
    }
  }
  </style>