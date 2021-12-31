<template>
  <div class="article-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
    >
  <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />
</van-list>
  </div>
</template>

<script>
import {getArticles} from '@/api/article.js'

export default {
    name:"Articlelist",
    props:{
        channel:{
            type:Object,
            required:true
        }
    },
    data() {
        return {
            list: [], //储存列表数据
            loading: false,  //控制加载中的loading状态
            finished: false,  //控制数据加载结束的状态
            timestamp:null, //请求获取下一页数据的时间戳
            error:false  //控制列表请求失败的提示状态
        };
    },
     methods: {
         //初始化或页面滚动到底部的时候会触发
    //     onLoad() {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 本次加载状态结束之后要把加载状态设置为结束
    //     // loading关闭以后才能触发下一次的加载更多
    //     this.loading = false;

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //         //如果没有数据了，把finished设置为true,之后不再触发加载更多
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },
      async  onLoad() {
         try {
             //1.请求获取数据
             const {data}=await getArticles({  //将包含服务器需要传递的置顶参数发送给服务器，服务器会返回数据
                 channel_id:this.channel.id, //频道ID
                 timestamp:this.timestamp || Date.now(),  //时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳(页码)
                                                        //用于请求之后页码数据的时间戳会在当前请求结果中返回给你
                 with_top :1   // 是否包含置顶
             })
             //数组的展开操作符，它会把数组元素一个一个的拿出来
             //2.把请求结果放到list数组中
             const {results}=data.data
             this.list.push(...results)
             //3.本次数据加载结束后要把加载状态设置为结束
            this.loading=false
             //4.判断数据是否加载完成
             if(results.length){
                 //更新获取下一页数据的时间戳
                 this.timestamp=data.data.pre_timestamp
             }else{
                 //没有数据了把finished设置为true，不再load加载更多
                 this.finished=true
             }
         } catch (error) {
             //展示错误提示状态
             this.error=true
             this.loading=false
         }
    },
  },
}
</script>

<style>

</style>