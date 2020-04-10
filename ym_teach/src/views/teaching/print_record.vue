<template>
  <div class="appraisal_record" v-loading.fullscreen="showReport">
    <!-- 打印用的图片 -->
    <div ref="printImg" v-show="printImg">
      <img :src="printImg" alt="logo" style="margin:-800px 0px 0px -100px;" />
    </div>
    <!-- 头部 -->
    <!-- 中部 -->
    <div class="appraisal_main_box">
      <div class="main_white" ref="print">
        <!-- 打印的头部 -->
        <div class="print">
          <!-- <div class="print_report">
            <img src="../../assets/images/appraisal/report-printer.png" alt="logo" />
            <div style="margin-left: 10px;">打印报告</div>
          </div>-->
          <img
            style="width:80px;margin-left: 20px"
            src="../../assets/images/appraisal/printing--logo.png"
            alt="logo"
          />
          <img src="../../assets/images/appraisal/logo.png" alt="logo" />
          <div class="print_china">Alpha喵学前评测答题记录</div>
          <div class="print_english">Answer record</div>
          <div class="print_three_line" style="width:955px"></div>
          <div class="print_three_line" style="width:755px"></div>
          <div class="print_three_line" style="width:555px"></div>
          <ul class="print_bottom">
            <li>
              <span>学生姓名：</span>
              <span>{{top.name}}</span>
              <span class="print_bottom_line">|</span>
            </li>
            <li>
              <span>测试课程：</span>
              <span>{{top.course}}</span>
              <span class="print_bottom_line">|</span>
            </li>
            <li>
              <span>测试时间：</span>
              <span>{{top.endTime}}</span>
              <span class="print_bottom_line">|</span>
            </li>
            <li>
              <span>测试用时：</span>
              <span>{{top.time}}</span>
            </li>
          </ul>
        </div>
        <!-- 白色背景部分 -->
        <div class="main_white_top">
          <p>
            <img
              class="main_white_top_img"
              src="../../assets/images/appraisal/a-r-ico.png"
              alt="logo"
            />
          </p>
          <div class="main_white_top_t">
            <div class="main_white_top_l">
              <div>我的正确率：</div>
              <div class="main_white_top_l_pr">{{Math.floor((rightQue/allQue)*100)}}%</div>
            </div>
            <!-- <div class="main_white_top_r pointer" @click="showErr">
              <img src="../../assets/images/appraisal/a-r-default.png" alt="logo" v-if="showRight" />
              <img src="../../assets/images/appraisal/a-r-choice.png" alt="logo" v-else />
              <div :style="showRight?'':'color:rgba(51,51,51,1);'">仅显示错题</div>
            </div>-->
          </div>
          <div class="main_white_top_b">
            <div>总做题：{{allQue}}题</div>
            <div class="main_white_top_b_line"></div>
            <div>答对题数：{{rightQue}}题</div>
            <div class="main_white_top_b_line"></div>
            <div>答错题数：{{allQue-rightQue}}题</div>
            <div></div>
          </div>
        </div>
        <ul v-if="question.length == 0">
          <li style="text-align: center;font-size: 21px;padding-bottom: 20px;">你没有错题喔~</li>
        </ul>
        <ul v-else>
          <li class="main_white_bottom" v-for="(item,index) in question" :key="index">
            <div class="main_white_bottom_time">
              <div v-text="delTime(item.time)"></div>
              <div v-text="average(item.questionItem.difficulty)"></div>
              <div>本题难度：{{item.questionItem.difficulty}}级</div>
            </div>
            <!-- 题目 -->
            <div class="main_white_bottom_title">
              <div>
                <span>{{index+1}}、</span>
                <span
                  style="color: rgba(251,0,0,1);margin-right:21px"
                >[{{item.questionItem.type==0?"单选":item.questionItem.type==1?"多选":"填空"}}]</span>
              </div>
              <div style="width: 800px" v-html="item.questionItem.title"></div>
            </div>
            <!-- 单选 -->
            <div
              class="main_white_bottom_choice"
              v-if="item.questionItem.type==0 ||item.questionItem.type==1 "
            >
              <div
                class="flex ai"
                style="margin-bottom: 30px"
                v-for="(options,optionsIndex) in item.questionItem.cmsOptionList"
                :key="optionsIndex"
              >
                <div class="flex ai">
                  <img
                    src="../../assets/images/select-border.png"
                    alt="logo"
                    v-if="!item.questionItem.rightKey.split('').includes(options.name.substr(2))"
                  />
                  <img src="../../assets/images/select-succ.png" alt="logo" v-else />
                  <div style="margin-left: 20px;">{{options.name.substr(2)}}、</div>
                </div>
                <div style="width: 835px" v-html="options.optionContent"></div>
              </div>
            </div>
            <!-- 多选 -->
            <!-- <div class="main_white_bottom_choice" v-if="item.questionItem.type==1">
              <div class="flex ai" style="margin-bottom: 30px">
                <div class="flex ai">
                  <img src="../../assets/images/select--and-border.png" alt="logo" v-if="true" />
                  <img src="../../assets/images/select-and-succ.png" alt="logo" v-else />
                  <div style="margin-left: 20px;">A、</div>
                </div>
                <div style="width: 855px">6</div>
              </div>
            </div>-->
            <!-- 答案 -->
            <div class="main_white_bottom_answer">
              <div>正确答案：</div>
              <div class="main_white_bottom_answer_right">{{item.questionItem.rightKey}}</div>
              <div style="margin-left: 77px;">您的答案：</div>
              <div
                :class="item.isright ==1 ? 'main_white_bottom_answer_right':'main_white_bottom_answer_err'"
              >{{item.answer}}</div>
            </div>
            <!-- 题目解析 -->
            <div class="main_white_bottom_analysis">
              <div class="main_white_bottom_analysis_t">题目解析：</div>
              <div v-html="item.questionItem.analysis"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getEvaluateRecord } from "@/api/teaching.js";
