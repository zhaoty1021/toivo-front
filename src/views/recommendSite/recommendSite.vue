<template>
  <div class="cyber-card-container" :class="theme">
    <div class="cyber-recommend-card">
      <!-- 清晰的标题 -->
      <div class="tech-header">
        <h1 class="title">开发者资源导航</h1>
        <div class="tech-underline"></div>
      </div>

      <!-- 清晰的水平分类导航 -->
      <div class="clear-category-nav">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          <component :is="category.icon" class="category-icon" />
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>

      <!-- 优化后的网站卡片网格 -->
      <div class="compact-site-grid">
        <div
          v-for="site in filteredSites"
          :key="site.id"
          class="site-card"
          @click="openSite(site.url)"
        >
          <div class="card-header">
            <div class="site-logo">
              <img :src="site.logo" :alt="site.name" />
            </div>
            <h3 class="site-name">{{ site.name }}</h3>
          </div>
          <p class="site-desc">{{ site.description }}</p>
          <div class="site-tags">
            <span v-for="tag in site.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
          <div class="visit-btn">访问网站</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import {
  Code,
  TerminalSquare,
  Smartphone,
  BrainCircuit,
  FunctionSquare,
  Shield,
  Gamepad,
  Link,
  Database,
  Cloud,
  MessageSquare,
  Server,
} from "lucide-vue-next";

const theme = inject("theme", "dark");

// 分类数据
const categories = ref([
  { id: "frontend", name: "前端开发", icon: Code },
  { id: "backend", name: "后端开发", icon: TerminalSquare },
  { id: "mobile", name: "移动开发", icon: Smartphone },
  { id: "database", name: "数据库", icon: Database },
  { id: "devops", name: "DevOps", icon: Server },
  { id: "ai", name: "人工智能", icon: BrainCircuit },
  { id: "cloud", name: "云服务", icon: Cloud },
  { id: "algorithm", name: "算法", icon: FunctionSquare },
  { id: "security", name: "网络安全", icon: Shield },
  { id: "game", name: "游戏开发", icon: Gamepad },
  { id: "blockchain", name: "区块链", icon: Link },
  { id: "interview", name: "面试资源", icon: MessageSquare },
]);

const activeCategory = ref("frontend");

// 推荐网站数据
const recommendedSites = ref([
  {
    id: "freecodecamp",
    name: "freeCodeCamp",
    url: "https://www.freecodecamp.org",
    logo: "https://www.freecodecamp.org/icons/icon-512x512.png",
    description: "免费学习编程的社区",
    tags: ["编程学习", "实战项目"],
    category: "frontend",
  },
  {
    id: "codewars",
    name: "Codewars",
    url: "https://www.codewars.com",
    logo: "https://www.codewars.com/favicon.ico",
    description: "通过挑战提升编程技能",
    tags: ["编程练习", "算法"],
    category: "algorithm",
  },
  {
    id: "leetcode",
    name: "LeetCode",
    url: "https://leetcode.com",
    logo: "https://leetcode.com/favicon.ico",
    description: "算法与数据结构练习平台",
    tags: ["算法", "面试准备"],
    category: "algorithm",
  },
  {
    id: "udemy",
    name: "Udemy",
    url: "https://www.udemy.com",
    logo: "https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg",
    description: "在线编程课程平台",
    tags: ["视频教程", "付费课程"],
    category: "backend",
  },
  {
    id: "pluralsight",
    name: "Pluralsight",
    url: "https://www.pluralsight.com",
    logo: "https://www.pluralsight.com/etc/clientlibs/pluralsight/main/images/favicons/favicon.ico",
    description: "技术技能学习平台",
    tags: ["专业课程", "技术评估"],
    category: "devops",
  },
  {
    id: "kaggle",
    name: "Kaggle",
    url: "https://www.kaggle.com",
    logo: "https://www.kaggle.com/static/images/favicon.ico",
    description: "数据科学与机器学习社区",
    tags: ["机器学习", "数据集"],
    category: "ai",
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    url: "https://www.hackerrank.com",
    logo: "https://www.hackerrank.com/favicon.ico",
    description: "编程挑战与面试准备",
    tags: ["编程练习", "面试"],
    category: "interview",
  },
  {
    id: "edx",
    name: "edX",
    url: "https://www.edx.org",
    logo: "https://www.edx.org/favicon.ico",
    description: "来自顶尖大学的在线课程",
    tags: ["大学课程", "认证"],
    category: "backend",
  },
  {
    id: "coursera",
    name: "Coursera",
    url: "https://www.coursera.org",
    logo: "https://www.coursera.org/favicon.ico",
    description: "世界顶级大学在线课程",
    tags: ["专业课程", "学位"],
    category: "ai",
  },
  {
    id: "codecademy",
    name: "Codecademy",
    url: "https://www.codecademy.com",
    logo: "https://www.codecademy.com/favicon.ico",
    description: "交互式编程学习平台",
    tags: ["交互学习", "基础课程"],
    category: "frontend",
  },
  {
    id: "udacity",
    name: "Udacity",
    url: "https://www.udacity.com",
    logo: "https://www.udacity.com/favicon.ico",
    description: "纳米学位技术课程",
    tags: ["项目实战", "职业导向"],
    category: "mobile",
  },
  {
    id: "egghead",
    name: "egghead",
    url: "https://egghead.io",
    logo: "https://egghead.io/favicon.ico",
    description: "短小精悍的技术视频教程",
    tags: ["视频教程", "高级主题"],
    category: "frontend",
  },
  {
    id: "frontendmasters",
    name: "Frontend Masters",
    url: "https://frontendmasters.com",
    logo: "https://frontendmasters.com/favicon.ico",
    description: "前端开发深度课程",
    tags: ["前端进阶", "专业课程"],
    category: "frontend",
  },
  {
    id: "scrimba",
    name: "Scrimba",
    url: "https://scrimba.com",
    logo: "https://scrimba.com/favicon.ico",
    description: "交互式前端编程学习",
    tags: ["交互式", "前端"],
    category: "frontend",
  },
  {
    id: "exercism",
    name: "Exercism",
    url: "https://exercism.org",
    logo: "https://exercism.org/favicon.ico",
    description: "通过导师指导学习编程",
    tags: ["代码审查", "多语言"],
    category: "backend",
  },
  {
    id: "codepen",
    name: "CodePen",
    url: "https://codepen.io",
    logo: "https://codepen.io/favicon.ico",
    description: "前端代码实验与分享平台",
    tags: ["前端实验", "创意"],
    category: "frontend",
  },
]);

