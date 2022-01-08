<template>
  <div class="history">
    <van-nav-bar
      fixed
      title="我的历史"
      left-arrow
      class="page-nav-bar"
      @click-left="$router.back()"
    />
    <van-empty v-if="flag" description="暂无数据" />
    <van-cell
      v-for="(item, index) in list"
      class="article-item"
      :key="index"
      :to="`/article/${list[index].art_id}`"
    >
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ list[index].title }}
      </div>
      <div slot="label">
        <div v-if="list[index].cover.type === 3" class="cover-wrap">
          <div
            class="cover-item"
            v-for="(img, index) in list[index].cover.images"
            :key="index"
          >
            <van-image fit="cover" :src="img" class="cover-item-img" />
          </div>
        </div>
        <div class="label-info-wrap">
          <span>{{ list[index].aut_name }}</span>
          <span>{{ list[index].comm_count }}评论</span>
          <span>{{ list[index].pubdate }}</span>
        </div>
      </div>
      <van-image
        v-if="list[index].cover.type === 1"
        class="right-cover"
        slot="default"
        fit="cover"
        :src="list.cover.images[0]"
      />
    </van-cell>
  </div>
</template>

<script>
import { getHistory } from "@/api/article.js";
export default {
  name: "History",
  data() {
    return {
      list: [],
      page: 1,
      per_page: 10,
      flag: true,
    };
  },
  methods: {
    async gethistory() {
      try {
        const { data } = await getHistory({
          page: this.page,
          per_page: this.per_page,
        });
        data.data.results.forEach((element) => {
          this.list.push(element);
        });
        if (this.list.length >= 1) {
          this.flag = false;
        } else {
          this.flag = true;
        }
      } catch (error) {
        this.$toast("数据获取失败，请稍后重试");
      }
    },
  },
   mounted(){
     this.gethistory()
  }
};
</script>

<style lang="less" scoped>
.history {
  padding-top: 45px;
}
</style>
