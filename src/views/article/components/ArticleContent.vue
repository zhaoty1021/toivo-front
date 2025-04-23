<template>
    <article class="article-content">
        <div class="theme-switcher">
            <label for="highlight-style">代码风格：</label>
            <select
                id="highlight-style"
                v-model="highlightStyle"
                @change="changeHighlightStyle"
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

        <!-- 内容部分保持不变 -->
        <div v-if="article.readType === 1" v-html="renderedContent"></div>
        <LockedContent
            v-else
            :content="article.content"
            :type="article.readType === 2 ? 'member' : 'paid'"
            @action="$emit(article.readType === 2 ? 'upgrade' : 'purchase')"
        />
    </article>
</template>

<script>
import LockedContent from './LockedContent.vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
// 动态导入所有主题样式
const highlightStyles = [
    { value: 'github', label: 'GitHub' },
    { value: 'atom-one-dark', label: 'Atom One Dark' },
    { value: 'vs2015', label: 'VS2015' },
    { value: 'school-book', label: 'School Book' },
    { value: 'tomorrow-night-blue', label: 'Tomorrow Night Blue' }
]

import markdownItAnchor from 'markdown-it-anchor'
import markdownItToc from 'markdown-it-toc-done-right'
import markdownItEmoji from 'markdown-it-emoji/dist/markdown-it-emoji.js'

export default {
    name: 'ArticleContent',
    components: {
        LockedContent
    },
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            md: null,
            highlightStyle: 'github', // 默认主题
            highlightStyles: highlightStyles.map((s) => ({
                value: s.value,
                label: s.label
            })),
            styleElement: null // 用于动态切换样式
        }
    },
    created() {
        this.initMarkdown()
        this.loadHighlightStyle(this.highlightStyle)
    },
    computed: {
        renderedContent() {
            return this.md.render(this.article.content || '')
        }
    },
    methods: {
        initMarkdown() {
            this.md = new MarkdownIt({
                html: true,
                linkify: true,
                typographer: true,
                highlight: (str, lang) => {
                    const language =
                        lang && hljs.getLanguage(lang) ? lang : 'plaintext'
                    try {
                        return `<pre class="hljs"><code>${
                            hljs.highlight(str, { language }).value
                        }</code></pre>`
                    } catch (err) {
                        console.error('代码高亮错误:', err)
                        return `<pre class="hljs"><code>${this.md.utils.escapeHtml(
                            str
                        )}</code></pre>`
                    }
                }
            })
            this.md
                .use(markdownItAnchor)
                .use(markdownItToc)
                .use(markdownItEmoji)
        },
        loadHighlightStyle(styleName) {
            // 移除旧样式
            if (this.styleElement) {
                document.head.removeChild(this.styleElement)
                this.styleElement = null
            }

            // 创建新的 link 标签加载样式
            const styleLink = document.createElement('link')
            styleLink.rel = 'stylesheet'
            styleLink.type = 'text/css'
            styleLink.href = `https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/${styleName}.min.css`
            styleLink.onload = () => {
                this.styleElement = styleLink
            }
            styleLink.onerror = () => {
                console.error(
                    `样式 ${styleName} 加载失败，使用默认 GitHub 主题`
                )
                if (styleName !== 'github') {
                    this.highlightStyle = 'github'
                    this.loadHighlightStyle('github')
                }
            }

            document.head.appendChild(styleLink)
        },
        changeHighlightStyle() {
            this.loadHighlightStyle(this.highlightStyle)
        }
    }
}
</script>
  
