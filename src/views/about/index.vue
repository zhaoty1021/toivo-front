<template>
    <div class="about-container">
      <el-card class="about-card" :class="theme">
        <div class="card-header">
          <SvgIcon name="about" class="card-icon" />
          <span class="card-title">关于本站</span>
        </div>
        
        <div class="about-content" v-html="renderedMarkdown" />
        
        <div class="tech-border-container">
            <div class="tech-border"></div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup name='About'>
  import { inject, ref, onMounted } from 'vue';
  import MarkdownIt from 'markdown-it';
  import markdownItAnchor from 'markdown-it-anchor';
  import markdownItToc from 'markdown-it-toc-done-right';
 import markdownItEmoji from 'markdown-it-emoji/dist/markdown-it-emoji.js'
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import 'highlight.js/styles/github.css';
  import SvgIcon from "@/components/SvgIcon.vue";
  
  const theme = inject('theme', 'dark');
  
  // 初始化 Markdown 渲染器
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ''; // 使用默认的高亮处理
    }
  })
  .use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#'
  })
  .use(markdownItToc, {
    containerClass: 'table-of-contents',
    listType: 'ul'
  })
  .use(markdownItEmoji);
  
  // 模拟后端返回的 Markdown 内容
  const mockMarkdown = `
  # 欢迎来到我的技术博客
  
  这是一个基于 Vue 3 和 Element Plus 构建的个人技术博客，专注于分享前端开发、后端技术和 DevOps 相关内容。
  
  ## ✨ 主要特性
  
  - **现代化技术栈**：Vue 3 + Vite + Pinia
  - **响应式设计**：完美适配各种设备
  - **主题切换**：支持深色/浅色模式
  - **Markdown 支持**：完美渲染技术文章
  
  ## 🛠️ 技术栈
  
  \`\`\`javascript
  const techStack = {
    frontend: ['Vue 3', 'Vite', 'Element Plus'],
    backend: ['Node.js', 'Express', 'MongoDB'],
    devops: ['Docker', 'Nginx', 'CI/CD']
  };
  \`\`\`
  
  ## 📊 博客统计
  
  | 指标        | 数值       |
  |------------|-----------|
  | 文章数量     | 128       |
  | 总字数       | 1,024,568 |
  | 访问量       | 128,956   |
  
  ## 🤝 联系我
  
  有问题或建议？欢迎通过以下方式联系我：
  
  - 邮箱: contact@example.com
  - GitHub: [github.com/username](https://github.com/username)
  - Twitter: [@username](https://twitter.com/username)
  
  > "分享知识是程序员的美德" — 某位开发者
  `;
  
  const renderedMarkdown = ref('');
  
  onMounted(() => {
    // 实际项目中这里应该是从 store 获取 markdown 内容
    // const markdownContent = siteStore.getWebInfo.aboutMe;
    renderedMarkdown.value = md.render(mockMarkdown);
  });
  </script>
  
  <style lang="scss" scoped>
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .about-card {
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
    margin-top: 40px;
    position: relative; /* 确保子元素绝对定位基于此元素 */
    overflow: hidden; /* 防止边框溢出 */
  
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
  
    .about-content {
      padding: 24px;
      color: var(--text-color);
      line-height: 1.8;
      font-size: 16px;
  
      :deep(h1) {
        font-size: 2em;
        margin: 0.67em 0;
        color: var(--primary-color);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.3em;
      }
  
      :deep(h2) {
        font-size: 1.5em;
        margin: 0.83em 0;
        color: var(--secondary-color);
      }
  
      :deep(h3) {
        font-size: 1.17em;
        margin: 1em 0;
      }
  
      :deep(p) {
        margin-bottom: 16px;
      }
  
      :deep(a) {
        color: var(--primary-color);
        text-decoration: none;
        transition: all 0.2s;
  
        &:hover {
          text-decoration: underline;
          text-shadow: 0 0 5px var(--primary-color);
        }
      }
  
      :deep(img) {
        max-width: 100%;
        border-radius: 8px;
        margin: 20px 0;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
  

  
      :deep(pre) {
  background: rgba(0, 20, 40, 0.6) !important;
  padding: 16px !important;
  border-radius: 8px !important;
  overflow-x: auto !important;
  margin: 20px 0 !important;
  border: 1px solid var(--primary-color) !important;
  box-shadow: 
    0 0 0 1px rgba(0, 240, 255, 0.2),
    0 0 15px rgba(0, 240, 255, 0.1) !important;
  position: relative !important;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color)) !important;
  }

  code {
    background: transparent !important;
    padding: 0 !important;
    font-family: 'Fira Code', 'Courier New', monospace !important;
    font-size: 0.95em !important;
    line-height: 1.6 !important;
    color: #ccd6f6 !important;
  }

  .hljs-keyword,
  .hljs-built_in {
    color: #ff7ab2 !important;
    font-weight: 500 !important;
  }

  .hljs-title,
  .hljs-class {
    color: #00f0ff !important;
  }

  .hljs-string,
  .hljs-template-string {
    color: #64ffda !important;
  }

  .hljs-number,
  .hljs-literal {
    color: #ffb86c !important;
  }

  .hljs-comment {
    color: rgba(100, 255, 218, 0.5) !important;
    font-style: italic !important;
  }

  .hljs-punctuation {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .hljs-attr,
  .hljs-property {
    color: #00bcd4 !important;
  }
}


      :deep(blockquote) {
        border-left: 3px solid var(--primary-color);
        padding-left: 16px;
        margin-left: 0;
        color: var(--text-color);
        opacity: 0.8;
        font-style: italic;
        background: rgba(0, 0, 0, 0.1);
        padding: 12px;
        border-radius: 0 8px 8px 0;
      }
  
      :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        
        th, td {
          padding: 12px;
          border: 1px solid var(--border-color);
        }
        
        th {
          background: rgba(0, 0, 0, 0.2);
          color: var(--primary-color);
        }
      }
  
      :deep(ul), :deep(ol) {
        margin: 16px 0;
        padding-left: 2em;
        
        li {
          margin-bottom: 8px;
        }
      }
  
      :deep(.table-of-contents) {
        background: rgba(0, 0, 0, 0.1);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid var(--border-color);
        
        a {
          color: var(--text-color);
          
          &:hover {
            color: var(--primary-color);
          }
        }
      }
  
      :deep(.emoji) {
        height: 1em;
        width: 1em;
        vertical-align: middle;
      }
    }
  
    .tech-border-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    overflow: hidden; /* 防止渐变溢出 */
    
    .tech-border {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), transparent);
      animation: borderFlow 3s linear infinite;
    }
  }
  }
  
  @media (max-width: 768px) {
    .about-container {
      padding: 10px;
    }
    
    .about-card {
      margin-top: 20px;
      
      .card-header {
        padding: 12px 16px;
        
        .card-title {
          font-size: 18px;
        }
      }
      
      .about-content {
        padding: 16px;
        font-size: 15px;
      }
    }
  }
  /* 优化后的浅色主题 */
.about-card.light {
  :deep(pre) {
    background: white !important;
    border-color: rgba(0, 102, 204, 0.3) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    
    &::before {
      background: linear-gradient(90deg, #0066cc, #00aa66) !important;
    }

    code {
      color: #333344 !important;
    }

    .hljs-keyword,
    .hljs-built_in {
      color: #d03b8e !important;
    }

    .hljs-title,
    .hljs-class {
      color: #0066cc !important;
    }

    .hljs-string,
    .hljs-template-string {
      color: #00aa66 !important;
    }

    .hljs-number,
    .hljs-literal {
      color: #e67e22 !important;
    }

    .hljs-comment {
      color: rgba(0, 102, 204, 0.6) !important;
    }

    .hljs-punctuation {
      color: rgba(0, 0, 0, 0.7) !important;
    }

    .hljs-attr,
    .hljs-property {
      color: #0095ff !important;
    }
  }
}
  
  </style>