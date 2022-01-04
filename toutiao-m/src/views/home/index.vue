<template>
  <div class="home-container">
    <!-- 头部搜索 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        type="info"
        size="small"
        round
        icon="search"
        slot="title"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- 头部搜索 -->

    <!-- 频道列表 -->
    <van-tabs class="channel-tab" v-model="active" animated swipeable>
      <van-tab v-for="item in channels" :title="item.name" :key="item.id">
        <!-- 文章列表 -->
        <Articlelist :channel="item" />
        <!-- 文章列表 -->
      </van-tab>
      <!-- 占位元素 -->
      <div slot="nav-right" class="placegolder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- 频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user.js";
import Articlelist from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage.js";
export default {
  name: "homeIndex",
  components: {
    Articlelist,
    ChannelEdit,
  },
  data() {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadChannels();
  },
  methods: {
    async loadChannels() {
      try {
        let channels = [];
        //判断用户是否登录
        if (this.user) {
          //已登录，请求获取用户频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          //未登录，判断是否有本地频道列表存储数据
          const localChannels = getItem("TOUTIAO_CHANNELS");
          // 如果有，拿来使用
          if (localChannels) {
            channels = localChannels;
          } else {
            //如果没有，请求获取所有频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }
        this.channels = channels;
      } catch (error) {
        this.$toast("获取用户频道失败");
      }
    },
    showPopup() {
      this.show = true;
    },
    onUpdateActive(index, isChennelEditShow = true) {
      //更新激活的频道项
      this.active = index;
      //关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 88px;
  padding-bottom: 60px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 275px;
    height: 34px;
    background-color: #5babfb;
    border: none;
    font-size: 16px;
  }
  /deep/ .channel-tab {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 110px;
    }
    .van-tabs__wrap {
      height: 40px;
      font-size: 20px;
      color: #777777;
      position: fixed;
      top: 46px;
      z-index: 2;
      left: 0;
      right: 0;
    }
    .van-tabs--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 21px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 4px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 30px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 23px;
      }
    }
    .placegolder {
      flex-shrink: 0;
      width: 30px;
      height: 40px;
    }
  }
}
</style>
>
