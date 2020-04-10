<template>
  <div class="jvTable">
    <!-- 表格 -->
    <el-table :data="tableData"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 1)"
      style="width:100%;background:#F6F7F9"
      :header-row-class-name="headClassName"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :cell-style="changeColor"
      @cell-click="cellClick">
     <!-- 表格行 -->
      <el-table-column
        align="left"
        v-for="(item,i) of rowInfo" 
        :key="i"
        :prop="item.dataType"
        :label="item.rowName"
        :width="item.rowWidth"
        show-overflow-tooltip
        ></el-table-column>
        <!-- 操作列 -->
        <el-table-column
          fixed="right"
          label="操作"
          width="280"
        >
        <!-- 操作功能列 -->
          <template slot-scope="scope">
            <div v-show="scope.row.isShow">
              <!-- 编辑功能 -->
              <el-button 
              @click.stop="editor(scope.row)"  
              type="text" 
              size="small" 
              :disabled="isDisabledOne"
              v-text="btnText1"
              class="edit"
              v-show="tableType!=='4' && tableType!=='5' && tableType!=='6'"
              ></el-button>
                <!-- 重置密码功能 -->
              <el-button
              v-show="tableType!=='3' && tableType!=='4' && tableType!=='5' && tableType!=='6'"
              class="delimiter" 
              @click.stop="reset(scope.row)" 
              type="text" 
              size="small"
              v-text="btnText2">
              </el-button>
              <!-- 终止合作功能 -->
              <el-button 
              @click.stop="overcoop(scope.row)" 
              type="text" 
              :disabled="isDisabledTwo || scope.row.Dis2"
              size="small"
              class="overCoop"
              v-text="btnText3">
              </el-button>
              <!-- 评测按钮功能 -->
              <el-button 
              @click.stop="evaluating(scope.row)" 
              type="text" 
              v-show="tableType=='4'"
              :disabled="scope.row.Dis1"
              size="small"
              class="evaluating"
              v-text="btnText4">
              </el-button>
            </div>
            <div v-show="!scope.row.isShow">
              <!-- 终止合作操作人 -->
              <span v-text="scope.row.updatePersonName"></span>
              <!-- 终止合作操作时间 -->
              <span v-text="scope.row.updateTime" class="textGap"></span>
            </div>
          </template>
        </el-table-column>
        <template slot="empty"> 
          <img :src="image" alt="" v-show="imgIsShow">
        </template>
      </el-table>
  </div>
