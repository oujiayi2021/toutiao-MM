<template>
  <div class="article-comment">
    <van-sticky offset-top="11.73333vw">
      <div class="title van-hairline--bottom">
        <span>全部评论 ({{ source.comm_count }})</span>
        <span>{{ source.like_count }} 点赞</span>
      </div>
    </van-sticky>
    <!-- 评论列表 -->
    <div class="list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有评论了"
        @load="onLoad"
        :immediate-check="false"
      >
        <div
          class="item van-hairline--bottom"
          v-for="(item, index) in list"
          :key="index"
        >
          <van-image round width="10vw" height="10vw" :src="item.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{ item.aut_name }}</span>
              <van-button 
              class="zan1" 
              :class="{liked:item.is_liking}"
              :icon="item.is_liking ? 'good-job' : 'good-job-o'"
              @click="onLike(item.com_id,index)"
              :loading="commentLoading"
              >{{item.like_count || '赞'}}</van-button>
            </p>
            <p class="cont">{{ item.content }}</p>
            <p>
              <span class="reply"
                >{{ item.reply_count }}回复
                <i class="van-icon van-icon-arrow"></i
              ></span>
              <span class="time">{{ item.pubdate}}</span>
            </p>
          </div>
        </div>
      </van-list>
       <!-- 底部工具 -->
        <div class="footer van-hairline--top">
          <div class="input" @click="showInput = true">
            <i class="van-icon van-icon-edit">发表评论</i>
          </div>
          <div class="btn">
            <span class="toutiao icon-pinglun"></span>
            <i>0</i>
          </div>
          <div class="btn">
            <span class="toutiao icon-a-dianzan2"></span>
          </div>
            <CollectArticle v-model="source.is_collected" :articleid="source.art_id"></CollectArticle>
          <!-- <div class="btn">
        <span class="toutiao icon-shoucang"></span>
        <p>收藏</p>
      </div> -->
          <div class="btn">
            <span class="toutiao icon-a-fenxiang1"></span>
          </div>
        </div>
    </div>

 
     <!-- 评论&回复 -->
    <van-popup v-model="showInput" position="bottom">
      <van-nav-bar left-arrow @click-left="showInput=false" @click-right="AddComments" title="评论文章" right-text="发表" />
      <van-field
        v-model="text"
        rows="3"
        autosize
        type="textarea"
        maxlength="100"
        placeholder="请输入评论"
        show-word-limit
      />
    </van-popup>
  </div>
</template>
<script>
import { getComments,addComments,addCommentLike,deleteCommentLike } from "@/api/article.js";
import CollectArticle from '@/components/collect-article/index.vue'
export default {
  name: "ArticleComment",
  components:{
    CollectArticle
  },
  props: {
    source: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      showInput: false,
      text:'',
      commentLoading:false,
    };
  },
  methods: {
    async onLoad() {
      //1.请求获取数据
      try {
        const { data } = await getComments({
          type: "a", //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.art_id, //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });
        //2.将数据添加到列表中
        // console.log(data);
        const { results } = data.data;
        this.list.push(...results);
        // console.log(this.list);
        //3.将loading设置为false
        this.loading = false;
        //4.判断是否还有数据
        if (results.length) {
          this.offset = data.data.last_id;
        } else {
          //有就更新获取下一页数据的页码
          //没有就讲finished设置结束
          this.finished = true;
        }
      } catch (error) {
        this.$toast('操作失败，请稍后重试')
      }
    },
   async onLike(id,index){
     this.commentLoading=true
    try {
      if(this.list[index].is_liking){
        //已赞就取消点在
      await deleteCommentLike(id)
      this.list[index].like_count--
      }else{
        //没有点赞添加点赞
      await addCommentLike(id)
      this.list[index].like_count++
      }
      this.list[index].is_liking=!this.list[index].is_liking
    } catch (error) {
      this.$toast('操作失败请重试')
      console.log(this.list.com_id)
    }
     this.commentLoading=false
    },
  async AddComments (){
      try {
        const {data}=await addComments({
          target:this.source.art_id,    //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content:this.text,    //	评论内容	
          art_id:null              //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。	
        })
        // console.log(data);
        this.text=''
        this.showInput=false
        this.list.unshift(data.data.new_obj)
      } catch (error) {
        this.$toast('发布失败，请重试')
      }
    }
  },
  created() {
    setTimeout(() => {
      this.onLoad();
      console.clear()
    }, 1000);
  },
};
</script>
<style scoped lang="less">
.article-comment {
  .title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background: #fff;
    span {
      font-size: 16px;
      &:last-child {
        color: #ccc;
        font-size: 14px;
      }
    }
  }
  .list {
    padding: 0 16px;
    .item {
      display: flex;
      padding: 10px 0;
      .info {
        padding-left: 10px;
        flex: 1;
        p {
          margin: 0;
          .name {
            font-size: 16px;
          }
          .zan1 {
            font-size: 14px;
            float: right;
            color: #999;
            border: none;
          }
          .liked{
            color: #e5645f;
          }
          &.cont {
            font-size: 14px;
            color: #666;
            padding: 10px 0;
            word-break: break-all;
            padding-right: 40px;
          }
          .reply {
            min-width: 60px;
            height: 24px;
            text-align: center;
            line-height: 28px;
            font-size: 12px;
            display: inline-block;
            border-radius: 14px;
            color: #666;
            .van-icon {
              font-size: 18px;
              position: relative;
              top: 1px;
            }
          }
          .time {
            font-size: 12px;
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 50px;
    background: #fff;
    display: flex;
    width: 100%;
    align-items: center;
    .input {
      margin-left: 10px;
      width: 200px;
      height: 34px;
      font-size: 18px;
      border-radius: 17px;
      line-height: 36px;
      padding-left: 10px;
      .van-icon {
        color: #999;
      }
    }
    .btn {
      flex: 1;
      text-align: center;
      position: relative;
    .btn span{
        font-size: 16px;
      }
      p {
        margin: 0;
        font-size: 10px;
      }
      .toutiao {
        font-size: 18px;
      }
      i {
        height: 16px;
        min-width: 16px;
        padding: 0 3px;
        
        color: #fff;
        font-size: 10px;
        position: absolute;
        right: 0;
        top: -4px;
        line-height: 16px;
        border-radius: 8px;
        font-style: normal;
      }
    }
  }
}
</style>
