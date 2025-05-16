<template>
  <div class="cyber-nav" :class="theme">
    <!-- 霓虹灯边框效果 -->
    <div class="neon-border"></div>

    <div class="nav-container">
      <!-- 3D全息投影Logo -->
      <div class="logo-box" @click="router.push('/')">
        <div class="logo-3d">
          <span
            v-for="(char, i) in ['T', 'O', 'I', 'V', 'O']"
            :key="i"
            :style="{ '--i': i }"
            >{{ char }}</span
          >
        </div>
        <div class="logo-watermelon">🍉</div>
      </div>

      <!-- 全息菜单 -->
      <div class="menu-box">
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="menu-item"
          @click="handleMenuClick(item)"
          @mouseenter="activateMenu(item)"
          @mouseleave="deactivateMenu"
        >
          <div class="menu-hologram">
            <SvgIcon
              :name="item.icon"
              class="menu-icon"
              :style="{ color: item.color }"
            />
            <span class="menu-text">{{ item.name }}</span>
            <div class="menu-line"></div>
          </div>
          <div class="menu-particles" v-if="activeMenu === item.path"></div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <!-- 全息投影开关 -->
        <div class="theme-switch" @click.stop="toggleTheme">
          <div class="switch-track">
            <div class="switch-thumb">
              <span class="sun-icon">☀️</span>
              <span class="moon-icon">🌙</span>
            </div>
          </div>
        </div>

        <!-- 用户全息投影 -->
        <div class="user-hologram" @click="toggleUserMenu">
          <div class="hologram-avatar">
            <img src="@/assets/avatar.png" alt="User" />
            <div class="hologram-grid"></div>
            <div class="hologram-light"></div>
          </div>
          <div class="hologram-ring"></div>
        </div>

        <!-- 全息用户菜单 -->
        <transition name="hologram-fade">
          <div
            v-if="showUserMenu"
            class="hologram-menu"
            v-click-outside="closeUserMenu"
          >
            <div class="menu-grid"></div>
            <div class="menu-item" @click="router.push('/user')">
              <SvgIcon class="icon" name="about" />
              <span>个人中心</span>
            </div>
            <div class="menu-item" @click="logout">
              <SvgIcon class="icon" name="about" />
              <span>退出登录</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const theme = inject("theme");
const activeMenu = ref(null);
const showParticles = ref(true);

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
};

// 菜单配置
const menuItems = [
  { path: "/", name: "首页", icon: "nav-home", color: "#FF5F5F" },
  { path: "/archive", name: "归档", icon: "nav-archive", color: "#5F9EA0" },
  { path: "/category", name: "分类", icon: "nav-category", color: "#9370DB" },
  { path: "/tags", name: "标签", icon: "nav-tag", color: "#FFA500" },
  { path: "/message", name: "留言", icon: "nav-message", color: "#20B2AA" },
  { path: "/say", name: "说说", icon: "nav-say", color: "#FF69B4" },
  { path: "/link", name: "友链", icon: "nav-link", color: "#1E90FF" },
  { path: "/about", name: "关于", icon: "nav-about", color: "#32CD32" },
];

const showUserMenu = ref(false);

const handleMenuClick = (item) => {
  router.push(item.path);
};

const activateMenu = (item) => {
  activeMenu.value = item.path;
};

