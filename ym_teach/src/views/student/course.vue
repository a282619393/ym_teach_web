<template>
  <div class='student_course'>
    <div class="headContent">
      <div class="firstRow">
        <button class="newBtn" v-text="newCourseButtonName" @click="onNewCourse"></button>
        <button class="goBack" @click="goback">
          <div class="gobackStyle">返回</div>
        </button>
      </div>
    </div>
    <div class="secondRow">
        <span v-text="currentUserCourseName"></span>
    </div>

    <div>
      <!--课程管理table-->
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="课程管理" name="first">
           <el-table
            v-loading="tableLoading" 
            class="course-manage-cls"          
            :data="courseManageData"
            :header-row-class-name="headerStyle"
            :row-class-name="rowStyle"
            :cell-class-name="cellStyle"
            :header-cell-class-name="headerCellStyle"
           >
            <el-table-column prop="courseName" label="课程名称"  width="300" show-overflow-tooltip></el-table-column>
            <el-table-column prop="courseStatus" label="课程状态"  width="300"  >
               <template slot-scope="scope">
                <img
                  :src="require('../../assets/images/'+(scope.row.courseStatus == '0'?'student_ic_reading.png':
                    scope.row.courseStatus == '1'?'student_ic_not.png':scope.row.courseStatus == '2'?'student_ic_refund.png':'student_ic_exper.png'))"
                  alt="logo"
                  class="tab_img"
                />
                <span class="course-new-cls" :style="scope.row.courseStatus == '0'?'color:#00D198;':
                  scope.row.courseStatus == '1'?'color:#FA6912;':
                  scope.row.courseStatus == '2'?'color:#FF2222;':'color:#007EFF;'">{{scope.row.courseStatusName}}</span>
               
              </template>
            </el-table-column>
            <el-table-column prop="cutOffTime" label="截止时间"  width="300" ></el-table-column>
            <el-table-column prop="remandDate" label="剩余有效期(天)" width="300"   ></el-table-column>
            <el-table-column  label="操作" min-width="300">
              <template slot-scope="scope">
                <el-button type="text" @click="onTableOperate('enable',scope.row)" v-if="scope.row.courseStatus==3">开通</el-button>
                <el-button type="text" @click="onTableOperate('renew',scope.row)"  v-if="scope.row.courseStatus!=3">续费</el-button>
                <el-button type="text" @click="onTableOperate('refund',scope.row)" v-if="scope.row.courseStatus==0">退费</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页位置  -->
          <div class="alignSite"  v-show="managePageInfo.total">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="managePageInfo.currentPage"
              :page-sizes="managePageInfo.pageSizes"
              :page-size="managePageInfo.pageSize"
              :layout="managePageInfo.layout"
              :total="managePageInfo.total">
            </el-pagination>
          </div>

        </el-tab-pane>
        <el-tab-pane label="课程记录" name="second">
           <!--课程记录table-->
           <el-table
             v-loading="tableLoading"            
            :data="courseRecordData"
            :header-row-class-name="headerStyle"
            :row-class-name="rowStyle"
            :cell-class-name="cellStyle"
             class="course-record-cls"
            :header-cell-class-name="headerCellStyle"
           >
            <el-table-column prop="courseName" label="课程名称"  width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operateUserName" label="操作人"  width="250" ></el-table-column>
            <el-table-column prop="operateDate" label="操作时间" width="250"   ></el-table-column>
            <el-table-column prop="operateType" label="操作类型" width="250"   ></el-table-column>
            <el-table-column prop="time" label="时长" width="250"   ></el-table-column>
            <el-table-column prop="consAccountNum" label="消耗账号数量" min-width="200"   ></el-table-column>
            
          </el-table>

          <!-- 分页位置 -->
          <div class="alignSite" v-show="recordPageInfo.total">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="recordPageInfo.currentPage"
              :page-sizes="recordPageInfo.pageSizes"
              :page-size="recordPageInfo.pageSize"
              :layout="recordPageInfo.layout"
              :total="recordPageInfo.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--弹框dialog-->
    <el-dialog
      :title="dialogTitle"
      custom-class="course-manage-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="closeDialog">
        <div  class="dialogThree">
          <!-- 错误提示 -->
        <div v-if="!isSelectedCourse&&operateType!='refund'">
          <div class="hint" v-show="newCourseErrInfo">
            <img src="../../assets/images/ic_judge_error.png" alt="">
            <span class="hintText" v-text="newCourseErrInfo"></span>
          </div>
          <el-form label-width="120px" :model="newCourseModel">
            <!--开通课程-->
            <el-form-item  prop="courseId" :label="(operateType=='renew'?'续费':'开通')+'课程:'">
              <el-select  v-if="operateType=='new'" clearable v-model="newCourseModel.courseId" placeholder="请选择" :class="newCourseErrInfo=='请选择需要开通的课程!'?{errStyle:true}:{errStyle:false}" @change="courseSelectChange">
                <el-option 
                  :label="item.name" 
                  :value="item.curriculumId" 
                  v-for="item of openCourseList" 
                  :key="item.curriculumId"
                ></el-option>
              </el-select>
              <label v-else>{{newCourseModel.courseName}}</label>
            </el-form-item>

            <!--负责学科-->
            <el-form-item prop="resSubject" label="负责学科" v-if="operateType!='renew'">
              <el-radio-group v-model="newCourseModel.resSubject" @change="resSubjectChange">
                <el-radio label="3" :disabled="operateType=='new'?false:true">体验</el-radio>
                <el-radio label="0">开通</el-radio>
              </el-radio-group>
            </el-form-item>

            <!--时间长度-->
            <el-form-item  prop="courseName" label="时间长度:">
              <el-select v-model="newCourseModel.dateLength"  @change="dateLengthChange">
                <el-option 
                  :label="item.value" 
                  :value="item.key" 
                  v-for="item of dateLengthList" 
                  :key="item.key"
                ></el-option>
              </el-select>
            </el-form-item>

             <!--消耗账号数量-->
            <el-form-item v-if="newCourseModel.resSubject=='0'||operateType=='renew'" prop="consAccountNum" label="消耗账号数量:">
              <label >{{newCourseModel.consAccountNum}}</label>
            </el-form-item>

             <!--剩余账号数量-->
            <el-form-item  v-if="newCourseModel.resSubject=='0'||operateType=='renew'" prop="surAccountNum" label="剩余账号数量:">
              <label>{{newCourseModel.surAccountNum}}</label>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="operateType!='refund'&&isSelectedCourse" class="new-course-tip-cls">
            <el-row >
              <el-col :md="24">
                <span v-if="operateType=='renew'" class="new-course-tip-one">是否确定续费课程?</span>
                <span v-else class="new-course-tip-one">是否确定开通{{newCourseModel.resSubject=='0'?'正式':'体验'}}课程?</span>
              </el-col>
            </el-row>

            <el-row >
              <el-col :md="24">
                <span class="new-course-tip-two">课程名称: {{newCourseModel.courseName}}</span>
              </el-col>
            </el-row>

            <el-row >
              <el-col :md="24">
                  <span class="new-course-tip-three">体验时间: {{newCourseModel.dateLength}}天</span>
              </el-col>
            </el-row>

            <el-row v-if="newCourseModel.resSubject=='0'">
              <el-col :md="24">
                 <span class="new-course-tip-four"> 消耗账号数量: {{newCourseModel.consAccountNum}}个</span>
              </el-col>
            </el-row>
        </div>

        <!--退费div-->
        <div v-show="operateType=='refund'" class="dialogTwo">
          <img src="../../assets/images/pop_ic_judge_caveat_big.png" alt="">
          <div>
            <div class="dialogText1">是否确定为该学生退费“{{newCourseModel.courseName}}”课程？</div>
            <div class="dialogText2">退费后该学生将无法继续使用该课程</div>
          </div>
        </div>
          
        </div>
        <!-- 弹框底部按钮 -->
        <span slot="footer" class="dialog-footer" >
          <button class="minorBtn" @click="closeDialog" style="marginRight:10px;">取消</button>
          <button class="newBtn" @click="onSure" v-loading.fullscreen.lock="buttonLoading" >确定</button>
        </span>
    </el-dialog>
  </div>

  