</template>
<script>
import {principalList} from "../api/principal";
export default {
  data(){
    return {
      // 表格头信息
      rowInfo:[
        {dataType:"name",rowName:"校长姓名",rowWidth:"120"},
        {dataType:"phone",rowName:"手机号码",rowWidth:"130"},
        {dataType:"address",rowName:"所在地区",rowWidth:"170"},
        {dataType:"campusName",rowName:"校区名称",rowWidth:"180"},
        {dataType:"specificAddress",rowName:"校区地址",rowWidth:"240"},
        {dataType:"userName",rowName:"账号",rowWidth:"120"},
        {dataType:"teacherCounts",rowName:"在职教师数量",rowWidth:"120"},
        {dataType:"studentCounts",rowName:"付费学生数量",rowWidth:"120"},
        {dataType:"status",rowName:"合作状态",rowWidth:"120"}
      ],
      btnText1:'编辑',
      btnText2:'重置密码',
      btnText3:'终止合作',
      btnText4:"查看评测记录",
      overPerson:"张三",
      overTime:"2019-11-18  16:37",
      isDisabledOne:false,
      isDisabledTwo:false,
      tableData:[],
      skipValue:[],
      image:require('../assets/images/default_page/default_pic_principal.png')
    }
  },
  props:{
    tableType:{
      type:String,
      default:""
    },
    tableDataAll:{
      type:Array,
      default:[]
    },
    loading:{
      type:Boolean,
      default:true
    },
    imgIsShow:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    // 监听表格数据
    tableDataAll:{
      handler: function(newVal, oldVal) {
        this.tableData=newVal
        if(this.tableType==4 && newVal.length!==0){
          for(let item of newVal){
            item.Dis1=item.studyRecord.elchemistry+item.studyRecord.elmath+item.studyRecord.elphysics==0?true:false
            item.Dis2=item.studyRecord.chemistry+item.studyRecord.math+item.studyRecord.physics==0?true:false
            if(item.courseId!==null){
              if(item.courseId==0){
                item.Dis1=item.studyRecord.elmath==0?true:false
              }
              if(item.courseId==1){
                item.Dis1=item.studyRecord.elphysics==0?true:false
              }
              if(item.courseId==2){
                item.Dis1=item.studyRecord.elchemistry==0?true:false
              }
            }
          }
        }
      },
      deep: true,
      immediate:true
    },
  },
  created(){
    
  },
  mounted(){
    if(this.tableType==2){
      this.teacherTablePage()
    }else if(this.tableType==3){
      this.orderTablePage()
    }else if(this.tableType==4){
      this.teachingTablePage()
    }else if(this.tableType==5){
      this.teachingStudyRecordTablePage()
    }else if(this.tableType==6){
      this.teacherEvaluating()
    }else{
    }
  },
  methods:{
    // 校长管理分页查询
    // 老师管理页方法
    teacherTablePage(){
      this.rowInfo=[
        {dataType:"name",rowName:"老师姓名",rowWidth:"150"},
        {dataType:"phone",rowName:"手机号码",rowWidth:"180"},
        {dataType:"sex",rowName:"性别",rowWidth:"120"},
        {dataType:"age",rowName:"年龄",rowWidth:"120"},
        {dataType:"campusName",rowName:"校区名称",rowWidth:"270"},
        {dataType:"courseName",rowName:"负责科目",rowWidth:"170"},
        {dataType:"userName",rowName:"账号",rowWidth:"170"},
        {dataType:"status",rowName:"确认状态",rowWidth:"130"}
      ]
      this.image=require('../assets/images/default_page/default_pic_teacher.png')
      this.btnText3="确认离职"
    },
    // 订单管理页方法
    orderTablePage(){
      let admin=JSON.parse(sessionStorage.getItem("userInfo")).sysRoleList[0].roleId
      this.rowInfo=[
        {dataType:"rectorUserName",rowName:"校长姓名",rowWidth:"120"},
        {dataType:"rectorPhone",rowName:"手机号码",rowWidth:"150"},
        {dataType:"rectorAddressName",rowName:"所在地区",rowWidth:"170"},
        {dataType:"schoolName",rowName:"校区名称",rowWidth:"230"},
        {dataType:"createDate",rowName:"提交时间",rowWidth:"200"},
        {dataType:"amount",rowName:"购买账号数量",rowWidth:"150"},
        {dataType:"shouldTotal",rowName:"总金额",rowWidth:"150"},
        {dataType:"status",rowName:"确认状态",rowWidth:"150"}
      ]
      this.image=require('../assets/images/default_page/default_pic_order.png')
      this.btnText1="确定"
      this.btnText3="调价"
      if(admin==1){
        this.isDisabledOne=true;
        this.isDisabledTwo=true;
      }else if(admin==2){
        this.isDisabledOne=true;
        this.isDisabledTwo=false;
      }else if(admin==3){
        this.isDisabledOne=true;
        this.isDisabledTwo=true;
      }else if(admin==4){
        this.isDisabledOne=false;
        this.isDisabledTwo=true;
      }
    },
    // 教学管理页方法
    teachingTablePage(){
      this.rowInfo=[
        {dataType:"name",rowName:"学生姓名",rowWidth:"220"},
        {dataType:"sex",rowName:"性别",rowWidth:"220"},
        {dataType:"age",rowName:"年龄",rowWidth:"220"},
        {dataType:"campuName",rowName:"校区名称",rowWidth:"400"},
        {dataType:"userName",rowName:"账号",rowWidth:"230"}
      ]
      this.image=require('../assets/images/default_page/teaching_pic.png')
      this.btnText3="查看学习记录"
    },
    // 教学管理学习记录页方法
    teachingStudyRecordTablePage(){
      this.rowInfo=[
        {dataType:"course",rowName:"课程名称",rowWidth:"450"},
        {dataType:"gradeSubject",rowName:"对应学科",rowWidth:"450"},
        {dataType:"count",rowName:"知识点数量",rowWidth:"450"},
      ]
      this.image=""
      this.btnText3="查看知识点列表"
    },
    teacherEvaluating(){
      this.rowInfo=[
        {dataType:"course",rowName:"课程名称",rowWidth:"250"},
        {dataType:"gradeName",rowName:"对应学段",rowWidth:"250"},
        {dataType:"subjectName",rowName:"对应学科",rowWidth:"250"},
        {dataType:"textbook",rowName:"教材版本",rowWidth:"250"},
        {dataType:"endTimeName",rowName:"评测时间",rowWidth:"250"}
      ]
      this.btnText3="查看报告"
    },
    // 单元格点击事件
    cellClick(row,column){
      if(column.property=="teacherCounts"){
        // 跳转到在职教师数量的方法
        this.$emit("jump","teacher")
        this.$router.push({path:"/teacher/index",name:"teacherIndex",params:{id:row.campusId,name:row.campusName}})
      }
      if(column.property=="studentCounts"){
        // 跳转到付费学生数量的方法
        this.$emit("jump","student")
        this.$router.push({path:"/student/index",name:"studentIndex",params:{id:row.campusId,name:row.campusName}})
      }
    },
    // 第一个按钮方法
    editor(val){
      sessionStorage.setItem("editInfo",JSON.stringify(val));
      if(this.tableType==2){
        this.$router.push("/teacher/edit")
      }else if(this.tableType==3){
        let obj={
          dialog:true,
          featrue:2,
          value:val
        }
        this.$emit("childData",obj)
      }else{
        this.$router.push("/principal/edit")
      }
    },
    // 第二个按钮方法
    reset(val){
      sessionStorage.setItem("editInfo",JSON.stringify(val));
      let obj={
        dialog:true,
        featrue:1,
        value:val
      }
      this.$emit("childData",obj)
    },
    // 第三个按钮方法
    overcoop(val){
      if(this.tableType==3){
        sessionStorage.setItem("editInfo",JSON.stringify(val));
        let obj={
          dialog:true,
          featrue:3,
          value:val
        }
        this.$emit("childData",obj)
      }else if(this.tableType==4){
        sessionStorage.setItem("editInfo",JSON.stringify(val));
        this.$router.push("/teaching/studyrecord")
      }else if(this.tableType==5){
        sessionStorage.setItem("abilityList",JSON.stringify(val))
        this.$router.push("/teaching/knowledgeList")
      }else if(this.tableType==6){
        sessionStorage.setItem("evaluatingData",JSON.stringify(val))
        this.$router.push({
          path:"/teaching/appraisal_report",
          query:{
            courseId:val.courseId,
            studentId:val.studentId
          }
        })
      }else{
        sessionStorage.setItem("editInfo",JSON.stringify(val));
        let obj={
          dialog:true,
          featrue:2,
          value:val
        }
        this.$emit("childData",obj)
      }
    },
    // 第四个按钮方法
    evaluating(val){
      sessionStorage.setItem("editInfo",JSON.stringify(val));
      this.$router.push("/teaching/evaluating")
    },
    // 表格头样式方法
    headClassName({row, rowIndex}){
      return 'tableHeadClass'
    },
      // 表格行样式
    tableRowClassName({row, rowIndex}) {
      if (rowIndex%2===1) {
        return 'white-row';
      }
      return '';
    },
    // 单元格样式方法
    changeColor({row, column, rowIndex, columnIndex}){  
      if(this.tableType==2){
        if(row.status=="在职" && columnIndex === 7){
          return {
            color:'#009A12'
          }
        }else if(row.status=="离职" && columnIndex==7){
          return{
            color:'#ff2222'
          }
        }
      }else if(this.tableType==3){
        if(row.status=="已确认" && columnIndex === 7){
          return {
            color:'#009A12'
          }
        }else if(row.status=="未确认" && columnIndex==7){
          return{
            color:'#ff2222'
          }
        }
      }else{
          //合作状态列的颜色
        if(columnIndex === 8 && row.status=="合作"){
          return {
            color:'#009A12'
          }
        }else if(columnIndex === 8 && row.status=="中止合作"){
          return{
            color:'#ff2222'
          }
        }
      }
    },
    // 单元格类样式方法
    tableCellClassName({row, column, rowIndex, columnIndex}){
      if(column.property=='teacherCounts' || column.property=="studentCounts"){
        return 'tableHover'
      }else if(this.tableType==4 || this.tableType==5 ||this.tableType==6){
        if(columnIndex==3 && this.tableType==4){
          return 'teachEmptyStyle'
        }else if(columnIndex==5 && this.tableType==4){
          return "recordEmptyStyle"
        }else if(columnIndex==3 && this.tableType==5){
          return "recordEmptyStyle"
        }else if(columnIndex==5 && this.tableType==6){
          return "recordEmptyStyle"
        }
      }
      return ''
    },
  },
}
</script>
<style lang="scss" scoped>
  .textGap{
    padding-left:18px;
  }
