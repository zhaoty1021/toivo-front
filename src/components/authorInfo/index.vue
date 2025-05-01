<template>
    <el-card class="box" :class="theme">
        <div class="card-cover"></div>
        <div class="user">
            <div class="avatar_wrapper">
                <img src="@/assets/avatar.png" alt="" class="userAvatar" />
            </div>
            <a class="username">
                Tyrone
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="博主"
                    placement="right"
                >
                    <svg-icon name="bozhu"></svg-icon>
                </el-tooltip>
            </a>
            <span class="desc" :title="webInfo.authorInfo">
                萤小宇，全干工程师
            </span>
            <div class="site-data">
                <a href="/archive">
                    <div class="headline">文章</div>
                    <div class="count">12</div>
                </a>
                <a href="/category">
                    <div class="headline">分类</div>
                    <div class="count">12</div>
                </a>
                <a href="/tags">
                    <div class="headline">标签</div>
                    <div class="count">1</div>
                </a>
            </div>
            <div class="lianxi">
                <a class="hand-style" v-show="isShow(3)" :href="webInfo.github">
                    <svg-icon name="github" />
                </a>
                <a
                    v-show="isShow(4)"
                    class="gitee hand-style"
                    :href="webInfo.gitee"
                    target="_blank"
                    title="Gitee"
                    rel="noopener noreferrer nofollow"
                >
                    <svg-icon name="gitee" />
                </a>
                <a
                    class="qq hand-style"
                    :href="
                        '//wpa.qq.com/msgrd?v=3&amp;uin=' +
                        webInfo.qqNumber +
                        '&amp;site=qq&amp;menu=yes'
                    "
                    target="_blank"
                    title="QQ"
                    rel="noopener noreferrer nofollow"
                >
                    <svg-icon name="qq" />
                </a>
                <a
                    class="email hand-style"
                    href=""
                    target="_blank"
                    title="邮箱"
                    rel="noopener noreferrer nofollow"
                >
                    <svg-icon name="email" />
                </a>
                <a
                    class="weibo hand-style"
                    href="https://weibo.com/u/5747542477"
                    target="_blank"
                    title="微博"
                    rel="noopener noreferrer nofollow"
                >
                    <svg-icon name="weibo" />
                </a>
                <a
                    class="steam hand-style"
                    href="https://www.zhihu.com/people/he-he-85-83-34"
                    target="_blank"
                    title="Steam"
                    rel="noopener noreferrer nofollow"
                >
                    <svg-icon name="steam" />
                </a>
                <a
                    class="juejin hand-style"
                    href="https://juejin.cn/user/4391861792808499/posts"
                    target="_blank"
                    title="稀土掘金"
                    rel="noopener noreferrer nofollow"
                >
                    <svg-icon name="juejin" />
                </a>
            </div>
            <div class="collect">
                <el-button class="btn" @click="handleCollect">
                    <p>联系我</p>
                </el-button>
            </div>
        </div>
    </el-card>
</template>
  
  <script setup name="site">
import { ref, inject } from 'vue'
import { useSiteStore } from '@/store/moudel/site.js'
import SvgIcon from '@/components/SvgIcon.vue'

const { proxy } = getCurrentInstance()
const theme = inject('theme')
const defaultSetting = ref(proxy.$setting)
const siteStore = useSiteStore()
const webInfo = ref(siteStore.getWebInfo)

function isShow(type) {
    return webInfo.value.showList.indexOf(type) != -1
}
function handleClike(val) {
    window.location.href = val
}
function handleCollect() {
    proxy.$modal.msgSuccess('按CTRL+ D 键将本页加入书签!')
}
</script>
  
  <style lang="scss" scoped>
@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.8;
    }
    50% {
        opacity: 1;
    }
}

