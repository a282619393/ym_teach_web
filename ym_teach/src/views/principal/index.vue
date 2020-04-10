<template>
  <div class="principal_index ">
    <!-- 订单页面显示的样式 -->
    <div class="headContent" v-if="managePagetype==3" >
      <div class="specialRow orderSpecialRow" v-show="isPrincipalri">
        <span v-for="(item,i) of searchInfo" class="searchMar" :key="i">{{item.name}}
          <el-input v-model="inputSearch[item.model]" :placeholder="item.placeholder"></el-input>
        </span>
      </div>
      <!-- 订单页面第一行 -->
      <div class="orderRow">
        <div style="width:100%">
          <!-- 右一第一区域文字跟下拉框 -->
          <span v-text="text1"></span>
          <el-select v-model="cooperationState" class="coopState">
            <el-option :label="item.name" :value="item.value" v-for="(item,i) of coopState" :key="i"></el-option>
          </el-select>
          <!-- 右一第二区域三级联动组件 监听province省份 监听city城市 监听area地区-->
          <span v-text="text2" class="text2" v-show="isPrincipalri"></span>
          <linkage @province="province" @city="city" @area="area" class="linkage" v-show="isPrincipalri"></linkage>
          <button class="newBtn newBtnSpace" @click="search" v-text="text5"></button>
        </div>
      </div>
      <!-- 订单第二行数据行 -->
      <div class="OrderNumRow">
        <span v-text="text3"></span>
          <!-- 订单总数 -->
        <span v-text="rectorNum"></span>
        <span v-text="text4" class="text4"></span>
          <!-- 待确认订单总数 -->
        <span v-text="waitNum"></span>
      </div>
    </div>
    <!-- 教学管理页面 -->
    <div class="headContent" v-else-if="managePagetype==4">
      <div class="specialRow orderSpecialRow">
        <span v-for="(item,i) of searchInfo" class="searchMar" :key="i">{{item.name}}
          <el-input v-model="inputSearch[item.model]" :placeholder="item.placeholder"></el-input>
        </span>
        <button class="newBtn newBtnSpace" @click="search" v-text="text5"></button>
      </div>
      <div class="OrderNumRow">
          <span v-text="text3"></span>
          <span v-text="rectorNum"></span>
        </div>
    </div>
    <!-- 校长管理、老师管理页面样式 -->
    <div class="headContent" v-else>
      <!-- 题头位置 -->
        <!-- 第一行 -->
      <div class="firstRow">
        <button class="newBtn" v-text="newPrincipalBtn" @click="newAdd"></button>
      </div>
      <!-- 搜索行 -->
      <div class="specialRow">
        <span v-for="(item,i) of searchInfo" class="searchMar" :key="i">{{item.name}}
          <el-input v-model="inputSearch[item.model]" :placeholder="item.placeholder"></el-input>
        </span>
      </div>
        <!-- 第二行 -->
      <div class="secondRow">
        <span v-text="text1"></span>
        <el-select v-model="cooperationState" class="coopState">
          <el-option :label="item.name" :value="item.value" v-for="(item,i) of coopState" :key="i"></el-option>
        </el-select>
        <span v-text="text2" class="text2" v-show="managePagetype!='2'"></span>
        <linkage @province="province" @city="city" @area="area" class="linkage" v-show="managePagetype!='2'"></linkage>
        <button class="newBtn newBtnSpace" @click="search" v-text="text5"></button>
      </div>
        <!-- 第三行 -->
      <div class="thirdRow">
        <span v-text="text3"></span>
        <span v-text="rectorNum"></span>
      </div>
    </div>
    <!-- 表位置 -->
    <div class="mainContent">
      <jvtable @jump="changeStatus" :loading="loading" :imgIsShow="imgIsShow" :tableType='managePagetype' :tableDataAll="tablePageData" @childData="tableData"></jvtable>
    </div>
    <!-- 分页位置 -->
    <div class="alignSite" v-show="isPagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 200]"
        :page-size="10"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationTotal">
      </el-pagination>
    </div>
    <!-- 弹出框类型 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @open="openDialog"
      :before-close="handleClose">
      <!-- 第一个弹框重置密码 -->
      <div class="dialog" v-show="dialogState==1">
        <!-- 弹框提示行 -->
        <div class="hint" :class="isHint">
          <img src="../../assets/images/ic_judge_error.png" alt="">
          <span class="hintText" v-text="upwdHint"></span>
        </div>
        <!-- 弹框主内容 -->
        <el-form label-width="178px" :model="rulesPassword">
          <el-form-item v-for="(item,i) of password" :key="i">
            <template slot="label">
              <span style="color:#FF4444">*</span>
              <span v-text="item.text"></span>
            </template>
            <el-input class="principal_add_password" :class="item.isErr"  :placeholder="item.placeholder" v-model="rulesPassword[item.rules]" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 第二个弹框更改状态 -->
      <div v-show="dialogState==2" class="dialogTwo">
        <img src="../../assets/images/pop_ic_judge_caveat_big.png" alt="">
        <div>
          <div class="dialogText1" v-text="dialogText.text1"></div>
          <div class="dialogText2" v-html="dialogText.text2"></div>
        </div>
      </div>
      <!-- 第三个弹框订单调价 -->
      <div v-show="dialogState==3" class="dialogThree">
        <el-form label-width="178px" :model="adjustPrice">
          <!-- 原金额 -->
          <el-form-item>
            <template slot="label">
              <span v-text="adjustPriceText[0].name"></span>
            </template>
            <span v-text="tableRowData.shouldTotal"></span>
          </el-form-item>
          <!-- 订单提示文字行 -->
          <div class="hint hintFloat"  :class="isHint">
            <img src="../../assets/images/ic_judge_error.png" alt="">
            <span class="hintText" v-text="upwdHint"></span>
          </div>
          <!-- 订单主内容 -->
            <!-- 调价金额 -->
          <el-form-item>
            <template slot="label">
              <span style="color:#FF4444">*</span>
              <span v-text="adjustPriceText[1].name"></span>
            </template>
            <el-input v-model="adjustPrice.amount" :class="adjustPriceText[1].isErr" :placeholder="adjustPriceText[1].placeholder" clearable></el-input>
          </el-form-item>
            <!-- 调价原因 -->
          <el-form-item>
            <template slot="label">
              <span style="color:#FF4444">*</span>
              <span v-text="adjustPriceText[2].name"></span>
            </template>
            <el-input v-model="adjustPrice.cause" type="textarea" rows="5" :class="adjustPriceText[2].isErr" :placeholder="adjustPriceText[2].placeholder" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 弹框底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <button class="minorBtn" @click="dialogVisible = false" style="marginRight:10px;">取消</button>
        <button class="newBtn" @click="ensureUpwd">确定</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入input组件
