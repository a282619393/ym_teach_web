<template>
  <div class='student_add principal_add'>
    <!-- 新增、编辑页面 -->
    <div v-text="title" class="titleStyle"></div>
    <el-form :model="ruleForm"  :rules="rules"  ref="ruleForm" label-width="179px" >
      <el-form-item :label="`${editTitle}：`" v-if="pagetype==2">
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
        <el-input :type="item.type" v-model="ruleForm[item.prop]" :class="item.class?item.class:''" :placeholder="item.placeholder" clearable></el-input>
      </el-form-item>
    
      <div>
         <!-- 性别选择框 -->
        <el-form-item  prop="sex">
          <template slot="label">
            <span v-text="sexText[0]"></span>
          </template>
          <el-select v-model="ruleForm.sex" :placeholder="sexText[1]" class="sex" clearable>
            <el-option 
              :label="item.name" 
              :value="item.value" 
              v-for="(item,i) of addTeacher.sex" 
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--出生日期-->
        <el-form-item  prop="birthday">
          <template slot="label">
            <span v-text="birthdayText[0]"></span>
          </template>
           <el-date-picker
            v-model="ruleForm.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            clearable
            :placeholder="birthdayText[1]">
          </el-date-picker>
        </el-form-item>
        <!--所在区域-->
        <el-form-item prop="region">
          <template slot="label">
            <span>{{siteData[0]}}：</span>
          </template>
          <linkage ref="linkageRef" @province="province" @city="city" @area="area"></linkage>
        </el-form-item>

        <!-- 对应校区 -->
        <el-form-item  prop="campus">
          <template slot="label">
            <span v-text="campusText[0]"></span>
          </template>
          <el-select v-model="ruleForm.campus" :placeholder="campusText[1]" class="campus" clearable :disabled="ruleForm.userId?true:false">
            <el-option 
              :label="item.name" 
              :value="item.campusId" 
              v-for="item of addTeacher.campusInfo" 
              :key="item.campusId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--学段-->
        <el-form-item class="dist">
          <template slot="label">
            <span class="icon1">*</span>
            <span v-text="gradeText"></span>
          </template>
          <el-radio-group v-model="ruleForm.grade">
            <el-radio :label="item.value" :disabled="item.isUsable" v-for="(item,i) of addTeacher.grade" :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    
      <el-form-item class="btnRow">
        <button class="newBtn" style="marginRight:10px;" @click.prevent="save('ruleForm')" v-loading.fullscreen.lock="buttonLoading">保存</button>
        <button class="minorBtn" @click.prevent="cancel">取消</button>
      </el-form-item>
    </el-form>

    <button class="goBack" @click="goback">
      <div class="gobackStyle">返回</div>
    </button>
  </div>
</template>

