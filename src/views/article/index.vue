<template>
  <AHeader :article="article" />
  <div class="article-page" v-loading="loading" :class="theme">
    <!-- 添加固定操作栏 -->
    <FloatingActionBar
      :article="article"
      :action-bar-left="actionBarLeft"
      @toggle-like="toggleLike"
      @toggle-favorite="toggleFavorite"
      @toggle-sidebar="toggleSidebar"
      @scroll-to-comments="scrollToComments"
    />

    <div
      class="content-layout"
      id="articleBox"
      :class="{ center: !showSidebar }"
    >
      <main class="article-main">
        <!-- 文章头部 -->

        <!-- AI简短介绍 -->
        <AISummary
          v-if="article.aiDescribe"
          :content="article.aiDescribe"
          :is-expanded="isAiDescriptionExpanded"
          @toggle="isAiDescriptionExpanded = !isAiDescriptionExpanded"
        />

        <!-- 文章内容 -->
        <ArticleContent
          :key="article.id || $route.params.id"
          :article="article"
          @upgrade="handleUpgrade"
          @purchase="handlePurchase"
        />

        <!-- 文章底部 -->
        <ArticleFooter
          :article="article"
          @toggle-like="toggleLike"
          @share="shareToMethod"
          @copy-link="copyLink"
        />

        <!-- 添加评论组件 -->
        <Comment
          :article-id="$route.params.id"
          :comment-count="article.commentNum || 0"
          :article-author-id="article.userId || ''"
          @comment-added="handleCommentAdded"
          @comment-deleted="handleCommentDeleted"
        />
      </main>

      <!-- 侧边栏 -->
      <ArticleSidebar
        v-if="showSidebar"
        :toc-items="tocItems"
        :active-heading="activeHeading"
        :read-progress="readProgress"
        @navigate="scrollToHeading"
      />
    </div>
    <mj-image-preview ref="imagePreview" />
  </div>
</template>

<script>
import { getArticleDetailApi, likeArticleApi } from "@/api/article";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import Comment from "@/components/comment/index.vue";
import { inject } from "vue";

import ArticleHeader from "./components/ArticleHeader.vue";
import ArticleContent from "./components/ArticleContent.vue";
import ArticleFooter from "./components/ArticleFooter.vue";
import ArticleSidebar from "./components/ArticleSidebar.vue";
import FloatingActionBar from "./components/FloatingActionBar.vue";
import AISummary from "./components/AISummary.vue";
import AHeader from "./components/header.vue";
import themeLight from "naive-ui/es/float-button-group/styles/light";

