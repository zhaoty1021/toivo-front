<template>
    <div class="comment-container" :class="theme" v-loading="loading">
        <!-- 输入区域 -->
        <div class="comment-input">
            <div class="input-wrapper">
                <div class="avatar-container">
                    <el-avatar v-if="user" :src="user.avatar" size="default" />
                    <el-avatar
                        v-else
                        :src="proxy.$setting.touristAvatar"
                        size="default"
                    />
                </div>
                <div class="editor-container">
                    <div
                        ref="textareaRef"
                        contenteditable="true"
                        @input="onInput"
                        @paste="optimizePasteEvent"
                        data-placeholder="分享你的想法..."
                        class="comment-editor"
                    ></div>
                    <div class="editor-controls">
                        <button
                            @click.stop="chooseEmoji = !chooseEmoji"
                            class="control-btn"
                        >
                            <i class="iconfont icon-biaoqing"></i>
                            <span>表情</span>
                        </button>
                        <div class="emoji-picker" v-show="chooseEmoji">
                            <Emoji @chooseEmoji="handleChooseEmoji" />
                        </div>
                        <button @click="addComment" class="submit-btn">
                            <span>发布评论</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 评论列表 -->
        <div class="comment-list">
            <div v-if="commentList.length === 0" class="empty-comment">
                <div class="empty-icon">
                    <i class="iconfont icon-comment"></i>
                </div>
                <p>还没有评论，快来抢沙发~</p>
            </div>

            <div
                v-for="(item, index) in commentList"
                :key="index"
                class="comment-item"
            >
                <!-- 主评论 -->
                <div class="comment-main">
                    <div class="comment-avatar">
                        <el-avatar :src="item.avatar" size="default" />
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <div class="user-info">
                                <h3 class="username">
                                    <a
                                        :href="item.webSite"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {{ item.nickname }}
                                    </a>
                                    <span
                                        v-if="
                                            item.userId == props.articleUserId
                                        "
                                        class="author-tag"
                                        >作者</span
                                    >
                                </h3>
                                <div class="meta-info">
                                    <time class="time">{{
                                        item.createTimeStr
                                    }}</time>
                                    <span class="device">
                                        <svg-icon :name="item.browser" />
                                        {{ item.browserVersion }}
                                    </span>
                                    <span class="location">
                                        <svg-icon name="location" />
                                        {{ splitIpAddress(item.ipAddress) }}
                                    </span>
                                </div>
                            </div>
                            <button
                                @click="
                                    replyComment(item, item.id, false, index)
                                "
                                class="reply-btn"
                            >
                                <i class="iconfont icon-reply"></i>
                                <span>回复</span>
                            </button>
                        </div>

                        <div class="comment-text markdown-body">
                            <p v-html="item.content"></p>
                        </div>

                        <!-- 回复框 -->
                        <Reply
                            ref="replyRef"
                            @reloadReply="reloadReply"
                            :reply="item.replyData"
                        />
                    </div>
                </div>

                <!-- 子评论 -->
                <div
                    class="comment-replies"
                    v-if="item.children && item.children.length > 0"
                >
                    <div
                        v-for="(childrenItem, childIndex) in item.children"
                        :key="childIndex"
                        class="reply-item"
                    >
                        <div class="reply-avatar">
                            <el-avatar
                                :src="childrenItem.avatar"
                                size="default"
                            />
                        </div>
                        <div class="reply-content">
                            <div class="reply-header">
                                <div class="user-info">
                                    <h4 class="username">
                                        <a
                                            :href="childrenItem.webSite"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {{ childrenItem.nickname }}
                                        </a>
                                        <span
                                            v-if="
                                                childrenItem.userId ==
                                                props.articleUserId
                                            "
                                            class="author-tag"
                                            >作者</span
                                        >
                                    </h4>
                                    <div class="meta-info">
                                        <time class="time">{{
                                            childrenItem.createTimeStr
                                        }}</time>
                                        <span class="device">
                                            <svg-icon
                                                :name="childrenItem.browser"
                                            />
                                            {{ childrenItem.browserVersion }}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    @click="
                                        replyComment(
                                            childrenItem,
                                            item.id,
                                            true
                                        )
                                    "
                                    class="reply-btn"
                                >
                                    <i class="iconfont icon-reply"></i>
                                    <span>回复</span>
                                </button>
                            </div>

                            <div class="reply-text">
                                <p>
                                    <a class="mention"
                                        >@{{ childrenItem.replyNickname }}</a
                                    >
                                    <span v-html="childrenItem.content"></span>
                                </p>
                            </div>

                            <!-- 嵌套回复框 -->
                            <Reply
                                ref="replyRefs"
                                @reloadReply="reloadReply"
                                :reply="childrenItem.replyData"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="pages > 1">
            <sy-pagination
                :pageNo="pageData.pageNo"
                :pages="pages"
                @changePage="moreComment"
            />
        </div>
    </div>
