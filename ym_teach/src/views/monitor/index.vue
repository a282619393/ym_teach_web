<template>
  <div class="index">
    <div class="noti">
      <div class="notification" v-for="(item,index) in callArr" :key="index">
        <div class="notification_con">
          <i class="el-icon-close notification_icon" @click.stop="handleClose(index)"></i>
          <div class="notification_student">
            <div class="student_name">学生：{{item.studentName}}</div>
            <div class="student_accounts">账号：{{item.userName}}</div>
          </div>
          <p class="notification_text">发起了呼叫老师申请</p>
          <div class="notification_btn">
            <div class="act" @click.stop="detailsClose(item.callId,index)">查看详情</div>
            <div @click.stop="handleClose(index)">关闭</div>
          </div>
          <span class="content"></span>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>

  import {messageAuth} from "@/api/accounts"

  export default {
    name: "index",
    components: {},
    data() {
      return {
        callArr: [],
        JIM: "",
        timer: ""
      }
    },
    props: {},
    watch: {},
    methods: {
      JMessage() {
        //登录极光
        let that = this;
        //this.JIM.loginOut();
        messageAuth().then(res => {
          this.JIM.init({
            "appkey": res.data.appkey,
            "random_str": res.data.random_str,
            "signature": res.data.signature,
            "timestamp": res.data.timestamp,
            "flag": 0
          }).onSuccess(data => {
            const userId = sessionStorage.getItem("userId")
            that.JIM.login({
              'username': "teachid" + userId,
              'password': '4NKfMHm9'
            }).onSuccess(data => {
              // 监听消息
              that.JIM.onMsgReceive(data => {
                let msg_body = JSON.parse(data.messages[0].content.msg_body.text);
                let timer = new Date().getTime();//当前时间戳
                msg_body["timer"] = timer;
                if (msg_body != null && msg_body.action == 3) {
                  //呼叫弹窗
                  that.callArr.push(msg_body);
                  that.$store.dispatch("callCount", msg_body.callcount);
                } else if (msg_body != null && msg_body.action == 0) {  //刷新检课列表
                  if (msg_body.question == null || msg_body.question == undefined) {
                    that.$store.dispatch("monitor", JSON.stringify(msg_body));
                    window.sessionStorage.setItem("recordList", JSON.stringify(msg_body))
                    //当学习切换知识点或者在过渡页时，清空答题记录
                     // that.$store.dispatch("monitorDateil", "");
                  }
                } else if (msg_body != null && msg_body.action == 1) { //刷新答题记录详情
                  that.$store.dispatch("monitorDateil", JSON.stringify(msg_body));
                } else if (msg_body != null && msg_body.action == -1) {
                  //学生退出当前老师学科学习流程，并且学习其他课程 quitStudy
                  that.$store.dispatch("quitStudyJson", JSON.stringify(msg_body));
                }
              })
              that.JIM.onDisconnect(function (data) {
                  alert("极光断线");
                // that.JMessage();
                  location.reload();
                  that.$router.go(0);
              });
            }).onFail(data => {
              that.$message.error("您没有查看监课模块的权限，请联系管理员！");
            });
          }).onFail(data => {

          });

        })
      },
      handleClose(index) {
        this.callArr.splice(index, 1);
      },
      //查看详情
      detailsClose(id, index) {
        this.callArr.splice(index, 1);
        this.$router.push({name: '/monitor/AnswerDetails', params: {id: id}})
      },
      loginOutJMessage(){
        this.JIM.loginOut();
        this.JMessage()
      }
    },
    computed: {},
    created() {
      this.JIM = new JMessage({})
       this.JMessage()
    },
    mounted() {

    },
    destroyed() {
    },
    beforeDestroy() {
      //const JIM = new JMessage();
      this.JIM.loginOut();

    }
  }
</script>

<style scoped lang="scss">
  .noti {
    position: fixed;
    z-index: 9999;
    right: 40px;
    bottom: 40px;
    transition: all .3s;
  }

  .notification {
    color: #fff;
    padding: 20px;

    width: 370px;
    height: 200px;
    background: rgba(255, 255, 255, 1) url(../../assets/images/pop_call_bg.png) no-repeat left top;
    box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
    border-radius: 4px;
    margin-top: 20px;

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
