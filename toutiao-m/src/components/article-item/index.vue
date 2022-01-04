<template>
    <!-- 根据文章Id点击文章列表内容进入相应文章详情页 -->
     <van-cell class="article-item" :to="`/article/${article.art_id}`">
         <div slot="title" class="title van-multi-ellipsis--l2" >{{article.title}}</div>
         <div slot="label">
             <div v-if="article.cover.type===3" class="cover-wrap">
                 <div class="cover-item" v-for="(img,index) in article.cover.images" :key="index">
                     <van-image
                        fit="cover"
                        :src="img"
                        class="cover-item-img"
                    />
                 </div>
             </div>
             <div class="label-info-wrap">
                 <span>{{article.aut_name}}</span>
                 <span>{{article.comm_count}}评论</span>
                 <span>{{article.pubdate}}</span>
             </div>
         </div>
             <van-image
                v-if="article.cover.type===1"
                class="right-cover"
                slot="default"
                fit="cover"
                :src="article.cover.images[0]"
            /> 
     </van-cell>
</template>

<script>
export default {
    name:'ArticleItem',
    props:{
        article:{
            type:Object,
            required:true,
        }
    }
}
</script>

<style lang="less" scoped>
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