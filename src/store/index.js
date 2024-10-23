import {createPinia} from "pinia";
import piniaPluginPersist from 'pinia-plugin-persist'

const store = createPinia()
store.use(piniaPluginPersist) // 使用插件
export function useStore() {
    return store
  }
export default store