const deactivateMenu = () => {
  activeMenu.value = null;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  console.log("User menu toggled:", showUserMenu.value);
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const logout = () => {
  showUserMenu.value = false;
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@500;600;700&family=Press+Start+2P&display=swap");

.cyber-nav {
  --logo-colors: #ff6ec4, #7873f5, #4facfe, #43e97b, #38f9d7; /* 深色模式 */
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: rgba(10, 10, 20, 0.9);
  --text-color: #ffffff;
  --border-color: rgba(0, 240, 255, 0.3);
  --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
  --hologram-effect: 0 0 15px rgba(0, 240, 255, 0.5),
    0 0 30px rgba(0, 240, 255, 0.3), 0 0 45px rgba(0, 240, 255, 0.1);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 1000;
  background-color: var(--bg-color);
  backdrop-filter: blur(10px);
  font-family: "Orbitron", "Rajdhani", sans-serif;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
  overflow: visible !important; /* 覆盖可能的溢出隐藏 */

  &.light {
    --logo-colors: #007cf0, #00dfd8, #3f51b5, #007cf0, #00dfd8; /* 浅色模式 */
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --bg-color: rgba(240, 242, 245, 0.9);
    --text-color: #333344;
    --border-color: rgba(0, 102, 204, 0.3);
    --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5);
  }

  .neon-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color),
      var(--accent-color),
      var(--secondary-color),
      var(--primary-color)
    );
    box-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--secondary-color);
    animation: neonFlow 3s linear infinite;
  }

  @keyframes neonFlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
  }

  /* 全息投影Logo */
  .logo-box {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease;
    user-select: none;

    &:hover .logo-3d span {
      transform: translateY(-4px) rotateX(20deg) scale(1.1);
      filter: drop-shadow(0 0 6px currentColor);
    }

    .logo-3d {
      display: flex;
      perspective: 600px;

      span {
        font-size: 24px;
        font-weight: 800;
        margin: 0 2px;
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        background-image: linear-gradient(45deg, var(--logo-colors));
        transition: transform 0.4s ease, filter 0.3s ease;
        transform-style: preserve-3d;

        animation: float 3s ease-in-out infinite;
        animation-delay: calc(var(--i) * 0.1s);
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }
    }
    .logo-watermelon {
      font-size: 30px;
      margin-left: 10px;
      color: var(--primary-color);
      filter: drop-shadow(0 0 6px currentColor);
      animation: watermelonPulse 1.5s ease-in-out infinite;
    }
  }

  /* 全息菜单 */
  .menu-box {
    display: flex;
    height: 100%;
    position: relative;
    z-index: 2;

    .menu-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 100%;
      cursor: pointer;
      perspective: 500px;
      transform-style: preserve-3d;

      .menu-hologram {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        transform: translateZ(0);

        .menu-icon {
          width: 25px;
          height: 25px;
          color: v-bind(
            'menuItems.find(i => i.name === name)?.color || "var(--text-color)"'
          );
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 2px currentColor);
        }

        .menu-text {
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: var(--text-color);
          white-space: nowrap;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        }

        .menu-line {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            var(--primary-color),
            var(--secondary-color)
          );
          transition: all 0.3s ease;
          opacity: 0;
        }
      }

      .menu-particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle at center,
          rgba(0, 240, 255, 0.1) 0%,
          transparent 70%
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        .menu-hologram {
          transform: translateZ(20px);

          .menu-icon {
            transform: scale(1.3);
            filter: drop-shadow(0 0 8px currentColor);
          }

          .menu-text {
            color: var(--primary-color);
            text-shadow: var(--glow-effect);
          }

          .menu-line {
            width: 100%;
            opacity: 1;
          }
        }

        .menu-particles {
          opacity: 1;
        }
      }
    }
  }

  /* 控制面板 */
  .control-panel {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
    z-index: 2;
    overflow: visible; /* 重要！ */

    /* 全息用户头像 */
    .user-hologram {
      position: relative;
      width: 45px;
      height: 45px;
      cursor: pointer;
      perspective: 500px;
      transform-style: preserve-3d;
      z-index: 5;

      .hologram-avatar {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        transform: translateZ(0);
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hologram-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at center,
              transparent 60%,
              rgba(0, 240, 255, 0.2) 100%
            ),
            linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.5;
        }

        .hologram-light {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(0, 240, 255, 0.3) 0%,
            transparent 70%
          );
          animation: hologramPulse 2s ease-in-out infinite;
        }
      }

      .hologram-ring {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid var(--secondary-color);
        border-radius: 50%;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px var(--secondary-color);
      }

      &:hover {
        .hologram-avatar {
          transform: translateZ(10px);
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.8);
        }

        .hologram-ring {
          opacity: 1;
          transform: translateZ(5px);
        }
      }
    }

    /* 全息用户菜单 */
    .hologram-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: rgba(10, 10, 20, 0.9);
      border: 1px solid var(--primary-color);
      border-radius: 5px;
      padding: 10px 0;
      min-width: 180px;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5), var(--hologram-effect);
      z-index: 10;
      backdrop-filter: blur(10px);
      transform-origin: top right;
      perspective: 500px;
      transform-style: preserve-3d;
      visibility: visible; /* 确保可见 */
      opacity: 1; /* 明确设置不透明度 */
      overflow-y: auto; /* 允许内容滚动 */

      .menu-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
        background-size: 10px 10px;
        opacity: 0.3;
        pointer-events: none;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        color: var(--text-color);
        transition: all 0.3s ease;
        cursor: pointer;
        gap: 10px;
        transform: translateZ(0);

        &:hover {
          background: rgba(0, 240, 255, 0.2);
          transform: translateZ(10px);

          .icon {
            color: var(--primary-color);
            filter: drop-shadow(0 0 5px currentColor);
          }

          span {
            color: var(--primary-color);
            text-shadow: 0 0 5px var(--primary-color);
          }
        }

        .icon {
          width: 16px;
          height: 16px;
          color: var(--text-color);
          transition: all 0.3s ease;
        }

        span {
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
      }
    }
  }

  /* 动画效果 */
  @keyframes hologramPulse {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 0.3;
    }
  }

  @keyframes particlePulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  @keyframes switchGlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  /* 全息菜单过渡动画 */
  .hologram-fade-enter-active,
  .hologram-fade-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }

  .hologram-fade-enter-from,
  .hologram-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px) rotateX(60deg);
  }
}