</template>

<script setup name='comment'>
import { postComment, featchComments } from '@/api/comment'
import { browserMatch } from '@/utils/index'
import Reply from './Reply.vue'
import Emoji from '@/components/emoji/index.vue'
import { useSiteStore } from '@/store/moudel/site.js'
import { useUserStore } from '@/store/moudel/user.js'
import { inject } from 'vue'

const theme = inject('theme')

const { proxy } = getCurrentInstance()
const siteStore = useSiteStore()
const userStore = useUserStore()
const route = useRoute()
const chooseEmoji = ref(false)
const commentContent = ref('')
const opacity = ref(0)
const show = ref(null)
const user = ref(userStore.getUserInfo)
const articleId = ref(route.params.articleId)
const pageData = ref({
    pageNo: 1,
    pageSize: 5,
    articleId: route.params.articleId
})
const commentList = ref([])
const pages = ref(0)
const lastEditRange = ref(null)
const lastComment = ref(null)
const textareaRef = ref()
const replyRef = ref()
const loading = ref(false)

const props = defineProps({
    articleUserId: {
        type: String,
        default: ''
    }
})

onMounted(() => {
    getCommens()
    document.addEventListener('click', (e) => {
        if (
            e.target.className != 'el-radio-button__orig-radio' &&
            e.target.className != 'el-radio-button__inner' &&
            e.target.className != 'el-upload__input' &&
            e.target.className != 'el-icon-plus avatar-uploader-icon'
        ) {
            chooseEmoji.value = false
        }
    })
    textareaRef.value.onclick = () => {
        // 获取选定对象
        let selection = window.getSelection()
        // 设置最后光标对象
        if (selection.rangeCount > 0) {
            // 记录光标最后点击可编辑div中所选择的位置
            lastEditRange.value = selection.getRangeAt(0)
        }
    }
})
//获取评论
function getCommens() {
    featchComments(pageData.value).then((res) => {
        commentList.value = res.data.records
        pages.value = res.data.pages
    })
}

//添加表情
function handleChooseEmoji(value) {
    // 创建一个img标签（表情）
    let img = document.createElement('img')
    img.src = value.url
    img.style.verticalAlign = 'middle'
    img.style.marginLeft = '2px'
    img.style.marginRight = '2px'
    img.style.maxHeight = value.maxHeight
    img.style.height = value.height
    img.style.width = value.width
    let edit = textareaRef.value
    edit.focus()
    let selection = window.getSelection()
    // 如果存在最后的光标对象
    if (lastEditRange.value) {
        // 选区对象清除所有光标
        selection.removeAllRanges()
        // 并添加最后记录的光标，以还原之前的状态
        selection.addRange(lastEditRange.value)
        // 获取到最后选择的位置
        var range = selection.getRangeAt(0)
        // 在此位置插入表情图
        range.insertNode(img)
        // false，表示将Range对象所代表的区域的起点移动到终点处
        range.collapse(false)

        // 记录最后的位置
        lastEditRange.value = selection.getRangeAt(0)
    } else {
        // 将表情添加到可编辑的div中，作为可编辑div的子节点
        edit.appendChild(img)
        // 使用选取对象，选取可编辑div中的所有子节点
        selection.selectAllChildren(edit)
        // 合并到最后面，即实现了添加一个表情后，把光标移到最后面
        selection.collapseToEnd()
    }
    chooseEmoji.value = false
}

function reloadReply(index) {
    let query = {
        pageNo: pageData.value.pageNo,
        pageSize: 5,
        articleId: articleId.value
    }

    featchComments(query).then((res) => {
        commentList.value = res.data.records
    })
}

