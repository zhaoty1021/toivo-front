<template>
  <div class="container">
    <div class="card">
      <input type="radio" name="select" id="slide_1" checked>
      <input type="radio" name="select" id="slide_2" checked>
      <input type="radio" name="select" id="slide_3" checked>
      <input type="checkbox" id="slideImg">
    <div class="slider">
      <label for="slide_1" class="slide slide_1"></label>
      <label for="slide_2" class="slide slide_2"></label>
      <label for="slide_3" class="slide slide_3"></label>
    </div>

    <div class="inner_part">
      <label for="slideImg" class="img">
        <img class="img_1" src="@/assets/blog1.svg">
      </label>
      <div class="content content_1">
        <div class="title">文章推荐</div>
        <div class="text">
          这是一个文章推荐
        </div>
        <button @click="getRecommendArticle1">查看详情</button>
      </div>
    </div>

    <div class="inner_part">
      <label for="slideImg" class="img">
        <img class="img_2" src="https://c4.wallpaperflare.com/wallpaper/649/96/56/ankara-cityscape-night-night-sky-wallpaper-preview.jpg">
      </label>
      <div class="content content_2">
        <div class="title">文章推荐2</div>
        <div class="text">
          这是第二个文章推荐
        </div>
        <button @click="getRecommendArticle2">查看详情</button>
      </div>
    </div>

    <div class="inner_part">
      <label for="slideImg" class="img">
        <img class="img_3" src="https://c4.wallpaperflare.com/wallpaper/620/34/558/turkey-izmir-mountains-wallpaper-preview.jpg">
      </label>
      <div class="content content_3">
        <div class="title">İzmir</div>
        <div class="text">Located on the shores of the Aegean Sea, west of the Anatolian Peninsula, İzmir is the third-largest city in Turkey.
        </div>
        <button @click="getRecommendArticle3">查看详情</button>
      </div>
    </div>
    </div>
    <div class="category-group">
      <div class="category-group-item">
        <a class="category-button" href="/post/70a2ebe4.html" style="background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);">
          <p class="category-button-title">萤的音乐小屋</p>
          <p class="category-button-date"><time datetime="2024-03-31T16:00:00.000Z" title="更新于 2024-04-01 00:00:00">更新于 171 天前</time></p>
          <svg-icon class="category-button-icon" name="music" />
        </a>
      </div>
      <div class="category-group-item">
        <a class="category-button" href="/post/22fd52ad.html" style="background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);">
          <p class="category-button-title">技术网站分享</p>
          <p class="category-button-date"><time datetime="2024-08-30T16:00:00.000Z" title="更新于 2024-08-31 00:00:00">更新于 19 天前</time></p>
          <svg-icon class="category-button-icon" name="tech" />
        </a>
      </div>
      <div class="category-group-item">
        <a class="category-button" href="/post/7c3a4efe.html" style="background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);">
          <p class="category-button-title">萤的游戏人生</p>
          <p class="category-button-date"><time datetime="2024-09-14T16:00:00.000Z" title="更新于 2024-09-15 00:00:00">更新于 4 天前</time></p>
          <svg-icon class="category-button-icon" name="game" />
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const getRecommendArticle1 = () => {
  console.log('getRecommendArticle1');
  router.push({path: '/article/1'});
}
const getRecommendArticle2 = () => {
  console.log('getRecommendArticle2');
  router.push({path: '/article/2'});
}
const getRecommendArticle3 = () => {
  console.log('getRecommendArticle3');
  router.push({path: '/article/3'});
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 调整 card 和 category-group 之间的间距 */
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card {
  position: relative;
  height: 250px;
  width: 100%;
  margin: 0;
  background-color: #ffffff;
  border-radius: 25px;
  padding-right: 50px; /* 为指示器留出空间 */  
  box-shadow: 10px 0 50px rgba(0, 0, 0, 0.5);
  
}

.card .inner_part {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 30px;
  height: 250px;
  position: absolute;  
  padding-right: 50px; /* 为指示器留出空间 */  
  transition: opacity 0.6s ease, transform 0.6s ease;
}
#slide_1:checked ~ .inner_part:nth-of-type(1),
#slide_2:checked ~ .inner_part:nth-of-type(2),
#slide_3:checked ~ .inner_part:nth-of-type(3) {
  opacity: 1;
  transform: translateX(0);
}


