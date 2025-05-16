<template>
  <div class="home-container">
    <MainLayout
      :fullscreenLoading="fullscreenLoading"
      :bannerList="bannerList"
      :categoryList="categoryList"
      :activeName="activeName"
      :sayList="sayList"
      :currentIndex="currentIndex"
      :articleList="articleList"
      :pages="pages"
      :newArticleList="newArticleList"
      :tagList="tagList"
      :webInfo="webInfo"
      @tab-click="handleTabClick"
      @page-change="handlePage"
      @wheel="goWheel"
      @mouseenter-say="stop"
      @mouseleave-say="start"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "./components/MainLayout.vue";

import WOW from "wow.js";
import "wow.js/css/libs/animate.css";
import Brand from "@/components/layout/Brand.vue";

import Clipboard from "clipboard";
import { listArticle, featchHomeData, listCategory } from "@/api";
import { listSay } from "@/api/say";
import { useSiteStore } from "@/store/moudel/site.js";

const { proxy } = getCurrentInstance();
const defaultSetting = ref(proxy.$setting);
const router = useRouter();
const siteStore = useSiteStore();
const webInfo = ref(siteStore.getWebInfo);
const centerDialogVisible = ref(false);
const drawer = ref(false);
const videoSrc = ref("http://api.yujn.cn/api/zzxjj.php");
const pageData = ref({
  pageNo: 1,
  pageSize: 10,
});
const activeName = ref("0");
const bannerList = ref([]);
const categoryList = ref([
  {
    id: null,
    name: "最新",
    icon: "new",
    desc: "create_time",
  },
  {
    id: null,
    name: "阅读最多",
    icon: "hot2",
    desc: "quantity",
  },
  {
    id: null,
    name: "评论最多",
    icon: "commenthot",
    desc: "quantity",
  },
]);
const articleList = ref([
  {
    id: 1,
    title: "测试文章璐璐璐璐璐璐璐璐璐",
    quantity: 100,
    isOriginal: true,
    isStick: true,
    summary: "测试文章",
  },
  {
    id: 2,
    title: "测试文章璐璐璐璐璐璐璐璐璐",
    quantity: 100,
    isOriginal: true,
    isStick: true,
    summary: "测试文章",
  },
]);
const pages = ref(0);
const tagList = ref([]);
const newArticleList = ref([]);
const tagStyle = ref(["success", "info", "warning", "danger"]);
const sayList = ref([]);
const currentIndex = ref(0);
const timer = ref();
const fullscreenLoading = ref(true);
const swiper = ref();
const swiperOpen = ref(true);

onBeforeUnmount(() => {
  clearInterval(timer);
});

//点击分类tab标签
function handleTabClick(tab) {
  let item = categoryList.value[tab.index];
  pageData.value.pageNo = 1;
  pageData.value.categoryId = item.id;
  pageData.value.orderByDescColumn = item.desc;
  listArticle(pageData.value).then((res) => {
    articleList.value = res.data.records;
    pages.value = res.data.pages;
  });
}
//获取主页数据
function getHomeData() {
  featchHomeData().then((res) => {
    bannerList.value = res.extra.articles;
    tagList.value = res.extra.tagCloud;
    for (var i = 0; i < tagList.value.length; i++) {
      tagList.value[i].font = Math.floor(Math.random() * 10) + 10 + "px";
    }
    newArticleList.value = res.extra.newArticleList;
  });
}
//获取所有分类
function fetchCategoryList() {
  listCategory().then((res) => {
    categoryList.value.push(...res.data);
  });
}

//要显示的联系方式
function isShow(type) {
  return webInfo.value.showList.indexOf(type) != -1;
}

//获取所有文章
function getArticleList() {
  listArticle(pageData.value)
    .then((res) => {
      articleList.value.push(...res.data.records);
      pages.value = res.data.pages;
    })
    .finally(() => (fullscreenLoading.value = false));
}

//随机颜色
function randomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  do {
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === "#FFFFFF" || color === "#000000");
  return color;
}
//切换视频
function nextVideo() {
  videoSrc.value = videoSrc.value + "?temps=" + new Date().getTime();
}
//复制
function copy(value) {
  const clipboard = new Clipboard(".copyBtn", {
    text: () => value,
  });
  clipboard.on("success", () => {
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    pro$toast.error("复制失败");
    clipboard.destroy();
  });
}
// 分页
function handlePage(val) {
  fullscreenLoading.value = true;
  pageData.value.pageNo = val;
  getArticleList();
}
function handleClike(id, path) {
  router.push({
    path: path,
    query: { id: id },
  });
}
//初始化天气
function insertWeather() {
  window.WIDGET = {
    CONFIG: {
      layout: "2",
      width: 230,
      height: 270,
      background: "2",
      dataColor: "000000",
      borderRadius: "5",
      key: "632bf35b75f643fda4f7154697df9f47",
    },
  };
  const script = document.createElement("script");
  script.src =
    "https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0";
  document.body.appendChild(script);
}

//说说列表
function handleGetSayList() {
  let pageData = {
    pageNo: 1,
    pageSize: 5,
  };
  listSay(pageData).then((res) => {
    sayList.value = res.data.records;
    for (var i = 0; i < sayList.value.length; i++) {
      //这里为过滤掉存在视频的说说
      if (sayList.value[i].content.indexOf("<video") > -1) {
        sayList.value.splice(i, 1);
        i = i - 1;
      }
    }
    start();
  });
}

function stop() {
  clearInterval(timer.value);
}
function start() {
  clearInterval(timer.value);
  if (sayList.value.length > 1) {
    timer.value = setInterval(() => {
      currentIndex.value++;
      if (currentIndex.value > sayList.value.length - 1) {
        currentIndex.value = 0;
      }
    }, 3500);
  }
}

function goWheel() {
  if (swiperOpen.value) {
    if (event.deltaY > 0) {
      //data中定义one为true 当one为true时执行
      swiper.value.next(); //以此来控制每次轮播图切换的张数
    }

    if (event.deltaY < 0) {
      swiper.value.prev();
    }
  }

  swiperOpen.value = false;
  setTimeout(() => {
    swiperOpen.value = true;
  }, 1000);
  event.preventDefault();
}
onMounted(() => {
  const wow = new WOW({
    boxClass: "wow", // animated element css class (default is wow)
    animateClass: "animated", // animation css class (default is animated)
    offset: 0, // distance to the element when triggering the animation (default is 0)
    mobile: true, // trigger animations on mobile devices (default is true)
    live: true, // act on asynchronously loaded content (default is true)
    callback: function (box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    },
    scrollContainer: null, // optional scroll container selector, otherwise use window
  });
  wow.init();

  getHomeData();
  getArticleList();
  insertWeather();
  fetchCategoryList();
  handleGetSayList();
});
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
