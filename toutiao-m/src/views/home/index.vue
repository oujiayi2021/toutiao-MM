<template>
  <div class="home-container">
    <!-- 头部搜索 -->
    <van-nav-bar class="page-nav-bar">
        <van-button
          class="search-btn"
          type="info"
          size="small"
          round
          icon="search"
          slot="title">
          搜索
        </van-button>
    </van-nav-bar>
    <!-- 头部搜索 -->

    <!-- 频道列表 -->
  <van-tabs class="channel-tab" v-model="active" animated swipeable>
    <van-tab v-for="item in channels" :title="item.name" :key="item.id">
      <!-- 文章列表 -->
      <Articlelist :channel="item"/>
      <!-- 文章列表 -->
    </van-tab>
    <div slot="nav-right" class="placegolder"></div> //站位元素
    <div slot="nav-right" class="hamburger-btn">
      <i class="toutiao icon-gengduo"></i>
    </div>
  </van-tabs>
  <!-- 频道列表 -->
  </div>
</template>

<script>
import {getUserChannels} from '@/api/user.js'
import Articlelist from './components/article-list.vue'
export default {
    name:'homeIndex',
    components:{
      Articlelist
    },
    data() {
      return {
        active:0,
        channels:[]
      };
    },
    created(){
      this.loadChannels()
    },
    methods:{
    async loadChannels(){
        try {
          const { data }= await getUserChannels()
          this.channels=data.data.channels
        } catch (error) {
          this.$toast('获取用户频道失败')
        }
      }
    }
}
</script>

<style lang="less" scoped>
.home-container{
    padding-bottom: 80px;
 /deep/ .van-nav-bar__title{
    max-width: unset;
  }
    .search-btn{
        width: 275px;
        height: 34px;
        background-color: #5babfb;
        border: none;
        font-size: 16px;
  }
 /deep/ .channel-tab{
    .van-tab{
      border-right: 1px solid #edeff3;
      min-width: 110px;
    }
    .van-tabs__wrap{
      height: 40px;
      font-size: 20px;
      color: #777777;
    }
    .van-tabs--active{
      color: #333333;
    }
    .van-tabs__nav{
      padding-bottom: 0;
    }
    .van-tabs__line{
      width: 21px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 4px;
    }
    .hamburger-btn{
      position: fixed;
      right: 0;
      width: 30px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao{
        font-size: 23px;
      }
    }
    .placegolder{
      flex-shrink: 0;
      width: 30px;
      height: 40px;
    }
  }
}

</style>>
