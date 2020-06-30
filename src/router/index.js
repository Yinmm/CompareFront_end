import Vue from 'vue'
import VueRouter from 'vue-router'
import Report from '../components/Report.vue'
import CompareReport from '../components/CompareReport.vue'
import CompareReportTest from '../components/CompareReportTest.vue'
import upload from '../components/upload.vue'
import login from '../components/login.vue'
import Vuecookies from 'vue-cookies'

Vue.use(VueRouter)

  const routes = [
  {
      path: '/',
      redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/Report',
    component: Report
  },
  {
    path: '/Compare',
    component: CompareReport
  },
  {
    path: '/CompareTest',
    component: CompareReportTest
  },
  {
    path: '/upload',
    component: upload
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //     //to 将要访问的路劲
  //     //from 代表从哪个路径跳转出来
  //     //next 是一个行数，表示放行
  //     //  next（）放行   next('/login') 强制跳转
      if (to.path == '/login') return next();
  //     //获取token值
      const tokenStr = Vuecookies.get('token');
      if (!tokenStr) return next('/login')
      next()
  })
  

export default router
