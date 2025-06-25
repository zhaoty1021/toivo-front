<!-- ArticleItem.vue -->
<template>
  <el-card class="article-item" :class="theme">
    <el-tooltip
      class="box-item"
      effect="dark"
      content="原创文章"
      placement="top"
    >
      <span v-if="article.isOriginal" class="original">
        <el-icon><Tickets /></el-icon>
      </span>
    </el-tooltip>
    <div class="article-content-wrapper">
      <div class="article-image">
        <router-link :to="articleLink">
          <img :src="article.cover || defaultImage" :alt="article.title" />
        </router-link>
      </div>

      <div class="articleInfo">
        <div class="articleInfo-item">
          <div>
            <h3>
              <router-link :to="articleLink">
                <span v-if="article.isStick" class="top">
                  <svg-icon name="top" />
                  置顶</span
                >
                <span class="xiahuaxian hand-style">
                  {{ article.title }}
                </span>
              </router-link>
            </h3>
            <div class="article-meta-wrap">
              <span class="article-meta">
                <svg-icon name="sign1" class="article-meta-icon"></svg-icon>
                <span>{{ formattedCreateTime }}</span>
                <span class="article-meta-separator">|</span>
              </span>
              <span class="article-meta" v-if="showUpdateTime">
                <svg-icon
                  name="update-time"
                  class="article-meta-icon"
                ></svg-icon>
                <span>{{ formattedUpdateTime }}</span>
                <span class="article-meta-separator">|</span>
              </span>
              <span class="article-meta">
                <svg-icon name="category" class="article-meta-icon"></svg-icon>
                <a
                  @click="handleClike(article.category.id, '/categroy')"
                  class="hand-style"
                  >{{ article.category.name }}</a
                >
                <span class="article-meta-separator">|</span>
              </span>
              <span class="article-meta">
                <svg-icon name="dianzan" class="article-meta-icon"></svg-icon>
                <span>点赞</span>
                <span class="article-meta-separator">|</span>
              </span>
              <span class="article-meta">
                <svg-icon name="comment" class="article-meta-icon"></svg-icon>
                <span>评论</span>
              </span>
            </div>
            <div class="summary">
              <el-text line-clamp="3" size="large">
                {{ article.summary }}
              </el-text>
            </div>
          </div>
        </div>

        <div class="post-footer">
          <div class="footer-left">
            <div class="author-info">
              <n-avatar
                round
                :size="medium"
                :src="article.author.avatar"
              ></n-avatar>
              <span class="author-name">{{ article.author.nickname }}</span>
            </div>
          </div>
          <div class="footer-right">
            <n-tag
              v-for="tag in article.tag"
              :key="tag.id"
              type="success"
              round="true"
              size="small"
              class="article-meta-tag"
              @click="handleClike(tag.id, '/tags')"
              >{{ tag.name }}</n-tag
            >
            <svg-icon name="yuan"></svg-icon>
            <span class="read-time"> {{ readingTime }} 阅读 </span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { inject, computed } from "vue";
import { useRouter } from "vue-router";
import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import SvgIcon from "@/components/SvgIcon.vue";
import defaultImage from "@/assets/article1.png";

const theme = inject("theme");
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const articleLink = computed(() => `/article/${props.article.id}`);

// 格式化创建时间
const formattedCreateTime = computed(() => {
  return formatDate(props.article.createTime);
});

// 格式化更新时间
const formattedUpdateTime = computed(() => {
  return props.article.updateTime ? formatDate(props.article.updateTime) : "";
});

// 是否显示更新时间（创建和更新时间不同时显示）
const showUpdateTime = computed(() => {
  return (
    props.article.updateTime &&
    props.article.createTime !== props.article.updateTime
  );
});

// 日期格式化函数
const formatDate = (isoString) => {
  try {
    const date = parseISO(isoString);
    return format(date, "yyyy年MM月dd日 HH:mm", { locale: zhCN });
  } catch (e) {
    console.error("日期格式化错误:", e);
    return isoString; // 如果格式化失败返回原始字符串
  }
};

