<template>
  <el-card class="sci-fi-card" :class="theme">
    <div class="card-cover"></div>
    <div class="hologram-grid"></div>
    <div class="user-content">
      <div class="avatar-container">
        <div class="avatar-glow"></div>
        <img
          :src="avatarSrc"
          :alt="`${userInfo.name}的头像`"
          class="user-avatar"
          @error="handleAvatarError"
        />
        <div class="scanning-line"></div>
      </div>

      <h2 class="username">
        {{ userInfo.name }}
        <el-tooltip
          class="tooltip-item"
          effect="dark"
          :content="userInfo.role"
          placement="right"
        >
          <svg-icon name="bozhu" class="role-icon"></svg-icon>
        </el-tooltip>
      </h2>

      <p class="user-desc" :title="webInfo.authorInfo">
        {{ userInfo.description }}
      </p>

      <nav class="stats-grid" aria-label="网站统计">
        <a
          v-for="stat in statsData"
          :key="stat.name"
          :href="stat.link"
          class="stat-item"
          :aria-label="`查看${stat.name}，共${stat.count}个`"
        >
          <span class="stat-label">{{ stat.name }}</span>
          <span class="stat-value">{{ stat.count }}</span>
        </a>
      </nav>

      <div class="social-links" role="group" aria-label="社交媒体链接">
        <a
          v-for="social in visibleSocialLinks"
          :key="social.name"
          :href="social.url"
          :title="social.title"
          :class="['social-link', social.name]"
          target="_blank"
          rel="noopener noreferrer nofollow"
          :aria-label="social.title"
        >
          <svg-icon :name="social.icon" />
        </a>
      </div>

      <div class="action-area">
        <el-button
          class="contact-btn"
          @click="handleContact"
          :loading="isLoading"
          type="primary"
        >
          <span class="btn-text">联系我</span>
          <div class="btn-glow"></div>
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup name="SciFiUserCard">
import { ref, computed, getCurrentInstance, inject, onMounted } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

// Props and reactive data
const { proxy } = getCurrentInstance();
const theme = inject("theme");
const webInfo = ref({});
const isLoading = ref(false);
const avatarSrc = ref("@/assets/avatar.png");

// 用户信息配置
const userInfo = computed(() => ({
  name: "Tyrone",
  role: "博主",
  description: "萤小宇，全干工程师",
}));

// 统计数据
const statsData = computed(() => [
  { name: "文章", count: 12, link: "/archive" },
  { name: "分类", count: 12, link: "/category" },
  { name: "标签", count: 1, link: "/tags" },
]);

// 社交链接配置
const socialLinksConfig = computed(() => [
  {
    id: 3,
    name: "github",
    icon: "github",
    url: webInfo.value.github,
    title: "GitHub",
  },
  {
    id: 4,
    name: "gitee",
    icon: "gitee",
    url: webInfo.value.gitee,
    title: "Gitee",
  },
  {
    id: 5,
    name: "qq",
    icon: "qq",
    url: `//wpa.qq.com/msgrd?v=3&uin=${webInfo.value.qqNumber}&site=qq&menu=yes`,
    title: "QQ",
  },
  {
    id: 6,
    name: "email",
    icon: "email",
    url: `mailto:${webInfo.value.email}`,
    title: "邮箱",
  },
  {
    id: 7,
    name: "weibo",
    icon: "weibo",
    url: "https://weibo.com/u/5747542477",
    title: "微博",
  },
  {
    id: 8,
    name: "steam",
    icon: "steam",
    url: "https://www.zhihu.com/people/he-he-85-83-34",
    title: "Steam",
  },
  {
    id: 9,
    name: "juejin",
    icon: "juejin",
    url: "https://juejin.cn/user/4391861792808499/posts",
    title: "稀土掘金",
  },
]);

// 可见的社交链接
const visibleSocialLinks = computed(() => {
  console.log(socialLinksConfig.value);
  const t = socialLinksConfig.value.filter((social) => social.url);
  console.log(t);
  return socialLinksConfig.value.filter((social) => social.url);
});

// Methods
const handleAvatarError = () => {
  avatarSrc.value = "http://124.70.85.121:9000/t-blog/avatar/avatar.png"; // 提供默认头像
};

const handleContact = async () => {
  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 800)); // 模拟异步操作
    proxy.$modal.msgSuccess("按 Ctrl + D 键将本页加入书签!");
  } finally {
    isLoading.value = false;
  }
};

// 生命周期
onMounted(() => {
  // 可以在这里添加初始化逻辑，比如预加载头像等
});
</script>

<style lang="scss" scoped>
// 科幻动画定义
@keyframes hologramFlicker {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes scanningLine {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 10px var(--primary-color);
  }
  50% {
    box-shadow: 0 0 25px var(--primary-color), 0 0 35px var(--primary-color);
  }
}

