<template>
  <header class="article-header">
    <div class="article-title">{{ article.title }}</div>

    <!-- 作者信息和元数据 -->
    <div class="article-info">
      <div class="author-info">
        <img v-lazy="article.avatar" alt="作者头像" class="author-avatar" />
        <div class="author-meta">
          <span class="author-name">{{ article.nickname }}</span>
          <div class="post-meta">
            <time class="publish-time">
              <i class="far fa-calendar-alt"></i>
              {{ article.createTime }}
            </time>
            <span class="meta-divider">·</span>
            <span class="category">
              <i class="fas fa-folder"></i>
              {{ article.category.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="article-stats">
        <div class="stat-item">
          <i class="far fa-eye"></i>
          <span>{{ article.quantity }} 阅读</span>
        </div>
        <div class="stat-item">
          <i class="far fa-clock"></i>
          <span>{{ readTime }} 分钟</span>
        </div>
        <div class="stat-item">
          <i class="far fa-comment"></i>
          <span>{{ article.commentNum || 0 }} 评论</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "ArticleHeader",
  props: {
    article: {
      type: Object,
      required: true,
    },
    readTime: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.article-header {
  padding: 24px 32px;
  margin-top: 20px;
  position: relative;
  border-bottom: 1px solid #e8e8e8;
  background: #ffffff;

  .article-title {
    color: #333333;
    font-size: 1.8em;
    line-height: 1.4;
    margin-bottom: 24px;
    text-align: left;
  }

  .article-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;

    .author-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .author-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(64, 158, 255, 0.2);
        padding: 2px;
        background: #ffffff;
        transition: all 0.3s ease;

        &:hover {
          transform: rotate(360deg);
          border-color: #409eff;
        }
      }

      .author-meta {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .author-name {
          color: #409eff;
          font-weight: 600;
          font-size: 1.1em;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #666666;
          font-size: 0.9em;

          i {
            color: #409eff;
            margin-right: 4px;
          }

          .meta-divider {
            color: #666666;
            opacity: 0.5;
          }

          .category {
            color: #409eff;
          }
        }
      }
    }

    .article-stats {
      display: flex;
      align-items: center;
      gap: 24px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666666;
        font-size: 0.95em;

        i {
          color: #409eff;
          font-size: 1.1em;
        }
      }
    }
  }
}
</style>
