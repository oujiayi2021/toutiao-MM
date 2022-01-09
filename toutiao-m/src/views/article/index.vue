<template>
  <div class="container" @scroll="remPos" ref="box">
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      class="page-nav-bar"
      @click-left="$router.back()"
    />
    <div class="detail">
      <h3 class="title">{{ detail.title }}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="detail.aut_photo"
        />
        <div class="text">
          <p class="name">{{ detail.aut_name }}</p>
          <p class="time">{{ detail.pubdate }}</p>
        </div>
        <van-button
          v-if="detail.is_followed"
          :loading="followLoading"
          round
          @click="onFollow"
          size="small"
          type="primary"
        >
          已关注
        </van-button>
        <van-button
          v-else
          round
          @click="onFollow"
          :loading="followLoading"
          size="small"
          type="info"
        >
          +关注
        </van-button>
      </div>
      <div class="content" v-html="detail.content"></div>
      <div class="zan">
        <!-- 文章评论列表 -->
          <ArticleComment :source="detail" />
      </div>
      
 
    </div>
  </div>
</template>

<script>
/**
 * 记录用户阅读文章滚动位置 => 被缓存文章
 * 1.通过scroll滚动事件存储滚动位置
 * 2.下次回来再回到滚动位置
 */
import { getDetailById } from "@/api/detail.js";
import { addFollow, deleteFollow } from "@/api/user.js";
import ArticleComment from "./components/article-comment.vue";
// import Comment from './components/comment.vue'
export default {
  name: "articleDetail",
  components: {
    ArticleComment,
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      detail: {},
      scrollTop: 0,
      followLoading: false,
    };
  },
  // 组件缓存后会被执行：1. 默认第一次组件创建也会执行 2. 再次进入还会再执行
  activated() {
    // 当前访问文章详情ID和上次访问的文章ID不一样
    if (this.detail.art_id !== this.articleId) {
      this.scrollTop = 0;
      this.getDetail();
    } else {
      this.scrollTop && (this.$refs.box.scrollTop = this.scrollTop);
    }
  },
  methods: {
    remPos(e) {
      this.scrollTop = e.target.scrollTop;
    },
    async getDetail() {
      const { data } = await getDetailById(this.articleId);
      //   console.log(data)
      this.detail = data.data;
    },
    // 关注文章作者或取关
    async onFollow() {
      this.followLoading = true;
      try {
        if (this.detail.is_followed) {
          //已关注就取消关注
          const { data } = await deleteFollow(this.detail.aut_id);
        } else {
          //未关注就添加关注
          const { data } = await addFollow(this.detail.aut_id);
        }
        this.detail.is_followed = !this.detail.is_followed;
      } catch (error) {
        let message = "操作失败，请稍后重试";
        if (error.response && error.response.status === 400) {
          message = "操作失败，无法关注自己";
        }
        this.$toast(message);
      }
      this.followLoading = false;
    },
    // // 对文章表态：attitude -1: 无态度，0-不喜欢，1-点赞（喜欢）=> 3选1
    // // type=> 1 点击了点赞按钮 0 点击了不喜欢按钮
    // async toggleStatus(type) {
    //   try {
    //     if (type === 1) {
    //       if (this.detail.attitude === 1) {
    //         await unLike(this.detail.art_id);
    //         this.detail.attitude = -1;
    //       } else {
    //         await like(this.detail.art_id);
    //         this.detail.attitude = 1;
    //       }
    //     } else {
    //       if (this.detail.attitude === 0) {
    //         await unDisLike(this.detail.art_id);
    //         this.detail.attitude = -1;
    //       } else {
    //         await disLike(this.detail.art_id);
    //         this.detail.attitude = 0;
    //       }
    //     }
    //   } catch (error) {
    //     this.$toast.fail("操作失败！");
    //   }
    // },
  },
  mounted() {
    this.getDetail();
  },
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  // height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      text-align: left;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 16px;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
    /deep/ pre {
      white-space: pre-wrap;
    }
  }
}
</style>
