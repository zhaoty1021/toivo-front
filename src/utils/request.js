import axios from 'axios'
import { getToken,removeToken } from '@/utils/cookie'
 import { useUserStore } from "@/store/moudel/user.js";


// let { userInfo,userFlag } = storeToRefs(userStore);
// create an axios instance
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 36000, // request timeout
    withCredentials: true,
})

// request interceptor
service.interceptors.request.use(

    config => {
        //do something before request is sent
        let token = getToken()
        if (token != null) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers.Authorization = token
        }

        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        const userStore = useUserStore();
        
        if (res.code !== 200 && res.code !== "200") {
            if (res.code == 401) {
                removeToken()
                sessionStorage.removeItem("user")
                userStore.setUserInfo(null)
                userStore.setLoginFlag(true)
            }
            
            if (response.config.url !== "/oauth/wechat/is_login") {
                ElMessage({ message: res.message, type: 'error' })
            }

            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            // 修改这里：返回res.data而不是res
            return res.data || res // 兼容没有data字段的情况
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default service