/* 白天模式调整 */
.cyber-nav.light {
  .holographic-logo {
    .logo-layer.base {
      color: var(--primary-color);
    }
    .logo-layer.glow {
      text-shadow: 0 0 15px var(--secondary-color);
    }
    .logo-layer.shadow {
      text-shadow: 0 0 30px var(--accent-color);
    }
  }

  .holographic-switch {
    .switch-core {
      background: rgba(255, 255, 255, 0.5);
      border-color: var(--primary-color);
      box-shadow: inset 0 0 10px rgba(0, 102, 204, 0.3), var(--hologram-effect);

      .switch-light {
        background: linear-gradient(
          90deg,
          rgba(0, 102, 204, 0.1) 0%,
          rgba(204, 0, 255, 0.1) 100%
        );
      }

      .switch-grid {
        background: linear-gradient(rgba(0, 102, 204, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 102, 204, 0.2) 1px, transparent 1px);
      }
    }
  }

  .user-hologram {
    .hologram-avatar {
      box-shadow: 0 0 15px rgba(0, 102, 204, 0.5);

      .hologram-grid {
        background: radial-gradient(
            circle at center,
            transparent 60%,
            rgba(0, 102, 204, 0.2) 100%
          ),
          linear-gradient(rgba(0, 102, 204, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 102, 204, 0.2) 1px, transparent 1px);
      }

      .hologram-light {
        background: radial-gradient(
          circle at center,
          rgba(0, 102, 204, 0.3) 0%,
          transparent 70%
        );
      }
    }

    .hologram-ring {
      border-color: var(--secondary-color);
      box-shadow: 0 0 10px var(--secondary-color);
    }

    &:hover {
      .hologram-avatar {
        box-shadow: 0 0 25px rgba(0, 102, 204, 0.8);
      }
    }
  }

  .hologram-menu {
    background: rgba(240, 242, 245, 0.95);
    border-color: var(--primary-color);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2), var(--hologram-effect);

    .menu-grid {
      background: linear-gradient(rgba(0, 102, 204, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 102, 204, 0.1) 1px, transparent 1px);
    }
  }
}
.theme-switch {
  position: relative;
  width: 60px;
  height: 30px;
  margin-right: 20px;
  cursor: pointer;
  z-index: 1;

  .switch-track {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background: linear-gradient(90deg, #555, #222);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
      0 0 5px rgba(0, 240, 255, 0.5);
    transition: all 0.3s ease;
  }

  .switch-thumb {
    position: absolute;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(145deg, #fff, #ccc);
    top: 2px;
    left: 2px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .sun-icon,
    .moon-icon {
      position: absolute;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .sun-icon {
      opacity: 1;
      transform: translateX(0);
    }

    .moon-icon {
      opacity: 0;
      transform: translateX(20px);
    }
  }

  &:hover {
    .switch-track {
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
        0 0 10px rgba(0, 240, 255, 0.8);
    }
  }
}

/* 白天模式下的开关样式 */
.cyber-nav.light .theme-switch {
  .switch-track {
    background: linear-gradient(90deg, #ffd700, #ff8c00);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2),
      0 0 5px rgba(255, 215, 0, 0.5);
  }

  .switch-thumb {
    transform: translateX(30px);
    background: linear-gradient(145deg, #333, #111);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.5);

    .sun-icon {
      opacity: 0;
      transform: translateX(-20px);
    }

    .moon-icon {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    .switch-track {
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2),
        0 0 10px rgba(255, 215, 0, 0.8);
    }
  }
}
</style>
