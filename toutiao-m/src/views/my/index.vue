<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
         <div class="left">
           <van-image
            :src="userinfo.photo"
            class="avatar"
            round
            fit="cover"
          />
          <span class="name">{{userinfo.name}}</span>
         </div>
         <div class="right">
           <van-button size="mini" round to="/user/profile">编辑资料</van-button>
         </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userinfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
         <div class="data-item">
          <span class="count">{{userinfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
         <div class="data-item">
          <span class="count">{{userinfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
         <div class="data-item">
          <span class="count">{{userinfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 已登录头部 -->


    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push({
        name:'login',
        query:{
          redirect:'/my'
        }
      })">
        <img class="mobile-image" src="~@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 未登录头部 -->


    <!-- 宫格导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
    <van-grid-item class="grid-item" to="/collection">
      <i slot="icon" class="toutiao icon-shoucang"></i>
      <span slot="text" class="text">收藏</span>
    </van-grid-item>
      <van-grid-item class="grid-item" to="/history">
      <i slot="icon" class="toutiao icon-lishi"></i>
      <span slot="text" class="text">历史</span>
    </van-grid-item>
</van-grid>
<van-cell title="消息通知" is-link />
<van-cell class="mb-9" title="小智同学" is-link @click="totoChat"/>
<van-cell v-if="user" class="logout-cell" title="退出登录" @click="onLogout" clickable/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getUserinfo} from '@/api/user.js'
export default {
    name:'MyIndex',
    data() {
      return {
        userinfo:{} //用户信息
      };
    },
    computed:{
      ...mapState(['user'])
    },
    methods:{
      onLogout(){
        //退出登录提示
        //在组件中需要使用this.$dialog来调用弹窗组件
       this.$dialog.confirm({
          title: '确认退出吗？',
        })
          .then(() => {
            //确认退出，清除登录状态（本地容器和本地存储中的user数据）
            this.$store.commit('setUser',null)
          })
          .catch(() => {
            // on cancel
          })
      },
     async loadUserInfo(){
        try {
          const {data}=await getUserinfo()
          this.userinfo=data.data
        } catch (error) {
          this.$toast('获取用户信息失败，请稍后重试')
        }
      },
      totoChat(){
        this.$router.push("./user-chat")
      }
    },
    created(){
      //如果用户登录了则请求加载用户信息数据
      if(this.user){
         this.loadUserInfo()
      }
    }
}
</script>

<style lang="less" scoped>
.my-container{
  .header{
    height: 200px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login{
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .mobile-image{
      width: 72px;
      height: 72px;
      margin-bottom: 10px;
    }
    .text{
      font-size: 16px;
      color: #fff;
    }
  }
  .user-info{
    .base-info{
      height: 131px;
      padding: 40px 15px 13px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        display: flex;
        align-items: center;
        .avatar{
          width: 72px;
          height: 72px;
          margin-right: 13px;
          border: 2px solid #fff;
        }
        .name{
          font-size: 16px;
          color: #fff;
        }
      }
    }
    .data-stats{
      display: flex;
      .data-item{
        flex: 1;
        height: 81px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        .count{
          font-size: 18px;
        }
        .text{
          font-size: 14px;
        }
      }
    }
  }
  .grid-nav{
    margin-bottom: 3px;
    .grid-item{
      height: 71px;
      i.toutiao{
        font-size: 30px;
      }
      .icon-shoucang{
        color: #eb5253;
      }
      .icon-lishi{
        color: #ff9d1d;
      }
      span.text{
        font-size: 18px;
      }
    }
  }
  .logout-cell{
    margin-top: 3px;
    text-align: center;
    color: red;
  }
}
</style>>
