<template>
  <div class="report" id="report_printcontent">
    <!-- <div class="loading" v-loading="loading" v-if="loading"></div> -->
    <!-- 头部 -->
    <img src="../../assets/images/reporttop-bg.png" alt="logo" style="width:100%" />
    <div class="r_btn">
      <div class="btn_report">学习报告</div>
      <div class="btn_record" @click="$router.push('/teaching/record')">答题记录</div>
    </div>
    <!-- <p class="title">Alpha喵学习报告</p> -->
    <div class="report_word">
      <div class="left">
        <div class="rel">
          对应学科：
          <span class="dot"></span>
        </div>
        <div class="rel">
          课程名称：
          <span class="dot"></span>
        </div>
        <div class="rel">
          知识点名称：
          <span class="dot1"></span>
        </div>
        <div class="rel">
          学生姓名：
          <span class="dot"></span>
        </div>
        <div class="rel">
          报告时间：
          <span class="dot"></span>
        </div>
      </div>
      <div class="right">
        <div v-text="report.subject==0?'数学':report.subject==1?'物理':report.subject==2?'化学':'出错了，亲'"></div>
        <div>{{report.course}}</div>
        <div>{{report.knowledge}}</div>
        <div>{{name}}</div>
        <div>{{report.createTime}}</div>
      </div>
    </div>
    <!-- 知识点掌握情况 -->
    <div class="chart_box">
      <div class="mb-20 rel">
        <img class="grasp" src="../../assets/images/class_bg_blue.png" alt="logo" />
        <div class="flex jc-sa">
          <div class="know same">
            <div class="c-title">知识点掌握情况</div>
            <ul class="star flex">
              <li class="power_none" v-if="!star.length"></li>
              <li v-for="(item,index) in star" :key="index">
                <img src="../../assets/images/class_ic_star_one.png" alt="logo" />
              </li>
              <li>
                <img src="../../assets/images/class_ic_star_half.png" alt="logo" v-if="showStar" />
              </li>
            </ul>
            <el-progress :percentage="percentageK" :color="customColor" :show-text="false"></el-progress>
            <div class="c-summer" v-if="percentageK<70">你还没掌握该知识点，不要气馁，继续加油！</div>
            <div class="c-summer" v-else>太棒了！你已经掌握了该知识点！</div>
            <!-- <div class="c-summer" v-if="percentageK>70">太棒了！你已经掌握了该知识点！</div>
            <div class="c-summer" v-if="percentageK=70">太棒了！你已经掌握了该知识点！</div>-->
            <!-- <div class="c-summer" v-text="`${percentageK>70?'太棒了！你已经掌握了该知识点！':percentageK=70?'太棒了！你已经掌握了该知识点！':'你还没掌握该知识点，不要气馁，继续加油！'}`"></div> -->
          </div>
          <div class="average same">
            <div class="c-title">平均掌握情况</div>
            <ul class="flex star">
              <li>
                <img src="../../assets/images/class_ic_star_one.png" alt="logo" />
              </li>
              <li>
                <img src="../../assets/images/class_ic_star_one.png" alt="logo" />
              </li>
              <li>
                <img src="../../assets/images/class_ic_star_one.png" alt="logo" />
              </li>
            </ul>
            <el-progress :percentage="percentageA" :color="customColor" :show-text="false"></el-progress>
            <div class="c-summer">该知识点平均掌握情况</div>
          </div>
        </div>
      </div>
      <!-- 学习用时 -->
      <div class="rel mb-20">
        <img class="time" src="../../assets/images/class_bg_purple.png" alt="logo" />
        <div class="know_time same">
          <div class="c-title">知识点学习用时</div>
          <div class="k_time f24" v-text="delTime(report.times)"></div>
        </div>
        <div class="average_time same">
          <div class="c-title">知识点平均学习用时</div>
          <div class="a_time f24">20分30秒</div>
        </div>
      </div>
      <!-- 答题情况 -->
      <div class="rel" style="margin-bottom: 50px">
        <img class="answerbg" src="../../assets/images/class_bg_red.png" alt="logo" />
        <div class="know_time same flex answer">
          <div class="c-title">答题情况</div>
          <div class="m-true">
            我的正确率
            <img class="orage_img" src="../../assets/images/report_orage.png" alt="logo" />
          </div>
          <div class="a-true">
            平均正确率
            <img class="blue_img" src="../../assets/images/report_blue.png" alt="logo" />
          </div>
        </div>
        <div class="progress">
          <span class="bule">70%</span>
          <span class="orage">{{accuracy+'%'}}</span>
          <div style="width:93px">
            <p>答题总数：{{report.rights+report.wrongs}}</p>
            <p style="line-height:40px">答对题数：{{report.rights}}</p>
            <p>答错题数：{{report.wrongs}}</p>
          </div>
          <!-- <el-progress
            class="circle"
            :show-text="false"
            type="circle"
            :percentage="accuracy"
            :width="70"
            color="#FF6E01"
            :stroke-width="5"
          ></el-progress>
          <el-progress
            :show-text="false"
            type="circle"
            :percentage="70"
            :width="70"
            color="#089BF8"
            :stroke-width="5"
          ></el-progress>-->
        </div>
      </div>
      <!-- 能力值 -->
      <el-card class="box-card">
        <div id="myChart" style="width: 1380px;height: 420px;margin:0 auto"></div>
      </el-card>
      <!-- 学习建议 -->
      <el-card class="box-card" v-if="!(knowledges.length === 0)">
        <p class="sudy">学习建议</p>
        <ul>
          <li class="suggest" v-for="(item,index) in knowledges" :key="index">
            <div>
              <div class="spot"></div>
              <span v-html="`${index+1}、巩固相关前置知识`"></span>
              <span class="point">“{{item.name}}”</span>
            </div>
            <!-- <div class="go" @click="go(item.pointsId)">
              <img src="../../assets/images/link-btn.png" alt />
            </div>-->
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getReport } from "../../api/teaching.js";
export default {
  data() {
    return {
      name: "", //学生名字
      customColor: "#409eff", //掌握情况的进度条颜色
      percentageA: 60, //平均掌握情况
      accuracy: 0, //我的正确率
      //能力值，折线图
      option: {
        tooltip: {
          trigger: "item",
          triggerOn: "'mousemove|click",
          showContent: true,
          transitionDuration: 0,
          formatter: "{b0}<br />{c0}"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["", "学前测试", "知识点学习", "学后测试"],
          offset: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#ADB9C5"
            }
          },
          axisLabel: {
            fontSize: 14
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          name: "能力值变化",
          min: 0,
          max: 1,
          splitNumber: 10,
          offset: 10,
          nameTextStyle: {
            color: "#14112E",
            fontWeight: "bolder",
            fontSize: 17,
            lineHeight: 56,
            align: "right"
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#ADB9C5"
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            type: "line",
            // symbol: "emptyCircle",
            symbol:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABUFBMVEX///8AZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+QAZ+T///86lOvLAAAAbnRSTlMABUJ6mJl/SgkGc+jPjG9mhMbugwwfuC8lpt4uGeF4AWWOi14SYOkoBMd1+fN8AlnaDmy6B72rnojdNodtHO8I3BD2vkybVzyAeWKdclxNM9W3OGP+Se3BpAPK29JbLU4nyzKqceaPaIbsgUCWSNTV++EAAAABYktHRACIBR1IAAAAB3RJTUUH4wsbEx8Af/YxtAAAAQhJREFUGNNV0Os/wlAcx/EvW6NWbivR7SyURInmLoVJK5dIumBuubP//2Gntrb5PPqd96Pz+gL9hoYZ1sGNjMLK6eLdnrHxickpwTswn3var18zs4GgfoXCEYKQGJ2bXwBi8cWeJZaScHqWNdpKKo3VzBrF9SyRNjSjzTS2tinu7GJPM9tH7iAPfwGHRxbGEziWIZ6gqNk6BSegxEGxYwzlCkoKzv7jeQUiiws7XoIREKwiz1tWJbiSgcI1aqbd1OG7lYBygyA6MBfQ5OjnW20FKN717L4OPAT6Q+XCDAFRH+Un+qjxqjHdc/bFmO41o5ojd97a752Pz8bXt9e2fesn8sum/iT91QVLNVF3jhU1NAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMS0yN1QxMTozMTowMCswODowMLxf04AAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTEtMjdUMTE6MzE6MDArMDg6MDDNAms8AAAAAElFTkSuQmCC",
            symbolSize: 20,
            data: [0, 0.7, 0.3, 0.8],
            lineStyle: {
              normal: {
                color: "#166CC8",
                shadowColor: "#166CC8",
                shadowOffsetY: 5,
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: "#166CC8",
                borderWidth: 1,
                borderColor: "white"
              }
            }
          }
        ]
      },
      knowledges: [],
      report: {},
      loading: true,

      percentageK: 80, //掌握知识点情况
      showStar: true, //显示半颗星
      star: [] //显示多少颗星
    };
  },
  created() {

    //从本地拿参数
    let params = JSON.parse(sessionStorage.getItem("report"));
    let { courseId, knowledgeId, studentId } = params;
    // 请求获取报告数据
    getReport(courseId, knowledgeId, studentId)
      .then(res => {
        this.loading = false;
        if (Object.keys(res.data).length != 0) {
          let reportData = res.data;
          this.knowledges = reportData.knowledges;
          let report = reportData.report;
          this.report = report;
          //如果没返回学习建议，让它为空
          if (reportData.knowledges) {
            this.knowledges = reportData.knowledges;
          } else {
            this.knowledges = [];
          }
          //获取报告人的名字
          this.name = reportData.studentName;
          //我的正确率
          let rights = reportData.report.rights;
          let wrongs = reportData.report.wrongs;
          let all = rights + wrongs;
          this.accuracy = parseInt((rights / all) * 100);
          //渲染能力值图
          let name = [""];
          let value = [0];
          if (report.preAbility) {
            name.push("学前测试");
            value.push(report.preAbility / 10);
          }
          if (report.firstAbility) {
            name.push("第一轮学习");
            value.push(report.firstAbility / 10);
          }
          if (report.secondAbility) {
            name.push("第二轮学习");
            value.push(report.secondAbility / 10);
          }
          if (report.postAbility) {
            name.push("学后测试");
            value.push(report.postAbility / 10);
          }
          this.option.xAxis.data = name;
          this.option.series[0].data = value;
          //渲染知识点掌握情况
          let postPower = report.postAbility; //后测能力
          let prePower = report.preAbility; //前测能力
          if (postPower) {
            //用后测能力
            if (postPower) {
              this.rederPower(postPower);
            }
          } else {
            //用前测能力
            this.rederPower(prePower);
          }
        }
      })
      .catch(err => {
        this.loading = false;
      });
  },
  mounted() {
    //初始化图表插件
    let myChart = echarts.init(document.getElementById("myChart"));
    myChart.setOption(this.option, true);
  },
  methods: {
    //把秒变成分秒
    delTime(time) {
      var hour = parseInt(time / 3600);
      var minutes = parseInt(time / 60);
      var seconds = parseInt(time % 60);

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (hour > 0) {
        return `${hour}时${minutes}分${seconds}秒`;
      } else {
        return `${minutes}分${seconds}秒`;
      }
    },

    //渲染知识点掌握情况
    rederPower(power) {
      this.percentageK = power * 10;
      if (power === 0) {
        this.star = [];
        this.showStar = false;
      } else {
        switch (Math.ceil(power)) {
          case 1:
            this.star = [];
            this.showStar = true;
            break;
          case 2:
            this.star = [1];
            this.showStar = false;
            break;
          case 3:
            this.star = [1];
            this.showStar = true;
            break;
          case 4:
            this.star = [1, 2];
            this.showStar = false;
            break;
          case 5:
            this.star = [1, 2];
            this.showStar = true;
            break;
          case 6:
            this.star = [1, 2, 3];
            this.showStar = false;
            break;
          case 7:
            this.star = [1, 2, 3];
            this.showStar = true;
            break;
          case 8:
            this.star = [1, 2, 3, 4];
            this.showStar = false;
            break;
          case 9:
            this.star = [1, 2, 3, 4];
            this.showStar = true;
            break;
          case 10:
            this.star = [1, 2, 3, 4, 5];
            this.showStar = false;
            break;
        }
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
.report {
  margin: -20px -33px 0 -33px;
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
.btn_report {
  cursor: pointer;
  width: 166px;
  height: 52px;
  background: rgba(0, 103, 228, 1);
  box-shadow: 0px 0px 10px 0px rgba(211, 211, 211, 0.66);
  border-radius: 4px 0 0 4px;
  color: rgba(255, 255, 255, 1);
}
.btn_record {
  cursor: pointer;
  width: 166px;
  height: 52px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(159, 203, 255, 0.66);
  border-radius: 0 4px 4px 0;
  color: rgba(20, 17, 45, 1);
}
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
.report_word {
  position: absolute;
  top: 370px;
  left: 50%;
  transform: translateX(-50%);
  font-family: Source Han Sans CN;
  color: black;
  font-size: 17px;
  font-weight: 550;
  line-height: 45px;
  display: flex;
}
.left {
  width: 110px;
}
.left div {
  text-align: right;
}
.right {
  padding-left: 5px;
}
.grasp {
  width: 1563px;
  height: 370px;
}
.chart_box {
  margin-top: 50px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  position: relative;
}
.time {
  width: 1478px;
  height: 276px;
}
.answerbg {
  width: 1478px;
  height: 276px;
}
.same {
  width: 395px;
  color: white;
}
.know {
  position: absolute;
  top: 90px;
  left: 140px;
}
.average {
  position: absolute;
  top: 90px;
  right: 250px;
}
.c-title {
  font-size: 19px;
  margin-left: -35px;
  margin-bottom: 40px;
  font-weight: 520;
}
.c-summer {
  margin-left: 15px;
  margin-top: 10px;
}
.c-summer_err {
  margin-left: 15px;
  margin-top: 10px;
  color: red;
}
.star {
  margin-left: 12px;
}
.chart_box {
  font-size: 15px;
}
.know_time {
  position: absolute;
  top: 60px;
  left: 100px;
}
.average_time {
  position: absolute;
  top: 60px;
  right: 207px;
}
.k_time {
  position: absolute;
  top: 100px;
  left: 103px;
}
.a_time {
  position: absolute;
  top: 100px;
  left: 104px;
}
.progress {
  display: flex;
  position: absolute;
  top: 100px;
  left: 210px;
  color: white;
}
.circle {
  margin: 0 360px;
}
.m-true {
  margin-left: 170px;
  font-size: 17px;
}
.a-true {
  font-size: 17px;
}
.answer {
  width: 1070px;
  justify-content: space-between;
}
.bule {
  position: absolute;
  top: 25px;
  right: -845px;
  font-size: 18px;
  font-family: Adobe Heiti Std;
  font-weight: normal;
  color: rgba(255, 255, 255, 1);
}
.orage {
  position: absolute;
  top: 25px;
  left: 474px;
  font-size: 18px;
  font-family: Adobe Heiti Std;
  font-weight: normal;
  color: rgba(255, 255, 255, 1);
}
.orage_img {
  position: absolute;
  top: 5px;
  left: 645px;
}
.blue_img {
  position: absolute;
  top: 5px;
  right: -20px;
}
.suggest {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f3f7;
  height: 65px;
  margin: 0 30px;
  padding-right: 50px;
  font-weight: 600;
}
.box-card {
  width: 1443px;
  margin-bottom: 55px;
}
.sudy {
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  margin: 10px;
}
.point {
  color: #0066e4;
}
.spot {
  height: 5px;
  width: 5px;
  background: black;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 2px;
}
.go {
  cursor: pointer;
}
.mb-20 {
  margin-bottom: 20px;
}
.dot {
  position: absolute;
  top: 10px;
  left: 19px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcecfc;
  z-index: -10;
}
.dot1 {
  position: absolute;
  top: 10px;
  left: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dcecfc;
  z-index: -10;
}
.loading {
  position: fixed;
  top: 80px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 20;
}
.power_none {
  display: block;
  height: 46px;
  width: 10px;
}
</style>
