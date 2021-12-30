import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
  path: "/login",
  name: 'login',
  component: () => import("@/views/login")
  },
   {
     path: "/",
     component: () => import("@/views/layout"),
     children: [{
       path: "",
       name: 'home',
       component: () => import("@/views/home/index.vue")
      }, {
       path: "/qa",
       name: 'qa',
       component: () => import("@/views/qa/index.vue")
      }, {
       path: "/vedio",
       name: 'vedio',
       component: () => import("@/views/vedio/index.vue")
      }, {
       path: "/my",
       name: 'my',
       component: () => import("@/views/my/index.vue")
      }, ]
   },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
