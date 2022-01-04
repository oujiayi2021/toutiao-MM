<template>
  <div class="qa-container">
    <van-nav-bar class="page-nav-bar" title="问答" left-arrow @click-left="onClickLeft" />
    <div>
      <div v-for="a in 8" :key="a" @click="click">
        <div>
          <p>作为IT行业的过来人，你有什么话想对后辈说的？</p>
          <p>赞同 1000+ 评论 500+ 1小时前</p>
        </div>
        <div><img src="http://toutiao.itheima.net/resources/images/58.jpg" alt="" /></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "qaIndex",
  methods: {
    click() {
      Toast.fail({ message: "美女是你想看就能看的吗...", duration: 500 });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.qa-container {
  width: 100%;
  /deep/.van-nav-bar {
    width: 100%;
    position: fixed;
    top: 0;
  }
  .van-nav-bar__content{
    background-color: #3296fa;
  }
  > div:nth-of-type(2) {
    width: 93%;
    margin: 0 auto;
    margin-top: 46px;
    padding-bottom: 60px;
    > div {
      width: 100%;
      height: 85px;
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgb(236, 236, 236);
      > div:nth-of-type(1) {
        width: 53%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        > p:nth-of-type(1) {
          font-size: 15px;
          margin-bottom: 15px;
        }
        > p:nth-of-type(2) {
          font-size: 12px;
          color: rgb(187, 187, 187);
        }
      }
      > div:nth-of-type(2) {
        width: 37%;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>