.inner_part .img {
  height: 200px;
  width: 200px;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 20px;
  box-shadow: 0 10px 50px rgba(0,0,0,0.2);
}


.img img {
  height: 70%;
  width: 70%;
  margin-top: 15%;
  margin-left: 15%;
  opacity: 0;
  transition: .6s;
}

#slide_1:checked ~ .inner_part .img_1,
#slide_2:checked ~ .inner_part .img_2,
#slide_3:checked ~ .inner_part .img_3 {
  opacity: 1;
  transition-delay: .2s;
}

.content {
  padding: 0 20px 0 35px;
  width: 530px;
  margin-left: 50px;
  opacity: 0;
  transition: .6s; 
}


#slide_1:checked ~ .inner_part .content_1,
#slide_2:checked ~ .inner_part .content_2,
#slide_3:checked ~ .inner_part .content_3 {
  opacity: 1;
  margin-left: 0;
  z-index: 100;
  transition-delay: .3s;
}

.content .title {
  font-size: 30px;
  font-weight: 700;
  color: #0d0925;
  margin: 0 0 20px 0;
}

.content .text {
  font-size: 19px;
  color: #4e4a67;
  margin: 0 auto 30px auto;
  line-height: 1.5em;
  text-align: justify;
}

.content button {
  padding: 15px 20px;
  border: none;
  font-size: 16px;
  color: #fff0e6;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  background: #000000;
  float: right;
}

.content button:hover {
  background: #cecece;
  color: #000000;
}

.slider {
  position: absolute;
  right: -20px; /* 调整到右侧 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%);
  display: flex;
  flex-direction: column; /* 改为纵向排列 */
  z-index: 10;
  pointer-events: auto; /* 确保可以接收点击事件 */
  transform: translate3d(0, -50%, 0);
}



.slider .slide {
  position: relative;
  height: 50px; /* 调整高度 */
  width: 10px; /* 调整宽度 */
  background: #d9d9d9;
  border-radius: 5px;
  display: inline-flex;
  margin: 3px 0; /* 调整垂直间距 */
  cursor: pointer;
  z-index: 2; 
}


.slider .slide:before {
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 0; /* 初始高度为0 */
  background: #000000;
  border-radius: 5px;
  transform: scaleY(0); /* 改为垂直缩放 */
  transition: transform .6s;
  transform-origin: top; /* 从顶部开始变化 */
  
}

#slide_1:checked ~ .slider .slide_1:before,
#slide_2:checked ~ .slider .slide_2:before,
#slide_3:checked ~ .slider .slide_3:before {
  transform: scaleY(1);
  height: 100%;
}


input {
  display: none;
}

.category-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-width: 200px;
    height: 120px;
    margin-bottom: 16px;
}
.category-group-item {
  flex: 1;
  margin: 0 5px; /* 添加一些水平间距 */
  
}
@media screen and (min-width: 900px) {
    .category-group-item {
        width: calc(100% / 3 - 0.5rem);
        height: 100%;
    }
}
a.category-button {
    height: 100%;
    width: 100%;
    border-radius: 12px;
    display: inline-block;
    font-weight: 700;
    color: var(--text-color);
    transition: all 0.4s cubic-bezier(0.39, 0.575, 0.565, 1);
    transform: scale(1);
    overflow: hidden;
    border: 1.5px solid var(--border-line);
}
a.category-button:after {
    top: 50px;
    width: 50%;
    left: 25px;
    height: 2px;
    background: var(--text-color);
    content: "";
    border-radius: 1px;
    position: absolute;
}
.category-button-title {
    margin-top: 20px;
    padding-left: 25px;
    line-height: 1.5;
    font-size: 1.2rem;
}
.category-button-date {
    margin-top: 10px;
    padding-left: 25px;
    line-height: 1.5;
    font-size: 0.8rem;
}
a.category-button .category-button-icon {
    font-size: 3rem;
    opacity: 1;
    position: absolute;
    right: 0;
    top: 25%;
    transition: 0.3s;
    width: 100px;
    text-align: center;
}
a.category-button .category-button-icon:hover {
  transform: scale(1.4);
}
</style>
