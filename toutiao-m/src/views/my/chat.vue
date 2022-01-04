<template>
  <div class="container">
    <van-nav-bar
      class="page-nav-bar"
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>
    <!-- 聊天内容区域（列表）一对一单聊 -->
    <div class="chat-list" ref="chatList">
      <div
        class="chat-item"
        :class="{ left: item.name === 'xz', right: item.name === 'my' }"
        v-for="(item, i) in list"
        :key="i"
      >
        <van-image v-if="item.name === 'xz'" fit="cover" round :src="xz" />
        <div class="chat-pao">{{ item.msg }}</div>
        <van-image
          v-if="item.name === 'my'"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
    </div>
    <!-- 发送聊天内容 -->
    <div class="reply-container van-hairline--top">
      <van-field
        @keyup.enter="send()"
        v-model="value"
        placeholder="说点什么..."
      >
        <span @click="send()" slot="button" style="font-size: 12px; color: #999"
          >提交</span
        >
      </van-field>
    </div>
  </div>
</template>

<script>
import xz from "@/assets/3.png";
// 导入socket.io
import io from "socket.io-client";
export default {
  name: "user-chat",
  data() {
    return {
      // 聊天发送的内容
      value: "",
      // 小智头像
      xz,
      // 聊天内容列表
      list: [
        // { name: 'xz', msg: '你好！137同学' },
        // { name: 'my', msg: '你好！小智' },
        // { name: 'xz', msg: '很高兴认识你' },
        // { name: 'my', msg: 'nice meet you!' }
      ],
      // ws/socket 实例
      socket: null,
    };
  },
  created() {
    this.initSocket();
  },
  methods: {
    // 初始化socket.io
    initSocket() {
      // 1. 初始化创建socket连接实例
      this.socket = io("http://geek.itheima.net", {
        query: {
          token: this.$store.state.user.token,
        },
        transports: ["websocket"],
      });
      // 2. 连接成功=》测试
      this.socket.on("connect", () => {
        // 小智主动问候
        this.list.push({ name: "xz", msg: "你好！同学" });
      });

      // 3. 接收服务器发的消息
      this.socket.on("message", (data) => {
        // console.log("接收服务器发的消息:", data);
        this.list.push({ name: "xz", msg: data.msg });
        this.scrollBottom();
      });
    },
    // 发送聊天内容（一问一答形式）
    send() {
      // 客户端向服务器发消息
      this.socket.emit("message", { msg: this.value, timestamp: Date.now() });
      this.list.push({ name: "my", msg: this.value });
      this.value = "";
    },
    // 滚动列表到底部
    scrollBottom() {
      //  等list列表渲染完，执行滚动
      this.$nextTick(() => {
        const listDom = this.$refs.chatList;
        listDom.scrollTop = listDom.scrollHeight;
      });
    },
  },
  destroyed() {
    // 关闭ws连接
    this.socket.close();
  },
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