function optimizePasteEvent(e) {
    // 监听粘贴内容到输入框事件，对内容进行处理 处理掉复制的样式标签，只拿取文本部分
    e.stopPropagation()
    e.preventDefault()
    let text = '',
        event = e.originalEvent || e
    if (event.clipboardData && event.clipboardData.getData) {
        text = event.clipboardData.getData('text/plain')
    } else if (window.clipboardData && window.clipboardData.getData) {
        text = window.clipboardData.getData('text')
    }
    if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
    } else {
        document.execCommand('paste', false, text)
    }
}
function onInput(e) {
    let selection = window.getSelection()
    lastEditRange.value = selection.getRangeAt(0)
}

function replyComment(item, parentId, isChilderen) {
    if (user.value == null) {
        userStore.setLoginFlag(true)
        return
    }
    if (lastComment.value != null) {
        lastComment.value.replyData = { showBox: false }
    }

    //传值给回复框
    let data = {
        showBox: true,
        commentContent: '',
        nickname: item.nickname,
        replyUserId: item.userId,
        parentId: parentId,
        index: item.id
    }
    item.replyData = data
    lastComment.value = item
}

//添加评论
function addComment() {
    if (user.value == null) {
        userStore.setLoginFlag(true)
        return
    }
    if (!textareaRef.value.innerHTML) {
        proxy.$modal.msgWarning('评论不能为空')
        return
    }
    let browser = browserMatch()
    let comment = {
        articleId: articleId.value,
        content: textareaRef.value.innerHTML,
        browser: browser.browser.toLowerCase(),
        browserVersion: browser.browser + ' ' + browser.version
    }
    postComment(comment).then((res) => {
        pageData.value.pageNo = 1
        getCommens()
        proxy.$modal.msgSuccess('评论成功')
        siteStore.setIsCommentVisible(true)
        textareaRef.value.innerHTML = ''
    })
}
//加载更多评论
function moreComment(val) {
    loading.value = true
    pageData.value.pageNo = val
    featchComments(pageData.value)
        .then((res) => {
            commentList.value.push(...res.data.records)
            pages.value = res.data.pages
            loading.value = false
        })
        .catch((err) => {
            loading.value = false
        })
}

//分割地址
function splitIpAddress(address) {
    return address.split('|')[1]
}
</script>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');

.comment-container {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #e0e0ff;
    --border-color: rgba(0, 240, 255, 0.3);
    --grid-color: rgba(0, 240, 255, 0.1);
    --card-bg: rgba(20, 28, 42, 0.6);

    margin: 2rem 0;
    font-family: 'Roboto Mono', monospace;
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

    &::before {
        content: '';
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

/* 输入区域 */
.comment-input {
    margin-bottom: 2rem;
    margin: 2rem 2rem 0 2rem;

    .input-wrapper {
        display: flex;
        gap: 1.25rem;
        background: var(--bg-color);
        border-radius: 0.5rem;
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
        }
    }

    .avatar-container {
        .el-avatar {
            border: 2px solid var(--primary-color);
            box-shadow: 0 0 15px var(--primary-color);
        }
    }

    .editor-container {
        flex: 1;

        .comment-editor {
            min-height: 7.5rem;
            max-height: 18.75rem;
            padding: 1rem;
            background: var(--bg-color);
            border-radius: 0.5rem;
            border: 1px solid var(--border-color);
            color: var(--text-color);
            font-size: 1rem;
            line-height: 1.6;
            outline: none;
            transition: all 0.3s ease;
            overflow-y: auto;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);

            &:focus {
                border-color: var(--primary-color);
                box-shadow: inset 0 0 15px rgba(0, 240, 255, 0.2),
                    0 0 15px rgba(0, 240, 255, 0.3);
            }

            &:empty:before {
                content: attr(data-placeholder);
                color: var(--text-color);
                opacity: 0.6;
            }
        }

        .editor-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;

            .control-btn {
                display: flex;
                align-items: center;
                background: transparent;
                border: none;
                color: var(--text-color);
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                transition: all 0.3s ease;

                i {
                    margin-right: 0.5rem;
                    font-size: 1.25rem;
                }

                &:hover {
                    color: var(--primary-color);
                    text-shadow: 0 0 5px var(--primary-color);
                }
            }

            .submit-btn {
                background: linear-gradient(
                    135deg,
                    var(--primary-color),
                    var(--secondary-color)
                );
                color: white;
                border: none;
                padding: 0.625rem 1.75rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }
            }
        }

        .emoji-picker {
            position: absolute;
            bottom: 4.375rem;
            left: 0;
            background: rgba(13, 17, 23, 0.95);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3),
                0 0 20px var(--primary-color);
            z-index: 10;
            padding: 1rem;
            backdrop-filter: blur(10px);
        }
    }
}

