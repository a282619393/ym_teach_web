<template>
  <div class="appraisal_report" v-loading.fullscreen="showReport" ref="printHing">
    <!-- 打印用的图片 -->
    <div ref="printImg" v-show="printImg">
      <img :src="printImg" alt="logo" />
    </div>
    <!-- 中部 -->
    <div class="appraisal_main_box">
      <div class="main_white" ref="print">
        <!-- 打印的头部 -->
        <div class="print" v-show="true">
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
          <div class="print_china">Alpha喵学前评测报告</div>
          <div class="print_english">Learning Report</div>
          <div class="print_three_line" style="width:955px;margin-top:5px;"></div>
          <div class="print_three_line" style="width:755px"></div>
          <div class="print_three_line" style="width:555px;margin-bottom:5px;"></div>
          <ul class="print_bottom">
            <li>
              <span>学生姓名：</span>
              <span>{{renderData.reports&&renderData.reports[0].studentName}}</span>
              <span class="print_bottom_line">|</span>
            </li>
            <li>
              <span>测试课程：</span>
              <span>{{renderData.reports&&renderData.reports[0].course}}</span>
            </li>
          </ul>
          <ul class="print_bottom">
            <li>
              <span>测试时间：</span>
              <span>{{renderData.reports&&renderData.reports[0].endTime}}</span>
              <span class="print_bottom_line">|</span>
            </li>
            <li>
              <span>测试用时：</span>
              <span v-html="delTime(renderData.times)"></span>
            </li>
          </ul>
        </div>
        <!-- 白色背景部分 -->
        <ul>
          <!-- 1、评测用时 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">01</div>
              <div class="title_word">评测用时</div>
            </div>
            <div class="main_time">
              <div
                v-if="renderData.times/772>=1"
                class="main_time_progress main_time_progress_full"
                style="width:760px"
              ></div>
              <div v-else class="main_time_progress" :style="`width:${renderData.times/772*760}px`"></div>
              <img
                src="../../assets/images/appraisal/l-r-use time.png"
                alt="logo"
                class="main_time_img"
              />
              <div class="main_time_left">
                <div>【我的】</div>
                <div>【全国平均】</div>
              </div>
              <div class="main_time_right">
                <div class="main_time_right_my">
                  <span v-html="delTime(renderData.times,'slice').minutes"></span>
                  <span class="f_12">分</span>
                  <span v-html="delTime(renderData.times,'slice').seconds"></span>
                  <span class="f_12">秒</span>
                </div>
                <div class="main_time_right_all">
                  <span>12</span>
                  <span class="f_12">分</span>
                  <span>52</span>
                  <span class="f_12">秒</span>
                </div>
              </div>
            </div>
            <div style="height: 40px"></div>
          </li>
          <!-- 2、知识点掌握情况 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">02</div>
              <div class="title_word">知识点掌握情况</div>
            </div>
            <div class="echart">
              <!-- <canvas ref="cavsElem" style="margin-left: 10px">您的浏览器不支持canvas，请升级浏览器</canvas> -->
              <div id="myChart" style="pointer-events: none;"></div>
              <div class="echart_master_bottom">
                <span>知识点总数量：</span>
                <span>{{renderData.knowledgeCount}}</span>
                <!-- <span class="echart_master_line">|</span>
                <span>知识点掌握率：</span>
                <span class="echart_master_per">{{renderData.graspHit*100}}%</span>-->
              </div>
            </div>
            <div class="knowledge" v-for="(item,index) in renderData.reports" :key="index">
              <span class="knowledge_title">{{index+1}}.{{item.knowledge}}</span>
              <div class="knowledge_tabe_top">
                <div class="knowledge_tabe_top_left">知识点简介</div>
                <div class="knowledge_tabe_top_right">前置知识点</div>
              </div>
              <div class="knowledge_content">
                <div class="knowledge_content_left">{{item.pointIntro?item.pointIntro:""}}</div>
                <div class="knowledge_content_right">{{item.beforKnowledge?item.beforKnowledge:""}}</div>
              </div>
              <div class="knowledge_img">
                <div>
                  <span class="knowledge_img_word">难度</span>
                  <span v-for="dif in [1,2,3]" :key="dif" class="knowledge_img_img">
                    <img
                      v-if="item.difficulty >=dif"
                      src="../../assets/images/appraisal/l-r-difficulty-choice.png"
                      alt="logo"
                    />
                    <img
                      v-else
                      src="../../assets/images/appraisal/l-r-difficulty-default.png"
                      alt="logo"
                    />
                  </span>
                </div>
                <div>
                  <span class="knowledge_img_word">掌握情况</span>
                  <span v-for="gra in [0,1,2]" :key="gra" class="knowledge_img_img">
                    <img
                      v-if="item.grasp >= gra"
                      src="../../assets/images/appraisal/l-r-situation-choice.png"
                      alt="logo"
                    />
                    <img
                      v-else
                      src="../../assets/images/appraisal/l-r-situation-default.png"
                      alt="logo"
                    />
                  </span>
                </div>
                <div>
                  <span class="knowledge_img_word">平均掌握情况</span>
                  <span v-if="item.difficulty <= 2" class="knowledge_img_img">
                    <img src="../../assets/images/appraisal/l-r-situation-choice.png" alt="logo" />
                    <img src="../../assets/images/appraisal/l-r-situation-choice.png" alt="logo" />
                    <img src="../../assets/images/appraisal/l-r-situation-default.png" alt="logo" />
                  </span>
                  <span v-else class="knowledge_img_img">
                    <img src="../../assets/images/appraisal/l-r-situation-choice.png" alt="logo" />
                    <img src="../../assets/images/appraisal/l-r-situation-default.png" alt="logo" />
                    <img src="../../assets/images/appraisal/l-r-situation-default.png" alt="logo" />
                  </span>
                </div>
              </div>
            </div>
            <div class="summary">
              <div class="summary_title">知识点总结</div>
              <div class="summary_tabe_top">
                <div class="summary_tabe_top_left">掌握较好</div>
                <div class="summary_tabe_top_center">掌握一般</div>
                <div class="summary_tabe_top_right">掌握较差</div>
              </div>
              <div class="summary_tabe_content" v-for="(sum,sId) in summery" :key="sId">
                <div class="summary_tabe_content_main">{{renderData.graspList2[sId]}}</div>
                <div class="summary_tabe_content_main">{{renderData.graspList1[sId]}}</div>
                <div class="summary_tabe_content_main">{{renderData.graspList0[sId]}}</div>
              </div>
            </div>
            <div style="height: 40px"></div>
          </li>
          <!-- 3、答题情况 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">03</div>
              <div class="title_word">答题情况</div>
            </div>
            <div class="cavs">
              <div class="cavs_label">
                <div class="cavs_labe_word">
                  <div class="cavs_labe_blue"></div>
                  <span>平均正确率：</span>
                  <span class="fw600">{{mean*100}}%</span>
                </div>
                <div class="cavs_labe_word">
                  <div class="cavs_labe_gold"></div>
                  <span>我的正确率：</span>
                  <span class="fw600">{{my}}%</span>
                </div>
                <div class="cavs_labe_big" style="margin-top: 32px;">
                  <span>答题总数：</span>
                  <span class="fw600">{{renderData.questionCount}}</span>
                </div>
                <div class="cavs_labe_big">
                  <div class="cavs_labe_blue"></div>
                  <span>答对题数：</span>
                  <span class="fw600">{{renderData.rightCount}}</span>
                </div>
                <div class="cavs_labe_big" style="margin-bottom: 16px;">
                  <div class="cavs_labe_red"></div>
                  <span>答错题数：</span>
                  <span class="fw600">{{renderData.wrongCount}}</span>
                </div>
                <div class="cavs_labe_big" style="margin-top: 16px;">
                  <span>测试用时：</span>
                  <span class="fw600" v-html="delTime(renderData.times)"></span>
                </div>
              </div>
              <canvas ref="cavs" style="margin-top: 10px" class="cavs_img">您的浏览器不支持canvas，请升级浏览器</canvas>
              <div class="cavs_my">{{my}}%</div>
              <!-- 平均率小于30%就用这个 -->
              <!-- <div class="cavs_average_one">
                <div class="cavs_average_one"></div>
                <div class="cavs_average_one_pr">1%</div>
              </div>-->
              <!-- 平均率大于30%就用这个 -->
              <div class="cavs_average">
                <div class="cavs_average_line">
                  <div class="cavs_average_line_left"></div>
                  <div class="cavs_average_line_right"></div>
                </div>
                <div class="cavs_average_pr">{{mean*100}}%</div>
              </div>
            </div>
            <div class="answer_card">
              <div class="answer_card_word">
                <span style="color:rgba(13, 110, 243, 1)">【</span>
                <span>答题卡</span>
                <span style="color:rgba(13, 110, 243, 1)">】</span>
              </div>
              <div class="answer_card_ml157" style="margin-top: 29px;">
                <div class="answer_card_sort"></div>
                <div class="answer_card_long"></div>
              </div>
              <div
                :class="renderData.rightList&&renderData.rightList.length<=16?'answer_card_img answer_card_img_center':'answer_card_img'"
              >
                <div
                  v-for="(card,c) in renderData.rightList"
                  :key="c"
                  :class="card==0?'answer_card_img_red':'answer_card_img_blue'"
                >{{c+1}}</div>
              </div>
              <div class="answer_card_ml562">
                <div class="answer_card_sort" style="margin-left: 34px;"></div>
                <div class="answer_card_long"></div>
              </div>
            </div>
            <div style="height: 40px"></div>
          </li>
          <!-- 4、能力 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">04</div>
              <div class="title_word">能力</div>
            </div>
            <div class="ability">
              <div class="ability_word end_word">
                <div style="margin-bottom: 46px;" v-for="(power,p) in ability" :key="p">
                  <div class="ability_word_title">{{p+1}}.{{power.name}}</div>
                  <div v-html="`&#12288;&#12288;${power.intro}`"></div>
                </div>
              </div>
              <img src="../../assets/images/appraisal/l-r-ability.png" alt="logo" />
            </div>
            <div style="height: 40px"></div>
          </li>
          <!-- 5、方法 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">05</div>
              <div class="title_word">方法</div>
            </div>
            <div class="way_word">
              <div class="end_word" v-for="(method,m) in way" :key="m">
                <div class="end_word_title">{{m+1}}.{{method.name}}</div>
                <div style="margin-bottom:25px" v-html="`&#12288;&#12288;${method.intro}`"></div>
              </div>
            </div>
            <div style="height: 40px"></div>
          </li>
          <!-- 6、学习建议 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">06</div>
              <div class="title_word">学习建议</div>
            </div>
            <div class="suggest">
              <div class="suggest_img">
                <img src="../../assets/images/appraisal/l-r-learning suggestions.png" alt="logo" />
                <div class="suggest_img_word">
                  <p>{{renderData.reports&&renderData.reports[0].course}}</p>
                </div>
              </div>
              <div class="end_word suggest-word" v-html="`&#12288;&#12288;${suggest}`"></div>
            </div>
            <div style="height: 40px"></div>
          </li>
          <!-- 7、测评总结 -->
          <li>
            <div class="main_title">
              <img src="../../assets/images/appraisal/l-r-ico.png" alt="logo" class="title_img" />
              <div class="title_nmbuer">07</div>
              <div class="title_word">测评总结</div>
            </div>
            <div
              class="end_word appraisal_suumary"
              v-show="option.series[0].data[0].value<=0.39"
            >&#12288;&#12288;基础知识比较薄弱，对于简单问题缺乏解决方案。后续的学习中，要多练习基础知识，相信自己，努力总能进步。</div>
            <div
              class="end_word appraisal_suumary"
              v-show="option.series[0].data[0].value<=0.79 && option.series[0].data[0].value>=0.40"
            >&#12288;&#12288;基础比较扎实，知识掌握较好，对于简单问题能比较好的解决。对于中等难度的问题也能比较准确的给出答案。但是对于综合性的较难的问题还需要做更多的思考。加油，你可以更优秀。</div>
            <div
              class="end_word appraisal_suumary"
              v-show="option.series[0].data[0].value>=0.8"
            >&#12288;&#12288;基础扎实，对知识的理解比较深刻，简单与中等难度的问题能很好地解决，对综合问题也具备一定的解答能力。但是对于难题的解决还需要更多针对性学习。加油，优秀如你，一定会更好的。</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getEvaluateReport } from "@/api/teaching.js";
