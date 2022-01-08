<template>
  <div class="collection-container">
    <van-nav-bar
      fixed
      title="我的收藏"
      left-arrow
      class="page-nav-bar"
      @click-left="$router.back()"
    />
    <van-empty v-if="flag" description="暂无数据" />
     <van-cell v-for="(item,index) in list"  class="article-item" :key="index" :to="`/article/${list[index].art_id}`">
         <div slot="title" class="title van-multi-ellipsis--l2" >{{list[index].title}}</div>
         <div slot="label">
             <div v-if="list[index].cover.type===3" class="cover-wrap">
                 <div class="cover-item" v-for="(img,index) in list[index].cover.images" :key="index">
                     <van-image
                        fit="cover"
                        :src="img"
                        class="cover-item-img"
                    />
                 </div>
             </div>
             <div class="label-info-wrap">
                 <span>{{list[index].aut_name}}</span>
                 <span>{{list[index].comm_count}}评论</span>
                 <span>{{list[index].pubdate}}</span>
             </div>
         </div>
             <van-image
                v-if="list[index].cover.type===1"
                class="right-cover"
                slot="default"
                fit="cover"
                :src="list.cover.images[0]"
            /> 
     </van-cell>
  </div>
</template>

<script>
import {getCollection} from '@/api/article.js'
export default {
  name: "collection",
  data() {
    return {
      list: [],
      page:1,
      per_page:10,
      flag:true
    };
  },
  methods: {
    async  getCollect(){
        try {
            const {data} =await getCollection({
                page:this.page,
                per_page:this.per_page
            })
            data.data.results.forEach(element => {
                this.list.push(element)
            });
            if(this.list.length>=1){
                this.flag=false
            }else{
                this.flag=true
            }
        } catch (error) {
            this.$toast('数据获取失败，请稍后重试')
        }
      },
  },
  mounted(){
     this.getCollect()
  }
};
</script>

<style lang="less" scoped>
.collection-container{
    margin-top: 46px;
}
    .article-item{
    .title{
        font-size: 16px;
        color: #3a3a3a;
    }
    .van-cell__value{
        flex: unset;
        width: 110px;
        height: 72px;
        padding-left: 10px;
    }
    .right-cover{
        width: 110px;
        height: 72px;
    }
    .label-info-wrap span{
        color: #b4b4b4;
        margin-right: 10px;
        font-size: 12px;

    }
    .cover-wrap{
        display: flex;
        .cover-item{
            flex: 1;
            height: 72px;
            &:not(:last-child){
                padding-right: 4px;
            }
        }
        .cover-item-img{
            width: 100%;
            height: 72px;
        }
    }
}
</style>
