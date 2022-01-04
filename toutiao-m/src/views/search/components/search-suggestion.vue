<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in Suggestions"
      :key="index"
      @click="$emit('search',text)"
    >
    <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search.js";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      Suggestions: [], //联想建议数据列表

    };
  },
  watch: {
    searchText: {
      //当searchText发生变化就会触发调佣handler函数
      //handler函数名是固定的
      //使用debounde函数来达成用户输入后延迟一秒再调用发请求函数，以免每次用户输入一个字符就发送一次请求
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value);
      }, 1000),
      immediate: true, //该回调将会在侦听开始之后被立即执行
    },
  },
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q);
        this.Suggestions = data.data.options;
      } catch (error) {
        this.$toast("联想建议数据获取失败");
      }
    },
    highlight(text){
      const highlightStr=`<span class="active">${this.searchText}</span>`
      //如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
      //RegExp正则表达式构造函数：
      //   1.参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //  2.参数2：匹配模式，要写到字符串中
      const reg=new RegExp(this.searchText,'gi')
      return text.replace(reg,highlightStr)
    }
  },
};
</script>

<style lang="less" scoped>
.search-suggestion{
 /deep/ span.active{
    color: #3296fa;
  }
}
</style>
