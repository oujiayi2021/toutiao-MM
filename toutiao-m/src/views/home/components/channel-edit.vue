<template>
  <div class="channel-edit">
      <!-- 我的频道 -->
      <van-cell :border='false'>
          <div slot="title" class="title-text">我的频道</div>
          <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit=!isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
      </van-cell>
    <van-grid class="my-grid" :gutter="10">
        <van-grid-item class="grid-item" v-for="(channel,index) in myChannels" :key="index" @click="onMychannelClick(channel,index)">
            <van-icon slot="icon" name="clear" v-show="isEdit && !fiexChannels.includes(channel.id)"></van-icon>
            <span slot="text" class="text" :class="{active:index===active}">{{channel.name}}</span>
  </van-grid-item>
</van-grid>
    <!-- 我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border='false'>
          <div slot="title" class="title-text">频道推荐</div>
      </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item class="grid-item" icon="plus" @click="onAddChannel(allChannel)" v-for="(allChannel,index) in recommentChannels" :key="index" :text="allChannel.name" />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import {getAllChannels,addUserChannel,deleteUserChannel} from '@/api/channel.js'
import {mapState} from 'vuex'
import {setItem} from '@/utils/storage.js'

export default {
    name:'ChannelEdit',
    props:{
        myChannels:{
            type:Array,
            required:true
        },
        active:{
            type:Number,
            required:true
        }
    },
    data() {
        return {
           allChannels:[],  //所有频道列表数据
           isEdit:false , //控制编辑状态的显示（关闭图标）
           fiexChannels:[0] //固定频道不允许被删
        };
    },
    computed:{
        ...mapState(['user']),
        //计算属性会观测内部依赖数据的变化
        //如果依赖的数据发生变化，则计算属性会重新执行
        recommentChannels(){
            return this.allChannels.filter(channel=>{
                return !this.myChannels.find(myChannel=>{
                    return myChannel.id===channel.id
                })
            })
        }
        // recommentChannels(){
        //     const channels=[]
        //     this.allChannels.forEach(channel=>{
        //         //find遍历数组，找到满足条件的元素项
        //     const ret = this.myChannels.find(myChannel=>{
        //             return myChannel.id===channel.id
        //         })
        //         //如果我的频道项中不包含该频道，则收集到推荐频道
        //         if(!ret){
        //             channels.push(channel)
        //         }
        //     })
        //     //把计算结果返回
        //     return channels
        // }
    },
    methods:{
      async loadAllChannels(){
          try {             
              const {data}=await getAllChannels()
              this.allChannels=data.data.channels
          } catch (error) {
              this.$toast('数据获取失败')
          }
        },
        //添加频道
      async onAddChannel(allChannel){
            this.myChannels.push(allChannel)
            //数据持久化处理
         
            if(this.user){
                //已登录，把数据请求接口放在线上
            try {
                 await addUserChannel({
                    id:allChannel.id, //频道ID
                    seq:this.myChannels.length //序号
                })
            } catch (error) {
                this.$toast('用户频道保存失败，请稍后重试')
            }
            }else{
                //未登录，把频道数据存储到本地
            setItem('TOUTIAO_CHANNELS',this.myChannels)
            }
        },
        onMychannelClick(channel,index){
           if(this.isEdit){
               if(this.fiexChannels.includes(channel.id)){
                   //如果是固定频道则不删除
                   return
               }
                //如果是编辑状态则执行删除频道
                //参数1：要删除频道的索引
                //参数2：删除的个数，如果不指定，则从参数1开始删除
                if(index<=this.active){
                    //让激活频道的索引-1，删除激活频道前面的频道以后，激活状态才会还是原来的频道
                    this.$emit('update-active',this.active-1,true)
                }
                this.myChannels.splice(index,1)
                this.deleteChannel(channel)
           }else{
                //非编辑则执行切换频道
                this.$emit('update-active',index,false) //利用子组件向父组件传参的$emit事件
           }
          
        },
       async deleteChannel(channel){
           try {
             if(this.user){
               //已登录，把数据请求接口放在线上
             await deleteUserChannel(channel.id)
           }else{
                //未登录，把频道数据存储到本地
            setItem('TOUTIAO_CHANNELS',this.myChannels)
           }
           } catch (error) {
               this.$toast('删除操作失败，请稍后重试')
           }
        
        }
    },
    created(){
        this.loadAllChannels()
    }
}
</script>

<style lang="less" scoped>
.channel-edit{
    padding: 40px 0;
    .title-text{
        font-size: 20px;
        color: #333333;
    }
    .edit-btn{
        width: 60px;
        height: 25px;
        font-size: 16px;
        color: #f85959;
        border: 1px solid #f85959;
    }
  /deep/ .grid-item{
        width: 170px;
        height: 36px;
       .van-grid-item__content{
           white-space: nowrap;
            background-color: #f4f5f6;
            padding: 16px 3px;
            .van-grid-item__text,.text{
                font-size: 12px;
                color: #222;
                margin-top: 0;
            }
        }
    }
    /deep/ .my-grid{
        .grid-item{
            .active{
                color: red;
            }
            .van-grid-item__icon-wrapper{
                position: unset;
            }
            .van-icon-clear{
                position: absolute;
                right: -5px;
                top: -5px;
                font-size: 15px;
                color: red;
                z-index: 3;
            }
        }
    }
  /deep/  .recommend-grid{
        .grid-item{
            .van-grid-item__content{
                flex-direction: row;
                .van-icon-plus{
                    font-size: 12px;
                    margin-right: 2px;
                }
            .van-grid-item__text{
                margin-top: 1px;
            }
            }
        }
    }
}
</style>