@keyframes dataStream {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes textGlow {
  0%,
  100% {
    text-shadow: 0 0 5px var(--primary-color);
  }
  50% {
    text-shadow: 0 0 15px var(--primary-color), 0 0 25px var(--primary-color);
  }
}

.sci-fi-card {
  // CSS变量定义
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: #0a0a12;
  --text-color: #ffffff;
  --border-color: rgba(0, 240, 255, 0.3);
  --card-bg: rgba(15, 15, 30, 0.95);
  --grid-color: rgba(0, 240, 255, 0.1);
  --hover-glow: 0 0 30px rgba(0, 240, 255, 0.4);

  position: relative;
  height: 450px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--hover-glow);
    border-color: var(--primary-color);
  }

  // 光主题适配
  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --bg-color: #f8fafc;
    --text-color: #1e293b;
    --border-color: rgba(0, 102, 204, 0.2);
    --card-bg: rgba(255, 255, 255, 0.95);
    --grid-color: rgba(0, 102, 204, 0.05);
    --hover-glow: 0 0 20px rgba(0, 102, 204, 0.2);
  }

  .card-cover {
    width: 100%;
    height: 180px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url("@/assets/avatar.png");
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    transform: scale(1.2);
    z-index: 1;
  }

  .hologram-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-size: 20px 20px;
    animation: hologramFlicker 3s infinite;
    pointer-events: none;
  }

  .user-content {
    position: relative;
    padding: 40px 20px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
  }

  .avatar-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 16px;

    .avatar-glow {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      background: conic-gradient(
        var(--primary-color),
        var(--secondary-color),
        var(--accent-color),
        var(--primary-color)
      );
      animation: pulseGlow 2s infinite;
      z-index: 1;
    }

    .user-avatar {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-color);
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;

      &:hover {
        transform: rotate(360deg) scale(1.1);
      }
    }

    .scanning-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--primary-color),
        transparent
      );
      border-radius: 50%;
      animation: scanningLine 3s infinite;
      z-index: 3;
    }
  }

  .username {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-color);
    animation: textGlow 2s infinite;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    .role-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
    }
  }

  .user-desc {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: var(--text-color);
    text-align: center;
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--secondary-color),
      var(--accent-color)
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textGlow 3s infinite;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px;
      border-radius: 12px;
      background: rgba(var(--primary-color), 0.05);
      border: 1px solid rgba(var(--primary-color), 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;

      &:hover {
        transform: translateY(-4px) scale(1.05);
        background: rgba(var(--primary-color), 0.1);
        box-shadow: 0 8px 25px rgba(var(--primary-color), 0.2);
      }

      .stat-label {
        font-size: 14px;
        color: var(--text-color);
        opacity: 0.8;
        margin-bottom: 4px;
      }

      .stat-value {
        font-size: 20px;
        font-weight: bold;
        color: var(--primary-color);
      }
    }
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px 0;
    border-top: 1px solid var(--border-color);

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(var(--primary-color), 0.1);
      border: 1px solid rgba(var(--primary-color), 0.3);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: scale(1.2) rotate(10deg);
        background: var(--primary-color);
        box-shadow: 0 0 20px var(--primary-color);

        svg {
          color: white;
          transform: scale(1.1);
        }
      }

      svg {
        width: 22px;
        height: 22px;
        color: var(--primary-color);
        transition: all 0.3s ease;
        z-index: 2;
      }
    }
  }

  .action-area {
    width: 100%;
    margin-top: auto;

    .contact-btn {
      position: relative;
      width: 100%;
      height: 40px;
      background: transparent;
      border: 2px solid var(--primary-color);
      border-radius: 12px;
      color: var(--primary-color);
      font-size: 16px;
      font-weight: 600;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &:hover {
        transform: translateY(-3px);
        color: white;
        box-shadow: 0 10px 30px rgba(var(--primary-color), 0.3);

        .btn-glow {
          width: 100%;
        }

        .btn-text {
          transform: scale(1.05);
        }
      }

      &:active {
        transform: translateY(-1px);
      }

      .btn-text {
        position: relative;
        z-index: 2;
        transition: transform 0.3s ease;
      }

      .btn-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background: linear-gradient(
          45deg,
          var(--primary-color),
          var(--secondary-color)
        );
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
      }

      &.is-loading {
        pointer-events: none;
        opacity: 0.7;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sci-fi-card {
    height: auto;
    min-height: 450px;

    .social-links {
      gap: 8px;

      .social-link {
        width: 38px;
        height: 38px;

        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}

// 提升可访问性
@media (prefers-reduced-motion: reduce) {
  .sci-fi-card {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
</style>
