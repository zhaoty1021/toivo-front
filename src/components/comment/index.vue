<template>
    <div class="comment-container" :class="theme" v-loading="loading">
        <!-- Comment Input Area -->
        <div class="comment-input-area">
            <div class="avatar-wrapper">
                <img
                    v-if="user"
                    :src="user.avatar"
                    alt="User Avatar"
                    class="user-avatar"
                />
                <img
                    v-else
                    :src="proxy.$setting.touristAvatar"
                    alt="Guest Avatar"
                    class="user-avatar"
                />
            </div>
            <div class="input-wrapper">
                <div
                    id="textarea"
                    ref="textareaRef"
                    contenteditable="true"
                    @input="onInput"
                    @paste="optimizePasteEvent"
                    data-placeholder="Leave a comment..."
                    class="comment-textarea"
                ></div>
                <div class="comment-controls">
                    <button
                        @click.stop="chooseEmoji = !chooseEmoji"
                        class="emoji-btn"
                        aria-label="Insert emoji"
                    >
                        <i class="iconfont icon-biaoqing"></i>
                    </button>
                    <button
                        @click="addComment"
                        class="submit-btn"
                        aria-label="Submit comment"
                    >
                        Submit
                    </button>
                </div>
                <div class="emoji-dropdown" v-show="chooseEmoji">
                    <Emoji @chooseEmoji="handleChooseEmoji" />
                </div>
            </div>
        </div>

        <!-- Comment List -->
        <div class="comment-list" v-if="commentList.length > 0">
            <div
                v-for="(item, index) in commentList"
                :key="index"
                class="comment-item"
                ref="commentBoxref"
            >
                <!-- Main Comment -->
                <div
                    class="comment-content"
                    @mouseenter="item.showReplyBtn = true"
                    @mouseleave="item.showReplyBtn = false"
                >
                    <div class="comment-avatar">
                        <el-avatar
                            :src="item.avatar"
                            size="default"
                        ></el-avatar>
                    </div>
                    <div class="comment-body">
                        <div class="comment-header">
                            <div class="user-info">
                                <h4 class="username">
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
                                        class="author-badge"
                                        >Author</span
                                    >
                                </h4>
                                <span class="comment-meta">
                                    <time datetime="item.createTime">{{
                                        item.createTimeStr
                                    }}</time>
                                    <span class="device-info">
                                        <svg-icon :name="item.browser" />
                                        {{ item.browserVersion }} ·
                                        <svg-icon :name="item.system" />
                                        {{ item.systemVersion }}
                                    </span>
                                    <span class="location-info">{{
                                        splitIpAddress(item.ipAddress)
                                    }}</span>
                                </span>
                            </div>
                            <button
                                v-show="item.showReplyBtn"
                                @click="
                                    replyComment(item, item.id, false, index)
                                "
                                class="reply-btn"
                            >
                                Reply
                            </button>
                        </div>

                        <div class="comment-text markdown-body">
                            <p v-html="item.content"></p>
                        </div>

                        <!-- Reply Box -->
                        <Reply
                            ref="replyRef"
                            @reloadReply="reloadReply"
                            :reply="item.replyData"
                        />
                    </div>
                </div>

                <!-- Nested Comments -->
                <div
                    class="nested-comments"
                    v-if="item.children && item.children.length > 0"
                >
                    <div
                        v-for="(childrenItem, childerenIndex) in item.children"
                        :key="childerenIndex"
                        class="nested-comment-item"
                        @mouseenter="childrenItem.showReplyBtn = true"
                        @mouseleave="childrenItem.showReplyBtn = false"
                    >
                        <div class="comment-avatar">
                            <el-avatar
                                :src="childrenItem.avatar"
                                size="default"
                            ></el-avatar>
                        </div>
                        <div class="comment-body">
                            <div class="comment-header">
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
                                            class="author-badge"
                                            >Author</span
                                        >
                                    </h4>
                                    <span class="comment-meta">
                                        <time
                                            datetime="childrenItem.createTime"
                                            >{{
                                                childrenItem.createTimeStr
                                            }}</time
                                        >
                                        <span class="device-info">
                                            <svg-icon
                                                :name="childrenItem.browser"
                                            />
                                            {{ childrenItem.browserVersion }} ·
                                            <svg-icon
                                                :name="childrenItem.system"
                                            />
                                            {{ childrenItem.systemVersion }}
                                        </span>
                                        <span class="location-info">{{
                                            splitIpAddress(
                                                childrenItem.ipAddress
                                            )
                                        }}</span>
                                    </span>
                                </div>
                                <button
                                    v-show="childrenItem.showReplyBtn"
                                    @click="
                                        replyComment(
                                            childrenItem,
                                            item.id,
                                            true
                                        )
                                    "
                                    class="reply-btn"
                                >
                                    Reply
                                </button>
                            </div>

                            <div class="comment-text markdown-body">
                                <p>
                                    <a class="reply-mention"
                                        >@{{ childrenItem.replyNickname }}</a
                                    >
                                    <span v-html="childrenItem.content"></span>
                                </p>
                            </div>

                            <!-- Nested Reply Box -->
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

        <!-- Empty State -->
        <div class="empty-state" v-else>
            <p>Be the first to comment</p>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" v-if="pages > 1">
            <sy-pagination
                :pageNo="pageData.pageNo"
                :pages="pages"
                @changePage="moreComment"
            />
        </div>
    </div>
