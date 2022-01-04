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
        :immediate-check="true"
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
              <span class="zan"
                >{{ item.like_count }}
                <geek-icon :name="item.is_liking ? 'like-sel' : 'like2'" />
              </span>
            </p>
            <p class="cont">{{ item.content }}</p>
            <p>
              <span class="reply"
                >{{ item.reply_count }}回复
                <i class="van-icon van-icon-arrow"></i
              ></span>
              <span class="time">{{ item.pubdate | relativeTime }}</span>
            </p>
          </div>
        </div>
      </van-list>
    </div>

    <!-- 底部工具 -->
    <div class="footer van-hairline--top">
      <div class="input" @click="showInput=true"><i class="van-icon van-icon-edit"></i></div>
      <div class="btn">
        <span class="toutiao icon-pinglun"></span>
        <p>评论</p>
        <i>0</i>
      </div>
      <div class="btn">
        <span class="toutiao icon-a-dianzan2"></span>
        <p>点赞</p>
      </div>
      <div class="btn">
        <span class="toutiao icon-shoucang"></span>
        <p>收藏</p>
      </div>
      <div class="btn">
        <span class="toutiao icon-a-fenxiang1"></span>
        <p>分享</p>
      </div>
    </div>
     <!-- 评论&回复 -->
    <van-popup v-model="showInput" position="bottom">
      <van-nav-bar left-arrow @click-left="showInput=false" title="评论文章" right-text="发表" />
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
import { getComments } from "@/api/article.js";
export default {
  name: "ArticleComment",
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
      text:''
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
      } catch (error) {}
    },
  },
  created() {
    setTimeout(() => {
      this.onLoad();
    }, 2000);
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
          .zan {
            font-size: 14px;
            float: right;
            color: #999;
            .geek-icon {
              font-size: 12px;
              position: relative;
              top: -1px;
            }
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
