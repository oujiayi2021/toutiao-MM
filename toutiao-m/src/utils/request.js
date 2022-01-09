// 封装axios请求模块

import axios from 'axios'
import store from '@/store/index.js'
import {Toast} from 'vant'
import router from '@/router/index.js'

const refreshTokenReq = axios.create({
    baseURL: 'http://toutiao.itheima.net',
})

const request = axios.create({
    baseURL: 'http://toutiao.itheima.net', //接口基础路径
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

//响应拦截器
request.interceptors.response.use(function(response) {
    //响应成功进入这里
    return response
},async function (error) {
    //请求响应失败进入这里（超过200的状态返回响应码）
    const status = error.response.status
    console.log(error);
    if (status === 400) {
        //请求参数错误
        Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
        //token无效
        //1.如果没有user或user.token，直接登录
        const {user} = store.state
        if (!user || !user.token) {
            //直接跳转到登录页
            return redirectLogin()
        }
        //2.如果有refresh_token，则请求获取新的token
        try {
            const {data}= await refreshTokenReq({
                method: 'PUT',
                url: '/v1_0/authorizations',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })
            user.token = data.data.token
            store.commit('setUser', user)
            //error.config是本次请求的相关配置信息对象
            //这里使用request发送请求，它会走自己的拦截器
            //它的请求
            return request(error.config)
        } catch (error) {
            //刷新tkoen失败
            return redirectLogin()
        }
        //3.拿到新的token之后把它更新到容器中
        //把失败的请求重新发出去
    } else if (status === 403) {
        //没有权限操作

    } else if (status >= 500) {
        //服Toast.fail('没有权限操作')务端异常
        Toast.fail('服务端异常')
    }
    //抛出异常
    return Promise.reject(error)
})

function redirectLogin() {
    router.replace({
        name: 'login',
        //传递查询参数，查询参数会以？作为分隔符放到url
        query: {
            //数据名随便起
            redirect: router.currentRoute.fullPath //router.currentRoute和我们再组件中获取的this.$route是同样的
        }
    })
}

export default request