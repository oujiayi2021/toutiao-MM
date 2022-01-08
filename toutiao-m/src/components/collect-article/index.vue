<template>
  <van-button
  class="btn1"
    :class="{btn:value}"
    :icon="value ? 'star' : 'star-o'"
    size="small"
    @click="onColect"
    :loading="loading"
  ></van-button>
</template>

<script>
import {addCollect,deleteCollect} from '@/api/article.js'
export default {
  name: "CollectArticle",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    articleid:{
        type:[Number,String,Object],
        required:true
    }
    },
    data() {
        return {
            loading:false
        };
    },
  methods:{
     async onColect(){
         this.loading=true
        try {
            if(this.value){
                //已收藏，取消收藏
                await deleteCollect(this.articleid)
            }else{
                //没有收藏，添加收藏
                await addCollect(this.articleid)
            }
            this.$emit('input',!this.value)
            this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
        } catch (error) {
            this.$toast('收藏失败，请请重试')
        }
         this.loading=false
      }
  },
  created(){
    //   setTimeout(()=>{
    //       this.onColect()
    //   },1000)
  }
};
</script>

<style lang="less" scoped>
.btn {
  border: none;
    .van-icon {
      color: #ffa500;
      font-size: 20px;
    }
}
.btn1{
    border: none;
    font-size: 18px;
}
</style>
