<template>
  <div class="share_report" v-loading.fullscreen="showReport">
    <!-- 打印用的图片 -->
    <div ref="printImg" v-show="printImg">
      <img :src="printImg" alt="logo" style="margin:-330px 0px 0px 0px;" />
    </div>
    <!-- 头部 -->
    <div class="appraisal_top_box">
      <img src="../../assets/images/appraisal/learning-report.png" alt="logo" class="top_img" />
      <div class="top_botton">
        <div class="top_btn_report">评测报告</div>
        <div class="top_btn_record" @click="AnswerRecord">答题记录</div>
      </div>
      <!-- <div class="top_print" @click="print">
        <img
          class="top_print_img"
          src="../../assets/images/appraisal/report-printer.png"
          alt="logo"
        />
        <span class="top_print_word">打印报告</span>
      </div>-->
      <div class="top_bottom">
        <img src="../../assets/images/appraisal/logo.png" alt="logo" />
        <p class="top_bottom_chinese">Alpha喵学前评测报告</p>
        <p class="top_bottom_english">Learning Report</p>
        <img src="../../assets/images/appraisal/l-r-line.png" alt="logo" style="margin: 5px 0" />
        <ul class="top_word">
          <li>
            <span>学生姓名：</span>
            <span>{{renderData.reports&&renderData.reports[0].studentName}}</span>
            <span class="top_line">|</span>
          </li>
          <li>
            <span>测试课程：</span>
            <span>{{renderData.reports&&renderData.reports[0].course}}</span>
          </li>
        </ul>
        <ul class="top_word">
          <li>
            <span>测试时间：</span>
            <span>{{renderData.reports&&renderData.reports[0].endTime}}</span>
            <span class="top_line">|</span>
          </li>
          <li>
            <span>测试用时：</span>
            <span v-html="delTime(renderData.times)"></span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 中部 -->
    <div class="appraisal_main_box">
      <img
        src="../../assets/images/appraisal/bg_pic_blue_01.png"
        alt="logo"
        class="main_background1"
      />
      <img
        src="../../assets/images/appraisal/bg_pic_blue_02.png"
        alt="logo"
        class="main_background2"
      />
      <div class="main_block"></div>
      <div class="main_block-light"></div>
      <div class="main_white" ref="print">
        <!-- 打印的头部 -->
        <div class="print" v-show="showReport">
          <div class="print_report">
            <img src="../../assets/images/appraisal/report-printer.png" alt="logo" />
            <div style="margin-left: 10px;">打印报告</div>
          </div>
          <img
            style="width:80px;margin-left: 20px"
            src="../../assets/images/appraisal/printing--logo.png"
            alt="logo"
          />
          <img src="../../assets/images/appraisal/logo.png" alt="logo" />
          <div class="print_china">Alpha喵学前评测报告</div>
          <div class="print_english">Learning Report</div>
          <div class="print_three_line" style="width:955px"></div>
          <div class="print_three_line" style="width:755px"></div>
          <div class="print_three_line" style="width:555px"></div>
          <ul class="print_bottom">
            <li>
              <span>学生姓名：</span>
              <span>{{renderData.reports&&renderData.reports[0].studentName}}</span>
              <span class="print_bottom_line">|</span>
            </li>
            <li>
              <span>测试课程：</span>
              <span>{{renderData.reports&&renderData.reports[0].course}}</span>
              <span class="print_bottom_line">|</span>
            </li>
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
                  <span class="fw600">70%</span>
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
                <div class="cavs_average_pr">70%</div>
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
              <img
                src="data:image/png;base64,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"
                alt="logo"
              />
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
                <img
                  src="data:image/png;base64,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"
                  alt="logo"
                />
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
            <div style="height: 40px"></div>
          </li>
        </ul>
      </div>
      <!-- 底部 -->
      <div class="main_bottom">
        <img style="height: 18px;" src="../../assets/images/appraisal/l-r-click.png" alt="loao" />
        <div style="margin-left: 6px;" class="pointer" @click="AnswerRecord">在线查看更多题目详情</div>
        <div class="main_bottom_line"></div>
        <img src="../../assets/images/appraisal/l-r-logo-bottom.png" alt="loao" />
      </div>
    </div>
    <!-- 返回顶部 -->
    <el-backtop :right="320" :bottom="170" :visibility-height="1300">
      <div class="go_top">
        <span>TOP</span>
        <img src="../../assets/images/appraisal/top-ico.png" alt="logo" class="go_top_img" />
        <div class="go_top_line"></div>
      </div>
    </el-backtop>
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
    getEvaluateReport(
      this.$route.query.courseId,
      this.$route.query.studentId
    ).then(res => {
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

      this.$nextTick(() => {
        //答题情况双圆环
        this.annulus(this.my / 100);
        //初始化图表插件
        let myChart = echarts.init(document.getElementById("myChart"));
        myChart.setOption(this.option, true);
      });
    });
  },
  methods: {
    //点击答题记录
    AnswerRecord() {
      let top = this.renderData.reports[0];
      let urlcourse = top.course;
      let urlendTime = top.endTime;
      let urlname = top.studentName;
      let time = this.delTime(this.renderData.times);
      let urltime = time;
      this.$router.push({
        path: "/share_record",
        query: {
          courseId: this.$route.query.courseId,
          studentId: this.$route.query.studentId,
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
      let one = 0.7;
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
      this.showReport = true;
      let self = this;
      this.$nextTick(() => {
        //创建一个新的canvas
        var canvas2 = document.createElement("canvas");
        var _canvas = this.$refs.print;
        //此处可换body，或div等
        var w = parseInt(window.getComputedStyle(_canvas).width);
        var h = parseInt(window.getComputedStyle(_canvas).height);
        //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
        canvas2.width = w * 2;
        canvas2.height = h * 1.3;
        canvas2.style.width = w + "px";
        canvas2.style.height = h + "px";
        var context = canvas2.getContext("2d");
        // context.scale(2, 2);
        html2canvas(_canvas, { canvas: canvas2 }).then(function(canvas) {
          var dataUrl = canvas.toDataURL();
          self.printImg = dataUrl;
          self.$nextTick(() => {
            //保存页面原本内容
            var bdhtml = window.document.body.innerHTML;
            //要打印的内容
            var jubuData = self.$refs.printImg.innerHTML;
            //把获取的 局部div内容赋给body标签, 相当于重置了 body里的内容
            window.document.body.innerHTML = jubuData;
            //调用打印功能
            self.$nextTick(() => {
              window.print();
              window.document.body.innerHTML = bdhtml; //重新给页面内容赋值；
              self.$router.go(0);
            });
          });
        });
      });
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
.share_report {
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
  top: 498px;
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
  margin-top: -4px;
  padding-top: 31px;
  background: linear-gradient(
    0deg,
    rgba(49, 23, 208, 1),
    rgba(12, 113, 245, 1)
  );
  z-index: 2;
  overflow: hidden;
  .main_background1 {
    position: absolute;
    top: 450px;
    right: 10px;
    z-index: -1;
    width: 580px;
  }
  .main_background2 {
    position: absolute;
    top: 1400px;
    left: 0px;
    z-index: -1;
    width: 700px;
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
          margin-right: 25px;
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
            top: -10px;
            left: -62px;
            width: 80px;
            height: 10px;
            background: linear-gradient(
              45deg,
              transparent 68.5%,
              #2494e6 62.5%,
              #2494e6 70.5%,
              transparent 54.5%
            );
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
          top: 92px;
          left: 55px;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 30px;
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
      margin-top: -15px;
    }
    .end_word_title {
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  .main_bottom {
    width: 530px;

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
<style >
.share_report .el-backtop {
  background: none;
  width: 70px;
  height: 0px;
}
</style>