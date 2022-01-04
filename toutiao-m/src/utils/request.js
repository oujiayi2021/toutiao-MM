// 封装axios请求模块

import axios from 'axios'
import store from '@/store/index.js'

const request = axios.create({
    baseURL: 'http://geek.itheima.net', //接口基础路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
    //请求发起会经过这里
    //config配置对象：本次请求的请求配置对象
    const {user} = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config)
    //这里务必要返回config对象，否则请求就会停在这里出不去
    return config
}, function (error) {
    //如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error)
})
export default request