<template>
  <article class="article-content" :class="theme">
    <div class="code-style-selector">
      <label for="highlight-style" class="theme-label">代码风格：</label>
      <select
        id="highlight-style"
        v-model="highlightStyle"
        @change="changeHighlightStyle"
        class="theme-select"
      >
        <option
          v-for="style in highlightStyles"
          :key="style.value"
          :value="style.value"
        >
          {{ style.label }}
        </option>
      </select>
    </div>

    <div v-if="article.readType === 1" v-html="renderedContent"></div>
    <LockedContent
      v-else
      :content="article.content"
      :type="article.readType === 2 ? 'member' : 'paid'"
      @action="$emit(article.readType === 2 ? 'upgrade' : 'purchase')"
    />
  </article>
</template>

<script setup>
import { inject, ref, watch, onMounted, computed } from "vue";
import LockedContent from "./LockedContent.vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-toc-done-right";
import markdownItEmoji from "markdown-it-emoji/dist/markdown-it-emoji.js";
import markdownItTaskLists from "markdown-it-task-lists";
import markdownItMark from "markdown-it-mark";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItFootnote from "markdown-it-footnote";
import markdownItContainer from "markdown-it-container";

// 1. 首先定义 emits
const emit = defineEmits(["content-rendered", "upgrade", "purchase"]);

// 2. 然后注入依赖
const theme = inject("theme");
const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

// 3. 定义代码高亮样式
const darkHighlightStyles = [
  { value: "github-dark", label: "GitHub Dark" },
  { value: "atom-one-dark", label: "Atom Dark" },
  { value: "vs2015", label: "VS2015" },
  { value: "dracula", label: "Dracula" },
  { value: "night-owl", label: "Night Owl" },
  { value: "tokyo-night-dark", label: "Tokyo Night" },
  { value: "monokai", label: "Monokai" },
  { value: "nord", label: "Nord" },
  { value: "oceanic-next", label: "Oceanic Next" },
  { value: "synthwave-84", label: "Synthwave" },
  { value: "cobalt2", label: "Cobalt 2" },
];

const lightHighlightStyles = [
  { value: "github", label: "GitHub" },
  { value: "atom-one-light", label: "Atom Light" },
  { value: "vs", label: "VS" },
  { value: "default", label: "Default" },
  { value: "solarized-light", label: "Solarized Light" },
  { value: "a11y-light", label: "A11y Light" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "xcode", label: "Xcode" },
  { value: "stackoverflow-light", label: "StackOverflow" },
  { value: "kimbie-light", label: "Kimbie Light" },
  { value: "arduino-light", label: "Arduino Light" },
];

// 4. 响应式状态
const highlightStyle = ref(theme.value === "dark" ? "github-dark" : "github");
const highlightStyles = ref(
  theme.value === "dark" ? darkHighlightStyles : lightHighlightStyles
);
const styleElement = ref(null);
const md = ref(null);

// 5. 方法定义
const initMarkdown = () => {
  md.value = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true, // 添加这行配置
    highlight: (str, lang) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
      try {
        return `
                  <div class="code-toolbar">
                    <span class="language-label">${language}</span>
                    <button class="copy-btn" onclick="this.classList.add('copied'); setTimeout(() => this.classList.remove('copied'), 2000); navigator.clipboard.writeText(\`${str.replace(
                      /`/g,
                      "\\`"
                    )}\`)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                    </button>
                  </div>
                  <code>${hljs.highlight(str, { language }).value}</code>
                `;
      } catch (err) {
        console.error("代码高亮错误:", err);
        return `<div class="hljs-wrapper">
                  <div class="code-toolbar">
                    <span class="language-label">${language}</span>
                    <button class="copy-btn" onclick="this.classList.add('copied'); setTimeout(() => this.classList.remove('copied'), 2000); navigator.clipboard.writeText(\`${str.replace(
                      /`/g,
                      "\\`"
                    )}\`)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                    </button>
                  </div>
                  <pre class="hljs"><code>${md.value.utils.escapeHtml(
                    str
                  )}</code></pre>
                </div>`;
      }
    },
  });

  md.value
    .use(markdownItAnchor)
    .use(markdownItToc)
    .use(markdownItEmoji)
    .use(markdownItTaskLists)
    .use(markdownItMark)
    .use(markdownItSub)
    .use(markdownItSup)
    .use(markdownItFootnote)
    .use(markdownItContainer, "info", {
      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          return '<div class="custom-container info"><p class="container-title"><i class="icon-info"></i>Info</p>';
        } else {
          return "</div>";
        }
      },
    })
    .use(markdownItContainer, "warning", {
      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          return '<div class="custom-container warning"><p class="container-title"><i class="icon-warning"></i>Warning</p>';
        } else {
          return "</div>";
        }
      },
    })
    .use(markdownItContainer, "tech", {
      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          return '<div class="custom-container tech"><p class="container-title"><i class="icon-tech"></i>Tech</p>';
        } else {
          return "</div>";
        }
      },
    });
};

