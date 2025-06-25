import { createApp } from 'vue'
import './styles/style.css'
import './assets/font/iconfont.css'
import './assets/font/iconfont.js'
import clickOutside from './directives/clickOutside'
import App from './App.vue'
import router from './router'
import store from './store'
import SvgIcon from '@/components/SvgIcon.vue'
import pagination from '@/components/pagination/index.vue'
import empty from '@/components/empty/index.vue'
import plugins from './plugins'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VueLazyLoad from 'vue-lazyload'
import Loading from '@/components/loading/Loading.js'
import defaultSetting from "@/setting"
import * as components from '@element-plus/icons-vue'
import { create, NButton, NTag, NAvatar } from 'naive-ui'

// 创建应用实例
const app = createApp(App)

// 基础URL配置
const BASE_URL = import.meta.env.VITE_APP_BASE_API || '/toivo/' // 根据你的Vite配置调整
const API_PREFIX = '/api/admin/config/group/BASIC'

// 默认配置
const defaultConfig = {
  site_name: '默认标题',
  site_description: '默认描述',
  site_keywords: '默认关键词',
  site_logo: '/default-favicon.ico',
  site_background: ''
}

// 配置请求函数
const fetchSiteConfig = async () => {
  try {
    // 处理基础URL，确保不以斜杠结尾
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
    // 处理API路径，确保不以斜杠开头
    const apiPath = API_PREFIX.startsWith('/') ? API_PREFIX.slice(1) : API_PREFIX
    
    const response = await fetch(`${baseUrl}/${apiPath}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.code === "200" && result.data) {
      return result.data.reduce((map, item) => {
        map[item.configKey] = item.configValue
        return map
      }, {})
    }
    return null
  } catch (error) {
    console.error('Failed to fetch site config:', error)
    return null
  }
}

// 设置文档头部信息
const setDocumentHead = (config) => {
  // 设置标题
  if (config.site_name) {
    document.title = config.site_name
  }
  
  // 设置favicon
  const favicon = document.querySelector("link[rel='icon']") || document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = config.site_logo || defaultConfig.site_logo
  document.head.appendChild(favicon)
  
  // 设置meta标签
  const setMetaTag = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = name
      document.head.appendChild(tag)
    }
    tag.content = content || ''
  }
  
  setMetaTag('description', config.site_description)
  setMetaTag('keywords', config.site_keywords)
  
  // 设置背景图（可选）
  if (config.site_background) {
    document.body.style.backgroundImage = `url(${config.site_background})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundAttachment = 'fixed'
  }
}

// 初始化应用
const initApp = async () => {
  // 获取站点配置
  const siteConfig = await fetchSiteConfig() || defaultConfig
  
  // 设置全局配置
  app.config.globalProperties.$siteConfig = siteConfig
  
  // 设置文档头部信息
  setDocumentHead(siteConfig)
  
  // 注册全局组件
  app.component('svg-icon', SvgIcon)
  app.component("sy-pagination", pagination)
  app.component("sy-empty", empty)
  
  // 注册指令
  app.directive('click-outside', clickOutside)
  app.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach((block) => {
      // hljs.highlightBlock(block)
    })
  })
  
  // 注册插件
  app.use(router)
  app.use(store)
  app.use(plugins)
  app.use(VueViewer)
  app.use(VueLazyLoad, {
    preLoad: 1,
    loading: 'https://img.shiyit.com/20240123_1705973123698.gif',
    error: 'https://img.shiyit.com/20240123_1705973581037.png',
    attempt: 1
  })
  app.use(Loading)
  
  // 全局设置
  app.config.globalProperties.$setting = defaultSetting
  
  // 注册Element Plus图标
  for (const key in components) {
    const componentConfig = components[key]
    app.component(componentConfig.name, componentConfig)
  }
  
  // 注册Naive UI
  const naive = create({
    components: [NButton, NTag, NAvatar]
  })
  app.use(naive)
  
  // 挂载应用
  app.mount('#app')
}

// 启动应用
initApp().catch(error => {
  console.error('Application initialization failed:', error)
})