// import jvinput from '../../common/inputComponent'; 
// 引入三级联动组件
import linkage from '../../common/AreaLinkage';
// 引入表格组件
import jvtable from '../../common/TableData';
// 引入清除对象内容方法
import {objClear,isObjNull} from '../../utils/auth';
import {principalList,orderList} from "../../api/principal"
import qs from "qs"
export default {
  /*  声明数据 */
  data(){
    return {
      searchInfo:[
        {name:"校长姓名：",model:"searchName",placeholder:"请输入校长姓名"},
        {name:"手机号码：",model:"phone",placeholder:"请输入手机号码"},
        {name:"校区名称：",model:"schoolName",placeholder:"请输入校区名称"},
        {name:"校区地址：",model:"schoolSite",placeholder:"请输入校区地址"}
      ],
      coopState:[   //合作状态下拉框的数据
        {name:"全部",value:-1},
        {name:"合作",value:0},
        {name:"终止合作",value:1}
      ],
      password:[  //重置密码对话框
        {text:"请输入新密码：",placeholder:'输入8-16位字母+数字，区分大小写',rules:"password1",isErr:{errStyle:false}},
        {text:"再次输入新密码：",placeholder:'输入8-16位字母+数字，区分大小写',rules:"password2",isErr:{errStyle:false}}
      ],
      adjustPriceText:[ //订单调价对话框
        {name:"原价："},
        {name:"调价后金额：",placeholder:"请输入调整后金额",isErr:{errStyle:false}},
        {name:"调价原因：",placeholder:"请输入调价原因",isErr:{errStyle:false}}
      ],
      dialogText:{ //更改状态文字
        text1:"确定中止和该校长合作吗？",
        text2:"中止合作后，该校长账号将无法再继续使用"
      },
      inputSearch:{
        searchName:"",
        phone:"",
        schoolName:"",
        schoolSite:"",
        account:""
      },
      rulesPassword:{ //重置密码对话框input的双向绑定
        password1:'',
        password2:'',
      },
      adjustPrice:{  //订单调价对话框双向绑定
        amount:'',
        cause:''
      },
      isHint:{  //是否隐藏对话框里的提示文字
        hintState:true
      },
      tableRowData:{},  //table操作列出现的数据
      newPrincipalBtn:"新增校长",   //右上按钮文字
      placeholder:"输入名字、手机号、校区名称、校区地址",  //input框组件默认提示内容
      text1:"合作状态：",   //第一个下拉框文字
      text2:"所在地区：",    //第二个下拉框文字
      text3:"当前结果校长总数量：",   //右上尾行文字1
      text4:"待确认订单总数量：",   //右上尾行文字2
      text5:"搜索",
      cooperationState:-1,//合作状态
      searchValue:"",//查询输入框的值
      provinceID:"",  //省份id
      cityID:"",   //城市id
      areaID:"",  //地区id
      rectorNum:0,  //右上尾行1数据
      waitNum:0,    //右上尾行2数据
      currentPage: 1,    //分页栏默认页
      dialogVisible:false,  //是否展示对话框
      dialogTitle:"重置密码",  //对话框标题文字
      dialogState:1,    // 控制对话框类型
      upwdHint:"",  //   对话框提示文字
      isPagination:true,
      imgIsShow:false,
      tablePageData:[],
      pageSize:10,
      pageNum:1,
      currRegionCode:"",
      paginationTotal:0,
      loading:true,
      skipval:{},
      isPrincipalri:JSON.parse(sessionStorage.getItem("userInfo")).sysRoleList[0].roleId==3?false:true
    }
  },
  /*  注册组件 */
  components:{
    // jvinput,
    linkage,
    jvtable,
  },
  /* 接父组件的值 */
  props:{
    // 页面类型
    managePagetype:{
      type:String,
      default:""
    }
  },
  watch:{
    // 监听是否需要分页条
    tablePageData:{
      handler: function(newVal, oldVal) {
        if(newVal.length!==0){
          this.isPagination=true
        }else if(newVal.length==0){
          this.isPagination=false
        }
      },
      deep: true,
      immediate:true
    },
  },
  /* 挂载阶段钩子函数 */
  mounted(){
    if(this.managePagetype=="2"){
      this.teacherPage()
      this.searchList()
    }else if(this.managePagetype=="3"){
      this.orderPage()
      this.orderPageList()
    }else if(this.managePagetype=="4"){
      this.teachingPage()
      this.teacingpage()
    }else{
      this.principalPage()
    }
  },
  methods:{
    // 获取是否管理员
    gainIsAdmin(){
      let isAdmin=0
      if(JSON.parse(sessionStorage.getItem("userInfo")).sysRoleList[0].roleId==1 || JSON.parse(sessionStorage.getItem("userInfo")).sysRoleList[0].roleId==2){
        isAdmin=1
      }
      return isAdmin
    },
    changeStatus(val){
      this.$emit('jump',val)
    },
    // 打开对话框时格式化数据
    openDialog(){
      this.isHint.hintState=true  //默认隐藏提示文字
      if(this.dialogState==2){
      /* 打开第二类型对话框 */
        if(this.managePagetype==2){
          // 如果是老师管理页面打开第二类型对话框
          this.dialogTitle="确定离职"
          this.dialogText.text1="是否确认离职"
          this.dialogText.text2="确认离职后，该老师账号将无法登录<br/>并且将不计入在职教师数量"
        }else if(this.managePagetype==3){
          // 如果是订单管理打开第二类型对话框
          this.dialogTitle="确认订单"
          this.dialogText.text1="是否确认订单"
          this.dialogText.text2="点击确认表示货款已到<br/>对应数量的账号将自动发送给该校长"
        }else{
          // 如果是校长管理打开第二类型对话框时
          this.dialogTitle="终止合作"
        }
      }else if(this.dialogState==3){
      // 打开第三类型对话框
        this.dialogTitle="调价"
        objClear(this.adjustPrice)
        this.adjustPriceText[1].isErr.errStyle=false
        this.adjustPriceText[2].isErr.errStyle=false
      }else{
        // 默认打开第一类型对话框
        objClear(this.rulesPassword)
        this.password[0].isErr.errStyle=false
        this.password[1].isErr.errStyle=false
      }
    },
    /* 对话框确认按钮的方法 */
    ensureUpwd(){
      if(this.dialogState==2){
        /* 第二类型对话框确认方法 */
        if(this.managePagetype==2){
          // 如果是老师管理页面第二类型对话框确认方法
          let url="/teacher/teacherManager/updateStatus"
          let parmas={
	    userId:JSON.parse(sessionStorage.getItem("editInfo")).userId,
            userName:JSON.parse(sessionStorage.getItem("editInfo")).userName
	  }
          this.$axios.post(url,parmas).then(
            res=>{
              if(res.status==0){
                this.$message.success("终止合作成功")
                this.dialogVisible=false
                this.$router.go(0)
              }
            }
          ).catch(err=>console.log(err))
          this.$message.success("已确认离职成功")
          this.dialogVisible=false
        }else if(this.managePagetype==3){
          // 如果是订单管理页面第二类型对话框确认方法
          let url="/teaching/order/confirmOrder"
          let parmas={
            orderId:JSON.parse(sessionStorage.getItem("editInfo")).orderId,
            orderNumber:JSON.parse(sessionStorage.getItem("editInfo")).orderNumber,
            schoolName:JSON.parse(sessionStorage.getItem("editInfo")).schoolName,
            campusId:JSON.parse(sessionStorage.getItem("editInfo")).campusId,
            addressCode:JSON.parse(sessionStorage.getItem("editInfo")).rectorAddressCode,
            amount:JSON.parse(sessionStorage.getItem("editInfo")).amount
          }
          this.$axios.post(url,parmas).then(res=>{
            if(res.status==0){
              this.$message.success("已确认订单")
              this.$router.go(0)
            }
          }).catch(err=>console.log(err))
        }else{
          // 如果是校长管理页面第二类型对话框确认方法
          let url="/teacher/Principal/PrincipalUpdateStatus"
          let parmas={
            userId:JSON.parse(sessionStorage.getItem("editInfo")).userId,
            userName:JSON.parse(sessionStorage.getItem("editInfo")).userName
          }
          this.$axios.post(url,parmas).then(
            res=>{
              if(res.status==0){
                this.$message.success("终止合作成功")
                this.dialogVisible=false
                this.$router.go(0)
              }
            }
          ).catch(err=>console.log(err))
        }
      }else if(this.dialogState==3){
        /* 第三类型对话框确认方法 */
        let req=/^\d+$/
        let reqs=/^\s+$/
        if(!req.test(this.adjustPrice.amount)){
          // 验证调价金额
          this.upwdHint="请输入调价后金额!"
          this.isHint.hintState=false
          this.adjustPriceText[1].isErr.errStyle=true
          this.adjustPriceText[2].isErr.errStyle=false
        }else if(!this.adjustPrice.cause || reqs.test(this.adjustPrice.cause)){
          // 验证调价原因
          this.upwdHint="请输入调价原因!"
          this.isHint.hintState=false
          this.adjustPriceText[1].isErr.errStyle=false
          this.adjustPriceText[2].isErr.errStyle=true
        }else if(this.adjustPrice.cause.length>100){
          this.upwdHint="调价原因不能超过100个字!"
          this.isHint.hintState=false
          this.adjustPriceText[1].isErr.errStyle=false
          this.adjustPriceText[2].isErr.errStyle=true
        }else{
          // 验证通过
          let url="/teaching/order/adjustmentAmount"
          let parmas={
            orderId:JSON.parse(sessionStorage.getItem("editInfo")).orderId,
            orderNumber:JSON.parse(sessionStorage.getItem("editInfo")).orderNumber,
            realTotal:this.adjustPrice.amount,
            priceReasons:this.adjustPrice.cause
          }
          this.$axios.post(url,parmas).then(res=>{
            if(res.status==0){
              this.$message.success("调价完成")
              this.$router.go(0)
            }
          }).catch(err=>console.log(err))
        }
      }else{
        /* 第一类型对话框确认方法 */
        let req=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if(!req.test(this.rulesPassword.password1) || !req.test(this.rulesPassword.password2)){
          // 验证重置密码格式
          this.upwdHint="输入8-16位数字+字母密码!"
          this.isHint.hintState=false
          this.password[0].isErr.errStyle=true
          this.password[1].isErr.errStyle=false
        }else if(this.rulesPassword.password1!==this.rulesPassword.password2){
          // 验证密码是否一致
          this.upwdHint="密码前后不一致，请重新输入!"
          this.isHint.hintState=false
          this.password[0].isErr.errStyle=false
          this.password[1].isErr.errStyle=true
        }else{
          // 验证通过
          let url=""
          if(this.managePagetype==2){
            url="/teacher/teacherManager/updatePassword"
          }else{
            url="/teacher/Principal/PrincipalResetPassword"
          }
          let parmas={
            userId:JSON.parse(sessionStorage.getItem("editInfo")).userId,
            userName:JSON.parse(sessionStorage.getItem("editInfo")).userName,
            password:this.rulesPassword.password2
          }
          this.$axios.post(url,parmas).then(res=>{
            if(res.status==0){
              this.$message.success("修改成功")
              this.dialogVisible=false
            }
          }).catch(err=>console.log(err))
        }
      }
    },
     // 获取地区code码
    gainCurrRegionCode(){
      if(this.areaID!==""){
        this.currRegionCode=this.areaID
      }else if(this.cityID!==""){
        this.currRegionCode=this.cityID
      }else{
        this.currRegionCode=this.provinceID
      }
    },
    // 获取初始化校长列表数据
    principalPage(){
      let url="/teacher/Principal/searchPaging/?current="+this.pageNum+"&size="+this.pageSize
      let parmas={
        currRegionCode:this.currRegionCode,
        name:this.inputSearch.searchName,
        phone:this.inputSearch.phone,
        status:this.cooperationState,
        campusName:this.inputSearch.schoolName,
        specificAddress:this.inputSearch.schoolSite
      }
      this.$axios.post(url,parmas).then(
        res=>{
          let rowsData=res.data.rows
          for(let item of rowsData){
            item.isShow=item.status==0?true:false
            item.status=item.status==0?"合作":"中止合作"
          }
          this.tablePageData=rowsData
          this.rectorNum=res.data.total
          this.paginationTotal=res.data.total
        }
      ).finally(()=>{
        this.loading=false;
        this.imgIsShow=true
      })
    },
    // 获取初始化订单列表数据
    orderPageList(){
      let url="/teaching/order/selectOrderList"
      let parmas={
        rectorUserName:this.inputSearch.searchName==""?null:this.inputSearch.searchName,
        schoolName:this.inputSearch.schoolName==""?null:this.inputSearch.schoolName,
        rectorPhone:this.inputSearch.phone==""?null:this.inputSearch.phone,
        orderStauts:this.cooperationState,
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        currRegionCode:this.currRegionCode==""?null:this.currRegionCode
      }
      this.$axios.post(url,parmas).then(res=>{
        let rowsData=res.data.rows
        for(let item of rowsData){
          item.isShow=item.status==0?true:false
          item.status=item.status==0?"未确认":"已确认"
        }
        this.tablePageData=rowsData
        this.rectorNum=res.data.total
        this.waitNum=res.data.unconfirmedTotal
        this.paginationTotal=res.data.total
      }).finally(()=>{
        this.loading=false;
        this.imgIsShow=true
      })
    },
    // 获取初始化老师列表数据
    searchList(){
      let url="/teacher/teacherManager/teacherPage?current="+this.pageNum+"&size="+this.pageSize 
      this.skipval=this.$route.params   //跳转传递的参数
      let params={}  //声明参数
      if(isObjNull(this.skipval)){ 
        // 如果不是从校长页面跳转过来时的参数
        params={
          isAdmin:this.gainIsAdmin(),
          status:this.cooperationState,
          phone:this.inputSearch.phone,
          name:this.inputSearch.searchName,
          campusName:this.inputSearch.schoolName
        }
      }else{
        // 如果是从校长页面跳转过来时的参数
        this.inputSearch.schoolName=this.skipval.name
        this.cooperationState=0
        params={
          isAdmin:1,
          status:this.cooperationState,
          campusName:this.skipval.name,
          campusId:this.skipval.id
        }
      }
      // 发送请求
      this.$axios.post(url,params).then(res=>{
        let rowsData=res.data.rows
        for(let item of rowsData){
          item.sex=item.sex==1?"男":"女"
          item.isShow=item.status==0?true:false
          item.status=item.status==0?"在职":"离职"
        }
        this.tablePageData=rowsData
        this.rectorNum=res.data.total
        this.paginationTotal=res.data.total
      }).finally(()=>{
        this.loading=false;
        this.imgIsShow=true;
        delete this.skipval.id;
        delete this.skipval.name;
      })
    },
    // 老师管理页面初始化数据
    teacherPage(){
      this.newPrincipalBtn="新增老师"
      this.text1="确认状态："
      this.text3="当前结果老师总数量："
      let isAdmin=this.gainIsAdmin()
      if(isAdmin==1){
        this.searchInfo=[
          {name:"老师姓名：",model:"searchName",placeholder:"请输入老师姓名"},
          {name:"手机号码：",model:"phone",placeholder:"请输入手机号码"},
          {name:"所在校区：",model:"schoolName",placeholder:"请输入校区名称"}
        ]
      }else{
        this.searchInfo=[
          {name:"老师姓名：",model:"searchName",placeholder:"请输入老师姓名"},
          {name:"手机号码：",model:"phone",placeholder:"请输入手机号码"},
        ]
      }
      this.coopState=[   //合作状态下拉框的数据
        {name:"全部",value:-1},
        {name:"在职",value:0},
        {name:"离职",value:1}
      ]
    },
    // 教学管理主页面数据函数
    teacingpage(){
      let url="/teaching/students"
      let parmas={
        name:this.inputSearch.searchName,
        campuName:this.inputSearch.schoolName,
        userName:this.inputSearch.account,
        pageSize:this.pageSize,
        pageNum:this.pageNum
      }
      this.$axios.post(url,parmas).then(res=>{
        let rowsData=res.data.rows
        for(let item of rowsData){
          item.isShow=true
          item.sex=item.sex==1?"男":"女"
        }
        this.tablePageData=rowsData
        this.rectorNum=res.data.total
        this.paginationTotal=res.data.total
      }).finally(()=>{
        this.loading=false;
        this.imgIsShow=true
      })
    },
    // 订单管理页面初始化数据
    orderPage(){
      this.text3="当前结果订单总数量："
      this.text1="确认状态："
      this.searchInfo.pop()
      this.coopState=[   //合作状态下拉框的数据
        {name:"全部",value:-1},
        {name:"已确认",value:1},
        {name:"未确认",value:0}
      ]
    },
    // 教学管理页面初始化数据
    teachingPage(){
      let admin=this.gainIsAdmin()
      if(admin==1){
        this.searchInfo=[
          {name:"学生姓名：",model:"searchName",placeholder:"请输入学生姓名"},
          {name:"校区名称：",model:"schoolName",placeholder:"请输入校区名称"},
          {name:"账号：",model:"account",placeholder:"请输入账号名"},
        ]
      }else{
        this.searchInfo=[
          {name:"学生姓名：",model:"searchName",placeholder:"请输入学生姓名"},
          {name:"账号：",model:"account",placeholder:"请输入账号名"}
        ]
      }
      this.placeholder="输入学生名字、校区名称、学生账号等"
      this.text3="当前结果学生总数量："
    },
    // 这是搜索的方法
    search(){
      this.gainCurrRegionCode()
      if(this.managePagetype=="2"){
        this.searchList()
      }else if(this.managePagetype=="3"){
        this.orderPageList()
      }else if(this.managePagetype=="4"){
        this.teacingpage()
      }else{
        this.principalPage()
      }
    },
    province(val){ //获取省份相关信息
      this.provinceID=val[0]
    },
    city(val){ //获取城市相关信息
      this.cityID=val[0]
    },
    area(val){ //获取地区相关信息
      this.areaID=val[0]
    },
    /* 分页当前显示条数方法 */
    handleSizeChange(val) {
      this.pageSize=val
      this.search()
    },
    // 分页当前页方法
    handleCurrentChange(val) {
      this.pageNum=val
      this.search()
      // this.$emit("currentChange",val)
    },
    /* 关闭对话框方法 */
    handleClose(){
      this.dialogVisible=false
    },
    /* 获取操作行数据的方法 */
    tableData(val){
      this.dialogState=val.featrue
      this.dialogVisible=val.dialog
      this.tableRowData=val.value
    },
    /* 右上行一新增按钮 */
    newAdd(){
      if(this.managePagetype=='2'){
        this.$router.push('/teacher/add')
      }else{
        this.$router.push('/principal/add')
      }
    },
  },
}
</script>
<style lang="scss">
/* 隐藏对话框提示文字的样式 */
  .hintState{
    visibility:hidden;
  }
  /* 右上下拉框行高 */
  .el-input__inner{
    height:36px
  }
  .el-select:hover .el-input__inner:hover {
    border-color:#1F83FF
  }
  .el-select:hover .el-input__inner:active {
    border-color:#1F83FF
  }
  .el-select-dropdown__item{
    font-family: 'bold';
    font-size: 16px;
  }
  .el-select-dropdown__item.selected{
    color: #1F83FF;
    background: #f7f7f7;
  }
  
  .el-icon-arrow-up:before{
    font-weight: 900;
    color:#7F838C;
  }
  .secondRow .el-input__icon,
  .orderRow  .el-input__icon{
    line-height: 30px
  }
  .el-dialog{
    width:520px;
    margin-top:15% !important;
  }
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
  .dialog .el-input__inner,
  .dialogThree .el-input__inner{
    width: 294px;
    height: 42px;
    font-size: 14px;
  }
  .errStyle .el-input__inner,
  .errStyle .el-input__inner:hover,
  .errStyle .el-input__inner:active,
  .errStyle .el-textarea__inner,
  .errStyle .el-textarea__inner:hover,
  .errStyle .el-textarea__inner:active{
    border: 1px solid #FF6666;
  }
  .principal_add_password{
    .el-input__inner{
        -webkit-text-security: disc;
    }
  }
</style>
