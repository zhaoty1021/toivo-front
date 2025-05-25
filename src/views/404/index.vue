<template>
  <div class="not-found-container" :class="theme">
    <div class="cosmic-scene">
      <!-- 星空背景 -->
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>

      <!-- 行星 -->
      <div class="planet"></div>

      <!-- 404文字 -->
      <div class="error-code">
        <span>4</span>
        <div class="astronaut">
          <div class="helmet"></div>
          <div class="body"></div>
        </div>
        <span>4</span>
      </div>

      <!-- 错误信息 -->
      <div class="error-message">
        <h1>页面迷失在太空中</h1>
        <p>我们正在努力将它带回轨道...</p>
        <p class="countdown">{{ countdown }}秒后自动返回地球</p>

        <router-link to="/" class="home-button">
          <span>返回首页</span>
          <svg-icon name="rocket" class="rocket-icon" />
        </router-link>
      </div>

      <!-- 太空船 -->
      <div class="spaceship">
        <div class="window"></div>
        <div class="engine"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";

const theme = inject("theme");
const router = useRouter();
const countdown = ref(8);
const userInteracted = ref(false);

// 倒计时逻辑
onMounted(() => {
  // 监听用户交互事件
  const handleUserInteraction = () => {
    userInteracted.value = true;
    // 移除事件监听，避免重复执行
    window.removeEventListener("click", handleUserInteraction);
    window.removeEventListener("keydown", handleUserInteraction);
    window.removeEventListener("touchstart", handleUserInteraction);
  };

  window.addEventListener("click", handleUserInteraction);
  window.addEventListener("keydown", handleUserInteraction);
  window.addEventListener("touchstart", handleUserInteraction);

  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      // 只有用户没有交互时才自动跳转
      if (!userInteracted.value) {
        router.push("/");
      }
    }
  }, 1000);

  // 组件卸载时清理
  return () => {
    clearInterval(timer);
    window.removeEventListener("click", handleUserInteraction);
    window.removeEventListener("keydown", handleUserInteraction);
    window.removeEventListener("touchstart", handleUserInteraction);
  };
});
</script>

<style lang="scss" scoped>
.not-found-container {
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --bg-color: #0a0a12;
  --text-color: #ffffff;
  --planet-color: #4d007d;
  --planet-color-dark-10: #3a005e;
  --planet-color-dark-20: #27003f;
  --stars-color: rgba(255, 255, 255, 0.8);

  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  font-family: "Orbitron", sans-serif;

  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --bg-color: #f5f7fa;
    --text-color: #333344;
    --planet-color: #7d4d00;
    --planet-color-dark-10: #6a4400;
    --planet-color-dark-20: #573800;
    --stars-color: rgba(0, 0, 0, 0.6);
  }
}

.cosmic-scene {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  overflow: hidden;
}

/* 星空背景 */
@keyframes twinkle {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.stars,
.stars2,
.stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      1px 1px at 5% 15%,
      var(--stars-color) 1%,
      transparent 2%
    ),
    radial-gradient(1px 1px at 10% 35%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 15% 55%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 20% 75%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 25% 95%, var(--stars-color) 1%, transparent 2%);
  background-size: 100px 100px;
  animation: twinkle 3s infinite;
}

.stars2 {
  background-image: radial-gradient(
      1px 1px at 30% 25%,
      var(--stars-color) 1%,
      transparent 2%
    ),
    radial-gradient(1px 1px at 40% 45%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 50% 65%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 60% 85%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 70% 5%, var(--stars-color) 1%, transparent 2%);
  animation-delay: 0.5s;
}

.stars3 {
  background-image: radial-gradient(
      1px 1px at 75% 20%,
      var(--stars-color) 1%,
      transparent 2%
    ),
    radial-gradient(1px 1px at 85% 40%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 95% 60%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 15% 80%, var(--stars-color) 1%, transparent 2%),
    radial-gradient(1px 1px at 25% 10%, var(--stars-color) 1%, transparent 2%);
  animation-delay: 1s;
}

