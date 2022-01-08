<template>
  <div class="user-profile">
    <!-- 头部导航栏 -->
    <van-nav-bar
      fixed
      title="个人信息"
      left-arrow
      class="page-nav-bar"
      @click-left="$router.back()"
    />
    <!-- 头部导航栏 -->

    <!-- 个人信息 -->
    <!-- @change监听文件改变的时候触发事件 -->
    <van-cell title="头像" @click="$refs.file.click()" is-link>
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateSexShow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      @click="isUpdateBirthdayShow = true"
      is-link
    />
    <!-- 个人信息 -->

    <!-- 头像图片上传文件选择模块 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 头像图片上传文件选择模块 -->

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <UpdateName
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      ></UpdateName>
    </van-popup>
    <!-- v-if绑定布尔值让点击弹层取消按钮式重新渲染输入款的数据 -->
    <!-- 编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateSexShow" position="bottom">
      <UpdateSex
        v-if="isUpdateSexShow"
        @close="isUpdateSexShow = false"
        v-model="user.gender"
      >
      </UpdateSex>
    </van-popup>
    <!-- 编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      ></UpdateBirthday>
    </van-popup>
    <!-- 编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-if="isUpdatePhotoShow" v-model="isUpdatePhotoShow" position="bottom" style="height:100%">
      <UpdatePhoto :img="img" @close="isUpdatePhotoShow=false" @update-photo="user.photo=$event"></UpdatePhoto>
    </van-popup>
    <!-- 编辑头像 -->
  </div> 
</template>

<script>
import { getUserProfile } from "@/api/user.js";
import UpdateName from "@/views/user-profile/components/update-name.vue";
import UpdateSex from "@/views/user-profile/components/update-sex.vue";
import UpdateBirthday from "@/views/user-profile/components/update-birthday.vue";
import UpdatePhoto from '@/views/user-profile/components/update-photo.vue'
export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateSex,
    UpdateBirthday,
    UpdatePhoto
  },
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateSexShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow:false,
      img:null,     //预览的图片
    };
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        // console.log(data);
        this.user = data.data;
      } catch (error) {
        this.$toast("获取用户资料失败，请稍后重试");
      }
    },
    onFileChange() {
      //获取文件对象
      const file = this.$refs.file.files[0];
      //基于文件对象获取blob（设置给src）数据
      // const data = window.URL.createObjectURL(file);
      this.img=window.URL.createObjectURL(file)
      this.isUpdatePhotoShow=true

    //file-input如果选了同一个文件不会触发change事件
    //解决办法每次使用完毕把它的value清空
     this.$refs.file.values=""
    },
  },
  created() {
    this.loadUserProfile();
  },
};
</script>

<style lang="less" scoped>
.user-profile {
  margin-top: 50px;
  .avatar {
    width: 35px;
    height: 35px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