.box {
    --primary-color: #00f0ff;
    --secondary-color: #ff00f0;
    --accent-color: #00ff9d;
    --bg-color: #0a0a12;
    --text-color: #ffffff;
    --border-color: rgba(0, 240, 255, 0.3);
    --border-line: rgba(0, 240, 255, 0.3);
    --glow-effect: 0 0 10px rgba(0, 240, 255, 0.7);
    --card-bg: rgba(30, 30, 60, 0.8);
    --grid-color: rgba(0, 240, 255, 0.1);

    height: 450px;
    position: relative;
    border-radius: 12px;
    border: 1px solid var(--border-line);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background: var(--bg-color);
    overflow: hidden;
    transition: all 0.3s ease;
    animation: pulse 3s infinite alternate;

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
        --grid-color: rgba(0, 102, 204, 0.05);
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: var(--glow-effect);
    }

    .card-cover {
        width: 100%;
        height: 160px;
        position: absolute;
        top: 0;
        left: 0;
        background-image: url('@/assets/avatar.png');
        background-size: cover;
        background-position: center;
        filter: blur(30px);
        transform: scale(1.2);
        z-index: 1;
    }

    .user {
        padding: 45px 15px 15px;
        display: flex;
        align-items: center;
        position: relative;
        flex-direction: column;
        z-index: 2;

        .avatar_wrapper {
            position: relative;
            width: 110px;
            height: 110px;
            margin-bottom: 12px;

            .userAvatar {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid var(--primary-color);
                box-shadow: 0 0 15px var(--primary-color);
                transition: transform 0.5s;
                z-index: 20;

                &:hover {
                    transform: rotate(360deg);
                    box-shadow: 0 0 25px var(--primary-color);
                }
            }
        }

        .username {
            color: var(--text-color);
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 5px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.3s;

            &:hover {
                color: var(--primary-color);
            }

            svg {
                width: 18px;
                height: 18px;
                color: var(--primary-color);
            }
        }

        .desc {
            font-size: 16px;
            margin-top: 10px;
            color: var(--text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            text-align: center;
            background: linear-gradient(
                90deg,
                var(--primary-color),
                var(--secondary-color),
                var(--accent-color)
            );
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: pulse 2s infinite;
        }

        .site-data {
            margin: 14px 0 4px;
            display: flex;
            justify-content: space-around;
            width: 100%;
            text-align: center;

            a {
                display: flex;
                flex-direction: column;
                margin: 0 10px;
                transition: all 0.3s;
                padding: 5px 10px;
                border-radius: 8px;

                &:hover {
                    transform: scale(1.1);
                    background: rgba(var(--primary-color), 0.1);
                }

                .headline {
                    color: var(--text-color);
                    font-size: 14px;
                    opacity: 0.8;
                }

                .count {
                    font-size: 16px;
                    font-weight: bold;
                    color: var(--primary-color);
                }
            }
        }

        .lianxi {
            border-top: 1px solid var(--border-line);
            padding: 10px 0;
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;

            a {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(var(--primary-color), 0.1);
                transition: all 0.3s;

                &:hover {
                    transform: scale(1.2);
                    background: var(--primary-color);
                    box-shadow: 0 0 10px var(--primary-color);

                    svg {
                        color: white;
                    }
                }

                svg {
                    width: 20px;
                    height: 20px;
                    color: var(--primary-color);
                    transition: all 0.3s;
                }
            }
        }

        .collect {
            margin-top: 15px;
            width: 100%;

            .btn {
                width: 100%;
                height: 40px;
                background: transparent;
                border: 2px solid var(--primary-color);
                color: var(--primary-color);
                font-weight: bold;
                border-radius: 8px;
                position: relative;
                overflow: hidden;
                transition: all 0.5s;
                z-index: 1;

                &:hover {
                    color: white;
                    transform: translateY(-3px);

                    &::before {
                        width: 100%;
                    }
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background: var(--primary-color);
                    transition: all 0.5s;
                    z-index: -1;
                }
            }
        }
    }
}
</style>