// 根据分类筛选网站
const filteredSites = computed(() => {
  return recommendedSites.value.filter(
    (site) => site.category === activeCategory.value
  );
});

// 打开网站
const openSite = (url) => {
  window.open(url, "_blank");
};
</script>

<style lang="scss" scoped>
.cyber-card-container {
  --primary-color: #0066cc;
  --secondary-color: #0099ff;
  --accent-color: #00cc99;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --text-color: #333344;
  --border-color: rgba(0, 102, 204, 0.2);
  --hover-bg: rgba(0, 102, 204, 0.05);
  --active-bg: rgba(0, 102, 204, 0.1);

  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  font-family: "Inter", "PingFang SC", sans-serif;
  margin-top: 70px;

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

  .cyber-recommend-card {
    width: 100%;
    max-width: 1200px;
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
    overflow: hidden;

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

    .clear-category-nav {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
      padding: 0.8rem;
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: 10px;
      border: 1px solid var(--border-color);

      .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.8rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 80px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);

        &:hover {
          background-color: var(--hover-bg);
          transform: translateY(-2px);
        }

        &.active {
          background-color: var(--active-bg);
          border-color: var(--primary-color);
          box-shadow: 0 0 0 1px var(--primary-color);
        }

        .category-icon {
          width: 24px;
          height: 24px;
          color: var(--primary-color);
          margin-bottom: 0.3rem;
        }

        .category-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-color);
        }
      }
    }

    .compact-site-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
      row-gap: 3rem;

      .site-card {
        background-color: var(--card-bg);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--border-color);
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 160px;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          border-color: var(--primary-color);
        }

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;

          .site-logo {
            width: 32px;
            height: 32px;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.3rem;
            margin-right: 0.6rem;
            border: 1px solid var(--border-color);
            flex-shrink: 0;

            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }

          .site-name {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--primary-color);
            word-break: break-word;
            line-height: 1.2;
          }
        }

        .site-desc {
          font-size: 0.75rem;
          color: var(--text-color);
          opacity: 0.8;
          margin-bottom: 0.6rem;
          line-height: 1.3;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .site-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-bottom: 0.6rem;

          .tag {
            font-size: 0.6rem;
            padding: 0.15rem 0.5rem;
            background-color: rgba(0, 102, 204, 0.1);
            color: var(--primary-color);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            white-space: nowrap;
          }
        }

        .visit-btn {
          padding: 0.3rem;
          text-align: center;
          background-color: var(--primary-color);
          color: white;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          transition: all 0.2s ease;
          margin-top: auto;

          &:hover {
            background-color: var(--secondary-color);
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .cyber-card-container {
    padding: 1rem;
    margin-top: 60px;

    .cyber-recommend-card {
      padding: 1.2rem;

      .tech-header {
        .title {
          font-size: 1.5rem;
        }
      }

      .clear-category-nav {
        justify-content: flex-start;
        overflow-x: auto;
        padding: 0.8rem;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }

        .category-item {
          min-width: 70px;
          padding: 0.6rem;
        }
      }

      .compact-site-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 0.8rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .cyber-card-container {
    .cyber-recommend-card {
      .compact-site-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
