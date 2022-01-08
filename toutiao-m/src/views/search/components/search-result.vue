<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，点击重试"
      @load="onLoad"
    >
      <van-cell v-for="(article,index) in list" :key="index" :title="article.title" :to="`/article/${list[index].art_id}`"/>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search.js";
export default {
  name: "SearchResult",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page:1,
      per_page:10,
      error:false
    };
  },
  props:{
    searchText:{
      type:String,
      required:true
    }
  },
  methods: {
   async onLoad() {
      // 1.请求获取数据
      try {
        const {data} =await getSearchResult({
          page:this.page,  //页码
          per_page:this.per_page,  //每页几条数据
          q:this.searchText  //查询关键字
        })
        //2.将数据添加到列表数组中
        const {results}=data.data
        this.list.push(...results)
        //3.将本次加载中的loading关闭
        this.loading=false
        // 4.判断是否还有数据
        if(results.length){
          //  如果有，则更新下一页数据
          this.page++
        }else{
            //  如果没有，则将加载状态finished设置为结束
            this.finished=true
        }
      } catch (error) {
        this.error=true
        this.loading=false
        this.$toast('搜索结果数据获取失败，请稍后重试')
      }
    },
  },
};
</script>

<style></style>
