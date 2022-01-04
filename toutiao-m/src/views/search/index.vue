<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow=false"
      />
    </form>
    <!-- 顶部搜索栏 -->

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :searchText="searchText"></SearchResult>
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <SearchSuggestion v-else-if="searchText" :searchText="searchText" @search="onSearch"></SearchSuggestion>
    <!-- 联想建议 -->

    <!-- 搜索历史记录 -->
    <!-- <SearchHistory v-else></SearchHistory> -->
    <!-- 搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from "@/views/search/components/search-history.vue";
import SearchSuggestion from "@/views/search/components/search-suggestion";
import SearchResult from "@/views/search/components/search-result.vue";

export default {
  name: "SearchPage",
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false, //控制搜索结果的展示
    };
  },
  methods: {
    onSearch(val) {
        this.searchText=val
       this.isResultShow=true;
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