/* 行星 */
@keyframes planet-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.planet {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--planet-color) 0%,
    var(--planet-color-dark-10) 50%,
    var(--planet-color-dark-20) 100%
  );
  box-shadow: 0 0 60px rgba(0, 240, 255, 0.3),
    inset -20px -20px 60px rgba(0, 0, 0, 0.5);
  top: -100px;
  right: -100px;
  animation: planet-rotate 60s linear infinite;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
      circle at 70% 30%,
      transparent 30%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
}

/* 404文字 */
.error-code {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  font-size: 15rem;
  font-weight: 900;
  color: var(--primary-color);
  text-shadow: 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);

  span {
    display: inline-block;
    animation: bounce 2s infinite alternate;

    &:first-child {
      animation-delay: 0.1s;
    }
    &:last-child {
      animation-delay: 0.3s;
    }
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-30px);
  }
}

/* 宇航员 */
.astronaut {
  position: relative;
  width: 120px;
  height: 180px;
  margin: 0 40px;
  animation: float 4s ease-in-out infinite;

  .helmet {
    position: absolute;
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
    top: 0;
    left: 10px;
    box-shadow: inset -10px -10px 30px rgba(0, 0, 0, 0.2),
      0 0 20px var(--primary-color);

    &::before {
      content: "";
      position: absolute;
      width: 80px;
      height: 40px;
      background: var(--primary-color);
      border-radius: 20px;
      top: 30px;
      left: 10px;
      opacity: 0.3;
    }
  }

  .body {
    position: absolute;
    width: 80px;
    height: 100px;
    background: white;
    border-radius: 30px;
    top: 80px;
    left: 20px;
    box-shadow: inset -10px -10px 30px rgba(0, 0, 0, 0.2),
      0 0 20px var(--primary-color);
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 错误信息 */
.error-message {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: var(--text-color);
  max-width: 600px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 10px var(--primary-color);
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .countdown {
    color: var(--primary-color);
    font-weight: bold;
    margin: 1.5rem 0;
    font-size: 1.5rem;
  }
}

/* 返回按钮 */
.home-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px var(--primary-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 0 20px var(--primary-color);

    .rocket-icon {
      transform: translateX(5px);
    }

    &::after {
      opacity: 1;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0)
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  .rocket-icon {
    width: 20px;
    height: 20px;
    margin-left: 10px;
    transition: transform 0.3s;
  }
}

/* 太空船 */
.spaceship {
  position: absolute;
  width: 200px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 100px 10px 10px 100px;
  bottom: 20%;
  right: 10%;
  animation: spaceship-fly 20s linear infinite;
  box-shadow: 0 0 20px var(--primary-color),
    inset -10px -10px 30px rgba(0, 0, 0, 0.2);

  .window {
    position: absolute;
    width: 40px;
    height: 40px;
    background: var(--primary-color);
    border-radius: 50%;
    top: 20px;
    left: 30px;
    opacity: 0.5;
  }

  .engine {
    position: absolute;
    width: 30px;
    height: 60px;
    background: linear-gradient(
      to bottom,
      var(--secondary-color),
      var(--primary-color)
    );
    border-radius: 5px;
    bottom: -40px;
    right: 20px;
    animation: engine-fire 0.5s infinite alternate;
  }
}

@keyframes spaceship-fly {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-100px) rotate(5deg);
  }
  50% {
    transform: translateX(-200px) rotate(0deg);
  }
  75% {
    transform: translateX(-100px) rotate(-5deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

@keyframes engine-fire {
  0% {
    height: 60px;
    opacity: 0.8;
  }
  100% {
    height: 80px;
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-code {
    font-size: 10rem;
    top: 25%;

    .astronaut {
      width: 80px;
      height: 120px;
      margin: 0 20px;

      .helmet {
        width: 70px;
        height: 70px;
      }

      .body {
        width: 60px;
        height: 70px;
        top: 50px;
      }
    }
  }

  .error-message {
    top: 50%;
    width: 90%;

    h1 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .planet {
    width: 200px;
    height: 200px;
  }

  .spaceship {
    width: 150px;
    right: 5%;
  }
}
</style>
