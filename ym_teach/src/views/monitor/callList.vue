<template>
  <div class="callList">
    <div class="clear  ">
      <div class="backTo fr" @click="routerback(-1)">
        <img src="../../assets/images/ic_back_blue.png" alt="">
        <span>返回</span>
      </div>
    </div>
    <el-table
      class="monitor-table"
      :data="callList"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      :header-cell-style="{background:'#F6F7F9',color:'#333333'}"
    >
      <el-table-column
        prop="studentName"
        label="学生姓名"
        width="260">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="账号"
        width="200">
      </el-table-column>
      <!--<el-table-column
        prop="className"
        label="课程名称"
        width="230">
      </el-table-column>-->
      <el-table-column
        prop="knowledge"
        label="学习知识点"
        width="400">
      </el-table-column>
      <el-table-column
        prop="position"
        label="当前环节"
        width="260">
        <template slot-scope="scope">
          {{scope.row.position==1?'学前测试':scope.row.position==2?'第一轮学习':scope.row.position==3?'第二轮学习':'学后测试'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="申请时间"
        width="296">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="210">
        <template slot-scope="scope">
          <span class="recordLink callColor" @click="AnswerDetails(scope.row)"> 查看详情</span>
           <div class="divider"></div>
          <span class="callColor recordLink" @click="dispose(scope.row.id)" >已处理</span>
        </template>
      </el-table-column>

      <template slot="empty">
         <img src="../../assets/images/default_page/callrecord-n-pic.png" alt="">
       </template>
    </el-table>
    <div class="pageCon">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Page"

        :page-size="Pagesize"
        background
        right
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {monitorCallList,monitorUpdateCall} from "@/api/accounts"

  export default {
    name: "callList",
    components: {},
    data() {
      return {
        callList: [],
        Page: 1,
        total:0,
        Pagesize:10,
        gradeId: "",
        courseId: ""
      }
    },
    props: {},
    watch: {},
    methods: {
      init() {
        let gradeId = sessionStorage.getItem("gradeId");
        let courseId = sessionStorage.getItem("courseId");
        monitorCallList(parseInt(gradeId),parseInt(courseId),this.Pagesize,this.Page).then(res => {
          this.callList = res.data.res;
          this.total=res.data.total
          this.$store.dispatch("callCount", res.data.callcount);
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
      handleSizeChange(val) {
        this.Pagesize=val;
        this.init()

      },
      handleCurrentChange(val) {
        this.Page=val;
        this.init()

      },
      AnswerDetails(row) {
        window.sessionStorage.setItem("CallList",JSON.stringify(row))
        this.$router.push({name: '/monitor/AnswerDetails', params: {id:row.id}})
      },
      routerback(){
        this.$router.push({path: '/monitor/index'})
      },
      dispose(id){
        let that = this;
        this.$confirm('确认已解决学生问题？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          monitorUpdateCall(id).then(res => {
            that.init()
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {

        });
      }
    },
    computed: {},
    created() {
      this.init();
      //this.$store.dispatch("callCount", "0");
    },
    mounted() {
    },
    destroyed() {
    }
  }
</script>

<style scoped lang="scss">
  .callList {
    position: relative;
  }

  .callColor {
    color: #3981FFFF;
    margin: 0 5px;
  }
  .divider{
    background-color: #dcdfe6;

    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
  }
</style>
<style>

</style>