const loadHighlightStyle = (styleName) => {
  if (styleElement.value) {
    document.head.removeChild(styleElement.value);
  }

  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = `https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/${styleName}.min.css`;
  styleLink.onerror = () => {
    console.error(`样式 ${styleName} 加载失败，使用默认主题`);
    const fallbackStyle = theme.value === "dark" ? "github-dark" : "github";
    if (styleName !== fallbackStyle) {
      highlightStyle.value = fallbackStyle;
      loadHighlightStyle(fallbackStyle);
    }
  };
  document.head.appendChild(styleLink);
  styleElement.value = styleLink;
};

const updateHighlightStyles = (theme) => {
  const defaultStyle = theme === "dark" ? "github-dark" : "github";
  highlightStyle.value = defaultStyle;
  highlightStyles.value =
    theme === "dark" ? darkHighlightStyles : lightHighlightStyles;
  loadHighlightStyle(defaultStyle);
};

const changeHighlightStyle = () => {
  loadHighlightStyle(highlightStyle.value);
};

// 6. 计算属性
const renderedContent = computed(() => {
  return md.value?.render(props.article.content || "") || "";
});

const updateThemeVariables = (theme) => {
  const root = document.documentElement;
  const colors =
    theme === "dark"
      ? {
          primary: "#00f0ff",
          secondary: "#ff00f0",
          accent: "#00ff9d",
          bg: "#0a0a12",
          text: "#e0e0ff",
          border: "rgba(0, 240, 255, 0.3)",
          grid: "rgba(0, 240, 255, 0.1)",
        }
      : {
          primary: "#0066cc",
          secondary: "#cc00ff",
          accent: "#00aa66",
          bg: "#f8f9fa",
          text: "#333344",
          border: "rgba(0, 102, 204, 0.3)",
          grid: "rgba(0, 102, 204, 0.1)",
        };

  root.style.setProperty("--primary-color", colors.primary);
  root.style.setProperty("--secondary-color", colors.secondary);
  root.style.setProperty("--accent-color", colors.accent);
  root.style.setProperty("--bg-color", colors.bg);
  root.style.setProperty("--text-color", colors.text);
  root.style.setProperty("--border-color", colors.border);
  root.style.setProperty("--grid-color", colors.grid);
};

// 7. 监听器
watch(
  theme,
  (newTheme) => {
    updateHighlightStyles(newTheme);
    updateThemeVariables(newTheme); // 新增这个方法
  },
  { immediate: true }
);

watch(
  () => props.article.content,
  (newVal) => {
    if (newVal) {
      emit("content-rendered");
    }
  },
  { immediate: true }
);

// 8. 初始化
onMounted(() => {
  initMarkdown();
  loadHighlightStyle(highlightStyle.value);
  updateThemeVariables(theme.value); // 初始化时设置变量
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto+Mono:wght@300;400;500;700&display=swap");

:root {
  --primary-color: #00f0ff;
  --secondary-color: #ff00f0;
  --accent-color: #00ff9d;
  --bg-color: #0a0a12;
  --text-color: #e0e0ff;
  --border-color: rgba(0, 240, 255, 0.3);
  --grid-color: rgba(0, 240, 255, 0.1);
}

.article-content.light {
  --primary-color: #0066cc;
  --secondary-color: #cc00ff;
  --accent-color: #00aa66;
  --bg-color: #f8f9fa;
  --text-color: #333344;
  --border-color: rgba(0, 102, 204, 0.3);
  --grid-color: rgba(0, 102, 204, 0.1);
}

$glow-effect-dark: 0 0 10px rgba(0, 240, 255, 0.7),
  0 0 20px rgba(0, 240, 255, 0.5);
$glow-effect-light: 0 0 10px rgba(0, 102, 204, 0.5),
  0 0 20px rgba(0, 102, 204, 0.3);

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
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

.article-content {
  padding: 0 32px;
  line-height: 1.8;
  color: var(--text-color);
  font-size: 1.1em;
  font-family: "Roboto Mono", monospace;
  background: var(--bg-color);
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    opacity: 0.1;
    z-index: 0;
  }
}

.code-style-selector {
  margin-bottom: 30px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    animation: pulse 3s infinite;
  }
}

