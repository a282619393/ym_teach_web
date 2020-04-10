<template>
  <div class="teaching_knowledgeList">
    <div class="flex jc-sb">
      <div class="title">{{course}}</div>
      <div class="clear">
        <div class="back_box" style="margin: 0 50px" @click="goBack">
          <div class="back_img"></div>
          <span class="back_word">返回</span>
        </div>
      </div>
    </div>
    <template>
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="headerStyle"
        :header-cell-style="{background:'rgba(246,247,249,1)',color:'#333333'}"
        :row-class-name="rowStyle"
        :cell-class-name="cellStyle"
        :header-cell-class-name="headerCellStyle"
      >
        <el-table-column prop="knowledge" label="知识点名称" width="400" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="学习时间" :formatter="formatterTime" width="300"></el-table-column>
        <el-table-column prop="firstQuest" label="学习情况" width="250">
          <template slot-scope="scope">
            <img
              v-if="scope.row.status == 0"
              src="../../assets/images/course-grasp-n.png"
              alt="logo"
              class="tab_img"
            />
            <img
              v-if="scope.row.status == 1"
              src="../../assets/images/course-grasp-y.png"
              alt="logo"
              class="tab_img"
            />
            <img
              v-if="scope.row.status == 2"
              src="../../assets/images/course-learning-ic-y.png"
              alt="logo"
              class="tab_img"
            />
          </template>
        </el-table-column>

        <el-table-column prop="call" label="呼叫老师次数"></el-table-column>
        <el-table-column prop="uknow" label="待解决数量"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="tab_btn"
              :style="scope.row.status ==2?'visibility: hidden':''"
              @click="report(scope.row)"
            >学习报告</el-button>
            <el-button type="text" size="small" class="tab_btn_end" @click="recode(scope.row)">答题记录</el-button>
          </template>
        </el-table-column>
        <template slot="empty" class="list_empty" >
          <img src="../../assets/images/default_page/class-pic.png" alt />
        </template>
      </el-table>
      <!-- 分页 -->
      <div class="alignSite page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 25, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="saveData.length"
        ></el-pagination>
        <div class="page_go">GO</div>
      </div>
    </template>
  </div>
</template>


