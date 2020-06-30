import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import axios from 'axios'
import echarts from "echarts"
import Vuecookies from 'vue-cookies'
import { MessageBox } from 'element-ui'

Vue.config.productionTip = false

//配置请求的根路径
axios.defaults.baseURL = 'http://10.0.10.246:8092' 
// 请求拦截器，使拥有获取数据的权限,token验证
axios.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = Vuecookies.get('token');
    return config
})

// 拦截器 验证token是否过期
axios.interceptors.response.use(
    response=>{
        console.log(response.data)
        if(response.data.meta.status===500){
            window.sessionStorage.clear();
            MessageBox.alert('登录信息超时，请重新登录，正在跳转至登录页面')
            // 重定向到登录页
            setTimeout(
                "parent.location.href='/Login'",2000
            )
            
        }
        return response
    }
)

// 页面共享session值
var constant={
    SESSION_FLAG:'',
    SESSION_ID:'',
}
// 1.  触发标志位改变事件
window.localStorage.setItem(constant.SESSION_FLAG, Date.now().toString())
window.addEventListener("storage", function(event){
    if(!event.newValue){
        return;
    }
    // 2. 监听标志位改变事件
    if(event.key === constant.SESSION_FLAG){
    // 3. 触发传递信息的改变事件
        localStorage.setItem("storeSessionData", sessionStorage.getItem(constant.SESSION_ID))
        localStorage.removeItem("storeSessionData")
    } else if (event.key === 'storeSessionData') { // 4. 监听 传递信息 的改变事件
        sessionStorage.setItem(constant.SESSION_ID, event.newValue)
    }
})

Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