.theme-label {
  margin-right: 15px;
  font-weight: 500;
  color: var(--text-color);
  font-family: "Orbitron", sans-serif;
  text-shadow: 0 0 5px var(--primary-color);
  letter-spacing: 1px;
}

.theme-select {
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  appearance: none;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  background-image: linear-gradient(
      45deg,
      transparent 50%,
      var(--primary-color) 50%
    ),
    linear-gradient(135deg, var(--primary-color) 50%, transparent 50%);
  background-position: calc(100% - 20px) 50%, calc(100% - 15px) 50%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: $glow-effect-dark;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: $glow-effect-dark;
  }

  option {
    background: var(--bg-color);
    color: var(--text-color);
  }
}
/* 以下是内容样式，与之前相同 */
:deep(h1) {
  font-size: 2.5em;
  margin: 40px 0 24px;
  color: var(--primary-color);
  text-shadow: 0 0 10px var(--primary-color);
  position: relative;
  padding-bottom: 15px;
  letter-spacing: 2px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    animation: pulse 3s infinite;
  }
}

:deep(h2) {
  font-size: 2em;
  margin: 40px 0 24px;
  color: var(--secondary-color);
  text-shadow: 0 0 8px var(--secondary-color);
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    animation: pulse 3s infinite;
  }
}

:deep(h3) {
  font-size: 1.6em;
  margin: 24px 0;
  color: var(--accent-color);
  font-weight: 500;
  text-shadow: 0 0 8px var(--accent-color);
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    animation: pulse 3s infinite;
  }
}

:deep(p) {
  margin: 20px 0;
  color: var(--text-color);
  line-height: 1.8;
  text-align: justify;
  position: relative;
  z-index: 1;
}

:deep(a) {
  color: var(--primary-color);
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 0 2px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--primary-color);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #fff;
    text-shadow: 0 0 5px var(--primary-color);

    &::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
}

:deep(blockquote) {
  margin: 30px 0;
  padding: 20px 25px;
  background: rgba(0, 240, 255, 0.05);
  border-left: 4px solid var(--primary-color);
  border-radius: 0;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px var(--primary-color);

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary-color),
      transparent
    );
    animation: pulse 3s infinite;
  }

  &::before {
    top: 0;
  }
  &::after {
    bottom: 0;
  }

  p {
    margin: 0;
    position: relative;
    z-index: 1;
  }
}

:deep(ul),
:deep(ol) {
  margin: 24px 0;
  padding-left: 20px;
  color: var(--text-color);

  li {
    margin-bottom: 12px;
    position: relative;
    padding-left: 28px;
    line-height: 1.6;
    transition: all 0.2s ease;

    &:hover {
      transform: translateX(4px);
    }
  }
}

// 无序列表样式
:deep(ul) {
  li {
    list-style-type: none;

    &::before {
      content: "";
      position: absolute;
      left: 8px;
      top: 10px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary-color);
      transform: translateY(-50%);
      box-shadow: 0 0 5px var(--primary-color);
    }

    &:hover::before {
      background: var(--accent-color);
      transform: translateY(-50%) scale(1.2);
    }
  }
}

// 有序列表样式
:deep(ol) {
  counter-reset: list-counter;

  li {
    counter-increment: list-counter;
    list-style-type: none;

    &::before {
      content: counter(list-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-color);
      color: var(--bg-color);
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      font-family: "Roboto Mono", monospace;
      box-shadow: 0 0 5px var(--primary-color);
    }

    &:hover::before {
      background: var(--accent-color);
      transform: scale(1.1);
    }
  }
}