<style lang="scss" scoped>
.theme-switcher {
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;

    label {
        margin-right: 10px;
        font-weight: bold;
    }

    select {
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;

        &:hover {
            border-color: #409eff;
        }
    }
}
.article-content {
    padding: 0 32px;
    line-height: 1.8;
    color: #333333;
    font-size: 1.1em;

    :deep(h2) {
        font-size: 1.6em; /* 小于h1 */
        margin: 32px 0 24px;
    }

    :deep(h3) {
        font-size: 1.3em; /* 小于h2 */
        margin: 24px 0;
    }

    :deep(p) {
        margin: 16px 0;
        color: #666666;
        line-height: 1.8;
    }

    :deep(a) {
        color: #409eff;
        text-decoration: none;
        border-bottom: 1px dashed #409eff;
        transition: all 0.3s ease;

        &:hover {
            color: #66b1ff;
            border-bottom-style: solid;
        }
    }

    :deep(blockquote) {
        margin: 24px 0;
        padding: 16px 24px;
        background: #f5f7fa;
        border-left: 4px solid #409eff;
        border-radius: 4px;
        color: #666666;
        font-style: italic;

        p {
            margin: 0;
        }
    }

    :deep(ul),
    :deep(ol) {
        margin: 16px 0;
        padding-left: 32px;
        color: #666666;

        li {
            margin-bottom: 12px;
            position: relative;

            &::marker {
                color: #409eff;
            }
        }
    }

    :deep(code:not([class])) {
        font-size: 14px;
        line-height: 1.5;
        position: relative;
        color: rgb(239, 89, 84);
        background: rgb(243, 244, 244);
        border-radius: 6px;
        padding: 8px;
        margin: 0 8px;
    }

    :deep(pre) {
        margin: 1em 0;
        position: relative;
        background: #282c34;
        border-radius: 6px;
        padding-top: 2.5em;
        overflow: hidden;
        max-height: 2000px;
        transition: max-height 0.4s ease-in-out;

        &.collapsed {
            max-height: 300px;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: linear-gradient(transparent, #282c34);
                pointer-events: none;
                z-index: 2;
            }

            .expand-button {
                display: flex !important;
            }
        }

        .expand-button {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            color: #abb2bf;
            cursor: pointer;
            z-index: 3;
            font-size: 0.9em;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            white-space: nowrap;

            &:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
                transform: translateX(-50%) translateY(-2px);
            }

            i {
                font-size: 14px;
            }
        }

        /* 添加行号容器样式 */
        .line-numbers {
            position: absolute;
            left: 0;
            top: 2.5em;
            bottom: 0;
            font-size: 14px;
            padding: 1em 0;
            text-align: right;
            color: #666;
            border-right: 1px solid #404040;
            background: #2d323b;
            user-select: none;
            z-index: 1;

            span {
                display: block;
                padding: 0 0.5em;
                min-width: 2.5em;
                line-height: 1.5;
            }
        }

        /* 调整代码内容的样式 */
        code {
            display: block;
            padding: 1em;
            padding-left: 4em;
            margin-left: 0;
            overflow-x: auto;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            line-height: 1.5;
            position: relative;
        }

        /* 添加仿 macOS 风格的按钮 */
        &::before {
            content: '';
            position: absolute;
            top: 12px;
            left: 12px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff5f56;
            box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
        }

        /* 复制按钮容器 */
        .code-header {
            position: absolute;
            top: 8px;
            right: 12px;
            z-index: 2;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        /* 显示复制按钮 */
        &:hover .code-header {
            opacity: 1;
        }

        /* 复制按钮样式 */
        .copy-button {
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            color: #abb2bf;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;

            i {
                font-size: 14px;
            }

            &:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }

            &.copied {
                background: #98c379;
                color: #fff;
            }
        }
    }

    :deep(img.lazy-image) {
        opacity: 0;

        &.loaded {
            opacity: 1;
        }

        &.error {
            opacity: 0.5;
        }
    }

    :deep(img) {
        max-width: 100%;
        border-radius: 8px;
        margin: 24px 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        cursor: zoom-in;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
    }

    :deep(table) {
        width: 100%;
        margin: 24px 0;
        border-collapse: collapse;
        border-radius: 8px;
        overflow: hidden;

        th,
        td {
            padding: 12px 16px;
            border: 1px solid #e8e8e8;
        }

        th {
            background: #f5f7fa;
            color: #333333;
            font-weight: 500;
            text-align: left;
        }

        tr:nth-child(even) {
            background: #f5f7fa;
        }
    }

    :deep(hr) {
        margin: 32px 0;
        border: none;
        height: 1px;
        background: #e8e8e8;
        position: relative;

        &::before {
            content: '§';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            padding: 0 24px;
            color: #666666;
            font-size: 1.2em;
        }
    }
    :deep(pre) {
        position: relative;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        margin: 1.5em 0;
        overflow: hidden;
        counter-reset: line;
    }
    :deep(code:not([class])) {
        font-size: 16px; /* 修改字体大小 */
        line-height: 1.7; /* 修改行高 */
        background: #fff; /* 修改背景色 */
        margin: 0 12px; /* 修改外边距 */
        margin-top: -10px;
    }
}
</style>