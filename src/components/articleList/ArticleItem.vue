<template>
    <el-card class="article-item box-shadow-top wow pulse">
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
                    <img
                        :src="article.cover || defaultImage"
                        :alt="article.title"
                    />
                </router-link>
            </div>

            <div class="articleInfo">
                <div class="articleInfo-item">
                    <div>
                        <h3>
                            <router-link :to="articleLink">
                                <span v-if="article.isStick" class="top">
                                    <svg-icon name="top" color="#ff0000" />
                                    置顶</span
                                >
                                <span class="xiahuaxian hand-style">
                                    {{ article.title }}
                                </span>
                            </router-link>
                        </h3>
                        <div class="article-meta-wrap">
                            <span class="article-meta">
                                <svg-icon
                                    name="sign1"
                                    color="#ff0000"
                                    class="article-meta-icon"
                                ></svg-icon>
                                <span>{{ article.createTime }}</span>
                                <span class="article-meta-separator">|</span>
                            </span>
                            <span class="article-meta">
                                <svg-icon
                                    name="category"
                                    color="#ff0000"
                                    class="article-meta-icon"
                                ></svg-icon>
                                <a
                                    @click="
                                        handleClike(
                                            article.category.id,
                                            '/categroy'
                                        )
                                    "
                                    class="hand-style"
                                    >{{ article.category.name }}</a
                                >
                                <span class="article-meta-separator">|</span>
                            </span>
                            <span class="article-meta">
                                <svg-icon
                                    name="dianzan"
                                    color="#ff0000"
                                    class="article-meta-icon"
                                ></svg-icon>
                                <span>点赞</span>
                                <span class="article-meta-separator">|</span>
                            </span>
                            <span class="article-meta">
                                <svg-icon
                                    name="comment"
                                    color="#ff0000"
                                    class="article-meta-icon"
                                ></svg-icon>
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
                            <span class="author-name">{{
                                article.author.nickname
                            }}</span>
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
                        <svg-icon name="yuan" color="#ff0000"></svg-icon>
                        <span class="read-time"> 1分钟阅读 </span>
                    </div>
                </div>
            </div>
        </div>
    </el-card>
</template>
  
  <script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'
import defaultImage from '@/assets/article1.png'

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
})

const router = useRouter()
const articleLink = computed(() => `/article/${props.article.id}`)
function handleClike(id, path) {
    router.push({
        path,
        query: { id }
    })
}
</script>
  
<style lang="scss" scoped>
::v-deep(.el-card__body) {
    padding: 0;
    width: 100%;
}
.article-item {
    position: relative;
    padding: 10px 5px 10px 15px;
    background-color: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: 20px;
    margin-bottom: 20px;
    height: auto;
    min-height: 14em;

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
        }
    }
    .original {
        position: absolute;
        right: 0;
        top: 0;
        width: 0;
        height: 0;
        border-color: transparent #40c9c6;
        /*上下颜色 左右颜色*/
        border-width: 0 40px 40px 0;
        border-style: solid;

        i {
            position: absolute;
            top: 4px;
            right: -37px;
            font-size: 16px;
            color: aquamarine;
        }
    }

    .articleInfo {
        display: flex;
        flex-direction: column;
        color: var(--article-color);
        width: 50%;
        flex: 1; // 让文字内容占据剩余空间
        padding-left: 30px; // 添加左侧内边距
        padding-right: 30px; // 添加右侧内边距
        justify-content: space-between;

        .articleInfo-item {
            display: flex;
            justify-content: center; // 修改为居中
            flex-direction: column; // 添加此行以确保文字在垂直方向上居中
            padding-top: 10px;

            a {
                color: var(--article-color);
            }

            .top {
                background-image: -webkit-linear-gradient(
                    0deg,
                    #3ca5f6 0,
                    #a86af9 100%
                );
                padding: 2px 5px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                font-size: 0.9rem;
                margin-right: 5px;
                color: #fff;
                height: 20px; // 设置固定高度
                gap: 4px;
            }

            h3 {
                font-size: 1.2em;
                line-height: 1.4;
                margin-bottom: 10px;
                color: var(--text-primary);
                cursor: pointer;
                .stick-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.6em;
                    background: linear-gradient(
                        135deg,
                        #f6d365 0%,
                        #fda085 100%
                    );
                    color: white;
                    padding: 3px 8px;
                    border-radius: 4px;

                    i {
                        transform: rotate(45deg);
                    }
                }
            }

            .summary {
                margin-top: 10px;
            }
            .article-meta-wrap {
                margin: 6px 0;
                color: #858585;
                font-size: 90%;
                .article-meta {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    margin-right: 5px;
                    padding-bottom: 1px;

                    .article-meta-icon {
                        color: var(--text-secondary);
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
            .fa-calendar {
                color: #f56c6c;
            }
            .fa-eye {
                color: #67c23a;
            }
            .fa-clock {
                color: #2fa9e1;
            }
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

                .post-date {
                    color: var(--text-secondary);
                    font-size: 0.9em;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            }

            .footer-right {
                display: flex;
                align-items: center;
                gap: 5px;

                .category-tag {
                    padding: 4px 12px;
                    background: var(--hover-bg);
                    border-radius: 20px;
                    font-size: 0.9em;
                    color: var(--text-secondary);
                }

                .read-time {
                    color: var(--text-secondary);
                    font-size: 0.9em;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            }
        }
    }

    .bottumItem {
        align-items: center;
        display: flex;
        margin-top: 20px;
        flex-wrap: wrap;

        .articleUser {
            line-height: 50px;

            span {
                color: var(--theme-color);
                margin-left: 3px;
            }

            .userAvatar {
                vertical-align: middle;
                border: 1px solid var(--border-line);
                transition: transform 0.5s;

                &:hover {
                    transform: rotate(360deg);
                }
            }
        }

        .tag {
            display: inline-block;
            margin-left: 20px;

            .el-tag {
                margin-right: 8px;
            }
        }

        .articleOhter {
            margin-left: 20px;
            font-size: 0.8rem;
            color: var(--text-color);

            .item {
                margin-right: 10px;
                .el-icon {
                    vertical-align: -2px;
                }
                .name {
                    margin-right: 3px;
                }

                i {
                    margin-right: 3px;
                }
            }
        }
    }
}
</style>