// 嵌套列表样式
:deep(ul ul),
:deep(ol ol),
:deep(ul ol),
:deep(ol ul) {
  margin: 12px 0;
  padding-left: 24px;

  li::before {
    width: 2px;
    height: 2px;
  }
}

:deep(code:not([class])) {
  font-size: 18px;
  line-height: 1.7;
  position: relative;
  color: var(--accent-color);
  background: rgba(0, 255, 157, 0.1);
  border-radius: 2px;
  padding: 3px 6px;
  margin: 0 5px;
  font-family: "Roboto Mono", monospace;
  border: transparent 1px solid;
  margin-top: -20px;
  margin-bottom: -20px;
}

// 保持原有的折叠按钮样式
:deep(.expand-button) {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--primary-color);
  border-radius: 2px;
  color: var(--text-color);
  cursor: pointer;
  z-index: 3;
  font-size: 0.9em;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: "Roboto Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: rgba(0, 240, 255, 0.3);
    color: #fff;
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 0 10px var(--primary-color);
  }
}

:deep(pre) {
  margin: 25px 0;
  position: relative;
  border-radius: 0;
  overflow: hidden;
  max-height: 2000px;
  transition: max-height 0.4s ease-in-out;
  box-shadow: 0 0 20px var(--primary-color);
  border: 1px solid var(--border-color);
  font-family: "Roboto Mono", monospace;
  background: var(--bg-color);

  /* 新增的代码工具栏 */
  .code-toolbar {
    position: absolute;
    top: 0.5em;
    right: 1em;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
    height: 22px;

    .language-label {
      font-size: 1em;
      color: var(--primary-color);
      text-transform: uppercase;
      font-family: "Roboto Mono", monospace;
      opacity: 0.9;
      padding: 0.2em 0.5em;
      background: rgba(0, 240, 255, 0.1);
      border-radius: 2px;
      margin-right: 1em;
    }

    .copy-btn {
      width: 22px;
      height: 22px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--primary-color);
      color: var(--text-color);
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s ease;

      svg {
        width: 12px;
        height: 12px;
      }

      &:hover {
        background: rgba(0, 240, 255, 0.3);
      }

      &.copied {
        background: var(--accent-color);
        color: #000;
      }
    }
  }

  /* 保持原有终端样式 */
  &::after {
    content: "TERMINAL";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2em;
    background: linear-gradient(
      to right,
      rgba(0, 240, 255, 0.2),
      rgba(0, 240, 255, 0.1)
    );
    color: var(--primary-color);
    display: flex;
    align-items: center;
    padding-left: 1em;
    font-family: "Orbitron", sans-serif;
    font-size: 0.9em;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border-color);
  }

  /* 保持原有控制按钮 */
  .terminal-controls {
    position: absolute;
    top: 0.8em;
    right: 4em;
    display: flex;
    gap: 0.5em;
    z-index: 2;

    span {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;

      &:nth-child(1) {
        background: #ff5f56;
      }

      &:nth-child(2) {
        background: #ffbd2e;
      }

      &:nth-child(3) {
        background: #27c93f;
      }
    }
  }

  /* 保持原有代码内容样式 */
  code {
    display: block;
    margin: 0;
    overflow-x: auto;
    font-family: "Roboto Mono", monospace;
    font-size: 14px;
    line-height: 1.5;
    background: transparent !important;
  }

  /* 保持原有扫描线效果 */
  .scanline {
    position: absolute;
    top: 2em;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 240, 255, 0.5);
    animation: scanline 5s linear infinite;
    pointer-events: none;
  }

  /* 保持原有网格背景 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(var(--grid-color) 50%, transparent 50%);
    background-size: 100% 4px;
    pointer-events: none;
    opacity: 0.1;
  }

  /* 保持原有折叠按钮样式 */
  .expand-button {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 16px;
    background: rgba(0, 240, 255, 0.1);
    border: 1px solid var(--primary-color);
    border-radius: 2px;
    color: var(--text-color);
    cursor: pointer;
    z-index: 3;
    font-size: 0.9em;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    white-space: nowrap;
    font-family: "Roboto Mono", monospace;
    text-transform: uppercase;
    letter-spacing: 1px;

    &:hover {
      background: rgba(0, 240, 255, 0.3);
      color: #fff;
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 0 10px var(--primary-color);
    }
  }

  /* 保持原有折叠状态 */
  &.collapsed {
    max-height: 300px;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(transparent, #121420);
      pointer-events: none;
      z-index: 2;
    }
  }
}

