<template>
  <div class="login-container">
      <!-- 头部导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
        <van-icon slot="left" name="arrow-left" @click="$router.back()"></van-icon>
    </van-nav-bar>
    <!-- form表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
        <van-field
            v-model="user.mobile"
            type="number"
            name="mobile"
            placeholder="请输入手机号"
            maxlength="11"
            :rules="uesrFormRules.mobile"
  >
   <i slot="left-icon" class="toutiao icon-shouji"></i>
  </van-field>
        <van-field
         v-model="user.code"
            type="number"
            name="code"
            placeholder="请输入验证码"
            maxlength="6"
            :rules="uesrFormRules.code"
  >
  <i slot="left-icon" class="toutiao icon-yanzhengma"></i>
   <template #button>
       <!-- 验证码倒计时 -->
       <van-count-down 
       v-if="isCountDownShow" 
       :time="1000*60" 
       format="ss s"
       @finish="isCountDownShow=false" 
       />
    <van-button 
    v-else
    class="send-sms-btn" 
    round size="small" 
    type="default"
    native-type="button"
    @click="onSendSms"
    >获取验证码</van-button>
  </template>
   </van-field>
  <div class="login-btn-wrap">
        <van-button class="login-btn"  block type="info" native-type="submit">登录</van-button>
  </div>
</van-form>
    <!-- form表单 -->
  </div>
</template>
  
<script>
import { login,sendSms } from '@/api/user.js'
export default {
    name:'LoginIndex',
    components:{}, 
    props:{},
    data() {
        return { 
            user:{
                mobile:'19814382326', 
                code: '246810',
            },
            uesrFormRules:{ //表单验证规则数据
                mobile:[{ 
                    required: true, 
                    message: '手机号不能为空' 
                    },{
                        pattern:/^1[3|5|7|8|9]\d{9}$/,
                        message:'手机号格式错误'
                    }],     
                code:[{ 
                    required: true, 
                    message: '验证码不能为空' },
                    {
                        pattern:/^\d{6}$/,
                        message:'验证码格式错误'
                    }
                    ],
            },
            isCountDownShow:false  //是否展示倒计时
        };
    },
    computed:{},
    watch:{},
    created(){},
    mounted(){},
    methods:{
      async onSubmit() {
      //1.获取表单数据
      const user=this.user
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, //禁用背景点击
        duration:0     //持续时间，如果为0 则持续展示    
        })
      //2.表单验证 
      //3.提交表单请求登录
        try{ 
            const {data}=await login(user)
            // console.log('登录成功',res)
            this.$store.commit('setUser', data.data); //将用户登录后的Token储存到vuex中
            this.$toast.success('登录成功')
            //登录成功跳转回原来页面
            this.$router.back()
        }catch(err){
            if(err.response.status===400){
                // console.log('手机号或者验证码错误')
                this.$toast.fail('手机号或者验证码错误')
            }else{
                // console.log('登录失败',err)
                this.$toast.fail('登录失败')
            } 
        }
      //4.根据请求响应结果处理后续操作
    },
   async onSendSms(){ 
        //1.效验手机号
        try {
         await this.$refs.loginForm.validate('mobile')  //通过传入input输入框的name来实现点击发送验证码时只效验手机号
        } catch (error) {
           return console.log('验证失败',error) 
        }
        //2.验证通过，显示倒计时
        this.isCountDownShow=true
        //3.请求发送验证码
        try {
          await sendSms(this.user.mobile)
          this.$toast('验证码发送成功')
        } catch (error) {
            this.isCountDownShow=false
            if(error.response.status===429){
                this.$toast('验证码发送太频繁，请稍后重试')
            }else{
                this.$toast('验证码发送失败，请稍后重试')
            }
        }
    }
    }
}
</script>

<style lang="less" scoped>
.login-container{
    .toutiao{
        font-size: 27px;
    }
    .send-sms-btn{
        background-color: #ededed;
    }
    .login-btn-wrap{
        padding: 53px 33px;
    }
    .login-btn{
        background-color: #6db4fb;
        border-radius: 8px;
        border: none;
    }
}
</style>>
