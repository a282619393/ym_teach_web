<template>
  <div class='principal_add'>
    <!-- 新增、编辑页面 -->
    <div v-text="title" class="titleStyle"></div>
    <el-form :model="ruleForm"  :rules="rules"  ref="ruleForm" label-width="179px" >
      <el-form-item :label="`${editTitle}：`" v-if="pagetype==2 || pagetype==4">
        <span v-text="editAccount" class="titleContent"></span>
      </el-form-item>
      <!-- 新增、编辑的选项 -->
      <el-form-item
      class="dist"
      v-for="(item,i) of formData"
      :key="i"
      :label="`${item.label}：`" 
      :prop="item.prop"
      >
        <el-input  v-model="ruleForm[item.prop]" :class="item.class?item.class:''"  :type="item.type" :placeholder="item.placeholder" ></el-input>
      </el-form-item>
      <!-- 老师专属选项 -->
      <div v-show="pagetype=='3' || pagetype==4">
         <!-- 性别选择框 -->
        <el-form-item  prop="sex">
          <template slot="label">
            <span class="icon1">*</span>
            <span v-text="sexText[0]"></span>
          </template>
          <el-select v-model="ruleForm.sex" :placeholder="sexText[1]" class="sex" >
            <el-option 
              :label="item.name" 
              :value="item.value" 
              v-for="(item,i) of addTeacher.sex" 
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 年龄输入框 -->
        <el-form-item prop="age" class="dist">
          <template slot="label">
            <span class="icon1">*</span>
            <span v-text="ageText[0]"></span>
          </template>
          <el-input v-model="ruleForm.age" maxlength='2' :placeholder="ageText[1]"></el-input>
        </el-form-item>
        <el-form-item class="dist">
          <template slot="label">
            <span class="icon1">*</span>
            <span v-text="gradeText"></span>
          </template>
          <el-radio-group v-model="ruleForm.grade">
            <el-radio :label="item.value" :disabled="item.isUsable" v-for="(item,i) of addTeacher.grade" :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 负责学科按钮 -->
        <el-form-item class="dist">
          <template slot="label">
            <span class="icon1">*</span>
            <span v-text="subjectText"></span>
          </template>
          <el-radio-group v-model="ruleForm.subject">
            <el-radio :label="item.courseId"  v-for="(item,i) of addTeacher.subject" :key="i">{{item.courseName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 对应校区 -->
        <el-form-item  prop="campus" v-show="pagetype==3">
          <template slot="label">
            <span class="icon1">*</span>
            <span v-text="campusText[0]"></span>
          </template>
          <el-select v-model="ruleForm.campus" :placeholder="campusText[1]" class="campus" >
            <el-option 
              :label="item.name" 
              :value="`${item.campusId}+${item.addressCode}`" 
              v-for="(item,i) of addTeacher.campusInfo" 
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 校长专属选项 -->
      <div v-show="!pagetype || pagetype==2">
        <el-form-item prop="region">
          <template slot="label">
            <span>{{siteData[0]}}：</span>
          </template>
          <linkage ref="linkageRef" @province="province" @city="city" @area="area"></linkage>
        </el-form-item>
        <el-form-item class="site" :label="`${siteData[1]}：`" prop="site">
          <el-input v-model="ruleForm.site"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="btnRow">
        <button class="newBtn" style="marginRight:10px;" @click.prevent="save('ruleForm')" v-text="text2"></button>
        <button class="minorBtn" @click.prevent="cancel" v-text="text3"></button>
      </el-form-item>
    </el-form>
    <button class="goBack" @click.prevent="goback">
      <div class="gobackStyle" v-text="text1"></div>
    </button>
  </div>
</template>

<script>
// 引入三级联动组件
import linkage from '../../common/AreaLinkage';
import {gainCourse} from '../../api/teacher';
import axios from "../../utils/request";
import qs from "qs";
import {getProvinceList,getCityList,getAreaList} from '../../api/student';
export default {
  data() {
    let req=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
    let reqs=/^[\u4E00-\u9FA5]{1,10}$|^[A-Za-z]{1,20}$/
    let reqnum=/^1[3456789]\d{9}$/
    // 验证账号跟密码
    let verifyFormat=(rule, value, callback)=>{
      if (!req.test(value)) {
        return callback(new Error('请输入8-16位字母+数字，注意区分大小写'));
      }
      callback();
    }
    // 验证确认密码
    let verifyUpwd=(rule, value, callback)=>{
      if(!req.test(value)){
        return callback(new Error('请输入8-16位字母+数字，注意区分大小写'));
      }else if(value!==this.ruleForm.upwd){
        return callback(new Error('两次密码不一致'));
      }else{
        callback();
      }
    }
    // 验证老师姓名
    let verifyName=(rule, value, callback)=>{
      if(!value){
        return callback(new Error('此项不能为空'));
      }else if(!reqs.test(value)){
        return callback(new Error('请输入1-10个汉字或者1-20个字母'));
      }else{
        callback();
      }
    }
    // 验证手机号码
    let verifyIphone=(rule, value, callback)=>{
        if(!reqnum.test(value)){
          return callback(new Error('请输入正确格式的手机号码'));
        }else{
        callback();
      }
    }
    // 验证地区
    let verifyRegion=(rule, value, callback)=>{
      if(value[0]==""){
        return callback(new Error('请选择省份'));
      }else if(value[1]==""){
        return callback(new Error('请选择城市'));
      }else if(value[2]==""){
        return callback(new Error('请选择地区'));
      }else{
        callback();
      }
    }
    return {
      userInfo:JSON.parse(sessionStorage.getItem("userInfo")),
      text1:"返回",
      text2:"保存",
      text3:"取消",
      editTitle:'账号',
      editAccount:'betsy',
      title:"新增校长",
      sexText:["性别：","请选择"],
      ageText:["年龄：","请输入年龄"],
      gradeText:'负责学段：',
      subjectText:'负责学科：',
      campusText:["对应校区：","请选择校区"],
      addTeacher:{
        grade:[
          {name:"小学",value:0,isUsable:true},
          {name:"初中",value:1,isUsable:false},
          {name:"高中",value:2,isUsable:true}
        ],
        sex:[
          {name:"男",value:1},
          {name:"女",value:0}
        ],
        subject:[],
        campusInfo:[],
      },
      siteData:['所在地区','具体地址'],
      ruleForm:{
        uname:'',
        upwd:'',
        affirmUpwd:'',
        username:'',
        phone:'',
        province:'',
        city:'',
        area:'',
        campusname:'',
        site:'',
        sex:'',
        age:'',
        grade:1,
        subject:0,
        campus:"",
        region:[],
        regionVal:[]
      },
      // 校验规则
      rules:{
        uname:[
          { validator: verifyFormat,required: true, trigger: 'blur' },
        ],
        upwd:[
          { validator: verifyFormat,required: true, trigger: 'blur' },
        ],
        affirmUpwd:[
          { validator: verifyUpwd,required: true, trigger: 'blur' },
        ],
        username:[
          { validator: verifyName,required: true, trigger: 'blur' },
        ],
        phone:[
           { validator: verifyIphone,required: true, trigger: 'blur'},
        ],
        campusname:[
          { required: true, message: '请输入校区名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        site:[
          { required: true, message: '请输入具体地址', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        region:[
          { validator: verifyRegion,required: true,  trigger: 'change' }
        ]
        
      },
      //  循环产生的选项内容
      formData:[
        {label:"账号",prop:'uname',type:"text",placeholder:"请输入账号"},
        {label:"密码",prop:'upwd',type:"text",placeholder:"请输入密码",class:"principal_add_password"},
        {label:"确认密码",prop:'affirmUpwd',type:"text",placeholder:"请确认密码",class:"principal_add_password"},
        {label:"校长姓名",prop:'username',type:"text",placeholder:"请输入姓名"},
        {label:"手机号码",prop:'phone',type:"text",placeholder:"请输入手机号"},
        {label:"校区名称",prop:'campusname',type:"text",placeholder:"请输入校区名称"},
      ],
      
    };
  },
  // 统一注册组件
  components:{
    linkage
  },
  // 接收父组件的值
  props:{
    pagetype:{
      type:String,
      default:''
    },
  },
  created() {
  },
  // 挂载函数
  mounted() {
    // this.gainReArea()
    if(this.pagetype==2){
      this.editPrincipal()
    }else if(this.pagetype==3){
      this.gainAreaList()
      this.newAddTeacher()
    }else if(this.pagetype==4){
      this.editTeacher()
    }
  },
  methods: {
    // 新增校长接口函数
    newPrincipal(data){
      let url="/teacher/Principal/newbuildPrincipal"
      axios({
        url,
        method: 'post',
        data
      }).then(res=>{
        if(res.status==0){
          this.$message.success("新建成功")
          this.$router.push("/principal/index")
        }
      })
    },
    // 编辑校长的函数
    editPrincipalInfo(parmas){
      let url="/teacher/Principal/updatePagingPrincipal"
      this.$axios.post(url,parmas).then(res=>{
        if(res.status==0){
          this.$message.success("修改成功")
          this.$router.push("/principal/index")
        }
      })
      .catch(err=>console.log(err))
    },
    // 新增老师函数
    newTeacher(parmas){
      let url="/teacher/teacherManager/newBulidTeacher"
      this.$axios.post(url,parmas).then(res=>{
        if(res.status==0){
          this.$message.success("新增成功")
          this.$router.push("/teacher/index")
        }
      })
      .catch(err=>console.log(err))
    },
    // 编辑老师的方法
    editOldTeacher(parmas){
      let url="/teacher/teacherManager/updateTeacher"
      this.$axios.post(url,parmas).then(res=>{
        if(res.status==0){
          this.$message.success("编辑成功")
          this.$router.push("/teacher/index")
        }
      })
      .catch(err=>console.log(err))
    },
    // 获取学科信息函数
    gainCourseList(){
      gainCourse().then(res=>{
        this.addTeacher.subject=res.data
      })
    },
    // 获取是否管理员
    gainIsAdmin(){
      let isAdmin=0
      if(this.userInfo.sysRoleList[0].roleId==1 || this.userInfo.sysRoleList[0].roleId==2){
        isAdmin=1
      }
      return isAdmin
    },
    // 获取新增老师下拉框内容
    gainAreaList(){
      axios({
        url: '/teacher/teacherManager/teacherList',
        method: 'post',
        data:{
          isAdmin:this.gainIsAdmin(),
          userId:this.userInfo.userId
        }
      }).then(res=>{
        this.addTeacher.campusInfo=res.data
      })
    },
    // 监听省份的值
    province(val){
      this.ruleForm.province=val[0]
      this.ruleForm.region[0]=val[0]
      this.ruleForm.regionVal[0]=val[1]
    },
    // 监听城市的值
    city(val){
      this.ruleForm.city=val[0]
      this.ruleForm.region[1]=val[0]
      this.ruleForm.regionVal[1]=val[1]
    },
    // 监听地区的值
    area(val){
      this.ruleForm.area=val[0]
      this.ruleForm.region[2]=val[0]
      this.ruleForm.regionVal[2]=val[1]
    },
    
    // 编辑校长
    editPrincipal(){
      let editData=JSON.parse(sessionStorage.getItem("editInfo"))
      this.title="编辑校长"
      this.editAccount=editData.userName
      this.ruleForm.username=editData.name
      this.ruleForm.phone=editData.phone
      this.ruleForm.campusname=editData.campusName
      this.ruleForm.site=editData.specificAddress
      this.formData=[
        {label:"校长姓名",prop:'username',placeholder:"请输入姓名"},
        {label:"手机号码",prop:'phone',placeholder:"请输入手机号"},
        {label:"校区名称",prop:'campusname',placeholder:"请输入校区名称"}
      ]
      let url="/teacher/Principal/updatePage?code="+JSON.parse(sessionStorage.getItem("editInfo")).code
      this.$axios.post(url).then(res=>{
        this.ruleForm.province=res.data.hatProvince.provinceID
        this.ruleForm.city=res.data.hatCity.cityID;
        this.ruleForm.area=res.data.hatArea.areaID;
        this.$refs.linkageRef.gainProvinceID(this.ruleForm.province);
        this.$refs.linkageRef.gainCityID(this.ruleForm.city);
        this.$refs.linkageRef.setValueForProCityArea( this.ruleForm.province,this.ruleForm.city,this.ruleForm.area);
      })
    },
    // 新增老师
    newAddTeacher(){
      this.title="新增老师"
      this.gainCourseList()
      this.formData[3].label="老师姓名"
      this.formData.pop()
      delete this.rules.site
      delete this.rules.region
      this.rules.sex=[{
        required: true, message:"请选择性别",trigger: 'change' 
      }]
      // 年龄验证
      this.rules.age=[
        // { required: true,  trigger: 'blur' },
        { validator:(rule, value, callback)=>{
          let reqage=/^([1-9])|([1-9]\d)$/
            if(!reqage.test(value)){
              return callback(new Error('年龄区间为1-99'));
            }else{
              callback();
            }
          }
        }
      ]
      // 校区验证
      this.rules.campus=[
        // { required: true,  trigger: 'blur' },
        { validator:(rule, value, callback)=>{
            if(value==""){
              return callback(new Error('请选择对应校区'));
            }else{
              callback();
            }
          }
        }
      ]
    },
    // 编辑老师
    editTeacher(){
      let editData=JSON.parse(sessionStorage.getItem("editInfo"))
      this.title="编辑老师"
      this.gainCourseList()
      this.editAccount=editData.userName
      this.ruleForm.username=editData.name
      this.ruleForm.phone=editData.phone
      this.ruleForm.sex=editData.sex=="男"?1:0
      this.ruleForm.age=editData.age
      this.ruleForm.subject=editData.courseName=="数学"?0:(editData.courseName=="物理"?1:2)
      delete this.rules.site
      delete this.rules.region
      this.formData=[
        {label:"老师姓名",prop:'username',placeholder:"请输入姓名"},
        {label:"手机号码",prop:'phone',placeholder:"请输入手机号"}
      ]
      this.rules.age=[
        { validator:(rule, value, callback)=>{
          let reqage=/^([1-9])|([1-9]\d)$/
            if(!reqage.test(value)){
              return callback(new Error('年龄区间为1-99'));
            }else{
              callback();
            }
          }
        }
      ]
    },
    // 确认按钮方法
    save(formName){
      let address=""
      for(let item of this.ruleForm.regionVal){
        if(item!==undefined){
          address+=item
        }
      }
      let isError=false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          isError=false
        } else {
          isError=true;
        }
      });
      if(isError)return
      if(this.pagetype==2){
        const parmas={
          name:this.ruleForm.username,
          phone:this.ruleForm.phone,
          code:this.ruleForm.area,
          address:address,
          campusName:this.ruleForm.campusname,
          campusId:JSON.parse(sessionStorage.getItem("editInfo")).campusId,
          userId:JSON.parse(sessionStorage.getItem("editInfo")).userId,
          specificAddress:this.ruleForm.site
        }
        this.editPrincipalInfo(parmas)
      }else if(this.pagetype==3){
        let campus=this.ruleForm.campus.split("+")
        const parmas={
          isAdmin:this.gainIsAdmin(),
          age:this.ruleForm.age,
          sex:this.ruleForm.sex,
          userName:this.ruleForm.uname,
          password:this.ruleForm.affirmUpwd,
          name:this.ruleForm.username,
          phone:this.ruleForm.phone,
          campusId:parseInt(campus[0]),
          gradeId:[{gradeId:this.ruleForm.grade}],
          courseId:this.ruleForm.subject,
          code:parseInt(campus[1])
        }
        this.newTeacher(parmas)
      }else if(this.pagetype==4){
        const parmas={
          name:this.ruleForm.username,
          phone:this.ruleForm.phone,
          sex:this.ruleForm.sex,
          age:this.ruleForm.age,
          gradeId:[{gradeId:this.ruleForm.grade}],
          courseId:this.ruleForm.subject,
          userId:JSON.parse(sessionStorage.getItem("editInfo")).userId,
        }
        this.editOldTeacher(parmas)
      }else{
        const parmas={
          userName:this.ruleForm.uname,
          password:this.ruleForm.affirmUpwd,
          name:this.ruleForm.username,
          address:address,
          campusName:this.ruleForm.campusname,
          specificAddress:this.ruleForm.site,
          code:this.ruleForm.area,
          phone:this.ruleForm.phone
        }
        this.newPrincipal(parmas)
      }
    },
    cancel(){
      this.$router.go(-1)
    },
    goback(){
      this.$router.go(-1)
    }
  },
  computed: {

  },
  watch: {

  },
  destroyed(){

  }
}
</script>

<style>
  .dist .el-input__inner{
    width: 378px;
    height:44px;
  }
  .site .el-input__inner{
    width: 726px;
    height:44px;
  }
  .el-form-item__label{
    font-size:16px;
    line-height: 44px;
  }
</style>
<style lang="scss">
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
.sex .el-input__inner{
  width:127px;
  height: 40px;
}
.campus .el-input__inner{
  width:378px;
  height: 40px;
}
.sex .el-input__inner:hover,.sex .el-input__inner:focus,
.campus .el-input__inner:hover,.sex .el-input__inner:focus{
  border: 1px solid #327cff !important;
}
.el-select-dropdown__list li,
.el-select-dropdown__item.selected{
  /* color: #327cff !important; */
  font-family: 'medium';
  font-size: 16px;
}
.el-select-dropdown__item.selected{
  color: #327cff !important;
  font-family: 'bold;';
  font-size: 16px;
}
.el-radio__inner{
  width: 22px;
  height: 22px;
}
.el-radio__label{
  font-size:16px;
}
.el-radio__inner::after{
  background-color:#327CFF;
  width: 8px;
  height: 8px;
}
.el-radio__input.is-checked .el-radio__inner{
  border-color:#327CFF;
  background: #fff;
}
.el-form-item__content{
  line-height: 50px;
}
.el-input__icon{
  line-height: 50px;
}
.el-form-item__error{
  background:url("../../assets/images/ic_judge_caveat.png") no-repeat;
  background-size:15px;
  padding:1px 0 0 16px;
  top:30%;
  left:28%;
  font-size: 14px;
}
.site .el-form-item__error{
  left:52%;
}
.principal_add{
   input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-text-fill-color: #606266 !important;
    box-shadow: 0 0 0px 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
  }
  input {
    background-color:transparent;
  }
  .principal_add_password{
    .el-input__inner{
       -webkit-text-security: disc;
    }
  }
}
</style>