<script>
// 引入三级联动组件
import linkage from '../../common/AreaLinkage';
export default {
  data() {
    let req=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    let reqs=/^[\u4E00-\u9FA5]{1,10}$|^[A-Za-z]{1,20}$/;
    let reqnum=/^1[3456789]\d{9}$/;
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
    // 验证学生姓名
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

     //验证性别
    let verifySex=(rule, value, callback)=>{
        if(!value&&value!==0){
          return callback(new Error('请选择性别'));
        }else{
        callback();
      }
    }

    //验证出生日期
     let verifyBirthday=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('请选择出生日期'));
        }else{
          //校验出生日期必须小于今天且学生的年龄最大为99岁
          let today=new Date();
          let todayStr=today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
          if(new Date(value).getTime()>=new Date(todayStr).getTime()){
             return callback(new Error('出生日期不能大于或等于今天'));
          }else if(today.getFullYear()-(new Date(value)).getFullYear()>99){
            return callback(new Error(`所选年份不能低于${today.getFullYear()-99}年`));
          }else{
             callback();
          }        
      }
    }
    // 验证地区
   
    let verifyRegion=(rule, value, callback)=>{   
      if(!value[0]){
        return callback(new Error('请选择省份'));
      }else if(!value[1]){
        return callback(new Error('请选择城市'));
      }else if(!value[2]){
        return callback(new Error('请选择地区'));
      }else{
        callback();
      }
    }

    //验证对应校区
     let verifyCampus=(rule, value, callback)=>{
        if(!value){
          return callback(new Error('请选择对应校区'));
        }else{
         callback();
      }
    }
    return {
      editTitle:'账号',
      editAccount:'',
      title:"新增学生",
      sexText:["性别：","请选择"],
      gradeText:'学段：',
      campusText:["对应校区：","请选择校区"],
      birthdayText:["出生日期","选择出生日期"],//出生日期text
      addTeacher:{
        grade:[
          {name:"小学",value:'0',isUsable:true},
          {name:"初中",value:'1',isUsable:false},
          {name:"高中",value:'2',isUsable:true}
        ],
        sex:[
          {name:"男",value:1},
          {name:"女",value:0}
        ],
        campusInfo:[],
      },
      siteData:['所在地区','具体地址'],
      ruleForm:{
        uname:'',//账号
        upwd:'',//密码
        affirmUpwd:'',//确认密码
        username:'',//学生姓名
        phone:'',//手机号码
        province:'',//省
        city:'',//市
        area:'',//区
        sex:'',//性别
        campus:"",//对应校区
        grade:'1',//学段
        region:[],//省市区对应的数组
        birthday:''//出生日期
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
        sex:[{
            required: true,trigger: 'change',validator:verifySex
          }
        ],
        birthday:[{
            required: true,trigger: 'change',validator:verifyBirthday
          }
        ],
        campus:[
          {  required: true,trigger: 'change',validator:verifyCampus },
        ],
        
        region:[
          { validator: verifyRegion,required: true,  trigger: 'change' }
        ]
        
      },
      //  循环产生的选项内容
      formData:[
        {label:"账号",prop:'uname',placeholder:"请输入账号",type:"text"},     
        {label:"密码",prop:'upwd',placeholder:"请输入密码",type:"text",class:"student_add_password"},      
        {label:"确认密码",prop:'affirmUpwd',placeholder:"请确认密码",type:"text",class:"student_add_password"},
        {label:"学生姓名",prop:'username',placeholder:"请输入姓名",type:"text"},
        {label:"手机号码",prop:'phone',placeholder:"请输入手机号",type:"text"}
      ],
      buttonLoading:false,
      api:{
        addStudentUrl:'/student/insertStudent',//新增学生url
        selectStudentUrl:'/student/queryStudent',//查询学生信息(by userId)
        editStudentUrl:'/student/updateStudent',//编辑学生
        searchCampusListUrl:'/student/queryCampusList'//查询所在校区下拉框data
      }
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
    if(this.pagetype==2){
      this.editStudent();
    }else{
      this.ruleForm.userId='';
    }
    this.getSearchCampusList();
  },
  methods: {
    getSearchCampusList(){
      this.$axios.post(this.api.searchCampusListUrl).then(res=>{
        this.addTeacher.campusInfo=res.data.filter(el=>{
          if(el)return el;
        })
      })
    },
    //返回button click事件
    goback(){
      this.$router.push('/student');
    },
    // 监听省份的值
    province(val){	      
      this.ruleForm.province=val[0];
      this.ruleForm.region[0]=val[1];
    },
    // 监听城市的值
    city(val){
      this.ruleForm.city=val[0];
      this.ruleForm.region[1]=val[1];
    },
    // 监听地区的值
    area(val){
      this.ruleForm.area=val[0];
      this.ruleForm.region[2]=val[1];
    },
    // 编辑学生
    editStudent(){
      let editData=JSON.parse(sessionStorage.getItem("editInfo"));
      this.title="编辑学生";

      //调用Java接口查询学生详情
      this.buttonLoading=true;
      this.$axios.post(this.api.selectStudentUrl+"?userId="+editData.userId
      ).then(res=>{
        const studentInfo=res.data;
        this.editAccount=studentInfo.userName;
        this.ruleForm.userId=studentInfo.userId;
        this.ruleForm.uname=studentInfo.userName;
        this.ruleForm.upwd=studentInfo.password;
        this.ruleForm.affirmUpwd=studentInfo.password;
        this.ruleForm.username=studentInfo.name;
        this.ruleForm.phone=studentInfo.phone;
        this.ruleForm.sex=studentInfo.sex;
        this.ruleForm.campus=studentInfo.campusId;
        this.ruleForm.birthday=studentInfo.birthday.substring(0,10);
        this.ruleForm.username=studentInfo.name;
        this.ruleForm.phone=studentInfo.phone;
        this.ruleForm.province=studentInfo.hatProvince.provinceID;
        this.ruleForm.city=studentInfo.hatCity.cityID;
        this.ruleForm.area=studentInfo.hatArea.areaID;
        //给省市区赋值
        this.$refs.linkageRef.gainProvinceID(this.ruleForm.province);
        this.$refs.linkageRef.gainCityID(this.ruleForm.city);
        this.$refs.linkageRef.setValueForProCityArea( this.ruleForm.province,this.ruleForm.city,this.ruleForm.area);
       
      }).finally(()=>{
        this.buttonLoading=false;
      })

      this.formData=[
        {label:"学生姓名",prop:'username',placeholder:"请输入姓名",type:"text"},
        {label:"手机号码",prop:'phone',placeholder:"请输入手机号",type:"text"}
      ]
    },
    
    // 确认按钮方法
    save(formName){
      let isError=false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          isError=false;
        } else {
          isError=true;
        }
      });
      if(isError)return;

      //调用java接口
      let params={
        userName:this.ruleForm.uname,
        password:this.ruleForm.upwd,
        name:this.ruleForm.username,
        phone:this.ruleForm.phone,
        sex:this.ruleForm.sex,
        birthday:this.ruleForm.birthday+" 00:00:00",
        addressCode:this.ruleForm.area,
        addr:this.ruleForm.region.join(''),
        campusId:this.ruleForm.campus,
        grade:this.ruleForm.grade
      };
      if(this.ruleForm.userId)params.userId=this.ruleForm.userId;
      this.buttonLoading=true;
      this.$axios.post(this.ruleForm.userId?this.api.editStudentUrl:this.api.addStudentUrl,params).then(res=>{
        if(!res.status){
          this.$message.success((this.ruleForm.userId?'编辑':'新增')+'学生成功!');
          this.$router.push('/student');
        }
      }).finally(()=>{
        this.buttonLoading=false;
      })
    
    },
    cancel(){
      this.$router.push('/student');
    }
  },
  computed: {

  },
  destroyed(){

  }
}
</script>

<style lang="scss">
.student_add{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
     width: 174px;
  }
  .el-input{
    width:auto;
  }
  .dist .el-input__inner{
    width: 378px;
    height:44px;
  }
 
  .el-form-item__label{
    font-size:16px;
    line-height: 44px;
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
  .alignSite{
     padding: 20px 0px 25px 0;
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
  .student_add_password{
    .el-input__inner{
       -webkit-text-security: disc;
    }
  }
}
</style>