</template>

<script>
export default {
  data() {
    return {
        newCourseButtonName:'新增课程',
        currentUserCourseName:'',
        studentId:'',
        grade:'',
        activeName:'first',
        courseManageData:[],//课程管理table data
        managePageInfo:{
          currentPage:1,
          pageSizes:[10, 25, 50],
          pageSize:10,
          layout:'total, sizes, prev, pager, next, jumper',
          pageCount:1,
          total:0
        },
        courseRecordData:[],//课程记录table data
        recordPageInfo:{
          currentPage:1,
          pageSizes:[10, 25, 50],
          pageSize:10,
          layout:'total, sizes, prev, pager, next, jumper',
          pageCount:1,
          total:0
        },
        //dialog
        dialogTitle:'开通课程',
        dialogVisible:false,
        //新增课程model
        newCourseModel:{
          courseId:'',//课程id
          courseName:'',//课程名称
          resSubject:'3',//负责学科
          dateLength:7,//时间长度
          consAccountNum:1,//消耗账号数量
          surAccountNum:0,//剩余账号数量
          grade:'',//课程学段
          course:''//课程学科
        },
        dateLengthList:[{
            key:7,
            value:'7天'
        },{
            key:14,
            value:'14天'
        }],//时间长度下拉框 list
        openCourseList:[],//开通课程下拉框list
        newCourseErrInfo:'',//form错误提示信息
        isSelectedCourse:false,//新建课程中是否选择完了课程
        operateType:'',//当前操作按钮的名称
        editRow:'',//当前操作行
        tableLoading:false,
        buttonLoading:false,
        api:{
          searchCourseManageListUrl:'/student/queryClassList',//查询课程管理url
          searchCourseRecordListUrl:'/student/queryClassLog',//查询课程记录url
          searchCourseSelectUrl:'/student/queryCurriculumList',//开通课程下拉框url
          newEnableCourseUrl:'/student/addClassBegin',//新增开通课程url
          enableCourseUrl:'/student/openingClass',//开通课程
          renewCourseUrl:'/student/renewClass',//续费课程
          refundCourseUrl:'/student/refundClass',//退费课程
          queryAccountNumberUrl:'/student/queryAccountNumber'//查询当前学生所属校区剩余账号数量
        }
    };
  },
  created() {
  },
  mounted() {
    let row=sessionStorage.getItem('editInfo');
    if(row){
      row=JSON.parse(row);
      this.currentUserCourseName=row.userName+"的课程管理";
      this.studentId=row.userId;
      this.grade=row.grade;
    }     
    this.loadCourseTabelData('manage');    
  },
  methods: {
      //开通课程select change事件
      courseSelectChange(val){
        for(const obj of this.openCourseList){
          if(obj.curriculumId==val){
            this.newCourseModel.courseName=obj.name;
            this.newCourseModel.course=obj.course;
            this.newCourseModel.grade=obj.grade;
            break;
          }
        }
      },
      //获取开通课程下拉框data
      loadCourseSelectData(){
        this.openCourseList=[];
        const urls=this.api.searchCourseSelectUrl;
        let params={
          grade:this.grade,
          userId:this.studentId
        }
        this.$axios.post(urls+'?'+this.qs.stringify(params)).then(res=>{
          this.openCourseList=res.data;
        })
      },
      //加载课程列表数据
      loadCourseTabelData(type){
         //调用java接口
         let params={
           userId:this.studentId,
           pageNum:this.activeName==="first"?this.managePageInfo.currentPage:this.recordPageInfo.currentPage,
           pageSize:this.activeName==="first"?this.managePageInfo.pageSize:this.recordPageInfo.pageSize
         };
         let searchUrl=this.activeName==="first"?this.api.searchCourseManageListUrl:this.api.searchCourseRecordListUrl;
         this.tableLoading=true;
         this.$axios.post(searchUrl+'?'+this.qs.stringify(params)).then(res=>{
           const data=res.data;
           if(type==='manage'){
             this.managePageInfo.total=data.total;
           }else if(type==='record'){
             this.recordPageInfo.total=data.total;
           }
           this.combineTableData(data.rows,type);
         }).finally(()=>{
           this.tableLoading=false;
         })
      },
      //封装table数据
      combineTableData(data,type){
        data.forEach((el,index) => {
          if(type==='manage'){ 
             let obj={
              courseName:el.curriculumName,
              recordId:el.recordId,
              courseId:el.curriculumId,
              courseStatus:el.status,
              courseStatusName:el.status==0?'已开通':el.status==1?'未续费':el.status==2?'已退费':'体验',
              cutOffTime:el.dueTime?el.dueTime.substring(0,10):'',
              remandDate:el.laveDurationDay+'天'+el.laveDurationHo+'小时'
            };
            if(!index)this.courseManageData=[];           
            this.courseManageData.push(obj);
          }else if(type==='record'){
             let obj={
              courseName:el.curriculumName,
              recordId:el.recordId,
              courseId:el.curriculumId,
              operateUserName:el.createPerName,
              operateDate:el.createTime?el.createTime.substring(0,10).trim():'',
              operateType:el.status==0?'开通':el.status==1?'续费':el.status==2?'退费':'试用',//0 开通 1 未续费 2 退费 3 体验
              time:el.duration,
              consAccountNum:el.accountNum
            };
            if(!index)this.courseRecordData=[];  
            this.courseRecordData.push(obj);
          }
         
        });
        
      },
      //返回button click事件
      goback(){
         this.$router.push('/student');
      },
      //课程管理列表操作列方法
      onTableOperate(type,row){
        this.editRow=row;
        this.newCourseModel.resSubject='0';
        this.resSubjectChange();
        this.operateType=type;
        this.newCourseModel.courseName=row.courseName;
        this.newCourseModel.courseId=row.courseId;
        this.loadCourseSelectData();
        this.dialogVisible=true;
        if(type=='enable'){//开通
          this.dialogTitle="开通课程";          
        }else if(type=='renew'){//续费
          this.dialogTitle='续费课程';
        }else{
          //退费
          this.dialogTitle='课程退费';
        }
      },
      //时间长度change事件
      dateLengthChange(val){
        this.newCourseModel.consAccountNum=val/30;
      },
      //负责学科change事件
      resSubjectChange(){
        if(this.newCourseModel.resSubject=='0'){
          this.newCourseModel.surAccountNum=0;
          //查询剩余账号数量
          let urls=this.api.queryAccountNumberUrl;
          this.$axios.post(urls+"?userId="+this.studentId).then(res=>{
            this.newCourseModel.surAccountNum=res.data;
          });
          //正式课 重新赋值时间长度数组
          this.dateLengthList=[];
          for(let i=30;i<=300;i++){
            if(i%30==0)this.dateLengthList.push({
              key:i,
              value:i+'天'
            })
          }
          this.newCourseModel.dateLength=30;
          this.newCourseModel.consAccountNum=1;
          
        }else{
          this.dateLengthList=[];
          this.dateLengthList.push({
            key:7,
            value:'7天'
          },{
            key:14,
            value:'14天'
          });
          this.newCourseModel.dateLength=7;
        }
      },
      //dialog 确定事件
      onSure(){
        //校验开通课程必填
        if(this.operateType!=="refund"){
          if(!this.isSelectedCourse){
            if(!this.newCourseModel.courseId){
              this.newCourseErrInfo='请选择需要开通的课程!';
              return;
            }else{
              this.newCourseErrInfo='';
            }
            //正式课 校验账号剩余数量大于等于账号消耗数量
            if(this.newCourseModel.resSubject=='0'&&this.newCourseModel.surAccountNum<this.newCourseModel.consAccountNum){
              this.newCourseErrInfo='账号剩余数量不足!';
              return;
            }
            this.isSelectedCourse=true;

            //计算dialog marginleft
            this.$nextTick(()=>{
                let oneWidth=document.querySelector('.new-course-tip-one').offsetWidth;
                let twoWidth=document.querySelector('.new-course-tip-two').offsetWidth;
                let threeWidth=document.querySelector('.new-course-tip-three').offsetWidth;
                let fourWidth=document.querySelector('.new-course-tip-four')?document.querySelector('.new-course-tip-four').offsetWidth:0;
                let  widthArr=[oneWidth,twoWidth,threeWidth,fourWidth];
                let maxWidth = widthArr.reduce((front , after)=>{
                  return after > front ? after : front;
                });
                let marginLeft=(570-maxWidth)/2;
                document.querySelector('.new-course-tip-cls').setAttribute('style',"margin-left:"+marginLeft+"px;");
            })
          }else{
            //调用java接口
            this.buttonLoading=true;
            const urls=this.operateType==='new'?this.api.newEnableCourseUrl:this.operateType==='enable'?this.api.enableCourseUrl:this.api.renewCourseUrl;
            let params={
              userId:this.studentId,
              curriculumId:this.newCourseModel.courseId,
              curriculumName:this.newCourseModel.courseName,
              status:this.newCourseModel.resSubject,
              duration:this.newCourseModel.dateLength
            };
            if(this.operateType!=='new'){
              params.recordId=this.editRow.recordId
            } else{
              params.course=this.newCourseModel.course;
              params.grade=this.newCourseModel.grade;
            } 
            this.$axios.post(urls,params).then(res=>{
              if(!res.status){
                this.$message.success(this.operateType==='new'?'课程新增成功!':this.operateType==='enable'?'课程开通成功!':'课程续费成功!');
                this.closeDialog();
                const type=this.activeName==="first"?'manage':'record';
                this.loadCourseTabelData(type);
              }
            }).finally(()=>{
              this.buttonLoading=false;
            })
          }
        }else{
          //退费
          this.buttonLoading=true;
          this.$axios.post(this.api.refundCourseUrl,{
            recordId:this.editRow.recordId,
            userId:this.studentId
          }).then(res=>{
            if(!res.status){
              this.$message.success('课程退费成功!');
              this.closeDialog();
              const type=this.activeName==="first"?'manage':'record';
              this.loadCourseTabelData(type);
            }
          }).finally(()=>{
            this.buttonLoading=false;
          })
        }
        

      },
      //dialog 关闭事件
      closeDialog(){
        this.dialogVisible=false;
        this.newCourseModel.resSubject='3';
        this.newCourseModel.courseName='';
        this.newCourseModel.courseId='';
        this.newCourseErrInfo='';
        this.isSelectedCourse=false;
      },
      /* 分页当前显示条数方法 */
      handleSizeChange(val) {
        const type=this.activeName==="first"?'manage':'record';
        type==='manage'?this.managePageInfo.pageSize=val:this.recordPageInfo.pageSize=val;
        this.loadCourseTabelData(type);
      },
      // 分页当前页方法
      handleCurrentChange(val) {
        const type=this.activeName==="first"?'manage':'record';
        type==='manage'?this.managePageInfo.currentPage=val:this.recordPageInfo.currentPage=val;
        this.loadCourseTabelData(type);
      },
     //设置表头行样式
      headerStyle({ row, rowIndex }) {
        return "tab_header";
      },

      //设置表头单元格样式
      headerCellStyle({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return "tab_cell";
        }
      },

      //设置行样式
      rowStyle({ row, rowIndex }) {
        if (rowIndex % 2 == 0) {
          return "tab_row1";
        } else {
          return "tab_row2";
        }
      },

      //设置单元格样式
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return "tab_cell";
        }
        if (columnIndex === 4) {
          return "tab_shool";
        }
        if (columnIndex === 5) {
          return "tab_area";
        }
      },
      //课程管理tabs change事件
      handleClick(){
        const type=this.activeName==="first"?'manage':'record';
        this.loadCourseTabelData(type);
      },
      //新增课程按钮click事件
      onNewCourse(){
        this.newCourseModel.resSubject='3';
        this.dialogTitle="开通课程";
        this.resSubjectChange();
        this.loadCourseSelectData();
        this.dialogVisible=true;
        this.operateType='new';
      }
  },
  computed: {

  },
  watch: {
      
  },
}
</script>

