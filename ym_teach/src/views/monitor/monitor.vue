<template>
  <div class="monitor">
    <el-badge class="monitor-call" :value="this.$store.state.call_count" :max="99">
      <div @click="monitorCall">
        <img src="../../assets/images/class_ic_call.png" alt="">
        <p>呼叫申请</p>
      </div>
    </el-badge>
    <div class="clear subject_com">
      <div class="items-title">
        <div class="items-title-tab" v-for="(item,index) in Tabs" :key="index"
             @click="TabsSeek(item.gradeId,item.courseId)">{{item.gradeName}}{{item.courseName}}
        </div>
      </div>
    </div>
    <div class="table-bg">
      <el-table
        class="monitor-table"
        :data="monitorListData"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        :header-cell-style="{background:'#F6F7F9',color:'#333333'}"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          label="学生姓名"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="账号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="course"
          label="课程名称"
          width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="knowledge"
          label="学习知识点"
          width="390" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="position"
          label="当前环节"
          width="160">
          <template slot-scope="scope">
            {{scope.row.position==0?'开始学习':scope.row.position==1?'学前测试':scope.row.position==2?'第一轮学习':scope.row.position==3?'第二轮学习':'学后测试'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="答题数量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="right"
          label="答对题量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="rate"
          label="正答率"
          width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.count>0">{{Math.floor((scope.row.right/scope.row.count)*100)}}%</span>
            <span v-if="scope.row.count==0">0%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="called"
          label="呼叫次数"
          width="130">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <span class="recordLink" @click="recordLink(scope.row)"> 查看答题记录</span>
            <!--<router-link
              :to="/monitor/record/{{scope.row.knowledgeId}}/{{scope.row.studentId}}"
              class="recordLink">查看答题记录
            </router-link>-->
          </template>
        </el-table-column>
        <template slot="empty">
          <img src="../../assets/images/default_page/class-pic.png" alt="">
        </template>
      </el-table>
    </div>
    <!--    <button class="notify" @click="clickNotify">notification提示</button>-->
  </div>
</template>
<script>
  import {monitorTabs, monitorClassList, monitorCallList} from "@/api/accounts"

  export default {
    name: "monitor",
    components: {},
    data() {
      return {
        monitorListData: [],
        unshiftArr: [],
        Tabs: [],
        count: 0,
        loading: false,
        monitorOff: false,
        timer:""
      }
    },
    props: {},
    watch: {
      monitorList: {
        handler(old, newd) {
          let oldJson = JSON.parse(old);
          if (this.monitorListData != null && oldJson.studentId != null) {
            let JsonIndex = this.monitorListData.findIndex(function (value, index, arr) {
              return value.studentId == oldJson.studentId
            })
            if (JsonIndex != -1) {
              this.$set(this.monitorListData, JsonIndex, oldJson)
            } else {
              this.unshiftArr.push(oldJson);
              this.monitorListData = this.unshiftArr;
              // this.init()
            }
          }
        }

      },
      quitStudy: function (old, newd) {
        let quitJson = JSON.parse(old);
        if (this.monitorListData != null && this.monitorListData.length > 0) {
          let JsonIndex = this.monitorListData.findIndex(function (value, index, arr) {
            return value.studentId == quitJson.studentId
          })
          if (JsonIndex != -1) {
            this.monitorListData.splice(JsonIndex, 1);
          //  this.$store.dispatch("monitor", "{}");
          }
        }
      },
      call_count: function (old, newd) {
        this.count = old;
      }
    },
    methods: {
      init() { //初始化
       // this.$parent.loginOutJMessage();
        monitorTabs().then(res => {
          if (res.data.length > 0) {
            this.Tabs = res.data;
            this.TabsSeek(res.data[0].gradeId, res.data[0].courseId)
            monitorCallList(res.data[0].gradeId, res.data[0].courseId, 10, 1).then(res => {
              this.$store.dispatch("callCount", res.data.total);
            }).catch(err => {

            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
      },
      //呼叫老师
      monitorCall() {
        this.$router.push("/monitor/call")
      },
      //列表
      TabsSeek(gradeId, courseId) {
        this.loading = true;
        window.sessionStorage.setItem("gradeId", gradeId);
        window.sessionStorage.setItem("courseId", courseId);
        monitorClassList(gradeId, courseId).then(ListRes => {
          if (ListRes.data != null) {
            this.monitorListData = ListRes.data;
            this.unshiftArr = ListRes.data;
          }
          this.loading = false;
        }).catch(ListErr => {
          this.loading = false;

        })
      },
      recordLink(row) {
        this.$store.dispatch("monitor", JSON.stringify(row));
        this.$router.push({name: '/monitor/record', params: {knowledgeId: row.knowledgeId, studentId: row.studentId}})
      }
      /*clickNotify () {
        this.myNotify({
          content: 'this is a notification',
          cssda:"this",
          jsonData:{"sa":'1'}
        })
      },*/
    },
    computed: {
      monitorList() {
        return this.$store.state.monitorList
      },
      quitStudy() {
        return this.$store.state.quitStudy
      },
      //$store.state.call_count
      call_count() {
        return this.$store.state.call_count
      }
    },
    created() {
      this.init();
      //this.$parent.JMessage();

    },
    mounted() {
      this.timer = setInterval(()=>{
        this.init();
      }, 300000);
    },
    destroyed() {

    },
    beforeDestroy() {
     clearInterval(this.timer);
    }
  }
</script>
<style scoped lang="scss">
  .monitor {
    position: relative;
  }


</style>
<style>
  .monitor-table td, .monitor-table th {
    height: 68px;
  }

  .monitor-table td:first-child .cell, .monitor-table th:first-child .cell {
    padding-left: 30px;
  }

  .monitorOffImg {
    display: block;
    margin: 0 auto;
  }
</style>