export default {
  data() {
    return {
      showRight: true, //显示错题
      printImg: "", //打印报告的base64
      showReport: false, //显示打印报告
      renderData: { data: "渲染" }, //渲染数据
      allQue: "",
      rightQue: "",
      question: [],
      top: {}
    };
  },
  created() {
    //渲染顶部数据
    this.top = JSON.parse(sessionStorage.getItem("evaluationRecord"));
    //请求数据
    let showRight = sessionStorage.getItem("showRight")
    if (showRight) {
      this.init(JSON.parse(showRight) ? "" : "0");
    } else {
      this.init("");
    }
  },
  mounted() {
    //回到顶部
    // let main = document.getElementById("back-top");
    // console.log(main);
    // main.scrollTop = 0;
  },
  methods: {
    init(right) {
      let evaluatingData = JSON.parse(sessionStorage.getItem("evaluatingData"));
      let courseId = evaluatingData.courseId;
      let studentId = evaluatingData.studentId;
      getEvaluateRecord(courseId, studentId, right)
        .then(res => {
          this.renderData = res;
          this.allQue = res.data.allQue;
          this.rightQue = res.data.rightQue;
          this.righthit = res.data.righthit;
          this.question = res.data.res;
          //打印
          let self = this;
          this.$nextTick(() => {
            setTimeout(() => {
              document.getElementsByTagName("body")[0].style.zoom = 0.75;
              sessionStorage.setItem("refresh", 1);
              window.print();
              //跳转
              let courseId = JSON.parse(
                sessionStorage.getItem("evaluatingData")
              ).courseId;
              let studentId = JSON.parse(
                sessionStorage.getItem("evaluatingData")
              ).studentId;
              let evaluationRecord = JSON.parse(
                window.sessionStorage.getItem("evaluationRecord")
              );
              let urlname = encodeURIComponent(evaluationRecord.name); //编码
              let urlcourse = encodeURIComponent(evaluationRecord.course); //编码
              let urlendTime = encodeURIComponent(evaluationRecord.endTime); //编码
              let urltime = encodeURIComponent(evaluationRecord.time); //编码
              this.$router.push({
                path: "/teaching/appraisal_record",
                query: {
                  courseId: courseId,
                  studentId: studentId,
                  course: urlcourse,
                  endTime: urlendTime,
                  name: urlname,
                  time: urltime
                }
              });
            }, 500);
          });
        })
        .catch(res => {});
    },

    //平均正确率
    average(difficulty) {
      let rand = Math.floor(Math.random() * 9 + 1);
      let average = 100 - difficulty * 5 + rand;
      if (average >= 98) {
        return "本题平均正确率：98%";
      } else {
        return `本题平均正确率：${average}%`;
      }
    },

    //把秒变成分秒
    delTime(time) {
      var minutes = parseInt(time / 60);
      var seconds = parseInt(time % 60);
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return `答题时间：${minutes}:${seconds}min`;
    },

    //点击仅显示错
    showErr() {
      this.showRight = !this.showRight;
      this.init(this.showRight ? "" : "0");
    },

    //点击打印报告
    print() {
      // window.print();
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.appraisal_record {
  position: relative;
}
.top_botton {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  line-height: 52px;
  text-align: center;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  box-shadow: 0px 0px 10px 0px rgba(27, 84, 220, 0.66);
  .top_btn_report {
    cursor: pointer;
    width: 166px;
    height: 52px;
    border-radius: 4px 0 0 4px;
    color: rgba(20, 17, 45, 1);
    background: rgba(255, 255, 255, 1);
  }
  .top_btn_record {
    cursor: pointer;
    width: 166px;
    height: 52px;
    border-radius: 0 4px 4px 0;
    background: rgba(0, 103, 228, 1);
    color: rgba(255, 255, 255, 1);
  }
}
.top_print {
  position: absolute;
  top: 100px;
  right: 345px;
  cursor: pointer;
  .top_print_img {
    width: 25px;
  }
  .top_print_word {
    font-size: 13px;
    line-height: 28px;
    vertical-align: top;
    margin-left: 5px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
}
.top_bottom {
  position: absolute;
  top: 414px;
  right: 348px;
  color: white;
  .top_bottom_chinese {
    margin-top: 10px;
    font-size: 48px;
    font-family: medium;
    color: rgba(255, 255, 255, 1);
  }
  .top_bottom_english {
    margin-bottom: 25px;
    font-size: 48px;
    font-family: light;
    font-weight: 200;
    color: rgba(255, 255, 255, 1);
  }
  .top_word {
    display: flex;
    font-size: 18px;
    margin-top: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
  .top_line {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.appraisal_main_box {
  position: relative;
  z-index: 2;
  .main_background1 {
    position: absolute;
    top: 450px;
    right: 10px;
    z-index: -1;
    width: 450px;
  }
  .main_background2 {
    position: absolute;
    top: 1400px;
    z-index: -1;
    width: 650px;
  }
  .main_block {
    position: absolute;
    top: 19px;
    left: 50%;
    transform: translateX(-50%);
    width: 1054px;
    height: 26px;
    background: rgba(36, 2, 193, 1);
    border-radius: 13px;
    z-index: -1;
  }
  .main_block-light {
    position: absolute;
    top: 27px;
    left: 50%;
    transform: translateX(-50%);
    width: 1019px;
    height: 3px;
    background: rgba(21, 1, 115, 1);
    border-radius: 2px;
  }
  .main_white {
    margin: 0 auto;
    width: 1020px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    .main_white_top {
      position: relative;
      padding: 0 60px;
      .main_white_top_img {
        position: absolute;
        top: 30px;
        left: 30px;
      }
      .main_white_top_t {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 45px 0 30px 0;
        .main_white_top_l {
          font-size: 22px;
          font-family: medium;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          display: flex;
          line-height: 42px;
          .main_white_top_l_pr {
            font-size: 30px;
            font-family: medium;
            font-weight: 800;
            color: rgba(14, 112, 231, 1);
          }
        }
        .main_white_top_r {
          font-size: 16px;
          font-family: medium;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
          display: flex;
          width: 120px;
          height: 22px;
          line-height: 22px;
          justify-content: space-around;
        }
        .main_white_top_r:hover {
          color: rgba(18, 116, 211, 1);
        }
      }
      .main_white_top_b {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: medium;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 19px;
        .main_white_top_b_line {
          width: 1px;
          height: 16px;
          border: 1px solid rgba(229, 229, 229, 1);
          margin-left: 22px;
          margin-right: 10px;
        }
      }
    }
    .main_white_bottom {
      width: 934px;
      margin: 0 auto;
      border-top: 1px solid rgba(229, 229, 229, 1);
      .main_white_bottom_time {
        display: flex;
        justify-content: space-between;
        width: 934px;
        height: 50px;
        background: rgba(249, 249, 249, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 50px;
        margin-top: 27px;
        padding: 0 35px 0 28px;
      }
      .main_white_bottom_title {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        display: flex;
        margin-top: 26px;
        margin-bottom: 36px;
      }
      .main_white_bottom_choice {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
      .main_white_bottom_answer {
        width: 934px;
        height: 50px;
        background: rgba(249, 249, 249, 1);
        border-radius: 4px;
        display: flex;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 50px;
        padding-left: 35px;
        .main_white_bottom_answer_err {
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 700;
          color: rgba(225, 3, 65, 1);
          margin-left: 10px;
        }
        .main_white_bottom_answer_right {
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 700;
          color: rgba(0, 170, 108, 1);
          margin-left: 10px;
        }
      }
      .main_white_bottom_analysis {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding-left: 35px;
        padding-bottom: 70px;
        .main_white_bottom_analysis_t {
          font-size: 16px;
          font-family: medium;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          margin: 19px 0 28px 0;
        }
      }
    }
  }
}
.print {
  padding: 43px 30px 50px 35px;
  .print_report {
    font-size: 15px;
    font-family: medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .print_china {
    font-size: 40px;
    font-family: medium;
    font-weight: bold;
    color: #333333;
  }
  .print_english {
    font-size: 40px;
    font-family: medium;
    font-weight: 200;
    color: #333333;
  }
  .print_bottom {
    font-size: 14px;
    font-family: medium;
    font-weight: 500;
    color: #333333;
    display: flex;
    margin-top: 10px;
    .print_bottom_line {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .print_three_line {
    height: 1px;
    background: rgba(51, 51, 51, 1);
    margin-bottom: 2px;
  }
}
.go_top {
  // position: absolute;
  // bottom: 150px;
  // right: 190px;
  z-index: 20;
  font-size: 16px;
  font-family: medium;
  font-weight: 500;
  font-style: italic;
  color: rgba(255, 255, 255, 1);
  border-bottom: 1px solid rgba(41, 25, 185, 1);
}
.go_top_img {
  position: relative;
  top: 0px;
  left: 0px;
  margin-left: 2px;
}
.go_top_img:hover {
  animation: mymove 0.5s linear 0 infinite alternate;
  -webkit-animation: mymove 0.5s infinite; /*Safari and Chrome*/
}
@keyframes mymove {
  0% {
    top: 0px;
    opacity: 1;
  }
  98% {
    top: -10px;
    opacity: 1;
  }
  99% {
    top: -10px;
    opacity: 0;
  }
  100% {
    top: 0px;
    opacity: 1;
  }
}
@-webkit-keyframes mymove {
  0% {
    top: 0px;
    opacity: 1;
  }
  98% {
    top: -10px;
    opacity: 1;
  }
  99% {
    top: -10px;
    opacity: 0;
  }
  100% {
    top: 0px;
    opacity: 1;
  }
}
.pointer {
  cursor: pointer;
}
</style>
<style >
.appraisal_record .el-backtop {
  background: none;
  width: 70px;
  height: 0px;
}
</style>
