<template>
  <div>
      <!-- 导航栏 -->
      <div class="toolbar-content myBetween">
        <div class="logo-container">
          <a href="https://www.shiyit.com" class="logo-link" style="animation: 10s linear 0s infinite normal none running light_15px;">
          <span class="logo-text">Toivo🍉</span>
          <span class="logo-icon">
            <img src="http://124.70.85.121:9000/t-blog/test/Toivo-logo.png" alt="Toivo" style="width: 70px; height: 70px;">
          </span>
        </a>
        </div>
        
        
        <!-- 导航列表 -->
        <div class="nav-container">
          <!-- Logo 和链接 -->
        
          <ul class="scroll-menu">
            
            <li @click="router.push({path: '/'})">
              <div class="my-menu">
                🏡 <span>首页</span>
              </div>
            </li>

            <el-dropdown :hide-timeout="500" placement="bottom">
              <li>
                <div class="my-menu">
                  📒 <span>记录</span>
                </div>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(sort, index) in sortInfo" :key="index">
                  <div @click="router.push({path: '/sort', query: {sortId: sort.id}})">
                    {{sort.sortName}}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <!-- 家 -->
            <li @click="router.push({path: '/love'})">
              <div class="my-menu">
                ❤️‍🔥 <span>家</span>
              </div>
            </li>

<!--            &lt;!&ndash; 旅拍 &ndash;&gt;-->
<!--            <li @click="router.push({path: '/travel'})">-->
<!--              <div class="my-menu">-->
<!--                🌏 <span>旅拍</span>-->
<!--              </div>-->
<!--            </li>-->

            <!-- 百宝箱 -->
            <li @click="router.push({path: '/favorite'})">
              <div class="my-menu">
                🧰 <span>百宝箱</span>
                <div class="menus_item_child">
                <li>1111</li>
                <li>1111</li>
                <li>1111</li>
              </div>
              </div> 
            </li>
            

            <!-- 留言 -->
            <li @click="router.push({path: '/message'})">
              <div class="my-menu">
                📪 <span>留言</span>
              </div>
            </li>

            <!-- 聊天室 -->
            <li @click="goIm()">
              <div class="my-menu">
                💬 <span>联系我</span>
              </div>
            </li>

            <!-- 后台 -->
            <li @click="goAdmin()">
              <div class="my-menu">
                💻️ <span>后台</span>
              </div>
            </li>

            
          </ul>
          
            
        </div>
        <!-- 个人中心 -->
        <div class="avatar-container">
              <el-dropdown placement="bottom">
                <el-avatar class="user-avatar" :size="36"
                           style="margin-top: 12px"></el-avatar>               

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="router.push({path: '/user'})"
                                    v-if="!$common.isEmpty(currentUser)">
                    <i class="fa fa-user-circle" aria-hidden="true"></i> <span>个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="logout()">
                    <i class="fa fa-sign-out" aria-hidden="true"></i> <span>退出</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="router.push({path: '/user'})"
                                    v-if="$common.isEmpty(currentUser)">
                    <i class="fa fa-sign-in" aria-hidden="true"></i> <span>登陆</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </div>
      </div>

    
  </div>
</template>
<script setup>

import { useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
</script>
<style scoped>

.toolbar-content {
  width: 100%;
  height: 60px;
  color: #ffffff;
  /* 固定位置，不随滚动条滚动 */
  position: fixed;
  z-index: 100;
  /* 禁止选中文字 */
  user-select: none;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
}

.toolbar-content.enter {
  background: var(--toolbarBackground);
  color: var(--toolbarFont);
  box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

.toolbar-content.hoverEnter {
  background: var(--translucent);
  box-shadow: 0 1px 3px 0 rgba(0, 34, 77, 0.05);
}

.toolbar-title {
  margin-left: 30px;
  cursor: pointer;
}

.toolbar-mobile-menu {
  font-size: 30px;
  margin-right: 15px;
  cursor: pointer;
}
.logo-container {
  position: absolute;
  left: 30px;
  cursor: pointer;
}
.avatar-container {
  position: absolute;
  right: 30px;
  cursor: pointer;
}
.logo-link {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, .15);
  font-weight: 700;
  position: relative;
  font-size: 24px;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}

.logo-text {
  display: inline-block;
  transition: opacity 0.3s ease;
}

.logo-icon {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 10px;
}

.logo-link:hover .logo-text {
  opacity: 0;
}
.logo-link:hover .logo-icon {
  opacity: 1;
}
@keyframes light_15px {
  0% { text-shadow: #5636ed 0 0 15px; }
  12.5% { text-shadow: #11e8bb 0 0 15px; }
  25% { text-shadow: #c9dd22 0 0 15px; }
  37.5% { text-shadow: #fb21a3 0 0 15px; }
  50% { text-shadow: #ff05d9 0 0 15px; }
  62.5% { text-shadow: #ff7d00 0 0 15px; }
  75% { text-shadow: #ff6867 0 0 15px; }
  87.5% { text-shadow: #ff1b69 0 0 15px; }
  100% { text-shadow: #5636ed 0 0 15px; }
}


.nav-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.scroll-menu {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  list-style: none;
}

.scroll-menu li {
  list-style: none;
  margin: 0 12px;
  font-size: 17px;
  height: 60px;
  line-height: 60px;
  position: relative;
  cursor: pointer;
}

.scroll-menu li:hover .my-menu span {
  color: var(--theme-color);
}

.scroll-menu li:hover .my-menu i {
  color: var(--theme-color);
  animation: scale 1.5s ease-in-out infinite;
}

.scroll-menu li .my-menu:after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  height: 6px;
  background-color: var(--theme-color);
  width: 100%;
  max-width: 0;
  transition: max-width 0.25s ease-in-out;
}
.scroll-menu li:hover .my-menu:after {
  max-width: 100%;
}

.sortMenu {
  margin-left: 44px;
  font-size: 17px;
  position: relative;
}

.sortMenu:after {
  top: 32px;
  width: 35px;
  left: 0;
  height: 2px;
  background: var(--theme-color);
  content: "";
  border-radius: 1px;
  position: absolute;
}

.el-dropdown {
  font-size: unset;
  color: unset;
}

.el-popper[x-placement^=bottom] {
  margin-top: -8px;
}

.el-dropdown-menu {
  padding: 5px 0;
}

.el-dropdown-menu__item {
  font-size: unset;
}

.el-dropdown-menu__item:hover {
  background-color: var(--white);
  color: var(--theme-color);
}

.toolButton {
  position: fixed;
  right: 3vh;
  bottom: 3vh;
  animation: slide-bottom 0.5s ease-in-out both;
  z-index: 100;
  cursor: pointer;
  font-size: 25px;
  width: 30px;
}

.my-setting {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  cursor: pointer;
  font-size: 20px;
}

.my-setting i {
  padding: 5px;
}

.my-setting i:hover {
  color: var(--theme-color);
}

.cd-top {
  background: var(--toTop) no-repeat center;
  position: fixed;
  right: 5vh;
  top: -900px;
  z-index: 99;
  width: 70px;
  height: 900px;
  background-size: contain;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}

.backTop {
  transition: all 0.3s ease-in;
  position: relative;
  top: 0;
  left: -13px;
}

.backTop:hover {
  top: -10px;
}

#outerImg {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  width: 100%;
  height: 100%;
  display: none;
}

@media screen and (max-width: 400px) {
  .toolButton {
    right: 0.5vh;
  }
}
.menus_item_child{
  position: relative;
  font-size: 10px;
  right: 11px;
  display:none;
  margin-top: -10px;
  padding: 0;
  width: 120%;
  height: 100%;
  border-radius: 5px;
  background-color: var(--background-color); /* 使用纯白色背景 */    -webkit-box-shadow: 0 5px 20px -4px rgba(0,0,0,.5);
  box-shadow: 0 5px 20px -4px rgba(0,0,0,.5);
  -webkit-animation: sub_menus .3s .1s ease both;
  -moz-animation: sub_menus .3s .1s ease both;
  -o-animation: sub_menus .3s .1s ease both;
  -ms-animation: sub_menus .3s .1s ease both;
  animation: sub_menus .3s .1s ease both;
  }
  .my-menu:hover .menus_item_child {
    display: block;
  }
  .menus_item_child li {
      padding: 1px 10px;
      margin: 0;
      list-style-type: none;
      border-radius: 5px;
      white-space: nowrap;
      display: flex; /* 使用 flexbox 布局 */
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
  }

  .menus_item_child li:hover {
      background-color: var(--text-color2);
  }
  
</style>

