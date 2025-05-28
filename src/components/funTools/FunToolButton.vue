<template>
  <button
    class="tech-button"
    :class="[{ active }, theme]"
    @click="$emit('click')"
  >
    <span class="button-text">{{ text }}</span>
    <span class="button-border button-border-top"></span>
    <span class="button-border button-border-right"></span>
    <span class="button-border button-border-bottom"></span>
    <span class="button-border button-border-left"></span>
    <span class="button-glow"></span>
  </button>
</template>

<script setup>
defineProps({
  active: Boolean,
  text: String,
  theme: {
    type: String,
    default: "dark",
  },
});

defineEmits(["click"]);
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Rajdhani:wght@500;700&display=swap");

.tech-button {
  /* 默认暗色主题变量 */
  --primary-color: #00f0ff;
  --text-color: #ffffff;
  --bg-color: rgba(0, 240, 255, 0.05);
  --border-color: rgba(0, 240, 255, 0.5);
  --glow-color: rgba(0, 240, 255, 0.3);
  --active-glow: 0 0 15px rgba(0, 240, 255, 0.5);

  position: relative;
  min-width: 120px;
  padding: 12px 24px;
  background: var(--bg-color);
  color: var(--text-color);
  border: none;
  font-family: "Orbitron", "Rajdhani", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  /* 亮色主题覆盖 */
  &.light {
    --primary-color: #0066ff;
    --text-color: #1a1a2e;
    --bg-color: rgba(0, 102, 255, 0.08);
    --border-color: rgba(0, 102, 255, 0.7);
    --glow-color: rgba(0, 102, 255, 0.2);
    --active-glow: 0 0 15px rgba(0, 102, 255, 0.3);
  }

  .button-text {
    position: relative;
    z-index: 2;
    text-shadow: 0 0 5px var(--primary-color);
  }

  .button-border {
    position: absolute;
    background: var(--primary-color);
    transition: all 0.3s ease;
  }

  .button-border-top {
    top: 0;
    left: 0;
    width: 0;
    height: 1px;
  }

  .button-border-right {
    top: 0;
    right: 0;
    width: 1px;
    height: 0;
  }

  .button-border-bottom {
    bottom: 0;
    right: 0;
    width: 0;
    height: 1px;
  }

  .button-border-left {
    bottom: 0;
    left: 0;
    width: 1px;
    height: 0;
  }

  .button-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.5s ease;
    z-index: 1;
  }

  &:hover {
    background: rgba(var(--primary-color), 0.1);

    .button-border-top {
      width: 100%;
    }

    .button-border-right {
      height: 100%;
    }

    .button-border-bottom {
      width: 100%;
    }

    .button-border-left {
      height: 100%;
    }

    .button-glow {
      width: 200%;
      height: 200%;
      opacity: 0.6;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  &.active {
    background: rgba(var(--primary-color), 0.15);
    box-shadow: var(--active-glow);

    .button-border {
      background: var(--text-color);
      box-shadow: 0 0 5px currentColor;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: scan 2s linear infinite;
    }
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .tech-button {
    min-width: 100px;
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .tech-button {
    min-width: 80px;
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