<script>
import { knowledgeList } from "../../api/teaching.js";
export default {
  data() {
    return {
      tableData: [], //展示的数据
      saveData: [], //保存的所能数据
      eachPage: 10, //每页多少条数据
      currentPage: 1, //当前页
      showBack: true,
      course:'' //课程名称
    };
  },
  created() {
    //从会话拿数据
    let { studentId, courseId,course } = JSON.parse(
      sessionStorage.getItem("abilityList")
    );
    this.course = course
    knowledgeList(studentId, courseId)
      .then(res => {    
        this.saveData = res.data.slice();
        //添加学习状态变量
        res.data.map((item, index) => {
          //0未掌握，1已掌握，2学习中
          let { firstQuest, postAbility, preAbility } = item;
          //有没有后测
          if (postAbility) {
            if (postAbility > 6) {
              this.saveData[index].status = 1;
            } else {
              this.saveData[index].status = 0;
            }
          } else {
            //前测大于0.6
            if (preAbility > 6) {
              if (firstQuest == 0 || !firstQuest) {
                this.saveData[index].status = 1;
              } else {
                this.saveData[index].status = 2;
              }
            } else {
              this.saveData[index].status = 2;
            }
          }
        });
        //分页
        let arr = this.saveData.slice()
        this.tableData = arr.splice(0, 10);
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {},
  methods: {
    //点击学习报告
    report(row) {
      let { courseId, knowledgeId, studentId } = row;
      let obj = { courseId, knowledgeId, studentId };
      sessionStorage.setItem("report", JSON.stringify(obj));
      this.$router.push("/teaching/report");
    },

    //点击答题记录
    recode(row) {
      let { courseId, knowledgeId, studentId,status } = row;
      let obj = { courseId, knowledgeId, studentId,status };
      sessionStorage.setItem("report", JSON.stringify(obj));
      this.$router.push("/teaching/record");
    },

    //每页几条值变化时
    handleSizeChange(val) {
      this.eachPage = val;
      //初始化
      this.currentPage = 1;
      let data = this.saveData.slice();
      this.tableData = data.splice(0, val);
    },

    //当前页值变化时
    handleCurrentChange(val) {
      this.currentPage = val;
      let sart = this.currentPage * this.eachPage - this.eachPage;
      let data = this.saveData.slice(); //不能切保留的数据
      this.tableData = data.splice(sart, this.eachPage);
    },  

    //点击返回
    goBack() {
      this.$router.push("/teaching/studyRecord");
    },

    //鼠标移入事件
    chageStyle() {},

    //格式化时间
    formatterTime(row, column, cellValue, index) {  
    var time = cellValue
    var d = new Date(time);
    var h = d.getHours();//12
    var m = d.getMinutes(); //12
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + h + ':' + m 

      // let time = cellValue
      //   .replace(/T/g, " ")
      //   .replace(/:/g, ".")
      //   .split(".");
      // return time[0] + ":" + time[1];

    },

    //设置行样式
    rowStyle({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "tab_row1";
      } else {
        return "tab_row2";
      }
    },

    //设置表头单元格样式
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "tab_cell";
      }
    },

    //设置单元格样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "tab_cell";
      }
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.title {
  height: 17px;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(0, 103, 228, 1);
  line-height: 24px;
  margin: 26px 0 41px 33px;
}
.tab_btn {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(0, 103, 228, 1);
  padding: 3px 22px 3px 6px;
  margin: 0px;
}
.tab_btn_end {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(0, 103, 228, 1);
  padding: 3px 22px 3px 6px;
  margin: 0px;
  border-left: 2px solid rgba(233, 233, 233, 1);
}

//分页
.page {
  padding-top: 30px;
  padding-bottom: 30px;
  position: relative;
  background: rgba(255, 255, 255, 1);
}
.page_go {
  width: 42px;
  height: 28px;
  background: rgba(0, 103, 228, 1);
  border-radius: 4px;
  position: absolute;
  top: 31px;
  right: 25px;
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 28px;
  text-align: center;
  cursor: pointer;
}
.tab_img {
  margin-top: 10px;
}

</style>
<style lang="scss">
.teaching_knowledgeList .headerStyle {
  background: rgba(246, 247, 249, 1);
  height: 68px;
  font-size: 16px;
  font-family: medium;
  color: rgba(51, 51, 51, 1);
}
.teaching_knowledgeList .tab_row1 {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  height: 68px;
}
.teaching_knowledgeList .tab_row2 {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  height: 68px;
  background: rgba(246, 247, 249, 1);
}
.teaching_knowledgeList .tab_cell {
  padding-left: 21px;
}
.teaching_knowledgeList .tab_cell .cell {
  padding-right: 90px;
}
.back_box {
  position: relative;
  width: 96px;
  height: 40px;
  border: 1px solid rgba(0, 103, 228, 1);
  border-radius: 20px;
  font-size: 14px;
  font-family: medium;
  font-weight: normal;
  color: rgba(0, 103, 228, 1);
}
.back_box:hover {
  background: linear-gradient(90deg, #86c7ff 0%, #0076fa 100%);
  color: white;
  border: none;
}
.back_img {
  background-image: url("../../assets/images/ic_back_blue.png");
  width: 96px;
  height: 40px;
  padding-left: 20px;
  background-repeat: no-repeat;
  background-position: 18px 10px;
}
.back_img:hover {
  background-image: url("../../assets/images/ic_back_white.png");
}
.back_word {
  position: absolute;
  top: 10px;
  right: 15px;
}
//缺省页高度问题
.teaching_knowledgeList .el-table__empty-block{
  height:100vh !important;
}
</style>