<style  lang="scss">
.student_course{
  .secondRow span{
    width:125px;
    height:17px;
    font-size:18px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(0,103,228,1);
    line-height:24px;
  }
 .el-tabs__nav-wrap::after{
   width:268px;
 }
 .el-tabs__item {
    width: 134px;
    height: 53px;
    background: rgba(255,255,255,1);
    border-radius: 12px 12px 0px 0px;
    padding: 0 0; 
    line-height: 53px;
    text-align: center;
    margin-right: 2px;  
    font-size:18px;
    font-family:medium;
    font-weight:500;    
  }
  .el-tabs__item.is-active{
    font-family:medium;
    font-weight:bold;
    color:rgba(34,34,34,1);
    background:url("../../assets/images/list_ic_top_blue_full.png")
  }
  .el-tabs__active-bar{
    background-color: #fff;
  }
  .el-tabs__header{
    margin: 0 0 0;
  }

 .tab_header {
    height: 68px;
    font-size: 16px;
    font-family: medium;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    background: rgba(246, 247, 249, 1);
    padding: 0 31px;
  }

  .tab_row1 {
      font-size: 14px;
      font-family: medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      height: 68px;
    }
  .tab_row2 {
    font-size: 14px;
    font-family: medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    height: 68px;
    background: rgba(246, 247, 249, 1);
  }
  .tab_cell {
    padding-left: 21px;
  }
  .course-new-cls{
    width:76px;
    height:32px;
    font-size:14px;
    font-family:medium;
    font-weight:500;    
    position: absolute;
    line-height: 32px;
    left: 10px;
    text-align: center;
  }
  .alignSite{
     padding: 20px 0px 25px 0;
  }
  .goBack{
    top:70px;
  }
  .gobackStyle{
    background:url("../../assets/images/ic_back_blue.png") no-repeat 18% 50% ;
    padding-left:18px; 
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
      border: 0;
      background:url("../../assets/images/ic_back_white.png") no-repeat 18% 50% ;
    }
    &:active{
      border: 0;
      background:url("../../assets/images/ic_back_white.png") no-repeat 18% 50% ;
    }
  }
  .el-table__empty-text{
    display: none;    
  }
  .course-record-cls{
    .el-table__empty-block{
      height:525px !important;
      background:url("../../assets/images/default_pic_student_recording.png") no-repeat 50% 50%;
    }
  }
  .course-manage-cls{
    .el-table__empty-block{
      height:525px !important;
      background:url("../../assets/images/default_pic_student_set.png") no-repeat 50% 50%;
    }
  }
  

}
.student_course .el-table th,.el-table tr {
  background: none;
}
.course-manage-dialog{
   width:570px;
   margin-top:15% !important;
  .el-dialog__header{
    padding:20px 0 20px 34px;
    border: 2px solid rgba(245,247,251,1);
    font-family: "bold";
    border-radius: 4px;
  }
  .el-dialog__body{
    padding:0px 46px 10px 0;
  }
  .el-dialog__footer{
    padding: 0 32px 32px 0;
  }
  .el-dialog__headerbtn{
    top:26px;
    right: 34px;
    font-family: "bold"
  }
  .el-input__inner{
    width:378px;
    height: 40px;
  }
  .el-input__inner:hover,.el-input__inner:active{
    border: 1px solid #327cff !important;
  }
  .el-form-item__label{
    margin-left: 25px;
    text-align: left;
    font-size:16px;
    font-family:medium;
    font-weight:400;
    color:rgba(34,34,34,1);
  }
  // 弹框提示条样式
  .hint{
    padding: 6px 0 13px 0;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  // 弹框提示条文字样式
  .hintText{
    font-size: 12px;
    color: #FF6666;
    margin-left: 7px;
  }
  
  .errStyle{
   .el-input__inner,
   .el-input__inner:hover,
   .el-input__inner:active{
     border: 1px solid #FF6666 !important;
   }
  }
  .new-course-tip-cls{
    font-size:18px;
    font-family:medium;
    font-weight:500;
    color:rgba(51,51,51,1);
    .el-row{
      margin-bottom:15px;
    }
  }
  .el-dialog__title{
    font-size:20px;
    font-family:medium;
    font-weight:bold;
    color:rgba(34,34,34,1);
  }
  .dialogText1 {
    color: #333333;
    font-size: 18px;
    margin-bottom: 5px;
  }
  .dialogText2 {
    color: #999999;
    font-size: 14px;
  }
  .dialogTwo{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 57px 0 40px 0;
    img{
      margin:0 18px 0;
    }
  }
  
  
}

</style>