export default {
  name: "Article",
  components: {
    Comment,
    ArticleHeader,
    ArticleContent,
    ArticleFooter,
    ArticleSidebar,
    FloatingActionBar,
    AISummary,
    AHeader,
  },
  data() {
    return {
      article: {
        title: "Hexo + Butterfly 一些常见问题",
        cover: "http://124.70.85.121:9000/t-blog/cover/371476.png",
        createTime: "2023-10-01 12:00:00",
        content:
          '# 测试\n## 测试\n这就是我的测试\n ### 测试\n\n+ 测试内容\n+ 测试内容\n+ 测试内容\n > 121 \n```java\n public static void main(String[] args) {\n     System.out.println("Hello World");\n }\n ```\n\n## ces',
        category: {},
        isOriginal: true,
        readType: 1,
        price: 0,
      },
      prevArticle: {
        id: 1,
        title: "默认文章",
      },
      nextArticle: {
        id: 1,
        title: "默认文章",
      },
      tocItems: [],
      readProgress: 0,
      activeHeading: "",
      readTime: 0,
      likeDebounce: false,
      loading: false,
      actionBarLeft: "0px",
      showSidebar: true,
      contentLayout: "center",
      images: [],
      showPaymentDialog: false,
      showMembershipDialog: false,
      isAiDescriptionExpanded: true,
      contentRendered: false,
      theme: inject("theme"),
      scrollOffset: 80, // 新增：统一的滚动偏移量
    };
  },
  computed: {
    currentUrl() {
      return window.location.href;
    },
  },
  // 修改后的方法
  methods: {
    beforeRouteUpdate(to, from, next) {
      // 断开旧的观察器
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      // 清空所有相关数据
      this.tocItems = [];
      this.activeHeading = "";
      this.readProgress = 0;

      // 重置文章数据
      this.article = {
        title: "",
        content: "",
        cover: "",
        createTime: "",
        category: {},
        isOriginal: true,
        readType: 1,
        price: 0,
      };

      // 继续路由导航
      next();
    },
    async getArticle() {
      this.loading = true;
      try {
        // 获取新文章数据
        console.log("正在获取文章数据:", this.$route.params.id);
        const res = await getArticleDetailApi(this.$route.params.id);
        this.article = {
          title: "Hexo + Butterfly 一些常见问题",
          cover: "http://124.70.85.121:9000/t-blog/cover/371476.png",
          createTime: "2023-10-01 12:00:00",
          content:
            '# 测试\n## 测试\n这就是我的测试内容\n ### 测试\n\n1. 测试内容\n测试内容\n3. 测试内容\n > 121 \n```java\n public static void main(String[] args) {\n     System.out.println("Hello World");\n }\n ```\n\n ```python\nprint("Hello World")\n```\n\n## ces',
          category: {},
          isOriginal: true,
          readType: 1,
          price: 0,
        };
        console.log("获取文章数据:", res);
        this.article = {
          title: res.articleTitle,
          cover: res.articleCover,
          createTime: res.createTime,
          updateTime: res.updateTime,
          content: this.processContent(res.articleContent),
          desc: res.articleDesc,
          wordCount: res.wordCount,
          viewCount: res.viewCount,
          likeCount: res.likeCount,
          commentCount: res.commentCount,
          category: {},
          isOriginal: true,
          readType: 1,
          price: 0,
        };

        // 关键点：使用多个 nextTick 和足够的延迟，确保内容完全渲染
        await this.$nextTick();

        // 使用 setTimeout 确保 DOM 完全更新
        setTimeout(() => {
          // 重新生成目录
          this.generateToc();

          // 初始化观察器
          if (!this.observer) {
            this.initHeadingObserver();
          }

          this.updateReadProgress();
          this.loading = false;
        }, 300); // 增加延迟时间，确保内容渲染完成
      } catch (error) {
        console.error("加载失败:", error);
        this.loading = false;
      }
    },
    processContent(content) {
      // 处理可能的转义换行符
      return (content || "")
        .replace(/\\n/g, "\n") // 将转义的 \n 转换为真实换行
        .replace(/\r\n/g, "\n"); // 统一换行符
    },
    // 新增方法：等待内容渲染完成
    waitForContentRender() {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 5;

        const check = () => {
          attempts++;
          const content = document.querySelector(".article-content");
          const hasHeadings =
            content && content.querySelectorAll("h1, h2, h3, h4").length > 0;

          if (hasHeadings || attempts >= maxAttempts) {
            resolve();
          } else {
            setTimeout(check, 100 * attempts);
          }
        };

        check();
      });
    },

    // 新增方法：生成目录结构
    generateToc() {
      console.log("正在为文章生成目录:", this.$route.params.id);

      // 清空现有目录
      this.tocItems = [];

      // 强制重新查询 DOM
      const articleContent = document.querySelector(".article-content");
      if (!articleContent) {
        console.warn("无法找到文章内容元素，目录生成失败");
        return;
      }

      // 直接从当前页面的 DOM 获取标题元素，确保获取的是最新的
      const headings = articleContent.querySelectorAll("h1, h2, h3, h4");
      console.log(
        `当前文章中找到 ${headings.length} 个标题元素:`,
        Array.from(headings).map((h) => h.textContent)
      );

      if (headings.length === 0) {
        console.warn("当前文章没有找到标题元素");
        return;
      }

      // 处理标题元素，创建目录项
      this.tocItems = Array.from(headings).map((heading, index) => {
        // 确保每个标题都有 ID
        if (!heading.id) {
          // 生成唯一 ID，包含文章 ID 和标题文本
          const headingId = `heading-${
            this.$route.params.id
          }-${index}-${Date.now()}`;
          heading.id = headingId;
        }

        return {
          id: heading.id,
          text: heading.textContent.trim(),
          level: parseInt(heading.tagName.substring(1)),
        };
      });

      console.log("生成的目录项:", this.tocItems);

      // 更新后立即初始化观察器
      this.$nextTick(() => {
        this.initHeadingObserver();
      });
    },

    generateHeadingId(heading, index) {
      // Create a unique ID based on text content and position
      const baseId = heading.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Include route ID to ensure uniqueness between different articles
      return `heading-${this.$route.params.id}-${baseId || index}`;
    },

    // 初始化IntersectionObserver
    initHeadingObserver() {
      // 清理旧的观察器
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      // 创建可见标题集合
      const visibleHeadings = new Set();

      // 初始化交叉观察器
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleHeadings.add(entry.target.id);
            } else {
              visibleHeadings.delete(entry.target.id);
            }
          });

          // 找出最顶部的可见标题
          if (visibleHeadings.size > 0) {
            const visibleHeadingsArray = Array.from(visibleHeadings);
            const headingElements = visibleHeadingsArray
              .map((id) => document.getElementById(id))
              .filter((el) => el !== null);

            if (headingElements.length > 0) {
              // 按照在视口中的位置排序
              headingElements.sort((a, b) => {
                return (
                  a.getBoundingClientRect().top - b.getBoundingClientRect().top
                );
              });

              // 设置最顶部的标题为活动标题
              this.activeHeading = headingElements[0].id;
            }
          }
        },
        {
          rootMargin: "-64px 0px -90% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      // 开始观察当前文章中的所有标题
      const articleContent = document.querySelector(".article-content");
      if (articleContent) {
        const headings = articleContent.querySelectorAll("h1, h2, h3, h4");
        console.log(`为 ${headings.length} 个标题设置观察器`);

        headings.forEach((heading) => {
          if (heading.id) {
            this.observer.observe(heading);
          }
        });
      }
    },

    // 滚动到指定标题
    scrollToHeading(id) {
      const element = document.getElementById(id);
      if (!element) return;

      // 计算精确的滚动位置
      const elementRect = element.getBoundingClientRect();
      const offsetPosition =
        elementRect.top + window.pageYOffset - this.scrollOffset;

      // 使用平滑滚动
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // 更新活动标题
      this.activeHeading = id;
    },
    getDynamicOffset() {
      // 动态计算偏移量（与手动滚动时相同逻辑）
      return (
        (document.querySelector("header")?.offsetHeight || 60) +
        (document.querySelector(".floating-action-bar")?.offsetHeight || 0) +
        20
      );
    },

    updateReadProgress() {
      const article = document.querySelector(".article-content");
      if (!article) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + scrollY;
      const articleHeight = article.scrollHeight;
      const articleBottom = articleTop + articleHeight;

      // 如果文章还没进入视口
      if (scrollY + windowHeight < articleTop) {
        this.readProgress = 0;
        return;
      }

      // 如果已经完全阅读完
      if (scrollY > articleBottom) {
        this.readProgress = 100;
        return;
      }

      // 计算滚动的相对距离
      const scrolled = scrollY + windowHeight - articleTop;
      const totalScrollable = articleHeight + windowHeight;
      const progress = Math.min(
        100,
        Math.max(0, Math.round((scrolled / totalScrollable) * 100))
      );

      this.readProgress = progress;
    },
  },
  async created() {
    await this.getArticle();
    window.addEventListener("resize", this.updateActionBarPosition);
  },
  mounted() {
    window.addEventListener("scroll", this.updateReadProgress);

    // 确保在组件挂载后获取文章数据
    this.getArticle().then(() => {
      console.log("文章数据加载完成，开始初始化目录");
    });
  },
  beforeDestroy() {
    // 清理所有事件监听器和观察器
    window.removeEventListener("resize", this.updateActionBarPosition);
    window.removeEventListener("scroll", this.updateReadProgress);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    const images = document.querySelectorAll(".article-content img");
    images.forEach((img) => {
      img.removeEventListener("click", this.handleImageClick);
    });
  },
  watch: {
    contentRendered(newVal) {
      if (newVal) {
        // 内容已渲染，可以执行相关操作
        this.updateReadProgress();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto+Mono:wght@300;400;500;700&display=swap");

.article-page {
  padding: 12px;
  justify-content: center;
  display: flex;

  @media (max-width: 768px) {
    padding: 12px;
  }
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: #0a0a12;
  --text-color: #e0e0ff;
  --border-color: rgba(0, 240, 255, 0.3);
  --grid-color: rgba(0, 240, 255, 0.1);
  --card-bg: rgba(20, 28, 42, 0.6);

  margin: 2rem 0;
  font-family: "Roboto Mono", monospace;
  position: relative;

  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --bg-color: #f8f9fa;
    --text-color: #333344;
    --border-color: rgba(0, 102, 204, 0.3);
    --grid-color: rgba(0, 102, 204, 0.1);
    --card-bg: rgba(248, 249, 250, 0.8);
  }
}

.content-layout {
  display: flex;
  margin-top: -10px;
  gap: 32px;
  transition: all 0.3s ease;
  //居中
  justify-content: center;
  margin: 0 auto;
  width: 1300px;
  position: relative;

  &.center {
    grid-template-columns: 1fr;
    max-width: 1100px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0;
  }
}

.article-main {
  background: var(--bg-color);
  justify-content: center;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