</style>
<style lang="scss">
.jvTable{
  .el-table th{
    height: 76px;
    background: #F6F7F9;
  }
  .el-table tr{
    background: #ffffff;
  }
  .el-table td{
    height: 82px;
  }
  .el-table .white-row,.el-table .white-row:hover {
    background: #F6F7F9 !important;
  }
  .el-tooltip__popper{ 
    max-width:13% 
  } 
  .el-table__body tr>td,.el-table__body tr:hover>td{
    background-color: rgba(255, 225, 225,0)!important;
  }
  .delimiter,.edit,.overCoop,.evaluating{
    padding-top: 3px;
    padding-bottom: 3px;
    color:#3981FF;
  }
  .delimiter,.edit{
    padding-right:20px;
    border-right:2px solid #E9E9E9;
  }
  .delimiter:hover,.edit:hover,.overCoop:hover,.evaluating:hover{
    color:#0067e4;
  }
  .delimiter:hover,.edit:hover{
    border-right:2px solid #E9E9E9;
  }
  .evaluating,.evaluating:hover{
    border-left: 2px solid #E9E9E9;
    padding-left:15px 
  }
  .tableHeadClass{
    color:#333333;
    font-size: 16px;
    font-family: 'bold';
  }
  .tableOneCol{
    padding-left:20px
  }
  .tableHover:hover{
    color: #0067e4;
    cursor: pointer;
  }
  .el-table .tableHeadClass th:first-child .cell,
  .el-table__row td:first-child .cell{
    padding-left:30px;
  } 
  .priEmptyStyle{
    color:#009A12;
  }
  .priEmptyRedStyle{
    color:#ff2222;
  }
  .teachEmptyStyle .cell{
    padding-right: 120px;
  }
  .recordEmptyStyle .cell{
    padding-left: 0;
  }
  .el-table__empty-block,
  .el-table__body-wrapper.is-scrolling-left~.el-table__fixed, 
  .el-table__body-wrapper.is-scrolling-none~.el-table__fixed, 
  .el-table__body-wrapper.is-scrolling-none~.el-table__fixed-right, 
  .el-table__body-wrapper.is-scrolling-right~.el-table__fixed-right{
    background: #fff;
  } 
  .el-table::before,
  .el-table__fixed-right::before, .el-table__fixed::before{
    height:0;
  }
  .el-button.is-disabled.el-button--text{
    color:#c0c4cc;
  }
}
</style>