/* 评论列表 */
.comment-list {
    .empty-comment {
        text-align: center;
        padding: 3.75rem 0;
        color: var(--text-color);
        opacity: 0.6;

        .empty-icon {
            font-size: 3.75rem;
            color: var(--primary-color);
            margin-bottom: 1.25rem;
            opacity: 0.8;
        }
    }

    .comment-item {
        background: var(--card-bg);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
        }

        .comment-main {
            display: flex;
            gap: 1.25rem;
            margin-bottom: 1.25rem;

            .comment-avatar {
                .el-avatar {
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 0 15px var(--primary-color);
                }
            }

            .comment-content {
                flex: 1;

                .comment-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;

                    .user-info {
                        .username {
                            font-size: 1.125rem;
                            font-weight: 600;
                            margin: 0 0 0.375rem 0;
                            color: var(--text-color);

                            a {
                                color: inherit;
                                text-decoration: none;
                                transition: all 0.3s ease;

                                &:hover {
                                    color: var(--primary-color);
                                }
                            }

                            .author-tag {
                                display: inline-block;
                                background: linear-gradient(
                                    to right,
                                    var(--primary-color),
                                    var(--secondary-color)
                                );
                                color: white;
                                font-size: 0.75rem;
                                border-radius: 0.25rem;
                                padding: 0.125rem 0.625rem;
                                margin-left: 0.625rem;
                                font-weight: 600;
                            }
                        }

                        .meta-info {
                            display: flex;
                            align-items: center;
                            flex-wrap: wrap;
                            font-size: 0.8125rem;
                            color: var(--text-color);
                            opacity: 0.7;

                            .time {
                                margin-right: 1rem;
                            }

                            .device,
                            .location {
                                display: flex;
                                align-items: center;
                                margin-right: 1rem;

                                svg-icon {
                                    margin-right: 0.375rem;
                                }
                            }
                        }
                    }

                    .reply-btn {
                        display: flex;
                        align-items: center;
                        background: transparent;
                        color: var(--primary-color);
                        border: 1px solid var(--primary-color);
                        padding: 0.5rem 1rem;
                        border-radius: 0.5rem;
                        font-size: 0.875rem;
                        cursor: pointer;
                        transition: all 0.3s ease;

                        i {
                            margin-right: 0.5rem;
                        }

                        &:hover {
                            background: rgba(0, 240, 255, 0.1);
                        }
                    }
                }

                .comment-text {
                    font-size: 1rem;
                    line-height: 1.7;
                    color: var(--text-color);
                    margin-bottom: 1.25rem;

                    p {
                        margin: 0;
                    }

                    img {
                        max-width: 100%;
                    }
                }
            }
        }

        .comment-replies {
            margin-left: 4.75rem;
            padding-left: 1.5rem;
            border-left: 2px solid var(--border-color);

            .reply-item {
                display: flex;
                gap: 1.25rem;
                padding: 1.25rem 0;
                border-bottom: 1px dashed var(--border-color);

                &:last-child {
                    border-bottom: none;
                }

                .reply-avatar {
                    .el-avatar {
                        border: 2px solid var(--accent-color);
                        box-shadow: 0 0 15px var(--accent-color);
                    }
                }

                .reply-content {
                    flex: 1;

                    .reply-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 0.5rem;
                    }

                    .reply-text {
                        font-size: 0.9375rem;

                        .mention {
                            color: var(--primary-color);
                            font-weight: 600;
                            text-decoration: none;
                            margin-right: 0.375rem;
                        }
                    }
                }
            }
        }
    }
}

/* 分页 */
.pagination {
    margin-top: 2.5rem;
    display: flex;
    justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .comment-input .input-wrapper {
        flex-direction: column;
        padding: 1.25rem;
    }

    .comment-item {
        padding: 1.25rem;

        .comment-main {
            gap: 1rem;
        }

        .comment-replies {
            margin-left: 3.5rem;
            padding-left: 1rem;
        }
    }
}
</style>