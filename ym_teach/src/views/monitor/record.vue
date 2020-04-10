<template>
  <div class="record">
    <div class="clear  ">
    </div>
    <el-badge class="monitor-call" :value="this.$store.state.call_count" :max="99">
      <div @click="monitorCall">
        <img src="../../assets/images/class_ic_call.png" alt="">
        <p>呼叫申请</p>
      </div>
    </el-badge>
    <div class="call-details">
      <div class="call-details-top">
        <p class="f16 mr-20">基本信息</p>
        <div class="details-list">
          <span class="details-list-fl">学生姓名：</span>
          <span class="details-list-fr">{{recordJson.name}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">课程名称：</span>
          <span class="details-list-fr">{{recordJson.course}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">学习知识点：</span>
          <span class="details-list-fr">{{recordJson.knowledge}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">当前环节：</span>
          <span class="details-list-fr">{{ recordJson.position==0?'开始学习':recordJson.position==1?'学前测试':recordJson.position==2?'第一轮学习':recordJson.position==3?'第二轮学习':'学后测试'}}</span>
        </div>
        <!--<div class="details-list">
          <span class="details-list-fl">答题数量：</span>
          <span class="details-list-fr">{{recordJson.count}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">答对题量：</span>
          <span class="details-list-fr">{{recordJson.right}}</span>
        </div>
        <div class="details-list">
          <span class="details-list-fl">正确率：</span>
          <span class="details-list-fr" v-if="recordJson.count>0">{{Math.floor((recordJson.right/recordJson.count)*100)}}%</span>
          <span class="details-list-fr" v-if="recordJson.count==0">0%</span>
        </div>-->
      </div>
      <div v-if="DateilJson!='' && DateilJson.question!=null" class="DateilJson-div">
        <div class="titleKey">
          <div class="titleKey-img">
            <img src="../../assets/images/icon-note.png" width="25" alt="">
            <span>{{ DateilJson.position==0?'开始学习':DateilJson.position==1?'学前测试':DateilJson.position==2?'第一轮学习':DateilJson.position==3?'第二轮学习':'学后测试'}}-当前题目</span>
          </div>
          <div class="details-con choice ">
            <img src="../../assets/images/teaching_ic_lightbulb.png" class="lightbulb" alt="">
            <!-- 题目显示 -->
            <div
              class="choice-type-text"
              style="font-style: normal"

            >
              {{DateilJson.question.type==0?'单选题':DateilJson.question.type==1?'多选题':DateilJson.question.type==2?"填空题":"经典题"}}
            </div>

            <div class="choice-con">
              <div class="choice-title">
                <!--                <span class="choice-quan">题目</span>-->
                <span class="choice-timu" v-html="DateilJson.question.title"></span>
              </div>
              <ul class="answer" v-if="DateilJson.question.type!=2">
                <!--                <span class="choice-quan">{{DateilJson.type==0?'单选题':DateilJson.type==1?'多选题':"填空题"}}</span>-->
                <!-- 单选  -->
                <li
                  class="answer-li"
                  v-for="(item,index) in DateilJson.question.options"
                  :key="index">
                  <div class="answer-li-name clear">
                    <div class="fl">{{item.name.substr(2)}}、</div>
                    <div class="answerContent" v-html="item.optionContent"></div>
                  </div>
                </li>
              </ul>
              <div class="answer" v-if="DateilJson.question.type==2" style=" padding: 95px 0 0 30px;">
                <!-- <span class="choice-quan">填空</span> -->
                <img src="../../assets/images/answer-ren.png" class="fillingImg" alt/>
                <div class="filling" v-for="(item,index) in  strSplit(DateilJson.question.answer)" :key="index">
                  <span>填空{{index+1}}</span>
                  <input
                    type="text"
                    :value="replaceAnswer(item)"
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
                class="analysisImg" alt/>

              <div>

                <div class="analysis-dub">
                  <span class="correct">
                    正确答案:
                     <span class=" "
                           v-if="DateilJson.question.type==2">{{replaceAnswer(DateilJson.question.answer)}}</span>
                    <span class=" " v-if="DateilJson.question.type<2">{{DateilJson.question.answer}}</span>

                  </span>

                </div>
                <div class="choice-title">
                  <div style="color:#0067E4FF">题目解析:</div>
                  <span v-html="DateilJson.question.analysis"></span>
                  <div class="" style="margin-top: 10px;color:#0067E4FF">点评：</div>
                  <span v-html="DateilJson.question.comment"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="details-top-btn basicAbs" @click="knowledgeTextvideo(DateilJson.question.video.videoUploadId) "
             v-if="DateilJson.question.video">查看讲解视频
        </div>
      </div>
    </div>
    <div class="record-con call-details">
      <div class="record-title">
        <div>答题记录</div>
        <div class="record-title-tab " :class="isRight==0?'act':''" @click="isRightList(0)"><span>全部显示</span></div>
        <div class="record-title-tab " :class="isRight==1?'act':''" @click="isRightList(1)"><span>显示错题</span></div>
      </div>
      <div class="record-border" v-if="!recordPage" v-for="(item,index) in recordList" :key="index">
        <div class="titleKey-img">
          <img src="../../assets/images/icon-note.png" width="25" alt="">

          <span>{{item.position==1?'学前测试':item.position==2?'第一轮学习':item.position==3?'第二轮学习':'学后测试'}}-第{{recordList.length-index}}题</span>
        </div>
        <div v-for="(topicList,listIndx) in item.res">

          <div class="details-con choice ">
            <img src="../../assets/images/teaching_ic_lightbulb.png" class="lightbulb" alt="">
            <!-- 题目显示 -->

            <div
              class="choice-type-text"
              style="font-style: normal"

            >{{topicList.type==0?'单选题':topicList.type==1?'多选题':topicList.type==2?"填空题":"经典题"}}
            </div>
            <!--          <div class="choice-type-text" style="font-style: normal">经典题</div>-->
            <div class="choice-con">
              <div class="choice-title">
                <!--                <span class="choice-quan">题目</span>-->
                <span class="choice-timu" v-html="topicList.title"></span>
              </div>
              <ul class="answer" v-if="topicList.type!=2" :class="topicList.type==1?'multipleLi':''">
                <!--                <span class="choice-quan">{{topicList.type==0?'单选题':topicList.type==1?'多选题':"填空题"}}</span>-->
                <!-- 单选  -->
                <li
                  class="answer-li"
                  v-for="(options,indexs) in topicList.options||topicList.cmsOptionList"
                  :key="indexs"
                  :class="getClass(options.name.substr(2),item.myanswer,topicList.rightKey,topicList.type)"
                >
                  <span class="answer-li-opt"></span>
                  <div class="answer-li-name clear">
                    <div class="fl">{{options.name.substr(2)}}、</div>
                    <div class="answerContent" v-html="options.optionContent"></div>
                  </div>
                </li>
              </ul>
              <div class="answer" v-if="topicList.type==2" style=" padding: 95px 0 0 30px;">
                <!-- <span class="choice-quan">填空</span> -->
                <img src="../../assets/images/answer-ren.png" class="fillingImg" alt/>
                <div class="filling" v-for="(item,index) in  strSplit(item.myanswer)" :key="index">
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
                class="analysisImg" v-if="item.isright==1" alt/>
              <img
                src="../../assets/images/wrong_pic_wrong.png"
                class="analysisImg" v-if="item.isright==0" alt/>
              <div>
                <div v-if="item.isright==1" class="succ">回答正确</div>
                <div v-if="item.isright==0" class="errAnswer">回答错误</div>
                <div class="analysis-dub">
                      <span class="correct">
                        正确答案:
                        <span class=" " v-if="topicList.type==2">{{replaceAnswer(topicList.rightKey)}}</span>
                        <span class=" " v-if="topicList.type<2">{{topicList.rightKey}}</span>
                      </span>
                  <span data-v-dc245c72="" class="correct">
                    学生答案:
               <span data-v-dc245c72="" class=" ">{{item.myanswer}}</span></span>
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
          <div class="record-type">
            <div class="record-type-div">
              <span v-if="item.hasUnknow==1"><img src="../../assets/images/class_ic_solved_blue.png" alt="">待解决</span>
              <span v-if="item.called==1"><img src="../../assets/images/class_ic_call_blue.png" alt="">呼叫过老师</span>
            </div>
            <div class="details-top-btn" @click="knowledgeTextvideo(topicList.firstVideo.videoUploadId) "
                 v-if="topicList.firstVideo">查看讲解视频
            </div>
          </div>
        </div>
      </div>
      <img v-if="recordPage" src="../../assets/images/default_page/answer-n-pic.png" class="record_page" alt="">
    </div>
    <!--视频讲解-->
    <el-dialog
      title="视频讲解"
      :visible.sync="centerDialogVisible"
      :before-close="DialogVisibleCenter"
      top="80px"
      center
      width="80%"
      height="80%"
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
  import {monitorClassDetail, videoPlay} from "@/api/accounts"

  export default {
    name: "record",
    components: {},
    data() {
      return {
        recordList: [],
        recordInherit: [],
        recordJson: {},
        topicList: {},
        Myanswer: {},
        count: "0",
        videoJson: {},
        playAuth: "", //视频路径
        videoVid: "",
        bookContent: '',
        bookCt: false, //不显示板书,
        centerDialogVisible: false,

        isRight: 0,
        DateilJson: "",
        studentId: this.$route.params.studentId,
        knowledgeId: this.$route.params.knowledgeId,
        position:"",
        recordPage: true
      }
    },
    props: {},
    watch: {
      call_count: function (old, newd) {
        this.count = old;
      },
      quitStudy: function (old, newd) {
        if (old != "" && old != undefined) {
          let quitJson = JSON.parse(old);
          //学生修改课程后，并且当前老师学科和学生学习课程不对应，返回兼课列表
          setTimeout(()=>{
            this.$router.push("/monitor/index")
          },1000)

        }
      },
      //推知识点
      MONITOR_List: {
        handler(newName, oldName) {
          if (newName != "" && newName != undefined) {
            let newNameJson = JSON.parse(newName)
            if (newNameJson.studentId == this.studentId) {
              this.recordJson = newNameJson;
              //当前知识点
              if (newNameJson.knowledgeId != this.knowledgeId) {
                this.knowledgeId = newNameJson.knowledgeId;
                //this.DateilJson = this.DATEIL_List;
              }

              this.init();
              // this.init();
              if(newNameJson.knowledgeId!=this.DateilJson.knowledgeId ){
                this.DateilJson="";
              }
            }else{
             // this.$store.dispatch("monitorDateil", "");
             // this.DateilJson = "";
            }
          }

        },
        immediate: true,
        deep: true
      },
      DATEIL_List: {
        handler(newName, oldName) {
          if (newName != "" && newName != undefined) {
            let newNameJson = JSON.parse(newName)
            //当前学生推题
            if (newNameJson.studentId == this.studentId) {
              this.DateilJson = newNameJson;
              /*  this.$set(this.recordJson, "position", newNameJson.position)*/
               this.init();
            }
          } else {
           // this.DateilJson = "";
          }
        },
        immediate: true,
        deep: true
      },

    },
    methods: {
      replaceAnswer(sads) {
        if (sads != undefined) {
          return "'" + sads.replace(/\$/g, "\'或\'").replace(/\,/g, "\'\,\'") + "'"
        }
      },
      init() {
        // this.recordJson = JSON.parse(window.sessionStorage.getItem("recordList"));
        monitorClassDetail(this.studentId, this.knowledgeId, "").then(res => {
          if (res.data != null) {
            res.data.length > 0 ? this.recordPage = false : this.recordPage = true;
            this.recordList = res.data;
            this.recordInherit = res.data;
          }
        }).catch(err => {
        })
      },
      //方法存放
      getClass(thisValue, selectList, realList, types) {
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
            return isReal ? "act" : "";
          } else {
            return isReal ? "multipleLiact" : "";
          }
        }
      },
      strSplit(right) {
        if (right != undefined) {
          return right.trim().split(',')
        } else {
          return []
        }
      },
      knowledgeTextvideo(videoVid) {
        videoPlay(videoVid).then(res => {
          this.playAuth = res.data;
          this.videoVid = videoVid;
          setTimeout(() => {
            this.centerDialogVisible = true;
          }, 300);
        });
      },
      //显示错对
      isRightList(str) {
        if (str == 0) {
          this.isRight = 0;
          monitorClassDetail(this.$route.params.studentId, this.$route.params.knowledgeId, "").then(res => {
            this.recordList = res.data;
          }).catch(err => {
          })
        } else {
          this.isRight = 1;
          monitorClassDetail(this.$route.params.studentId, this.$route.params.knowledgeId, 0).then(res => {
            this.recordList = res.data;
          }).catch(err => {
          })
        }
      },
      //讲解视频隐藏
      DialogVisibleCenter() {
        this.centerDialogVisible = false;
        this.$refs.aliplayerVideo.pause();
      },
      //呼叫老师
      monitorCall() {
        this.$router.push("/monitor/call")
      }
    },
    computed: {
      MONITOR_List() {
        return this.$store.state.monitorList
      },
      //$store.state.call_count
      call_count() {
        return this.$store.state.call_count
      },
      DATEIL_List() {
        return this.$store.state.DateilList
      },
      quitStudy() {
        return this.$store.state.quitStudy
      },

    },
    created() {
    //  this.init()
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">

  .record {
    position: relative;
    padding-top: 80px;
  }

  .call-details {
    position: relative;
    background: #fff;
    box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
    border-radius: 6px;

    .DateilJson-div {
      position: relative;
      padding-bottom: 90px;
    }

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
      box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
      border: #dfdfdf 1px solid;
      padding: 20px;

      .lightbulb {
        position: absolute;
        left: -80px;
        top: 0;
      }
    }
  }

  .correct {
    margin-right: 15px;
  }

  .titleKey {
    position: relative;

  }

  .titleKey-img {
    position: relative;
    width: 85%;
    margin-left: 160px;
    padding-top: 30px;

    span {
      color: rgba(0, 103, 228, 1);
      vertical-align: top;
      font-weight: bold;
      font-size: 16px;
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

  .basicAbs {
    position: absolute;
    right: 112px;
    bottom: 30px;
  }

  .record-title {
    position: relative;
    width: 85%;
    margin-left: 160px;
    padding-top: 30px;

    > div {
      display: inline-block;
      width: 120px;
      font-size: 18px;

      span {
        font-size: 14px;
      }
    }

    &-tab {
      background: url(../../assets/images/report-err.png) no-repeat left center;
      background-size: 20px 20px;
      text-align: center;
      cursor: pointer;
    }

    .act {
      background: url(../../assets/images/report-act.png) no-repeat left center;
      background-size: 20px 20px;
    }
  }

  .record-type {
    padding: 20px 0;
    width: 85%;
    margin-left: 160px;
    text-align: right;

    > div {
      display: inline-block;
    }

    &-div {
      margin-right: 20px;

      span {
        margin: 0 20px;

        img {
          width: 40px;
          vertical-align: middle;
        }
      }
    }
  }

  .record-border {
    position: relative;

    &:before {
      content: "";
      display: block;
      border-left: 1px dashed rgba(141, 207, 255, 1);
      position: absolute;
      left: 110px;
      top: 0;
      z-index: 9;
      height: 100%;
    }

    &:after {
      content: "";
      display: block;
      border-bottom: 1px dashed rgba(141, 207, 255, 1);
      position: absolute;
      left: 110px;
      bottom: 0;
      z-index: 9;
      width: 88%;
    }

    &:last-child:after {
      display: none;
    }
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

  .record_page {
    display: block;
    margin: 0 auto;
  }
</style>
<style lang="scss">
  .choice-type-text {
    background: url("../../assets/images/teaching_ic_label.png");
  }

  .record .el-dialog {
    margin-top: 80px !important;
    width: 80% !important;
  }
</style>
