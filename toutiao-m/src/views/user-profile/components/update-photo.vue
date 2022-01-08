<template>
  <div class="update-photo">
    <img :src="img" class="img" alt="" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserPhoto } from "@/api/user.js";
export default {
  name: "UpdatePhoto",
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },
  methods: {
    onConfirm() {
      //客户端的裁切使用getCroppedCanvas获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto1(blob);
      }); //PC端建议使用getData()方法获取裁切的参数（服务器有相关功能）
    },
    async updateUserPhoto1(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
        duration: 0,
      });
      try {
        //如果要求Content-Type是application/json则传递普通js对象
        //如果接口要求Content-Type是multipart/form-data则你必须传递FormData对象
        const formData = new FormData();
        formData.append("photo", blob);
        const { data } = await updateUserPhoto(formData);
        //关闭弹出层
        this.$emit("close");
        //更新视图
        this.$emit("update-photo", data.data.photo);
        this.$toast.success('头像更新成功')
      } catch (error) {
          this.$toast('头像更新失败')
      }
    },
  },
  mounted() {
    //图片裁切第三方插件
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1, //查看模式，定义裁剪器的视图模式。如果您将viewMode设置为0，裁剪框可以扩展到画布之外，而值为1、2或3将限制作物框到画布的大小。viewMode为2或3将额外限制画布到容器。当画布和容器的比例相同时，2和3之间没有区别。
      dragMode: "move", //定义裁剪器的拖拽模式,"move"则图片可以拖动，"none"则图片不能拖动，裁切框可以拖动
      aspectRatio: 1, //定义裁切框的固定长宽比。默认情况下，作物盒有一个自由比例（16:9）。
      autoCropArea: 1, //它应该是0到1之间的数。定义自动裁切面积大小(百分比)。
      cropBoxMovable: false, //截图区域是否可以移动。
      cropBoxResizable: false, //截图框是否可以缩放
      background: false, //是否需要默认背景
      movable: true, //背景图像是否可以移动
      //其他设置选项可以参考cropperjs的文档
    });
  },
};
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 60px;
      height: 60px;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
