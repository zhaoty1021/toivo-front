<template>
    <div class="user-container">
      <el-card class="user-card" :class="theme">
        <!-- 头部 -->
        <div class="card-header">
          <SvgIcon name="user" class="card-icon" />
          <span class="card-title">关于我</span>
        </div>
  
        <!-- 主体内容 -->
        <div class="user-content">
          <!-- 个人信息 -->
          <div class="profile-section">
            <div class="avatar-container">
              <img :src="userInfo.avatar" class="avatar" alt="用户头像">
              <div class="tech-circle"></div>
            </div>
            <div class="profile-info">
              <h2 class="username">{{ userInfo.name }}</h2>
              <p class="bio">{{ userInfo.bio }}</p>
              <div class="social-links">
                <a 
                  v-for="link in userInfo.socialLinks" 
                  :key="link.name" 
                  :href="link.url" 
                  target="_blank"
                  class="social-link"
                >
                  <SvgIcon :name="link.icon" class="social-icon" />
                </a>
              </div>
            </div>
          </div>
  
          <!-- 个人简介 Markdown -->
          <div class="markdown-section" v-html="renderedIntro"></div>
  
          <!-- 详细信息卡片 -->
          <div class="details-section">
            <div class="info-card" v-for="(item, index) in userInfo.details" :key="index">
              <div class="info-header">
                <SvgIcon :name="item.icon" class="info-icon" />
                <h3 class="info-title">{{ item.title }}</h3>
                <div class="tech-dot"></div>
              </div>
              <div class="info-content" v-html="item.content"></div>
            </div>
          </div>
        </div>
  
        <!-- 底部科技感边框 -->
        <div class="tech-border-container">
          <div class="tech-border"></div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { inject, ref, computed } from 'vue';
  import MarkdownIt from 'markdown-it';
  import SvgIcon from "@/components/SvgIcon.vue";
  
  const theme = inject('theme', 'dark');
  
  // 初始化Markdown渲染器
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });
  
  // 用户信息数据
  const userInfo = ref({
    name: "Tyrone萤小宇",
    bio: "全栈开发者 | 技术博主 | 开源爱好者",
    avatar: "http://124.70.85.121:9000/t-blog/avatar/avatar.png",
    socialLinks: [
      { name: "GitHub", icon: "github", url: "https://github.com/username" },
      { name: "Twitter", icon: "twitter", url: "https://twitter.com/username" },
      { name: "掘金", icon: "juejin", url: "https://juejin.cn/user/123" },
      { name: "知乎", icon: "zhihu", url: "https://www.zhihu.com/people/username" }
    ],
    personalIntro: {
      title: "个人简介",
      content: `
  ## 个人简介
  
  我是**Tyrone萤小宇**，一名全栈开发者与技术博主，专注于前沿技术的实践与分享。拥有6年互联网开发经验，擅长将复杂技术转化为易懂的内容。
  
  ### 技术理念
  
  - **「简洁至上」**：追求代码的优雅与可维护性
  - **「持续学习」**：每周至少投入20小时研究新技术
  - **「开源共享」**：维护3个Star超1K的开源项目
  
  ### 近期动态
  
  📌 **2023.07** - 发布《Vue3性能优化实战》系列文章  
  📌 **2023.05** - 开源项目获GitHub Trending周榜TOP3  
  📌 **2023.03** - 在JSConf China分享前端工程化实践
  
  ### 技术影响力
  
  - 技术博客累计访问量：\`128,956+\`
  - GitHub粉丝：\`3.2K+\`
  - 掘金Lv7 | 知乎科技领域优秀答主
      `,
      highlights: [
        "6年互联网开发经验",
        "擅长技术内容输出",
        "开源项目维护者"
      ]
    },
    details: [
      {
        title: "技术栈",
        icon: "code",
        content: `
          <ul class="tech-stack">
            <li><span class="tech-tag">Vue3</span> 前端开发</li>
            <li><span class="tech-tag">React</span> 复杂应用开发</li>
            <li><span class="tech-tag">Node.js</span> 后端服务</li>
            <li><span class="tech-tag">Python</span> 数据分析</li>
          </ul>
        `
      },
      {
        title: "工作经历",
        icon: "work",
        content: `
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-date">2020 - 至今</div>
              <div class="timeline-content">某科技公司 · 高级前端工程师</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">2018 - 2020</div>
              <div class="timeline-content">某互联网公司 · 前端开发工程师</div>
            </div>
          </div>
        `
      },
      {
        title: "开源项目",
        icon: "open-source",
        content: `
          <div class="projects">
            <a href="#" class="project-link">vue-admin-template</a>
            <a href="#" class="project-link">react-ui-library</a>
            <a href="#" class="project-link">node-cli-tool</a>
          </div>
        `
      },
      {
        title: "联系我",
        icon: "contact",
        content: `
          <div class="contact-info">
            <p>邮箱: <a href="mailto:contact@example.com">contact@example.com</a></p>
            <p>微信: tech-explorer</p>
          </div>
        `
      }
    ]
  });
  
  // 渲染Markdown内容
  const renderedIntro = computed(() => md.render(userInfo.value.personalIntro.content));
  </script>
  
  <style lang="scss" scoped>
  .user-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .user-card {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --card-bg: #0a0a12;
    --hover-bg: rgba(0, 240, 255, 0.1);
    --glow-effect: 0 0 15px rgba(0, 240, 255, 0.3);
  
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    margin-top: 40px;
  
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--glow-effect);
    }
  
    &.light {
      --primary-color: #0066cc;
      --secondary-color: #cc00ff;
      --accent-color: #00aa66;
      --bg-color: #f0f2f5;
      --text-color: #333344;
      --border-color: rgba(0, 102, 204, 0.3);
      --card-bg: rgba(255, 255, 255, 0.95);
      --hover-bg: rgba(0, 102, 204, 0.1);
      --glow-effect: 0 0 15px rgba(0, 102, 204, 0.2);
    }
  
    .card-header {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
  
      .card-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        color: var(--primary-color);
        filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.5));
      }
  
      .card-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-color);
      }
    }
  
    .user-content {
      padding: 24px;
  
      .profile-section {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        flex-wrap: wrap;
  
        .avatar-container {
          position: relative;
          margin-right: 30px;
          width: 150px;
          height: 150px;
  
          .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--primary-color);
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
            position: relative;
            z-index: 2;
          }
  
          .tech-circle {
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border-radius: 50%;
            border: 2px dashed var(--primary-color);
            animation: rotate 20s linear infinite;
            opacity: 0.5;
          }
        }
  
        .profile-info {
          flex: 1;
          min-width: 300px;
  
          .username {
            font-size: 28px;
            color: var(--text-color);
            margin-bottom: 10px;
            font-weight: 600;
          }
  
          .bio {
            font-size: 16px;
            color: var(--text-color);
            opacity: 0.8;
            margin-bottom: 20px;
          }
  
          .social-links {
            display: flex;
            gap: 15px;
  
            .social-link {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: rgba(0, 240, 255, 0.1);
              transition: all 0.3s ease;
  
              &:hover {
                background: var(--primary-color);
                transform: translateY(-3px);
                box-shadow: 0 0 10px var(--primary-color);
  
                .social-icon {
                  color: white;
                }
              }
  
              .social-icon {
                width: 20px;
                height: 20px;
                color: var(--primary-color);
                transition: all 0.3s ease;
              }
            }
          }
        }
      }
  
      .markdown-section {
        margin-bottom: 30px;
        padding: 20px;
        background: rgba(0, 0, 0, 0);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        color: var(--text-color);
  
        :deep(h2) {
          color: var(--primary-color);
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 8px;
          margin-top: 1.5em;
          margin-bottom: 1em;
        }
  
        :deep(h3) {
          color: var(--secondary-color);
          margin-top: 1.5em;
          margin-bottom: 1em;
        }
  
        :deep(ul) {
          padding-left: 20px;
          
          li {
            margin-bottom: 8px;
            position: relative;
            
            &::before {
              content: "▹";
              color: var(--accent-color);
              position: absolute;
              left: -20px;
            }
          }
        }
  
        :deep(strong) {
          color: var(--accent-color);
        }
  
        :deep(code) {
          background: rgba(0, 240, 255, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: var(--accent-color);
        }
  
        :deep(.highlight) {
          background: rgba(0, 240, 255, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
  
        :deep(p) {
          margin-bottom: 1em;
          line-height: 1.8;
        }
      }
  
      .details-section {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
  
        .info-card {
          background: rgba(0, 0, 0, 0);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
  
          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 240, 255, 0.2);
            border-color: var(--primary-color);
  
            .tech-dot {
              opacity: 1;
            }
          }
  
          .info-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            position: relative;
  
            .info-icon {
              width: 20px;
              height: 20px;
              color: var(--primary-color);
              margin-right: 10px;
            }
  
            .info-title {
              font-size: 18px;
              color: var(--text-color);
              margin: 0;
            }
  
            .tech-dot {
              position: absolute;
              right: 0;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--primary-color);
              opacity: 0;
              transition: opacity 0.3s ease;
              box-shadow: 0 0 5px var(--primary-color);
            }
          }
  
          .info-content {
            color: var(--text-color);
            line-height: 1.6;
            font-size: 15px;
  
            :deep(.tech-tag) {
              display: inline-block;
              background: rgba(0, 240, 255, 0.2);
              color: var(--primary-color);
              padding: 2px 8px;
              border-radius: 4px;
              margin-right: 8px;
              font-size: 14px;
            }
  
            :deep(.timeline-item) {
              display: flex;
              margin-bottom: 10px;
  
              .timeline-date {
                width: 100px;
                color: var(--primary-color);
                font-size: 14px;
              }
  
              .timeline-content {
                flex: 1;
              }
            }
  
            :deep(.project-link) {
              display: inline-block;
              margin-right: 15px;
              margin-bottom: 10px;
              color: var(--primary-color);
              text-decoration: none;
              transition: all 0.2s;
  
              &:hover {
                text-decoration: underline;
                text-shadow: 0 0 5px var(--primary-color);
              }
            }
  
            :deep(.contact-info) {
              p {
                margin-bottom: 10px;
  
                a {
                  color: var(--primary-color);
                  text-decoration: none;
  
                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
            }
          }
        }
      }
    }
  
    .tech-border-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      overflow: hidden;
      
      .tech-border {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), transparent);
        animation: borderFlow 3s linear infinite;
      }
    }
  }
  
  /* 动画 */
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes borderFlow {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .user-container {
      padding: 10px;
    }
    
    .user-card {
      .card-header {
        padding: 12px 16px;
        
        .card-title {
          font-size: 18px;
        }
      }
      
      .user-content {
        padding: 16px;
  
        .profile-section {
          flex-direction: column;
          text-align: center;
  
          .avatar-container {
            margin: 0 auto 20px;
          }
  
          .profile-info {
            min-width: auto;
            width: 100%;
  
            .social-links {
              justify-content: center;
            }
          }
        }
  
        .markdown-section {
          padding: 15px;
        }
  
        .details-section {
          grid-template-columns: 1fr;
        }
      }
    }
  }
  </style>