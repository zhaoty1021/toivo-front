<template>
  <div class="cyber-dev-log" :class="theme">
    <!-- 霓虹灯边框效果 -->
    <div class="neon-border-top"></div>

    <!-- 头部 -->
    <header class="cyber-header">
      <h1 class="cyber-title">网站建设日志</h1>
      <p class="cyber-subtitle">DEVELOPMENT TIMELINE & PROGRESS TRACKING</p>
      <div class="title-grid"></div>
    </header>

    <!-- 统计面板 -->
    <section class="cyber-stats">
      <div
        v-for="stat in computedStats"
        :key="stat.label"
        class="stat-hologram"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <span class="stat-number">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
        <div class="stat-glow"></div>
      </div>
    </section>

    <!-- 筛选器 -->
    <nav class="cyber-filters">
      <button
        v-for="filter in filters"
        :key="filter.value"
        :class="['cyber-filter', { active: activeFilter === filter.value }]"
        @click="activeFilter = filter.value"
      >
        <span class="filter-text">{{ filter.label }}</span>
        <span class="filter-glow"></span>
      </button>
    </nav>

    <!-- 日志列表 -->
    <main class="cyber-timeline">
      <div class="timeline-grid"></div>

      <article
        v-for="log in filteredLogs"
        :key="log.id"
        :class="['log-hologram', `status-${log.status}`]"
      >
        <!-- 时间线标记 -->
        <div class="timeline-marker">
          <span class="marker-dot"></span>
          <span class="marker-line"></span>
        </div>

        <!-- 日志内容 -->
        <div class="log-content">
          <header class="log-header">
            <time class="log-date">{{ formatDate(log.date) }}</time>
            <span :class="['log-type', `type-${log.type}`]">
              {{ getTypeName(log.type) }}
            </span>
          </header>

          <h3 class="log-title">{{ log.title }}</h3>
          <p class="log-description">{{ log.description }}</p>

          <!-- 详细信息 -->
          <div v-if="log.details?.length" class="log-details">
            <div class="details-toggle" @click="toggleDetails(log.id)">
              <span>详细信息</span>
              <svg-icon name="arrow-down" class="toggle-icon" />
            </div>
            <transition name="details-slide">
              <ul
                v-show="expandedDetails.includes(log.id)"
                class="details-list"
              >
                <li v-for="detail in log.details" :key="detail">
                  <svg-icon name="bullet" class="bullet-icon" />
                  {{ detail }}
                </li>
              </ul>
            </transition>
          </div>

          <!-- 标签 -->
          <div v-if="log.tags?.length" class="log-tags">
            <span v-for="tag in log.tags" :key="tag" class="cyber-tag">
              {{ tag }}
            </span>
          </div>

          <!-- 元信息 -->
          <footer v-if="log.commitHash || log.duration" class="log-meta">
            <span v-if="log.commitHash" class="commit">
              <svg-icon name="commit" /> {{ log.commitHash }}
            </span>
            <span v-if="log.duration" class="duration">
              <svg-icon name="clock" /> {{ log.duration }}
            </span>
          </footer>
        </div>

        <!-- 全息效果 -->
        <div class="hologram-effect"></div>
      </article>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

const theme = inject("theme", "dark");
const activeFilter = ref("all");
const expandedDetails = ref([]);

const filters = [
  { value: "all", label: "全部" },
  { value: "completed", label: "已完成" },
  { value: "in-progress", label: "进行中" },
  { value: "planned", label: "计划中" },
];

const logs = ref([
  {
    id: 1,
    title: "项目初始化",
    description: "创建项目基础结构，配置开发环境",
    date: new Date("2024-01-15"),
    type: "feature",
    status: "completed",
    details: ["初始化Vue3项目", "配置Vite构建工具", "设置ESLint和Prettier"],
    tags: ["初始化", "Vue3"],
    commitHash: "a1b2c3d",
    duration: "4小时",
  },
  {
    id: 2,
    title: "用户认证系统",
    description: "实现用户登录、注册和权限管理功能",
    date: new Date("2024-01-20"),
    type: "feature",
    status: "completed",
    details: ["设计登录界面", "实现JWT认证", "添加权限验证"],
    tags: ["认证", "JWT"],
    commitHash: "e4f5g6h",
    duration: "12小时",
  },
  {
    id: 3,
    title: "响应式布局优化",
    description: "优化移动端显示效果，提升用户体验",
    date: new Date("2024-01-25"),
    type: "optimization",
    status: "completed",
    details: ["优化移动端布局", "调整媒体查询", "提升触摸体验"],
    tags: ["响应式", "移动端"],
    commitHash: "i7j8k9l",
    duration: "6小时",
  },
  {
    id: 4,
    title: "数据可视化模块",
    description: "集成图表库，实现数据统计和可视化展示",
    date: new Date("2024-02-01"),
    type: "feature",
    status: "in-progress",
    details: ["选择Chart.js", "设计组件架构", "实现基础图表"],
    tags: ["图表", "可视化"],
    duration: "预计16小时",
  },
  {
    id: 5,
    title: "性能监控系统",
    description: "添加应用性能监控和错误追踪功能",
    date: new Date("2024-02-10"),
    type: "feature",
    status: "planned",
    details: ["集成监控SDK", "设置错误收集", "创建监控面板"],
    tags: ["监控", "性能"],
    duration: "预计8小时",
  },
]);

