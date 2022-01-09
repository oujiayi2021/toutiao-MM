import Vue from 'vue'
import Vuex from 'vuex'
import {getItem,setItem} from '@/utils/storage.js'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    //一个对象，用于存储当前登录用户信息（token等数据）
    user: getItem(TOKEN_KEY) ,//将储存到本地的TOKEN信息（字符串）转化还原成对象

    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      
      //为了防止刷新丢失，需要把数据备份到本地存储
      setItem(TOKEN_KEY,state.user)
    },
    //添加缓存页面
    addCachePage(state,pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)    //缓存里没有这个名字的页面就添加
      }
    },
    //移除缓存页
    removeCachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index!=-1) {
        state.cachePages.splice(index,1)  //如果缓存里有这个名字就移除
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
