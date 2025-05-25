<template>
  <button
    :class="['cyber-button', theme, { active: active }]"
    @click.stop.prevent="handleClick"
    @mousedown.stop
    @mouseup.stop
  >
    <span class="button-glow"></span>
    <span class="button-text">
      <slot></slot>
    </span>
    <span class="button-icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<script setup>
import { inject } from "vue";

const props = defineProps({
  active: Boolean,
});

const theme = inject("theme", "dark");
const emit = defineEmits(["click"]);

let lastClickTime = 0;
const handleClick = (e) => {
  const now = Date.now();
  if (now - lastClickTime < 300) return; // 300ms内只允许点击一次

  lastClickTime = now;
  emit("click", e);
};
</script>

<style lang="scss" scoped>
.cyber-button {
  // 默认暗色主题变量
  --button-color: #00f0ff;
  --button-hover: #00c3ff;
  --button-bg: rgba(20, 20, 40, 0.8);
  --button-text: white;
  --button-glow-color: rgba(0, 240, 255, 0.3);
  --button-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  --button-active-shadow: 0 0 20px #00f0ff;
  --button-hover-shadow: 0 5px 15px rgba(0, 195, 255, 0.4);

  // 确保字体设置在最外层
  font-family: "Orbitron", sans-serif;
  font-weight: 500; // 确保使用支持的字体粗细

  position: relative;
  padding: 0.8rem 1.5rem;
  background: var(--button-bg);
  border: 1px solid var(--button-color);
  border-radius: 6px;
  color: var(--button-text);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: var(--button-shadow);

  // 提高特异性确保字体不被覆盖
  .cyber-button.cyber-button {
    font-family: "Orbitron", sans-serif;
  }

  &.light {
    --button-color: #0066cc;
    --button-hover: #0088ff;
    --button-bg: rgba(240, 242, 245, 0.8);
    --button-text: #333344;
    --button-glow-color: rgba(0, 102, 204, 0.3);
    --button-shadow: 0 0 10px rgba(0, 102, 204, 0.3);
    --button-active-shadow: 0 0 20px #0066cc;
    --button-hover-shadow: 0 5px 15px rgba(0, 136, 255, 0.4);
  }

  &.active {
    background: var(--button-color);
    box-shadow: var(--button-active-shadow);
  }

  &:hover {
    background: var(--button-hover);
    transform: translateY(-2px);
    box-shadow: var(--button-hover-shadow);
  }

  .button-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      var(--button-glow-color),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .button-glow {
    opacity: 1;
  }

  .button-icon {
    display: flex;
    align-items: center;

    ::v-deep(svg) {
      width: 18px;
      height: 18px;
    }
  }

  .button-text {
    font-family: inherit; // 继承按钮的字体设置
    font-weight: inherit;
  }
}
</style>
