<template>
  <div class="updata-name">
    <!-- 头部导航栏 -->
    <van-nav-bar
      fixed
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- 头部导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- v-model.trim防止用户输入空格 -->
    <!-- 输入框 -->
  </div>
</template>

<script>
import {updateUserProfile} from '@/api/user.js'
export default {
  name: "UpdateName",
  props:{
    value:{
      type:String,
      required:true
    }
  },
  data() {
    return {
      localName: this.value,
    };
  },
  methods:{
   async onConfirm(){
     this.$toast.loading({
       message:'保存中...',
       forbidClick:true,  //禁止背景点击
       duration:0
     })
     try {
       const localName=this.localName
       if(!localName.length){
         this.$toast('昵称不能为空')
         return
       }
      await updateUserProfile({
         name:localName
       })
      //console.log(data);
      //更新视图
      this.$emit('input',localName)
      //关闭弹层
      this.$emit('close')
      //提示成功
       this.$toast.success('昵称修改成功')
     } catch (error) {
       this.$toast('昵称更新失败')
     }
    }
  }
};
</script>

<style lang="less" scoped>
.updata-name {
  padding-top: 45px;
  .field-wrap{
    padding: 10px;
  }
}
</style>
