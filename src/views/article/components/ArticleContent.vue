<template>
    <article class="article-content">
        <!-- 免费内容 -->
        <div v-if="article.readType === 1" v-html="article.content"></div>

        <!-- 会员内容 -->
        <LockedContent
            v-else-if="article.readType === 2"
            :content="article.content"
            type="member"
            @action="$emit('upgrade')"
        />

        <!-- 付费内容 -->
        <LockedContent
            v-else-if="article.readType === 3"
            :content="article.content"
            type="paid"
            @action="$emit('purchase')"
        />
    </article>
</template>
  
  <script>
import LockedContent from './LockedContent.vue'

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
    }
}
</script>
  
  <style lang="scss" scoped>
.article-content {
    padding: 0 32px;
    line-height: 1.8;
    color: #333333;
    font-size: 1.1em;

    :deep(h2) {
        font-size: 1.8em;
        margin: 32px 0 24px;
        padding-bottom: 12px;
        border-bottom: 2px solid rgba(64, 158, 255, 0.1);
        position: relative;
        color: #333333;

        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 50px;
            height: 2px;
            background: #409eff;
        }
    }

    :deep(h3) {
        font-size: 1.4em;
        margin: 24px 0;
        color: #333333;
        position: relative;
        padding-left: 24px;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: #409eff;
            border-radius: 4px;
        }
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
}
</style>