// 计算属性
const computedStats = computed(() => {
  const completed = logs.value.filter(
    (log) => log.status === "completed"
  ).length;
  const total = logs.value.length;
  const commits = logs.value.filter((log) => log.commitHash).length;
  const startDate = new Date(Math.min(...logs.value.map((log) => log.date)));
  const totalDays = Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24));
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return [
    { icon: "📋", label: "已完成", value: completed },
    { icon: "📅", label: "开发天数", value: totalDays },
    { icon: "🔄", label: "代码提交", value: commits },
    { icon: "📈", label: "完成进度", value: `${progress}%` },
  ];
});

const filteredLogs = computed(() => {
  const filtered =
    activeFilter.value === "all"
      ? logs.value
      : logs.value.filter((log) => log.status === activeFilter.value);
  return filtered.sort((a, b) => b.date - a.date);
});

// 方法
const getTypeName = (type) => {
  const names = {
    feature: "新功能",
    bugfix: "Bug修复",
    optimization: "优化",
    refactor: "重构",
  };
  return names[type] || type;
};

const formatDate = (date) => {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const toggleDetails = (id) => {
  const index = expandedDetails.value.indexOf(id);
  if (index === -1) {
    expandedDetails.value.push(id);
  } else {
    expandedDetails.value.splice(index, 1);
  }
};
</script>

<style lang="scss" scoped>
@keyframes neonFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

@keyframes hologramPulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.cyber-dev-log {
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: rgba(10, 10, 20, 0.9);
  --text-color: #ffffff;
  --border-color: rgba(0, 240, 255, 0.3);
  --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
  --hologram-effect: 0 0 15px rgba(0, 240, 255, 0.5);
  --card-bg: rgba(30, 30, 60, 0.8);
  --grid-color: rgba(0, 240, 255, 0.1);

  position: relative;
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
  font-family: "Orbitron", "Rajdhani", sans-serif;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 70px;
  overflow-x: hidden;
  backdrop-filter: blur(10px);

  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --bg-color: rgba(240, 242, 245, 0.95);
    --text-color: #333344;
    --border-color: rgba(0, 102, 204, 0.3);
    --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5);
    --card-bg: rgba(255, 255, 255, 0.95);
    --grid-color: rgba(0, 102, 204, 0.05);
  }

  .neon-border-top {
    position: absolute;
    top: 0;
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

  /* 头部样式 */
  .cyber-header {
    position: relative;
    text-align: center;
    margin-bottom: 3rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    overflow: hidden;

    .title-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(var(--grid-color) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.3;
      z-index: 0;
    }

    .cyber-title {
      position: relative;
      font-size: 2.5rem;
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
      text-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
      z-index: 1;
    }

    .cyber-subtitle {
      position: relative;
      color: var(--text-color);
      font-size: 1.1rem;
      letter-spacing: 2px;
      opacity: 0.8;
      z-index: 1;
    }
  }

  /* 统计面板 */
  .cyber-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;

    .stat-hologram {
      position: relative;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      perspective: 500px;
      transform-style: preserve-3d;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px) translateZ(10px);
        box-shadow: var(--glow-effect);
      }

      .stat-icon {
        font-size: 2rem;
        min-width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--primary-color), 0.1);
        border-radius: 50%;
        border: 1px solid var(--border-color);
      }

      .stat-content {
        display: flex;
        flex-direction: column;

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
        }

        .stat-label {
          color: var(--text-color);
          font-size: 0.9rem;
          opacity: 0.8;
        }
      }

      .stat-glow {
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(
          45deg,
          var(--primary-color),
          var(--secondary-color),
          var(--accent-color)
        );
        border-radius: 12px;
        z-index: -1;
        opacity: 0.2;
        filter: blur(8px);
      }
    }
  }

  /* 筛选器 */
  .cyber-filters {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 2rem;
    justify-content: center;
    flex-wrap: wrap;

    .cyber-filter {
      position: relative;
      padding: 0.6rem 1.2rem;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--text-color);
      font-weight: 500;
      overflow: hidden;
      perspective: 500px;
      transform-style: preserve-3d;

      .filter-text {
        position: relative;
        z-index: 2;
      }

      .filter-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(var(--primary-color), 0.2),
          transparent
        );
        transition: all 0.5s ease;
      }

      &:hover {
        border-color: var(--primary-color);

        .filter-glow {
          width: 100%;
        }
      }

      &.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
        box-shadow: var(--glow-effect);
      }
    }
  }

  /* 时间线 */
  .cyber-timeline {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 4rem;

    .timeline-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(var(--grid-color) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.3;
      z-index: 0;
    }

    &::before {
      content: "";
      position: absolute;
      left: 1rem;
      top: 0;
      bottom: 2rem;
      width: 2px;
      background: linear-gradient(
        to bottom,
        transparent,
        var(--primary-color),
        transparent
      );
      box-shadow: 0 0 10px var(--primary-color);
    }

    .log-hologram {
      position: relative;
      margin-bottom: 2rem;
      padding-left: 2rem;
      perspective: 800px;
      transform-style: preserve-3d;

      .timeline-marker {
        position: absolute;
        left: -2.5rem;
        top: 0.5rem;
        z-index: 2;

        .marker-dot {
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--border-color);
          border: 3px solid var(--bg-color);
          box-shadow: 0 0 5px var(--primary-color);
          transition: all 0.3s ease;
        }

        .marker-line {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: calc(100% - 16px);
          background: var(--border-color);
        }
      }

      &.status-completed .marker-dot {
        background: var(--accent-color);
        box-shadow: 0 0 10px var(--accent-color);
      }

      &.status-in-progress .marker-dot {
        background: var(--secondary-color);
        box-shadow: 0 0 10px var(--secondary-color);
      }

      &.status-planned .marker-dot {
        background: var(--text-color);
        box-shadow: 0 0 10px var(--text-color);
      }

      .log-content {
        position: relative;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        z-index: 2;

        &:hover {
          transform: translateY(-3px) translateZ(10px);
          box-shadow: var(--glow-effect);
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;

          .log-date {
            color: var(--primary-color); /* 改为使用主色调 */
            font-size: 1.2rem;
            font-weight: 600; /* 加粗 */
            opacity: 1; /* 完全不透明 */
            text-shadow: 0 0 5px rgba(0, 240, 255, 0.5); /* 添加霓虹灯效果 */
            letter-spacing: 0.5px; /* 增加字母间距 */
          }

          .log-type {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
            border-radius: 4px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;

            &.type-feature {
              background: rgba(0, 240, 255, 0.1);
              color: var(--primary-color);
              border: 1px solid var(--primary-color);
            }

            &.type-bugfix {
              background: rgba(255, 0, 240, 0.1);
              color: var(--secondary-color);
              border: 1px solid var(--secondary-color);
            }

            &.type-optimization {
              background: rgba(0, 255, 157, 0.1);
              color: var(--accent-color);
              border: 1px solid var(--accent-color);
            }

            &.type-refactor {
              background: rgba(255, 255, 255, 0.1);
              color: var(--text-color);
              border: 1px solid var(--text-color);
            }
          }
        }

        .log-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          color: var(--primary-color);
          transition: all 0.3s ease;
        }

        .log-description {
          color: var(--text-color);
          line-height: 1.6;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .log-details {
          margin-bottom: 1rem;

          .details-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--primary-color);
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              text-shadow: 0 0 5px var(--primary-color);
            }

            .toggle-icon {
              width: 12px;
              height: 12px;
              transition: transform 0.3s ease;
            }
          }

          .details-list {
            list-style: none;
            padding: 0.5rem 0 0 1.5rem;
            margin: 0;

            li {
              position: relative;
              padding: 0.3rem 0;
              font-size: 0.9rem;
              color: var(--text-color);
              display: flex;
              align-items: flex-start;
              gap: 0.5rem;

              .bullet-icon {
                width: 12px;
                height: 12px;
                color: var(--primary-color);
                flex-shrink: 0;
                margin-top: 0.3rem;
              }
            }
          }
        }

        .log-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;

          .cyber-tag {
            background: rgba(var(--primary-color), 0.1);
            color: var(--primary-color);
            padding: 0.3rem 0.8rem;
            border-radius: 4px;
            font-size: 0.8rem;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;

            &:hover {
              background: rgba(var(--primary-color), 0.3);
              box-shadow: 0 0 5px var(--primary-color);
            }
          }
        }

        .log-meta {
          display: flex;
          gap: 1.5rem;
          color: var(--text-color);
          font-size: 0.8rem;
          opacity: 0.7;

          svg {
            width: 14px;
            height: 14px;
            margin-right: 0.3rem;
          }
        }
      }

      .hologram-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle at center,
          rgba(0, 240, 255, 0.1) 0%,
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      &:hover .hologram-effect {
        opacity: 0.5;
      }
    }
  }

  /* 过渡动画 */
  .details-slide-enter-active,
  .details-slide-leave-active {
    transition: all 0.3s ease;
  }

  .details-slide-enter-from,
  .details-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  /* 响应式 */
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 60px;

    .cyber-header {
      margin-bottom: 2rem;

      .cyber-title {
        font-size: 2rem;
      }

      .cyber-subtitle {
        font-size: 0.9rem;
      }
    }

    .cyber-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .cyber-timeline {
      padding-left: 1.5rem;

      &::before {
        left: 0.75rem;
      }

      .log-hologram {
        padding-left: 1.5rem;

        .timeline-marker {
          left: -2rem;
        }
      }
    }
  }
}
</style>