export default {
  data() {
    return {
      printImg: "", //打印报告的base64
      showReport: false, //显示打印报告
      summery: [], //2的知识点总结的数组长度
      my: "", //我的正确率
      mean: "", //平均正确率
      ability: {}, //能力
      way: {}, //方法
      suggest: {}, //建议
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/> {d}%"
        },
        legend: {
          orient: "vertical",
          right: 210,
          top: 110,
          bottom: 20,
          icon: "circle", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          itemWidth: 17, // 设置宽度
          itemHeight: 17, // 设置高度
          itemGap: 43 // 设置间距
        },
        series: [
          {
            type: "pie",
            radius: ["46%", "70%"],
            label: {
              normal: {
                textStyle: {
                  fontWeight: 300,
                  fontSize: 18 //文字的字体大小
                },
                formatter: function(data) {
                  return data.percent.toFixed(0) + "%";
                }
              }
            },
            data: [
              {
                value: 1,
                name: "掌握较好",
                itemStyle: {
                  normal: {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      { offset: 0, color: "#3E23B2" },
                      { offset: 1, color: "#9849DE" }
                    ])
                  }
                }
              },
              {
                value: 1,
                name: "掌握一般",
                itemStyle: {
                  normal: {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#38C7F8" },
                      { offset: 1, color: "#1680DD" }
                    ])
                  }
                }
              },
              {
                value: 1,
                name: "掌握较差",
                itemStyle: {
                  normal: {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      { offset: 0, color: "#DCDCDC" },
                      { offset: 1, color: "#DCDCDC" }
                    ])
                  }
                }
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      renderData: {
        data: "渲染1"
      } //渲染数据
    };
  },
  created() {},
  mounted() {
    let evaluatingData = JSON.parse(sessionStorage.getItem("evaluatingData"));
    let courseId = evaluatingData.courseId;
    let studentId = evaluatingData.studentId;
    //请求数据
    getEvaluateReport(courseId, studentId).then(res => {
      //保存返回数据
      this.renderData = res.data;
      //判断知识点总结，那个数组长度最长
      let arr = [];
      arr.push(this.renderData.graspList0.length);
      arr.push(this.renderData.graspList1.length);
      arr.push(this.renderData.graspList2.length);
      var max = Math.max.apply(null, arr);
      this.summery.length = max;
      //知识点掌握情况的饼图数据
      let god = this.renderData.graspList2.length;
      let soso = this.renderData.graspList1.length;
      let bad = this.renderData.graspList0.length;
      let sum = god + soso + bad;
      this.option.series[0].data[0].value = god / sum;
      this.option.series[0].data[1].value = soso / sum;
      this.option.series[0].data[2].value = bad / sum;
      //我的正确率
      this.my = Math.floor(
        (this.renderData.rightCount / this.renderData.questionCount) * 100
      );
      //后面的，能力，方法，建议的数据
      let end = JSON.parse(this.renderData.s);
      this.ability = end.data[2].abilityMap;
      this.way = end.data[3].methodMap;
      this.suggest = end.data[0].proposal;
      //更改地址栏参数
      let data = JSON.stringify(this.renderData);
      let url = encodeURIComponent("url" + data); //编码
      window.location.href = window.location.href.replace(/url.*/g, url);
      //答题记录页面要的参数
      let evaluationRecord = {};
      evaluationRecord.name =
        res.data.reports && res.data.reports[0].studentName;
      evaluationRecord.course = res.data.reports && res.data.reports[0].course;
      evaluationRecord.endTime =
        res.data.reports && res.data.reports[0].endTime;
      evaluationRecord.time = this.delTime(res.data.times);
      sessionStorage.setItem(
        "evaluationRecord",
        JSON.stringify(evaluationRecord)
      );
      this.$nextTick(() => {
        //答题情况双圆环
        this.annulus(this.my / 100);
        //初始化图表插件
        let myChart = echarts.init(document.getElementById("myChart"));
        myChart.setOption(this.option, true);
        //打印
        let self = this;
        this.$nextTick(() => {
          setTimeout(() => {
            document.getElementsByTagName("body")[0].style.zoom = 0.7;
            sessionStorage.setItem("refresh", 1);
            window.print()
            let evaluatingData = JSON.parse(
              sessionStorage.getItem("evaluatingData")
            );
            let courseId = evaluatingData.courseId;
            let studentId = evaluatingData.studentId;
            self.$router.push({
              path: "/teaching/appraisal_report",
              query: { courseId: courseId, studentId: studentId }
            });
          }, 500);
        });
      });
    });
  },
  methods: {
    //答题记录
    AnswerRecord() {
      let courseId = JSON.parse(sessionStorage.getItem("evaluatingData"))
        .courseId;
      let studentId = JSON.parse(sessionStorage.getItem("evaluatingData"))
        .studentId;
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
    },
    // 答题情况双圆环
    annulus(my) {
      //canvas进度条
      var canvas = this.$refs.cavs;
      let ctx = canvas.getContext("2d");
      //最终百分比
      let circleX = canvas.width / 2.5; // 中心x坐标
      let circleY = canvas.height / 1.05; //中心y坐标
      canvas.width = 262;
      canvas.height = 262;
      let radius = 100; //圆环半径
      let lineWidth = 13; // 圆形线条的宽度
      this.mean = Math.floor(Math.random() * 20 + 65) / 100;
      let one = this.mean;
      let two = my;
      //画弧线01
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      // 渐变色 - 可自定义
      var linGrad = ctx.createLinearGradient(
        //渐变开始x,y，结束的x,y
        circleX - radius - lineWidth,
        circleY,
        circleX + radius + lineWidth,
        circleY
      );
      linGrad.addColorStop(1, "#607FE3");
      linGrad.addColorStop(0.0, "#62B7D7");
      ctx.strokeStyle = linGrad;
      //圆弧两端的样式
      ctx.arc(
        circleX,
        circleY,
        radius,
        Math.PI * 1.5,
        Math.PI * (one * 2 + 1.5)
      ); //圆心x,y,半径r，开始角，结束角，
      ctx.stroke();

      //画弧线02
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      // 渐变色 - 可自定义
      var linGrad = ctx.createLinearGradient(
        circleX - radius - lineWidth,
        circleY,
        circleX + radius + lineWidth,
        circleY
      );
      linGrad.addColorStop(0.0, "#FDB73D");
      linGrad.addColorStop(1.0, "#FEC631");
      ctx.strokeStyle = linGrad;
      //圆弧两端的样式
      ctx.arc(
        circleX,
        circleY,
        (radius * 3) / 4,
        Math.PI * 1.5,
        Math.PI * (two * 2 + 1.5)
      );
      ctx.stroke();
    },

    //点击打印报告
    print() {
      // this.showReport = true;
      // let self = this;
      // this.$nextTick(() => {
      //   //创建一个新的canvas
      //   var canvas2 = document.createElement("canvas");
      //   var _canvas = this.$refs.print;
      //   //此处可换body，或div等
      //   var w = parseInt(window.getComputedStyle(_canvas).width);
      //   var h = parseInt(window.getComputedStyle(_canvas).height);
      //   //页面的宽高
      //   let ww = document.body.clientWidth
      //   let hh = this.$refs.printHing.offsetHeight
      //   console.log(w,h);
      //   //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      //   canvas2.width = w*2;
      //   canvas2.height = h*1.98;
      //   canvas2.style.width =  w + "px";
      //   canvas2.style.height = h + "px";
      //   var context = canvas2.getContext("2d");
      //   context.scale(2,2);
      //   html2canvas(_canvas, { canvas: canvas2 }).then(function(canvas) {
      //     var dataUrl = canvas.toDataURL();
      //     self.printImg = dataUrl;
      //     self.$nextTick(() => {
      //       //保存页面原本内容
      //       var bdhtml = window.document.body.innerHTML;
      //       //要打印的内容
      //       var jubuData = self.$refs.printImg.innerHTML;
      //       //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容
      //       window.document.body.innerHTML = jubuData;
      //       // self.showReport = false
      //       // 调用打印功能
      //       self.$nextTick(() => {
      //         window.print();
      //         window.document.body.innerHTML = bdhtml; //重新给页面内容赋值；
      //         sessionStorage.setItem('refresh',1)
      //         self.$router.push("/teaching/appraisal_report");
      //       });
      //     });
      //   });
      // });
    },

    //把秒变成分秒
    delTime(time, slice) {
      var minutes = parseInt(time / 60);
      var seconds = parseInt(time % 60);
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (slice) {
        return { minutes, seconds };
      } else {
        return `${minutes}分${seconds}秒`;
      }
    }
  },
  computed: {},
  watch: {
    option: {
      //监听数值变化，再次初始化echart渲染
      handler(newValue, oldValue) {
        let myChart = echarts.init(document.getElementById("myChart"));
        myChart.setOption(this.option, true);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.appraisal_report {
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
  color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(27, 84, 220, 0.66);
  .top_btn_report {
    cursor: pointer;
    width: 166px;
    height: 52px;
    background: rgba(0, 103, 228, 1);
    border-radius: 4px 0 0 4px;
    color: rgba(255, 255, 255, 1);
  }
  .top_btn_record {
    cursor: pointer;
    width: 166px;
    height: 52px;
    background: rgba(255, 255, 255, 1);
    border-radius: 0 4px 4px 0;
    color: rgba(20, 17, 45, 1);
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
  top: 440px;
  left: 23%;
  color: white;
  .top_bottom_chinese {
    margin-top: 10px;
    font-size: 48px;
    font-family: medium;
    color: rgba(255, 255, 255, 1);
  }
  .top_bottom_english {
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
    left: 67px;
    z-index: -1;
    width: 650px;
  }
  .main_block {
    position: absolute;
    top: 19px;
    left: 391px;
    width: 1054px;
    height: 26px;
    background: rgba(36, 2, 193, 1);
    border-radius: 13px;
    z-index: -1;
  }
  .main_block-light {
    position: absolute;
    top: 27px;
    left: 407px;
    width: 1019px;
    height: 3px;
    background: rgba(21, 1, 115, 1);
    border-radius: 2px;
  }
  .main_white {
    margin-left: 101px;
    width: 1020px;
    margin: 0 auto;
    padding-bottom: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    .main_title {
      position: relative;
      padding: 49px 0 43px 42px;
      display: flex;
      .title_img {
        position: absolute;
      }
      .title_nmbuer {
        height: 72px;
        line-height: 72px;
        font-size: 40px;
        font-family: number;
        font-weight: 400;
        color: rgba(13, 110, 243, 1);
        margin-left: 9px;
      }
      .title_word {
        font-size: 36px;
        font-family: medium;
        font-weight: bold;
        color: rgba(13, 110, 243, 1);
        height: 72px;
        line-height: 72px;
        margin-left: 18px;
      }
    }
    .main_time {
      position: relative;
      display: flex;
      justify-items: center;
      .main_time_progress {
        width: 619px;
        height: 10px;
        background: linear-gradient(
          90deg,
          rgba(241, 121, 49, 1) 0%,
          rgba(233, 217, 41, 1) 100%
        );
        border-radius: 5px;
        position: absolute;
        top: 23px;
        left: 131px;
      }
      .main_time_progress_full {
        background: linear-gradient(
          90deg,
          rgba(254, 122, 70, 1) 0%,
          rgba(233, 41, 55, 1) 100%
        );
      }
      .main_time_img {
        width: 760px;
        margin: 0 auto;
      }
      .main_time_left {
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        text-align: center;
      }
      .main_time_right {
        position: absolute;
        top: 12px;
        right: 30px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 30px;
        width: 120px;
        text-align: right;
        .main_time_right_my {
          color: rgba(255, 123, 0, 1);
        }
        .main_time_right_all {
          color: rgba(0, 115, 255, 1);
        }
        .f_12 {
          font-size: 12px;
          margin: 0 -6px;
        }
      }
    }
    .echart {
      .echart_master_bottom {
        text-align: center;
        font-size: 18px;
        font-family: medium;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
        margin-top: 25px;
        margin-right: 80px;
      }
      .echart_master_line {
        margin: 0 20px 0 20px;
      }
      .echart_master_per {
        font-size: 20px;
        font-weight: 600;
        color: #0d6ef3;
      }
    }
    .knowledge {
      margin: 50px 60px 20px 60px;
      .knowledge_title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
      }
      .knowledge_tabe_top {
        width: 900px;
        height: 44px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        text-align: center;
        line-height: 44px;
        margin-top: 20px;
        .knowledge_tabe_top_right {
          width: 326px;
          background: rgba(56, 147, 248, 1);
        }
        .knowledge_tabe_top_left {
          width: 573px;
          margin-right: 1px;
          background: rgba(56, 147, 248, 1);
        }
      }
      .knowledge_content {
        width: 900px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;
        display: flex;
        .knowledge_content_left {
          background: rgba(241, 247, 255, 1);
          padding: 17px 22px 30px 22px;
          margin-right: 1px;
          margin-bottom: 1px;
          width: 573px;
        }
        .knowledge_content_right {
          background: rgba(241, 247, 255, 1);
          padding: 17px 22px 30px 22px;
          margin-bottom: 1px;
          width: 326px;
          text-align: center;
        }
      }
      .knowledge_img {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: rgba(241, 247, 255, 1);
        width: 900px;
        height: 55px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        .knowledge_img_word {
          margin-right: 13px;
          display: inline-block;
          height: 25px;
          line-height: 25px;
          vertical-align: top;
        }
        .knowledge_img_img {
          margin-right: 5px;
        }
      }
    }
    .summary {
      margin: 50px 60px 20px 60px;
      .summary_title {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
      }
      .summary_tabe_top {
        height: 44px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 44px;
        text-align: center;
        display: flex;
        margin-top: 26px;
        .summary_tabe_top_left {
          background: linear-gradient(
            -90deg,
            rgba(76, 41, 185, 1),
            rgba(144, 71, 219, 1)
          );
          width: 300px;
          margin-right: 1px;
        }
        .summary_tabe_top_center {
          background: linear-gradient(
            -90deg,
            rgba(1, 128, 225, 1),
            rgba(57, 205, 255, 1)
          );
          width: 300px;
          margin-right: 1px;
        }
        .summary_tabe_top_right {
          background: linear-gradient(
            -45deg,
            rgba(180, 180, 180, 1),
            rgba(204, 204, 204, 1)
          );
          width: 300px;
          margin-right: 1px;
        }
      }
      .summary_tabe_content {
        display: flex;
        .summary_tabe_content_main {
          text-align: center;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          line-height: 21px;
          background: rgba(238, 238, 238, 1);
          width: 300px;
          padding: 20px 30px;
          margin-left: 1px;
          margin-bottom: 1px;
        }
      }
    }
    .cavs {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 150px;
      .cavs_label {
        .cavs_labe_word {
          height: 16px;
          margin: 22px 0 22px 0;
          font-size: 16px;
          font-family: medium;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 16px;
          display: flex;
          .cavs_labe_word_bold {
            font-weight: 600;
          }
        }
        .cavs_labe_big {
          margin: 22px 0 22px 0;
          font-size: 18px;
          font-family: medium;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          display: flex;
          align-items: center;
        }
        .cavs_labe_blue {
          width: 16px;
          height: 16px;
          margin-right: 16px;
          background: linear-gradient(
            0deg,
            rgba(97, 127, 227, 1) 0%,
            rgba(61, 188, 201, 1) 100%
          );
        }
        .cavs_labe_gold {
          width: 16px;
          height: 16px;
          margin-right: 16px;
          background: linear-gradient(
            0deg,
            rgba(241, 121, 49, 1) 0%,
            rgba(233, 217, 41, 1) 100%
          );
        }
        .cavs_labe_red {
          width: 16px;
          height: 16px;
          margin-right: 16px;
          background: rgba(255, 70, 72, 1);
        }
      }
      .cavs_my {
        width: 100px;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        position: absolute;
        top: 152px;
        right: 312px;
      }
      .cavs_average {
        font-size: 20px;
        font-weight: 600;
        position: absolute;
        top: 180px;
        right: 249px;
        .cavs_average_line {
          position: relative;
          .cavs_average_line_left {
            position: absolute;
            top: -7px;
            left: -14px;
            width: 17px;
            height: 1px;
            background: #2494e6;
            transform: rotate(50deg);
          }
          .cavs_average_line_right {
            position: absolute;
            left: 0px;
            right: 0px;
            width: 70px;
            height: 1px;
            background: #2494e6;
          }
        }
        .cavs_average_pr {
          position: absolute;
          top: -24px;
          left: 17px;
        }
      }
      .cavs_average_one {
        font-size: 20px;
        font-weight: 600;
        position: absolute;
        top: 33px;
        right: 363px;
        .cavs_average_one {
          position: absolute;
          left: 0px;
          right: 0px;
          width: 192px;
          height: 1px;
          background: #619add;
        }
        .cavs_average_one_pr {
          position: absolute;
          top: 8px;
          left: 142px;
        }
      }
    }
    .answer_card {
      .answer_card_word {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        width: 160px;
        margin: 0 auto;
        margin-top: 30px;
      }
      .answer_card_ml157 {
        margin-left: 157px;
      }
      .answer_card_ml562 {
        margin-left: 562px;
      }
      .answer_card_sort {
        width: 250px;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(35, 76, 230, 1) 0%,
          rgba(0, 117, 217, 1) 100%
        );
      }
      .answer_card_long {
        width: 284px;
        height: 1px;
        background: linear-gradient(
          90deg,
          rgba(35, 76, 230, 1) 0%,
          rgba(0, 117, 217, 1) 100%
        );
        margin-top: 2px;
        margin-bottom: 21px;
      }
      .answer_card_img_center {
        justify-content: center;
      }
      .answer_card_img {
        font-size: 20px;
        font-family: medium;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 32px;
        display: flex;
        width: 672px;
        margin: 0 auto;
        flex-wrap: wrap;

        .answer_card_img_red {
          width: 40px;
          height: 32px;
          background: rgba(255, 70, 72, 1);
          margin: 0px 1px 11px 1px;
        }
        .answer_card_img_blue {
          width: 40px;
          height: 32px;
          background: linear-gradient(
            -90deg,
            rgba(137, 189, 252, 1) 0%,
            rgba(64, 150, 255, 1) 100%
          );
          margin: 0px 1px 11px 1px;
        }
      }
    }
    .ability {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 100px;
      .ability_word {
        width: 432px;
        .ability_word_title {
          font-weight: 600;
          margin-bottom: 15px;
        }
      }
    }
    .way_word {
      width: 800px;
      margin: 0 auto;
    }
    .suggest {
      display: flex;
      align-items: center;
      .suggest_img {
        position: relative;
        width: 232px;
        height: 232px;
        margin-right: 51px;
        margin-left: 47px;
        .suggest_img_word {
          position: absolute;
          top: 50%;
          left: 57px;
          transform: translateY(-30%);
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 30px;
          width: 140px;
        }
      }
      .suggest-word {
        width: 560px;
      }
    }
    .appraisal_suumary {
      margin: 0 131px 0 105px;
    }
    .end_word {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
    }
    .end_word_title {
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  .main_bottom {
    width: 530px;
    padding-left: 136px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 57px;
    padding-bottom: 45px;
    font-size: 16px;
    font-family: medium;
    font-weight: bold;
    text-decoration: underline;
    color: rgba(0, 210, 255, 1);
    .main_bottom_line {
      width: 1px;
      height: 20px;
      border: 1px solid rgba(229, 229, 229, 1);
      margin-left: 14px;
      margin-right: 6px;
    }
  }
}
.print {
  padding: 43px 30px 0px 35px;
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
}
.go_top_line {
  width: 66px;
  border-bottom: 1px solid rgba(41, 25, 185, 1);
  border-top: 1px solid #3520ed;
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
#myChart {
  margin-left: -190px;
  margin-top: -35px;
  height: 360px;
}
</style>