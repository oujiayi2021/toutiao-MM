<template>
  <div class="update-sex">
    <van-picker
      title="性别"
      :default-index="value"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user.js";
export default {
  name: "UpdateSex",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender:this.value
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
        duration: 0,
      });
      try {
        const localGender = this.localGender;
        await updateUserProfile({
          gender: localGender,
        });
        //console.log(data);
        //更新视图
        this.$emit("input", localGender);
        //关闭弹层
        this.$emit("close");
        //提示成功
        this.$toast.success("性别修改成功");
      } catch (error) {
        this.$toast("性别更新失败");
      }
    },
    onPickerChange(picker, value, index){
        this.localGender=index   //获取选中的下标
    }
  },
};
</script>

<style></style>
