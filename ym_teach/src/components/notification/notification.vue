<template>
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <!--<div class="notification" :style="style" v-show="visible" @mouseenter="clearTimer" @mouseleave="createTimer">
      <span class="content">{{content}}</span>
      <a class="btn" @click.stop.prevent="handleClose">{{btn}}</a>
    </div>-->
    <div class="notification" :style="style" v-show="visible" @mouseenter="clearTimer">
      <div class="notification_con">
        <i class="el-icon-close notification_icon" @click.stop.prevent="handleClose"></i>
        <div class="notification_student">
          <div class="student_name">学生：{{content}}</div>
          <div class="student_accounts">账号：{{cssda}}</div>
        </div>
        <p class="notification_text">发起了呼叫老师申请</p>
        <div class="notification_btn">
          <div class="act" @click.stop.prevent="detailsClose">查看详情</div>
          <div @click.stop.prevent="handleClose">关闭</div>
        </div>
        <span class="content"></span>
      </div>
    </div>
  </transition>

</template>

<script>
  export default {
    name: "notification",
    components: {},
    data() {
      return {
        visible: true
      }
    },
    props: {
      content: {
        type: String,
        required: true
      },
      cssda: {
        type: String,
        required: true
      },
      btn: {
        type: String,
        default: '关闭'
      },
      jsonData: {
        type: Object,
        default: () => {
        }
      }
    },
    watch: {
      jsonData: {
        handler(val, oldval) {
        },
        deep: true//对象内部的属性监听，也叫深度监听
      }
    },
    methods: {
      handleClose() {
        this.$emit('close')
      },
      afterLeave() {
        this.$emit('closed')
      },
      detailsClose() {
        this.$emit('detailsClose', this.jsonData)
      },
      afterEnter() {
      },
      clearTimer() {
      },
      createTimer() {
      }
    },
    computed: {
      style() {
        return {}
      }
    },
    created() {
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  .notification {
    color: #fff;
    padding: 20px;
    position: fixed;
    z-index: 9999;
    transition: all .3s;
    width: 370px;
    height: 200px;
    background: rgba(255, 255, 255, 1) url(../../assets/images/pop_call_bg.png) no-repeat left top;
    box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
    border-radius: 4px;

    .notification_con {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;

      .notification_icon {
        cursor: pointer;
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 20px;
        color: #fff;
      }

      .notification_student {
        padding-top: 70px;
        color: #666666FF;
        font-size: 14px;

        > div {
          display: inline-block;
          margin: 0 8px;
        }
      }

      .notification_text {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 68, 68, 1);
        line-height: 30px;
      }

      .notification_btn {
        display: flex;
        justify-content: space-around;
        font-size: 14px;

        > div {
          width: 78px;
          height: 32px;
          line-height: 30px;
          cursor: pointer;
          border: 1px solid rgba(226, 226, 226, 1);
          border-radius: 4px;
          color: rgba(185, 185, 185, 1);
        }

        .act {
          background: linear-gradient(90deg, rgba(134, 199, 255, 1) 0%, rgba(0, 118, 250, 1) 100%);
          border-radius: 4px;
          color: #fff;
          border: none;
          line-height: 32px;
        }
      }
    }

  }

  .content {
    padding: 0;
  }

  .btn {
    color: #ff4081;
    padding-left: 24px;
    margin-left: auto;
    cursor: pointer;
  }
</style>
