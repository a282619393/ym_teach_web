<template>
  <div class="record_answer">
    <div class="loading" v-loading="loading" v-if="loading"></div>
    <!-- 头部 -->
    <div class="rel">
      <img src="../../assets/images/report-err-bg.png" alt="logo" style="height:594PX" />
      <div class="r_btn">
        <div
          class="record_btn_report"
          @click="$router.push('/teaching/report')"
          v-if="status != 2"
        >学习报告</div>
        <div class="record_btn_report" style="cursor:not-allowed" v-else>学习报告</div>
        <div class="record_btn_record">答题记录</div>
      </div>
      <!-- <p class="title">Alpha喵答题记录</p> -->
    </div>
    <div class="record_word">
      <div>
        题目总数：{{allSum}}
        <div class="dot1"></div>
      </div>
      <div>
        答对题目：{{rightSum}}
        <div class="dot2"></div>
      </div>
      <div>
        答错题目：{{errSum}}
        <div class="dot3"></div>
      </div>
    </div>
    <div v-if="showTopic&&showTopic.length == 0" class="no_topice">暂无答题记录喔~</div>
    <div v-else>
      <div class="flex jc-sa show">
        <div class="f18 fw550">显示范围</div>
        <div class="flex ai f16 cursor" @click="scope('all')">
          <img src="../../assets/images/report-act.png" alt="logo" v-if="showAll" />
          <img src="../../assets/images/report-err.png" alt="logo" v-else />
          <span class="ml-15">全部显示</span>
        </div>
        <div class="flex ai cursor" @click="scope">
          <img src="../../assets/images/report-act.png" alt="logo" v-if="!showAll" />
          <img src="../../assets/images/report-err.png" alt="logo" v-else />
          <span class="ml-15 f16">显示错题</span>
        </div>
      </div>
      <div class="frame"></div>
      <div class="record">
        <!-- 题目 -->
        <div class="titleKey" v-for="(item,index) in showTopic" :key="index">
          <div class="record_t_end" v-if="index == showTopic.length-1">
            <div class="record_endlong_end"></div>
            <div class="record_across"></div>
          </div>
          <div class="record_t" v-else>
            <div class="record_endlong"></div>
            <div class="record_across"></div>
          </div>
          <img src="../../assets/images/teaching_ic_lightbulb.png" class="titleKeyImg" alt />
          <div :class="index===0?'':'add'"></div>
          <div class="choice">
            <!-- 题目显示 -->
            <div class="choice-type-text" style="font-style: normal">{{showTepe(item.type)}}</div>
            <div class="choice-con">
              <div class="choice-title">
                <!-- <span class="choice-quan">题目</span> -->
                <span class="choice-timu" v-html="item.title"></span>
              </div>

              <!-- 填空题 -->
              <div class="answer_k" style=" padding: 95px 0 0 30px;" v-if="item.type>= 2">
                <!-- <span class="choice-quan">填空</span> -->
                <img src="../../assets/images/number_pic_cat_blue.png" class="fillingImg" alt />
                <div class="filling" v-for="(list,id) in item.filling || [] " :key="id">
                  <span>填空{{id+1}}</span>
                  <input type="text" :placeholder="list" :disabled="true" />
                </div>
              </div>

              <ul class="answer" style=" padding: 60px 0 0 30px;" v-else>
                <!-- <span class="choice-quan choice-one" >选项</span> -->
                <!-- 选项 -->
                <li
                  class="answer-li flex ai f16"
                  v-for="(list,i) in item.options"
                  :key="i"
                  :class="choice(list.name,item.answer,item.rightKey)"
                >
                  <span :class="item.type == 0?'answer-li-opt':'answer-li-opt-more'"></span>
                  <div class="flex ai">
                    <div>{{list.name.replace('选项', '')}}、</div>
                    <div v-html="list.optionContent" style="width:562px"></div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 解析 -->
            <div class="analysis">
              <img
                src="../../assets/images/wrong_pic_right.png"
                class="analysisImg"
                alt
                v-if="item.isRight"
              />
              <img src="../../assets/images/wrong_pic_wrong.png" class="analysisImg" alt v-else />
              <div class="analysis-title err_color" v-if="!item.isRight">很遗憾，答错了！请再接再厉！</div>
              <div class="analysis-title succ_color" v-else>恭喜你，答对了！太棒啦，继续保持！</div>
              <div class="analysis-dub">
                <span class="correct">
                  正确答案:
                  <span :class="item.isRight?'':'succ_color'">{{replaceAnswer(item.rightKey)}}</span>
                </span>
                <span class="correct ml-20">
                  您的答案:
                  <span :class="item.isRight?'':'err_color'">{{item.answer}}</span>
                </span>
              </div>
              <div class="choice-title" style="padding-top: 10px">
                题目解析:
                <div class="f14" v-html="item.analysis"></div>
              </div>
              <div class="choice-title comment">
                点评:
                <div class="f14" style="color:rgba(51,51,51,1);" v-html="item.comment"></div>
              </div>
            </div>
          </div>
          <!--按钮 -->
          <div class="look_btn">
            <el-button
              class="look_video"
              v-if="item.video"
              @click.native="CheckTextvideo(item.video.videoUploadId)"
            >查看讲解视频</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--视频讲解组件-->
    <el-dialog
      title="视频讲解"
      :visible.sync="centerDialogVisible"
      :before-close="DialogVisibleCenter"
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
import { getRecord, videoPlay } from "@/api/teaching.js";
export default {
  data() {
    return {
      Textvideo: "查看讲解视频",
      centerDialogVisible: false, //视频显示隐藏
      playAuth: "", //视频路径
      videoVid: "",
      bookContent: "", //板书内容,
      bookCt: false, //不显示板书,
      confirmOptions: "", //呼叫老师
      confirmNeed: "",
      SolveData: {},
      unknowId: "", //设为已解决需要的id
      showTV: true, //是否显示视频按钮

      showAll: true, //显示全部或错题
      allSum: 0, //全部题目
      rightSum: 0, //对的题目总数
      errSum: 0, //错的题目总数
      showTopic: [],
      loading: true,

      knowledgeId: "",
      studentId: "",

      status: 1 //为2是学习中，禁用报告按钮
    };
  },
  created() {
    //从本地拿参数
    let params = JSON.parse(sessionStorage.getItem("report"));
    let { knowledgeId, studentId, status } = params;
    this.knowledgeId = knowledgeId;
    this.studentId = studentId;
    this.status = status;
    //请求所有答题记录
    getRecord(knowledgeId, studentId)
      .then(res => {
        //渲染答题记录的题目
        this.showTopic = res.data;
        //渲染做对错题目数量
        this.allTopic(this.showTopic);
        this.loading = false;
        //渲染填空题
        let topic = this.showTopic.slice();
        topic.map((item, index) => {
          if (item.options.length === 0) {
            let filling = item.answer.split(",");
            this.showTopic[index].filling = filling;
          }
        });
      })
      .catch(err => {
        this.loading = false;
      });
  },
  mounted() {},
  methods: {
    //显示讲解视频
    CheckTextvideo(video) {
      if (video != null && video != "") {
        videoPlay(video).then(res => {
          this.playAuth = res.data;
          this.videoVid = video;
          this.centerDialogVisible = true;
        });
      } else {
        this.playAuth = "";
        this.videoVid = "";
        this.centerDialogVisible = true;
      }
      // let startStudy = JSON.parse(window.sessionStorage.getItem("startStudy"));
      // //video为Null就没有视频
      // if (video) {
      //   this.playAuth = video.videoUploadId;
      // } else {
      //   this.playAuth = "";
      // }
      // // this.bookContent = startStudy.bookContent;板书内容，暂时没有
      // this.centerDialogVisible = true;
    },

    //讲解视频隐藏
    DialogVisibleCenter() {
      this.centerDialogVisible = false;
      this.$refs.aliplayerVideo.pause();
    },

    //显示题目类型
    showTepe(type) {
      if (type === 0) {
        return "单选题";
      } else if (type === 1) {
        return "多选题";
      } else {
        return "填空题";
      }
    },

    //显示选择情况
    choice(value, selectList, realList) {
      let thisValue = value.replace("选项", "");
      let selectArr = selectList.split(",");
      let realArr = realList.split(",");
      let all = selectArr.concat(realArr);
      //是否选中
      if (all.includes(thisValue)) {
        let miss;
        let isRight;
        realArr.map((item, index) => {
          //是否漏选
          if (!selectArr.includes(item)) {
            if (item == thisValue) {
              miss = true;
            } else {
              miss = false;
            }
          }
          selectArr.map((list, key) => {
            //是否对错
            if (list == thisValue) {
              if (list == item) {
                isRight = true;
              }
            }
          });
        });
        if (miss) {
          return "right";
        } else {
          if (isRight) {
            return "right";
          } else {
            return "record_err red";
          }
        }
      } else {
        return "";
      }
    },

    //显示题目总数及对错数目
    allTopic(showTopic) {
      this.allSum = showTopic.length;
      let rightSum = 0;
      let errSum = 0;
      showTopic.forEach(item => {
        if (item.isRight) {
          rightSum = rightSum + 1;
        } else {
          errSum = errSum + 1;
        }
      });
      this.rightSum = rightSum;
      this.errSum = errSum;
    },

    //点击范围选择
    scope(all) {
      if (all === "all") {
        this.showAll = true;
        //请求所有答题记录
        getRecord(this.knowledgeId, this.studentId)
          .then(res => {
            //渲染答题记录的题目
            this.showTopic = res.data;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.showAll = false;
        //请求所有答错的答题记录
        getRecord(this.knowledgeId, this.studentId, 0)
          .then(res => {
            //渲染答题记录的题目
            this.showTopic = res.data;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //答案
    replaceAnswer(sads) {
      if (sads != undefined && sads.includes("$")) {
        return sads.replace(/\$/g, "'或'").replace(/\,/g, "','");
      } else {
        return sads;
      }
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: white;
  font-size: 50px;
  font-weight: 500;
}
.record_answer {
  margin: -20px -35px 0 -35px;
  position: relative;
}
.r_btn {
  display: flex;
  font-family: medium;
  font-size: 18px;
  font-weight: normal;
  line-height: 52px;
  text-align: center;
  position: absolute;
  top: 45px;
  left: 680px;
}
.record_btn_report {
  cursor: pointer;
  width: 166px;
  height: 52px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(211, 211, 211, 0.66);
  border-radius: 4px 0 0 4px;
  color: rgba(20, 17, 45, 1);
}
.record_btn_record {
  cursor: pointer;
  width: 166px;
  height: 52px;

  background: rgba(0, 103, 228, 1);
  box-shadow: 0px 0px 10px 0px rgba(159, 203, 255, 0.66);
  border-radius: 0 4px 4px 0;
  color: rgba(255, 255, 255, 1);
}

.top_img {
  height: 560px;
}
.record_word {
  position: absolute;
  font-family: Source Han Sans CN;
  top: 390px;
  left: 610px;
  font-size: 25px;
  font-weight: 550;
  line-height: 50px;
  z-index: 2;
}
.show {
  width: 460px;
  position: absolute;
  top: 561px;
  left: 1114px;
  align-items: center;
}
.frame {
  width: 1592px;
  height: 251px;
  border: 3px solid #0066e4;
  border-radius: 8px;
  background: #f7f7ff;
  margin: 0 auto;
  margin-top: 30px;
}
.record {
  width: 1530px;
  border: 1px solid #5598e9;
  background-color: white;
  border-radius: 5px;
  margin: 0 auto;
  margin-top: -221px;
}

.titleKey {
  margin-left: 49px;
  padding-left: 10px;
  border-left: 1px dashed #8ecefe;
  border-bottom: 1px dashed #8ecefe;
  position: relative;
  margin-bottom: 50px;
  margin-right: 35px;
  .titleKeyImg {
    position: absolute;
    left: 0px;
    top: 0px;
    transform: translateX(-50%);
  }
}
.choice {
  width: 1400px;
  margin-top: 40px;
  margin-left: 35px;
  position: relative;
  z-index: 99;
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 50px 0px rgba(48, 51, 45, 0.15);
  border-radius: 6px;
  .choice-con {
    display: flex;
  }
  .choice-title {
    margin-bottom: 25px;
    flex: 1;
    padding-top: 50px;
    position: relative;
    padding-right: 20px;
    line-height: 25px;
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
    padding: 50px 0 0 90px;
    min-height: 350px;
  }
  .answer-li {
    padding-left: 25px;
    padding-bottom: 15px;
    .answer-li-opt {
      display: inline-block;
      width: 31px;
      height: 31px;
      margin-right: 10px;
      background: url(../../assets/images/select-border.png);
    }
    .answer-li-opt-more {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-right: 10px;
      background: url(../../assets/images/select--and-border.png);
    }
    .answer-li-name {
      display: inline-block;
      line-height: 25px;
      font-size: 16px;
      vertical-align: 11px;
    }
  }
  .right .answer-li-opt {
    background: url(../../assets/images/wrong_ic_radio_right.png);
  }
  .record_err .answer-li-opt {
    background: url(../../assets/images/wrong_ic_radio_wrong.png);
  }
  .miss .answer-li-opt {
    background: url(../../assets/images/class_ic_star_one.png);
  }

  .right .answer-li-opt-more {
    background: url(../../assets/images/wrong_ic_many_right.png);
  }
  .record_err .answer-li-opt-more {
    background: url(../../assets/images/wrong_ic_many_wrong.png);
  }
  .miss .answer-li-opt-more {
    background: url(../../assets/images/select--and-border.png);
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

.choice-one {
  position: absolute;
  left: 40px;
  top: 56px;
}
.look_btn {
  margin: 30px 0 30px 1250px;
}
.add {
  border-left: 1px dashed #8ecefe;
  position: absolute;
  top: -50px;
  left: -1px;
  height: 50px;
}

.choice-type-text {
  background: url("../../assets/images/teaching_ic_label.png");
}
.dot1 {
  position: absolute;
  top: 8px;
  left: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcebfe;
  z-index: -1;
}
.dot2 {
  position: absolute;
  top: 58px;
  left: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcebfe;
  z-index: -1;
}
.dot3 {
  position: absolute;
  top: 108px;
  left: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcebfe;
  z-index: -1;
}
.succ_color {
  color: #4fcd3e;
}
.err_color {
  color: #fe4542;
}
.analysis {
  font-size: 16px;
  line-height: 35px;
}
.cursor {
  cursor: pointer;
}
.red {
  color: red;
}
.loading {
  position: fixed;
  top: 80px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 20;
}
.record_endlong {
  width: 2px;
  height: 16px;
  background: rgba(141, 207, 255, 1);
}
.record_across {
  width: 12px;
  height: 2px;
  background: rgba(141, 207, 255, 1);
}
.record_t {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -8px;
  left: -1px;
}
.record_endlong_end {
  width: 2px;
  height: 8px;
  background: rgba(141, 207, 255, 1);
}

.record_t_end {
  display: flex;
  align-items: baseline;
  position: absolute;
  bottom: -1.5px;
  left: -1px;
}

.answer_k {
  flex: 1;
  position: relative;
  border-left: 1px dashed #bfbfbf;
  padding: 50px 0 0 0;
  min-height: 350px;
}
.fillingImg {
  height: 60px;
  position: absolute;
  right: 45px;
  top: 45px;
  z-index: 99;
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
.look_video {
  width: 148px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(137, 189, 252, 1) 0%,
    rgba(12, 110, 230, 1) 100%
  );
  border-radius: 4px;
  font-size: 14px;
  font-family: medium;
  color: rgba(255, 255, 255, 1);
}
.record_answer .comment {
  color: rgba(0, 103, 228, 1);
  margin-top: -65px;
}
.no_topice{
  font-size: 18px;
  font-weight: 500;
  text-align: center;

  color: #666666;
  font-family: medium;
}
</style>