</template>
  
  <style lang="scss">
.comment-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', sans-serif;
    max-width: 100%;

    &.dark {
        --bg-color: #0a0a12;
        --card-bg: #0a0a12;
        --text-color: #e4e4e4;
        --text-secondary: #aaaaaa;
        --text-tertiary: #888888;
        --border-color: #3a3a3a;
        --primary-color: #3b82f6;
        --primary-hover: #60a5fa;
        --success-color: #10b981;
    }

    &.light {
        --bg-color: #ffffff;
        --card-bg: #f7f7f7;
        --text-color: #333333;
        --text-secondary: #666666;
        --text-tertiary: #999999;
        --border-color: #e5e5e5;
        --primary-color: #3b82f6;
        --primary-hover: #60a5fa;
        --success-color: #10b981;
    }

    /* Comment Input Area */
    .comment-input-area {
        display: flex;
        margin-bottom: 24px;
        background-color: var(--card-bg);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        .avatar-wrapper {
            margin-right: 16px;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }
        }

        .input-wrapper {
            flex: 1;
            position: relative;

            .comment-textarea {
                min-height: 100px;
                padding: 12px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                font-size: 14px;
                color: var(--text-color);
                background-color: var(--bg-color);
                transition: border-color 0.2s, box-shadow 0.2s;
                margin-bottom: 12px;
                line-height: 1.5;
                outline: none;

                &:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                }

                &:empty:before {
                    content: attr(data-placeholder);
                    color: var(--text-tertiary);
                    pointer-events: none;
                }

                img {
                    max-height: 20px;
                    vertical-align: middle;
                }
            }

            .comment-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .emoji-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 18px;
                    cursor: pointer;
                    padding: 6px 10px;
                    border-radius: 6px;
                    transition: all 0.2s;

                    &:hover {
                        color: var(--primary-color);
                        background-color: rgba(59, 130, 246, 0.1);
                    }
                }

                .submit-btn {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;

                    &:hover {
                        background-color: var(--primary-hover);
                    }
                }
            }

            .emoji-dropdown {
                position: absolute;
                bottom: 40px;
                left: 0;
                background-color: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10;
            }
        }
    }

    /* Comment List */
    .comment-list {
        .comment-item {
            margin-bottom: 20px;

            .comment-content {
                display: flex;
                padding: 16px;
                background-color: var(--card-bg);
                border-radius: 12px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

                .comment-avatar {
                    margin-right: 16px;

                    .el-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }
                }

                .comment-body {
                    flex: 1;

                    .comment-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 8px;

                        .user-info {
                            .username {
                                font-size: 15px;
                                font-weight: 600;
                                margin: 0 0 2px 0;

                                a {
                                    color: var(--text-color);
                                    text-decoration: none;

                                    &:hover {
                                        color: var(--primary-color);
                                    }
                                }

                                .author-badge {
                                    display: inline-block;
                                    background-color: var(--primary-color);
                                    color: white;
                                    font-size: 11px;
                                    border-radius: 4px;
                                    padding: 1px 6px;
                                    margin-left: 6px;
                                    font-weight: 500;
                                    vertical-align: middle;
                                }
                            }

                            .comment-meta {
                                display: block;
                                font-size: 12px;
                                color: var(--text-tertiary);

                                time {
                                    margin-right: 8px;
                                }

                                .device-info {
                                    margin-right: 8px;

                                    svg-icon {
                                        vertical-align: middle;
                                    }
                                }

                                .location-info {
                                    &:before {
                                        content: '·';
                                        margin-right: 4px;
                                    }
                                }
                            }
                        }

                        .reply-btn {
                            background-color: transparent;
                            color: var(--primary-color);
                            border: 1px solid var(--primary-color);
                            padding: 4px 10px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                            transition: all 0.2s;

                            &:hover {
                                background-color: rgba(59, 130, 246, 0.1);
                            }
                        }
                    }

                    .comment-text {
                        font-size: 14px;
                        line-height: 1.6;
                        color: var(--text-color);
                        margin-bottom: 12px;
                        word-break: break-word;

                        p {
                            margin: 0;
                        }

                        img {
                            max-width: 100%;
                            vertical-align: middle;
                        }

                        .reply-mention {
                            color: var(--primary-color);
                            font-weight: 500;
                            text-decoration: none;
                            margin-right: 4px;
                        }
                    }
                }
            }

            .nested-comments {
                margin-left: 40px;
                margin-top: 12px;
                border-left: 2px solid var(--border-color);
                padding-left: 16px;

                .nested-comment-item {
                    display: flex;
                    padding: 12px;
                    background-color: var(--card-bg);
                    border-radius: 8px;
                    margin-bottom: 12px;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .comment-avatar {
                        margin-right: 12px;

                        .el-avatar {
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 40px 0;
        color: var(--text-tertiary);
        font-size: 16px;
    }

    /* Pagination */
    .pagination-container {
        margin-top: 24px;
        display: flex;
        justify-content: center;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .comment-input-area {
            flex-direction: column;
            padding: 12px;

            .avatar-wrapper {
                margin-right: 0;
                margin-bottom: 12px;
                display: flex;
                justify-content: center;
            }
        }

        .comment-item .comment-content {
            padding: 12px;

            .comment-avatar {
                margin-right: 12px;
            }
        }

        .nested-comments {
            margin-left: 24px !important;
        }
    }
}
</style>
  
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