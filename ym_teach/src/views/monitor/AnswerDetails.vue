<template>
  <div class="detailss">
    <div class="clear  ">
      <div class="backTo fr " @click="routerback(-1)">
        <img src="../../assets/images/ic_back_blue.png" alt="">
        <span>返回</span>
      </div>
    </div>
    <div class="call-details">
      <div class="call-details-top">
        <p class="f16 mr-20">基本信息</p>
        <div class="details-top-btn basicAbs" v-if="statuss==0" @click="dispose()">已处理</div>
        <div class="details-top-btn basicAbs" v-if="statuss==1"> 已处理</div>
        <div class="details-list">
          <span class="details-list-fl">学生姓名：</span>
          <span class="details-list-fr">{{CallList.studentName}}</span>

        </div>
        <div class="details-list">
          <span class="details-list-fl">账号：</span>
          <span class="details-list-fr">{{CallList.userName}}</span>
        </div>
       <!-- <div class="details-list">
          <span class="details-list-fl">课程名称：</span>
          <span class="details-list-fr">{{CallList.className}}</span>
        </div>-->
        <div class="details-list">
          <span class="details-list-fl">学习知识点：</span>
          <span class="details-list-fr">{{CallList.knowledge}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">当前环节：</span>
          <span class="details-list-fr">{{CallList.position==1?'学前测试':CallList.position==2?'第一轮学习':CallList.position==3?'第二轮学习':'学后测试'}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">申请时间：</span>
          <span class="details-list-fr">{{CallList.createTime}}</span>
        </div>
      </div>
      <div class="titleKey">

        <div class="details-con choice ">
          <img src="../../assets/images/teaching_ic_lightbulb.png" class="lightbulb" alt="">
          <!-- 题目显示 -->
          <div
            class="choice-type-text"
            style="font-style: normal"

          >{{topicList.type==0?'单选题':topicList.type==1?'多选题':topicList.type==2?"填空题":"经典题"}}
          </div>

          <div class="choice-con">
            <div class="choice-title">
<!--              <span class="choice-quan">题目</span>-->
              <span class="choice-timu" v-html="topicList.title"></span>
            </div>
            <ul class="answer" v-if="topicList.type!=2" :class="topicList.type==1?'multipleLi':''">
<!--              <span class="choice-quan">{{topicList.type==0?'单选题':topicList.type==1?'多选题':"填空题"}}</span>-->
              <!-- 单选  -->
              <li
                class="answer-li"
                v-for="(item,index) in topicList.cmsOptionList"
                :key="index"
                :class="getClass(item.name.substr(2),myanswer,topicList.rightKey,topicList.type)"
              >
                <span class="answer-li-opt"></span>
                <div class="answer-li-name clear">
                  <div class="fl">{{item.name.substr(2)}}、</div>
                  <div class="answerContent" v-html="item.optionContent"></div>
                </div>
              </li>
            </ul>
            <div class="answer"  v-if="topicList.type==2" style=" padding: 95px 0 0 30px;">
              <!-- <span class="choice-quan">填空</span> -->
              <img src="../../assets/images/answer-ren.png" class="fillingImg" alt />
              <div    class="filling"   v-for="(item,index) in  myanswerArr" :key="index" >
                <span>填空{{index+1}}</span>
                <input
                  type="text"
                  :value="item"
                  disabled="disabled"
                />
              </div>

            </div>
          </div>
          <!-- 解析 -->
          <div class="analysis">
            <!--图片显示-->
            <img
              src="../../assets/images/class_ic_cat_teaching.png"
              class="analysisImg" v-if="isRight==1" alt/>
              <img
                src="../../assets/images/wrong_pic_wrong.png"
                class="analysisImg" v-if="isRight==0" alt/>
              <div>
              <div v-if="isRight==1" class="succ">回答正确</div>
              <div v-if="isRight==0" class="errAnswer">回答错误</div>
              <div class="analysis-dub">
                  <span class="correct">
                    正确答案:
                    <span class=" " v-if="topicList.type==2">'{{replaceAnswer(topicList.rightKey)}}'</span>
                    <span class=" " v-if="topicList.type<2">{{topicList.rightKey}}</span>
                  </span>
                <span class="correct">
                    学生答案:
                    <span class=" ">{{myanswer}}</span>
                  </span>
              </div>
              <div class="choice-title">
                <div style="color:#0067E4FF">题目解析:</div>
                <span v-html="topicList.analysis"></span>
                <div class="" style="margin-top: 10px;color:#0067E4FF">点评：</div>
                <span v-html="topicList.commentContent"></span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="details-top-btn basicAbs" v-if="topicList.firstVideo" @click="knowledgeTextvideo(topicList.cmsVideoList[0].videoUploadId)">查看讲解视频</div>
    </div>
    <!--视频讲解-->
    <el-dialog
      title="视频讲解"
      :visible.sync="centerDialogVisible"
      :before-close="DialogVisibleCenter"
      top="80px"
      center
      width="80%"
      height="60%"
    >
      <aliplayer
        :playauth="playAuth"
        :vid="videoVid"
        ref="aliplayerVideo"
        :bookContent="bookContent"
        :bookCt="bookCt"
      ></aliplayer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DialogVisibleCenter ">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import {monitorcallDateil, monitorUpdateCall ,videoPlay} from "@/api/accounts"

  export default {
    components: {},
    data() {
      return {
        topicList: {},
        myanswer: "",
        myanswerArr:[],
        isRight: "",
        studentId: "",
        knowledgeId: "",
        statuss: "0",
        videoJson: {},
        playAuth: "", //视频路径
        videoVid: "",
        bookContent:'',
        bookCt: false, //不显示板书,
        centerDialogVisible:false,
        CallList:{},
      }
    },
    props: {},
    watch: {
      '$route' (to, from) {
        this.init()
      }
    },
    methods: {
      init() {
       // this.CallList=JSON.parse(window.sessionStorage.getItem("CallList"))
        monitorcallDateil(this.$route.params.id).then(res => {
          this.CallList=res.data;
          this.topicList = res.data.res.data[0];
          this.myanswer = res.data.myanswer;
          this.isRight = res.data.right;
          this.statuss = res.data.status;
          //myanswerArr
          if(this.topicList.type==2){
            this.myanswerArr=res.data.myanswer.split(",")
          }

        }).catch(err => {
          console.log(err);
        })
      },
      routerback(){
        this.$router.push({path: '/monitor/call'})
      },
      //处理
      dispose() {
        let id = this.$route.params.id;
        let that = this;
        this.$confirm('确认已解决学生问题？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          monitorUpdateCall(id).then(res => {
            that.statuss = "1";
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {

        });

      },
      replaceAnswer(sads){
        if(sads!=undefined){
          return sads.replace(/\$/g,"\'或\'").replace(/\,/g,"\'\,\'")
        }
      },
      //方法存放
      getClass(thisValue, selectList, realList,types) {
        //当前值，选择的值列表（兼容多选），正确值列表（兼容多选）
        if (selectList == null || realList == null) {
          return;
        }
        let Myanswer = selectList.trim().split(",");
        let answer = realList.trim().split(",");
        let isSelect = false;
        if (selectList.length > 0) {
          for (var i = 0; i < Myanswer.length; i++) {
            if (Myanswer[i] == thisValue) {
              isSelect = true;
              break;
            }
          }
        } else {
          if (selectList == thisValue) {
            isSelect = true;
          }
        }

        let isReal = false;
        for (var z = 0; z < answer.length; z++) {
          if (answer[z] == thisValue) {
            isReal = true;
            break;
          }
        }
        if (isSelect) {
          if (types == 0) {
            return isReal ? "act" : "errAnswer";
          } else {
            return isReal ? "multipleLiact" : "multipleLierr";
          }
        } else {
          let hasTrue = false;
          for (var j = 0; j < Myanswer.length; j++) {
            for (var k = 0; k < answer.length; k++) {
              if (Myanswer[j] == answer[k] && Myanswer[j] != thisValue) {
                hasTrue = true;
                break;
              }
            }
          }
          for (let i = 0; i < answer.length; i++) {
            //确定漏选的
            if (answer[i] == thisValue) {
              if (types == 0) {
                return "act";
              } else {
                return "multipleLiact";
              }
            }
          }
          if (types == 0) {
            return  isReal ? "act" : "";
          } else {
            return  isReal ? "multipleLiact" : "";
          }
        }
      },
      knowledgeTextvideo(videoVid){
        videoPlay(videoVid).then(res => {
          this.playAuth = res.data;
          this.videoVid = videoVid;
          setTimeout(() => {
            this.centerDialogVisible = true;
          }, 300);
        });
      },
      //讲解视频隐藏
      DialogVisibleCenter() {
        this.centerDialogVisible = false;
        this.$refs.aliplayerVideo.pause();
      },
    },
    computed: {},
    created() {
      this.init();
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">

  .call-details {
    position: relative;
    background: #fff;
    box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
    border-radius: 6px;
    padding-bottom: 90px;

    &-top {
      padding: 20px;
      border-bottom: 2px solid #F0F3F9;
      position: relative;

      .details-list {
        padding: 10px 0 0 0;
      }

      .details-list-fl {
        display: inline-block;
        width: 90px;
        text-align: right;
        color: #999999;
      }

      .details-list-fr {
        color: #333;
      }
    }

    .details-con {
      position: relative;
      width: 85%;
      margin-left: 160px;
      margin-top: 30px;
      background: #fff;
      padding: 20px;
      box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
      border: #dfdfdf 1px solid;
      .lightbulb {
        position: absolute;
        left: -80px;
        top: 0;
      }
    }
  }

  .titleKey {
    position: relative;

    .titleKeyImg {
      position: absolute;
      left: 30px;
      top: 10px;
    }
  }

  .choice {


    position: relative;
    border-radius: 8px;

    z-index: 99;
    padding: 20px;

    .choice-con {
      display: flex;
    }

    .choice-title {
      margin-bottom: 25px;
      flex: 1;
      padding-top: 50px;
      position: relative;
      padding-right: 20px;

      .choice-timu {
        display: inline-block;
        font-weight: bold;
        color: #000;

        vertical-align: 16px;
        line-height: 30px;
        font-size: 16px;
        padding-left: 60px;
      }
    }

    .answer {
      flex: 1;
      position: relative;
      border-left: 1px dashed #bfbfbf;
      padding: 50px 0 0 40px;
      min-height: 350px;
    }

    .answer-li {
      padding-left: 25px;
      line-height: 50px;
      color: #333333 !important;
      .answer-li-opt {
        display: inline-block;
        width: 31px;
        height: 31px;
        margin-right: 10px;
        background: url(../../assets/images/select-border.png);
        cursor: pointer;
        vertical-align: top;
      }

      .answer-li-name {
        display: inline-block;
        line-height: 25px;
        font-size: 16px;
        vertical-align: 11px;
        width: 550px;

        .answerContent {
          float: left;
          width: 80%;
          margin-left: 5px;
        }
      }
    }

    .act .answer-li-opt {
      background: url(../../assets/images/select-succ.png);
    }

    .errAnswer .answer-li-opt {
      background: url(../../assets/images/select-err.png);
    }
    .multipleLi .answer-li-opt {
      background: url(../../assets/images/select--and-border.png);
    }
    .multipleLiact .answer-li-opt {
      background: url(../../assets/images/select-and-succ.png);
    }
    .multipleLierr .answer-li-opt {
      background: url(../../assets/images/select-and-see.png);
    }
  }

  .basicAbs {
    position: absolute;
    right: 112px;
    bottom: 30px;
  }

  .analysis {
    border-top: 1px dashed #bfbfbf;
    position: relative;
    margin-top: 10px;
    padding-left: 140px;
    padding-top: 30px;

    .analysisImg {
      display: block;
      position: absolute;
      left: 20px;
      top: 30px;
    }
  }

  .analysis-title {
    line-height: 30px;
  }
  .filling {
    margin-bottom: 30px;
    position: relative;

    span {
      display: inline-block;
      width: 80px;
      font-weight: bold;
      font-size: 16px;
      vertical-align: middle;
    }

    input {
      background: #fafcff;
      border: 1px solid #b7d8ff;
      border-radius: 3px;
      height: 45px;
      padding-left: 8px;
      width: 545px;
    }
  }

  .fillingImg {
    position: absolute;
    width: 90px;
    right: 30px;
    top: 47px;
    z-index: 99;
  }

</style>
<style lang="scss">
  .choice-type-text {
    background: url("../../assets/images/teaching_ic_label.png");
  }
  .detailss .el-dialog{
    margin-top: 80px !important;
    width: 80% !important;
  }
</style>