:deep(img.lazy-image) {
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.3s ease;

  &.loaded {
    opacity: 1;
  }

  &.error {
    opacity: 0.5;
  }
}

:deep(img) {
  max-width: 100%;
  border-radius: 0;
  margin: 30px 0;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px var(--primary-color);
  border: 1px solid var(--border-color);
  cursor: zoom-in;
  position: relative;
  z-index: 1;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 30px var(--primary-color);
  }
}

:deep(table) {
  width: 100%;
  margin: 30px 0;
  border-collapse: collapse;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 0 20px var(--primary-color);
  position: relative;
  z-index: 1;

  th,
  td {
    padding: 15px 20px;
    border: 1px solid var(--border-color);
  }

  th {
    background: rgba(0, 240, 255, 0.1);
    color: var(--primary-color);
    font-weight: 500;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: "Orbitron", sans-serif;
  }

  tr:nth-child(even) {
    background: rgba(0, 240, 255, 0.05);
  }

  tr:hover {
    background: rgba(0, 240, 255, 0.1);
  }
}

:deep(hr) {
  margin: 40px 0;
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-color),
    transparent
  );
  position: relative;
  animation: pulse 3s infinite;

  &::before {
    content: "//";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-color);
    padding: 0 30px;
    color: var(--primary-color);
    font-family: "Roboto Mono", monospace;
    font-size: 1.5em;
  }
}

:deep(.task-list-item) {
  list-style-type: none;
  position: relative;
  padding-left: 30px;

  input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid var(--primary-color);
    background: rgba(0, 240, 255, 0.1);
    position: absolute;
    left: 0;
    top: 2px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:checked {
      background: var(--primary-color);

      &::after {
        content: "✓";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #000;
        font-size: 12px;
      }
    }

    &:hover {
      box-shadow: 0 0 5px var(--primary-color);
    }
  }
}

:deep(mark) {
  background-color: rgba(255, 0, 240, 0.3);
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid var(--secondary-color);
    border-radius: 2px;
    pointer-events: none;
  }
}

:deep(sub) {
  font-size: 0.8em;
  color: var(--accent-color);
  position: relative;
  bottom: -0.2em;
}

:deep(sup) {
  font-size: 0.8em;
  color: var(--secondary-color);
  position: relative;
  top: -0.5em;
}

:deep(.footnote-ref) {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: 4px;
  font-weight: bold;
  position: relative;
  top: -0.2em;

  &:hover {
    text-decoration: underline;
    text-shadow: 0 0 5px var(--primary-color);
  }
}

:deep(.footnote-item) {
  margin-bottom: 15px;
  padding-left: 20px;
  border-left: 2px solid var(--primary-color);
}

.custom-container {
  margin: 30px 0;
  padding: 20px 25px;
  border-radius: 0;
  box-shadow: 0 0 15px var(--primary-color);
  position: relative;
  overflow: hidden;
  border: 1px solid;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--border-color),
      transparent
    );
    animation: pulse 3s infinite;
  }

  .container-title {
    font-weight: bold;
    margin-bottom: 15px;
    font-family: "Orbitron", sans-serif;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 10px;
    text-transform: uppercase;
    font-size: 1.1em;

    i {
      font-size: 1.2em;
    }
  }

  p {
    margin: 10px 0;
  }
}

.custom-container.info {
  --border-color: var(--primary-color);
  background: rgba(0, 240, 255, 0.05);
  border-color: var(--primary-color);

  .icon-info {
    color: var(--primary-color);
  }
}

.custom-container.warning {
  --border-color: var(--secondary-color);
  background: rgba(255, 0, 240, 0.05);
  border-color: var(--secondary-color);

  .icon-warning {
    color: var(--secondary-color);
  }
}

.custom-container.tech {
  --border-color: var(--accent-color);
  background: rgba(0, 255, 157, 0.05);
  border-color: var(--accent-color);

  .icon-tech {
    color: var(--accent-color);
  }
}
</style>
