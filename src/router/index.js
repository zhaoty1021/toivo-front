import { createRouter, createWebHistory } from "vue-router";
import { useSiteStore } from "@/store/moudel/site.js";
import layout from '@/components/layout/index.vue'
import home from '@/views/home/index.vue'
import archive from '@/views/archive/index.vue'
import category from '@/views/category/index.vue'
import tag from '@/views/tag/index.vue'
import hot from '@/views/search/Hot.vue'
import message from '@/views/message/index.vue'
import about from '@/views/about/index.vue'
import link from '@/views/link/index.vue'
import article from '@/views/article/index.vue'
import newposts from '@/views/article/Add.vue'
import say from '@/views/say/index.vue'
import software from '@/views/software/index.vue'
import chat from '@/views/chat/index.vue'
import notice from '@/views/notice/index.vue'
import user from '@/views/user/index.vue'
import TagArticles from "../views/tag/TagArticles.vue";
import recommendSite from "../views/recommendSite/recommendSite.vue";
import recommendGame from "../views/game/recommendGame.vue";
import { pa } from "element-plus/es/locales.mjs";

const routes = [
    {
        path: "/",
        component: layout,
        children: [
            {
                path: "/",
                component: home,
            },
            {
                path: "/article/:articleId",
                component: article,
            },
            {
                path: "newposts",
                component: newposts,
            },
            {
                path: "/archive",
                component: archive,
                meta: {
                    title: "文章归档"
                }
            },
            {
                path: "/category",
                component: category,
                meta: {
                    title: "文章分类"
                }
            },
            {
                path: "/tags",
                component: tag,
                meta: {
                    title: "标签云"
                }
            },
            {
                path: "/tags/:tagId",
                component: TagArticles,
                meta: {
                    title: "标签云"
                }
            },
            {
                path: "/hot",
                component: hot,
            },
            {
                path: "/say",
                component: say,
            },
            {
                path: "/message",
                component: message,
                meta: {
                    title: "留言墙"
                }
            },
            {
                path: "/about",
                component: about,
                meta: {
                    title: "关于本站"
                }
            },
            {
                path: "/link",
                component: link,
                meta: {
                    title: "友情链接"
                }
            },
            {
                path: "/software",
                component: software,
                meta: {
                    title: "开源软件"
                }
            },
            {
                path: "/chat",
                component: chat,
            },
            {
                path: "/msg",
                component: notice,
                meta: {
                    title: "消息"
                }
            },
            {
                path: "/user",
                component: user,
                meta: {
                    title: "个人中心"
                }
            },
            {
                path: "/recommendSite",
                component: recommendSite,
                meta: {
                    title: "推荐网站"
                }
            },
            {
                path: "/recommendGame",
                component: recommendGame,
                meta: {
                    title: "推荐游戏"
                }
            }
        ],
    },
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: () => import("@/views/404/index.vue"),
    }
];

const router = createRouter({
    routes,
    history: createWebHistory("/toivo/"),
    scrollBehavior: (to, from, savePosition) => {
        return {
            top: 0
        }
    },
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + (to.params.tagId ? ` - ${to.params.tagId}` : '');
    }
    const siteStore = useSiteStore()
    siteStore.setSearchDialogVisible(false)
    next()
});

export default router;