// 计算阅读时间（基于字数）
const readingTime = computed(() => {
  console.log("计算阅读时间", props.article.wordCount);
  if (!props.article.wordCount) return "1分钟";

  // 假设平均阅读速度：200字/分钟
  const wordsPerMinute = 200;
  const minutes = Math.ceil(props.article.wordCount / wordsPerMinute);

  // 超过60分钟显示小时
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}小时${
      remainingMinutes > 0 ? remainingMinutes + "分钟" : ""
    }`;
  }

  return `${minutes}分钟`;
});

function handleClike(id, path) {
  router.push({
    path,
    query: { id },
  });
}
</script>

<style lang="scss" scoped>
.article-item {
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: #0a0a12;
  --text-color: #ffffff;
  --border-color: rgba(0, 240, 255, 0.3);
  --border-line: rgba(0, 240, 255, 0.3);
  --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
  --card-bg: rgba(30, 30, 60, 0.8);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --hover-bg: rgba(0, 240, 255, 0.1);

  position: relative;
  padding: 10px 5px 10px 15px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: 20px;
  height: auto;
  min-height: 14em;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--glow-effect);
  }

  &.light {
    --primary-color: #0066cc;
    --secondary-color: #cc00ff;
    --accent-color: #00aa66;
    --bg-color: #f0f2f5;
    --text-color: #333344;
    --border-color: rgba(0, 102, 204, 0.3);
    --border-line: rgba(0, 102, 204, 0.3);
    --glow-effect: 0 0 10px rgba(0, 102, 204, 0.5);
    --card-bg: rgba(255, 255, 255, 0.9);
    --text-primary: #333344;
    --text-secondary: rgba(51, 51, 68, 0.7);
    --hover-bg: rgba(0, 102, 204, 0.1);
  }

  ::v-deep(.el-card__body) {
    padding: 0;
    width: 100%;
  }

  .article-content-wrapper {
    width: 100%;
    display: flex;
    flex: 1;
    padding: 7px 0 7px 7px;
  }

  .article-image {
    height: 200px;
    width: 300px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      border: 1px solid var(--border-line);
      transition: transform 0.3s ease;
      filter: brightness(0.9);
    }

    &:hover img {
      transform: scale(1.02);
      filter: brightness(1);
    }
  }

  .original {
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
    border-color: transparent var(--primary-color);
    border-width: 0 40px 40px 0;
    border-style: solid;

    i {
      position: absolute;
      top: 4px;
      right: -37px;
      font-size: 16px;
      color: white;
    }
  }

  .articleInfo {
    display: flex;
    flex-direction: column;
    color: var(--article-color);
    width: 50%;
    flex: 1;
    padding-left: 30px;
    padding-right: 30px;
    justify-content: space-between;

    .articleInfo-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding-top: 10px;

      a {
        color: var(--text-primary);
        transition: color 0.3s;

        &:hover {
          color: var(--primary-color);
        }
      }

      .top {
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--secondary-color)
        );
        padding: 2px 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-right: 5px;
        color: #fff;
        height: 20px;
        gap: 4px;
      }

      h3 {
        font-size: 1.2em;
        line-height: 1.4;
        margin-bottom: 10px;
        color: var(--text-primary);
        cursor: pointer;
      }

      .summary {
        margin-top: 10px;
        color: var(--text-secondary);
      }

      .article-meta-wrap {
        margin: 6px 0;
        color: var(--text-secondary);
        font-size: 90%;

        .article-meta {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          margin-right: 5px;
          padding-bottom: 1px;

          .article-meta-icon {
            color: var(--primary-color);
          }

          .article-meta-separator {
            color: var(--border-line);
          }
        }
      }
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px solid var(--border-color);
      color: var(--text-secondary);

      .footer-left {
        display: flex;
        align-items: center;
        gap: 5px;

        .author-info {
          display: flex;
          align-items: center;
          gap: 5px;

          .author-name {
            font-weight: 500;
            color: var(--text-primary);
          }
        }
      }

      .footer-right {
        display: flex;
        align-items: center;
        gap: 5px;

        .article-meta-tag {
          background: var(--hover-bg);
          color: var(--primary-color);
          border-color: var(--primary-color);
          transition: all 0.3s;

          &:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
          }
        }

        .read-time {
          color: var(--text-secondary);
          font-size: 0.9em;
          display: flex;
          align-items: center;
          gap: 5px;

          svg {
            color: var(--primary-color);
          }
        }
      }
    }
  }
}
</style>
