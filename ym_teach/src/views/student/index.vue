<template>
  <div class="student_index">
    <el-card class="box-card">
      <!-- 新增 -->
      <div class="add flex jc-sb rel">
        <el-button class="add_btn" @click="addstudent">新增学生</el-button>
      </div>
      <!-- 搜索框 -->
      <div class="flex drop_down">
        <div class="flex margin_l">
          <div>学生姓名：</div>
          <el-input
            placeholder="请输入学生姓名"
            v-model="studentData.name"
            class="add_input"
            @input="change"
            @change="searchStudent"
          ></el-input>
        </div>
        <div class="flex ml_30 margin_l">
          <div>手机号码：</div>
          <el-input
            placeholder="请输入手机号码"
            v-model="studentData.phone"
            class="add_input"
            @input="change"
            @change="searchStudent"
          ></el-input>
        </div>
        <div class="flex ml_30 margin_l" v-if="!roleName.includes('校长')">
          <div>所在校区：</div>
          <el-input
            placeholder="请输入所在校区"
            v-model="studentData.campusName"
            class="add_input"
            @input="change"
            @change="searchStudent"
          ></el-input>
        </div>
        <div class="flex ml_30 margin_l">
          <div>课程名称：</div>
          <el-input
            placeholder="请输入课程名称"
            v-model="studentData.curriculumName"
            class="add_input"
            @input="change"
            @change="searchStudent"
          ></el-input>
        </div>
      </div>
      <!-- 下拉框 -->
      <div class="flex drop_down">
        <!-- 状态 -->
        <div class="flex ai">
          <div>状态：</div>
          <el-select v-model="studentData.classStatus" placeholder="全部" class="short" size="medium">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 所在地区 -->
        <div class="flex ai ml_30">
          <div>所在地区：</div>
          <el-select
            :clearable="true"
            v-model="province"
            placeholder="选择省"
            class="long"
            size="medium"
            @change="changeProvince"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.provinceID"
              :label="item.province"
              :value="item.provinceID"
            ></el-option>
          </el-select>
          <el-select
            :clearable="true"
            v-model="city"
            placeholder="选择市"
            class="long ml_8"
            size="medium"
            @change="changCity"
          >
            <el-option
              v-for="item in cityList"
              :key="item.cityID"
              :label="item.city"
              :value="item.cityID"
            ></el-option>
          </el-select>
          <el-select
            :clearable="true"
            v-model="area"
            placeholder="选择区"
            class="long ml_8"
            size="medium"
            @change="changeArea"
          >
            <el-option
              v-for="item in areaList"
              :key="item.areaID"
              :label="item.area"
              :value="item.areaID"
            ></el-option>
          </el-select>
        </div>
        <!-- 学段 -->
        <div class="flex ai ml_30">
          <div>学段：</div>
          <el-select
            v-model="studentData.grade"
            placeholder="全部"
            class="short"
            size="medium"
            @change="chageGrade"
          >
            <el-option
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- 学科 暂时不用 -->
        <!-- <div class="flex ai ml_30">
          <div>学科：</div>
          <el-select v-model="studentData.course" placeholder="全部" class="short" size="medium">
            <el-option
              v-for="item in subjectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->
        <div class="s_search ml_30" @click="clickSearch">搜索</div>
      </div>
      <!-- 学生数量 -->
      <div class="student_num">当前结果学生总数量：{{totalPage}}</div>
      <!-- 表单 -->
      <el-table
        v-loading="showLoading"
        ref="table"
        :data="tableData"
        style="width: 100%"
        :header-row-class-name="headerStyle"
        :row-class-name="rowStyle"
        :cell-class-name="cellStyle"
        :header-cell-class-name="headerCellStyle"
      >
        <el-table-column prop="name" label="学生姓名" center width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="sex" label="性别" width="75"></el-table-column>
        <el-table-column prop="age" label="年龄" width="75"></el-table-column>
        <el-table-column prop="campusName" label="校区名称" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addr" label="所在地区" width="190" show-overflow-tooltip></el-table-column>
        <el-table-column prop="classStatus" label="状态" width="120" class="flex ai">
          <!-- 状态 -->
          <template slot-scope="scope">
            <img
              v-show="scope.row.classStatus == 0"
              src="../../assets/images/student_ic_reading.png"
              alt="logo"
              class="tab_img rel"
            />
            <div
              class="status_word"
              style="color:rgba(0,209,152,1);"
              v-show="scope.row.classStatus == 0"
            >在读</div>
            <img
              v-show="scope.row.classStatus == 1"
              src="../../assets/images/student_ic_not.png"
              alt="logo"
              class="tab_img"
            />
            <div
              class="status_word"
              style="color:rgba(250,105,18,1);"
              v-show="scope.row.classStatus == 1"
            >未续费</div>
            <img
              v-show="scope.row.classStatus == 2"
              src="../../assets/images/student_ic_refund.png"
              alt="logo"
              class="tab_img"
            />
            <div
              class="status_word"
              style="color:rgba(255,34,34,1);"
              v-show="scope.row.classStatus == 2"
            >退费</div>
            <img
              v-show="scope.row.classStatus == 3"
              src="../../assets/images/student_ic_exper.png"
              alt="logo"
              class="tab_img"
            />
            <div
              class="status_word"
              style="color:rgba(0,126,255,1);"
              v-show="scope.row.classStatus == 3"
            >体验</div>
            <img
              v-show="scope.row.classStatus == 4"
              src="../../assets/images/student_ic_new.png"
              alt="logo"
              class="tab_img"
            />
            <div
              class="status_word"
              style="color:rgba(126,129,255,1); "
              v-show="scope.row.classStatus == 4"
            >新建</div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="帐号" width="196" show-overflow-tooltip></el-table-column>
        <el-table-column prop="grade" label="学段" :formatter="formattingGrade" width="88"></el-table-column>
        <el-table-column fixed="right" label="操作" width="380">
          <template slot-scope="scope">
            <el-button
              class="tab_btn btn_hover"
              type="text"
              size="small"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              class="tab_btn btn_hover"
              type="text"
              size="small"
              @click="rePassword(scope.row)"
            >重置密码</el-button>
            <el-button
              class="tab_btn btn_hover"
              type="text"
              size="small"
              @click="courseAdmin(scope.row)"
            >课程管理</el-button>
            <el-button
              :disabled="scope.row.classStatus == 4"
              v-if="!scope.row.open"
              :class="scope.row.classStatus == 4?'tab_btn_end_no':''"
              :ref="'openCourseRef_'+scope.$index"
              class="tab_btn_end btn_hover"
              type="text"
              size="small"
              @click="showCourse(scope.row,scope.$index,scope.store)"
            >
              展开课程
              <i class="el-icon-arrow-down el-icon--right ml_10"></i>
            </el-button>
            <el-button
              v-else
              :class="scope.row.classStatus == 4?'tab_btn_end_no':''"
              class="tab_btn_end btn_hover"
              type="text"
              size="small"
              @click="showCourse(scope.row,scope.$index,scope.store)"
            >
              收起课程
              <i class="el-icon-arrow-up el-icon--right"></i>
            </el-button>
          </template>
        </el-table-column>
        <!-- 展开课程 -->
        <el-table-column type="expand" width="5">
          <template slot-scope="scope">
            <div class="tab_open">
              <div
                v-if="Array.isArray(scope.row.birthday)?scope.row.birthday.length == 0:false"
              >没有课程</div>
              <div class="open_box" v-for="(item,index) in scope.row.birthday" :key="index" v-else>
                <div v-if="!item.curriculumName">数据异常</div>
                <div v-else>
                  <img
                    src="../../assets/images/student_class_bg_physical.png"
                    alt="logo"
                    v-show="item.curriculumName.includes('物理')"
                  />
                  <img
                    src="../../assets/images/student_class_bg_math.png"
                    alt="logo"
                    v-show="item.curriculumName.includes('数学')"
                  />
                  <img
                    src="../../assets/images/student_class_bg_chemistry.png"
                    alt="logo"
                    v-show="item.curriculumName.includes('化学')"
                  />
                  <img
                    class="open_img"
                    src="../../assets/images/student_class_ic_exp.png"
                    alt="logo"
                    v-show="item.status == 3"
                  />
                  <img
                    class="open_img"
                    src="../../assets/images/student_class_ic_nofee.png"
                    alt="logo"
                    v-show="item.status == 1"
                  />
                  <img
                    class="open_img"
                    src="../../assets/images/student_class_ic_open.png"
                    alt="logo"
                    v-show="item.status == 0"
                  />
                  <img
                    class="open_img"
                    src="../../assets/images/student_class_ic_refund.png"
                    alt="logo"
                    v-show="item.status == 2"
                  />
                  <div class="open_word">{{item.curriculumName}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 缺省页 -->
        <template slot="empty" v-if="showEmpty">
          <img src="../../assets/images/default_pic_student.png" alt />
        </template>
        <template slot="empty" v-else>
          <img src="../../assets/images/default_page/search-n-pic.png" alt />
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
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
        <div class="page_go">GO</div>
      </div>
    </el-card>

    <!-- 弹出框 -->
    <div class="cover" v-show="dialogVisible">
      <div class="cover_box">
        <div class="cover_title">
          <div style="font-size:20px;">重置密码</div>
          <img
            style="height: 20px;  cursor:pointer;"
            src="../../assets/images/pop_ic_x.png"
            alt="logo"
            @click="closeCover"
          />
        </div>
        <div style="background:rgba(245,247,251,1);height:2px"></div>
        <div class="cover_err" :style="errText?'':'visibility: hidden;'">
          <img src="../../assets/images/ic_judge_error.png" alt="logo" />
          <span style="margin-left: 7px;">{{errText}}</span>
        </div>
        <div class="cover_password">
          <img src="../../assets/images/ic_required_red.png" alt="logo" />
          <span style="margin-left: 5px">输入新密码：</span>
          <form>
            <el-input
              autocomplete="on"
              type="password"
              placeholder="请输入密码"
              v-model="password"
              show-password
              class="cover_input"
              :style="showRed == 1?'border:1px solid rgba(255,102,102,1)':''"
              @keyup.enter.native="sure"
              @focus="showRed = 0"
            ></el-input>
          </form>
        </div>
        <div class="cover_password cover_password2">
          <img src="../../assets/images/ic_required_red.png" alt="logo" />
          <span>再次输入新密码：</span>
          <form>
            <el-input
              :style="showRed == 2 ?'border:1px solid rgba(255,102,102,1)':''"
              autocomplete="on"
              type="password"
              placeholder="请输入密码"
              v-model="againPassword"
              show-password
              class="cover_input"
              @keyup.enter.native="sure"
              @focus="showRed = 0"
            ></el-input>
          </form>
        </div>
        <div class="cover_botton">
          <el-button class="cover_cancel" @click="closeCover">取消</el-button>
          <el-button class="cover_sure" @click="sure">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getProvinceList,
  getCityList,
  getAreaList,
  studentList,
  course,
  resetPassword
} from "../../api/student.js";
export default {
  data() {
    return {
      showEmpty: true, //缺省页的转换，true为没有学生和false为搜索没数据
      //下拉框
      statusOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "在读"
        },
        {
          value: 3,
          label: "体验"
        },
        {
          value: 1,
          label: "未续费"
        },
        {
          value: 2,
          label: "退费"
        },
        {
          value: 4,
          label: "新建"
        }
      ],
      gradeOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "小学"
        },
        {
          value: 1,
          label: "初中"
        },
        {
          value: 2,
          label: "高中"
        }
      ],

      //学科的，暂时不用
      subjectOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "数学"
        },
        {
          value: 1,
          label: "物理"
        },
        {
          value: 2,
          label: "化学"
        }
      ], //默认是全部
      subjectOptions1: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "数学"
        }
      ], //学段为小学时
      subjectOptions2: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "数学"
        },
        {
          value: 1,
          label: "物理"
        },
        {
          value: 2,
          label: "化学"
        }
      ], //学段为初中高中时

      //传的参数
      studentData: {
        name: "", //学生姓名
        phone: "", //手机号码
        campusName: "", //校区名称
        classStatus: "", //开通状态，0:开通（在读），1：未续费，2：退费，3：体验，4：新建
        addressCode: "", //所在地址code码
        grade: "", // 学段,0：小学，1：初中，2：高中
        curriculumName: "" // 课程名称
        // course: "" //学科 暂时不用
      },

      //三省联动力
      province: "", //省
      provinceList: [],
      city: "", //市
      cityList: [],
      area: "", //区
      areaList: [],

      //表格数据
      tableData: [],

      //弹框
      dialogVisible: false, //是否弹框
      password: "", //新密码
      againPassword: "", //再输一次新密码
      userId: "", //学生ID
      userName: "", //用户帐号
      showRed: "", //输入框显示红色
      errText: "", //错误提示信息

      //分页
      totalPage: 0, //总条数，学生数量
      currentPage: 1, //当前页
      pageSize: 10, //每页多少条

      showLoading: false,
      roleName: ""
    };
  },
  created() {
    //从校长管理界面过来，从路径取参数
    let params = this.$route.params;
    if (params.name) {
      this.studentData.campusName = params.name;
      this.studentData.classStatus = 0
    }
    //是校长，隐藏搜索校区
    this.roleName = sessionStorage.getItem("roleName");
    //获取省列表
    getProvinceList() //省
      .then(res => {
        this.provinceList = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    //获取学生列表
    this.getStudentList();
  },
  mounted() {},
  methods: {
    //给sessionStorage set editInfo(当前操作表格的row)
    setEditInfoToSessionStorage(row) {
      let obj = {};
      obj.curriculumId = row.curriculumId;
      obj.userId = row.userId;
      obj.userName = row.userName;
      obj.grade = row.grade;
      sessionStorage.setItem("editInfo", JSON.stringify(obj));
    },
    //点击新增学生
    addstudent() {
      //挑战新增学生页面
      this.$router.push("/student/add");
    },

    //input的值改变
    change(value) {},

    //input值变且失焦
    searchStudent(value) {},

    //学段选项改变
    chageGrade() {
      //改变学科下拉框的值，暂时不用
      // if (this.studentData.grade == 0) {
      //   this.subjectOptions = this.subjectOptions1;
      // } else {
      //   this.subjectOptions = this.subjectOptions2;
      // }
    },

    //点击搜索
    clickSearch() {
      this.showEmpty = false;
      //获取学生列表
      this.getStudentList();
    },

    //点击编辑
    edit(row) {
      this.setEditInfoToSessionStorage(row);
      this.$router.push("/student/edit");
    },

    //点击重置密码
    rePassword(row) {
      this.userId = row.userId;
      this.userName = row.userName;
      this.dialogVisible = true;
    },

    //点击确定
    sure() {
      let req = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
      if (!req.test(this.password)) {
        // 验证重置密码格式
        this.errText = "输入8-16位数字+字母密码!";
        this.showRed = 1;
      } else if (this.password !== this.againPassword) {
        // 验证密码是否一致
        this.errText = "密码前后不一致，请重新输入!";
        this.showRed = 2;
      } else {
        this.errText = "";
        this.showRed = 0;
        // 验证通过
        resetPassword(this.userId, this.userName, this.password)
          .then(res => {
            this.$message({
              message: "重置成功",
              type: "success"
            });
            this.closeCover();
          })
          .catch(err => {
            console.log(err);
            this.$message.error("重置失败");
            this.closeCover();
          });
      }
    },

    //关闭弹框
    closeCover() {
      this.dialogVisible = false;
      this.password = "";
      this.againPassword = "";
      this.errText = "";
    },

    //点击课程管理
    courseAdmin(row) {
      this.setEditInfoToSessionStorage(row);
      this.$router.push("/student/course");
    },

    //点击展开课程
    showCourse(row, index) {
      //展开课程
      this.$refs.table.toggleRowExpansion(row);
      if (this.tableData[index].open) {
        this.tableData[index].open = false;
      } else {
        this.tableData[index].open = true;
      }
      //请求课程列表
      if (!this.tableData[index].courseArr) {
        course(row.userId)
          .then(res => {
            this.tableData[index].birthday = res.data.rows;
            this.tableData[index].courseArr = 1; //只发一次请求
            //  大佬的方法
            //this.$set(this.tableData[index],'courseArr',res.data.rows)
            // let obj=this.tableData[index];
            // obj.courseArr=res.data.rows;
            // obj.open =false;
            // this.tableData.splice(index,1,obj);
            // this.$nextTick(()=>{
            //   this.$refs['openCourseRef_'+index].$el.click();
            // })
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //选择省
    changeProvince(provinceID) {
      this.city = "";
      this.cityList = [];
      this.area = "";
      this.areaList = [];
      this.studentData.addressCode = this.province; //省地址code码
      getCityList(provinceID)
        .then(res => {
          this.cityList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //选择市
    changCity(cityID) {
      this.area = "";
      this.areaList = [];
      this.studentData.addressCode = this.city; //市地址code码
      getAreaList(cityID)
        .then(res => {
          this.areaList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //选择区
    changeArea() {
      this.studentData.addressCode = this.area; //区地址code码
    },

    //格式化学段
    formattingGrade(row) {
      let grade = row.grade;
      if (grade == 0) {
        return "小学";
      } else if (grade == 1) {
        return "初中";
      } else {
        return "高中";
      }
    },

    //每页几条值变化时
    handleSizeChange(val) {
      this.pageSize = val;
      this.showEmpty = true;
      //获取学生列表数据
      this.getStudentList();
    },

    //当前页值变化时
    handleCurrentChange(val) {
      this.showEmpty = true;
      this.currentPage = val;
      //获取学生列表数据
      this.getStudentList();
    },

    //获取学生列表数据
    getStudentList() {
      this.showLoading = true;
      let {
        name,
        phone,
        campusName,
        classStatus,
        addressCode,
        grade,
        curriculumName,
        course
      } = this.studentData;
      let pageNum = this.currentPage; //当前页面
      let pageSize = this.pageSize; //每页多少条
      studentList(
        name,
        phone,
        campusName,
        classStatus,
        addressCode,
        grade,
        curriculumName,
        pageNum,
        pageSize,
        course
      )
        .then(res => {
          let rowsData = res.data.rows;
          for (let item of rowsData) {
            item.sex = item.sex == 1 ? "男" : "女";
          }
          this.tableData = rowsData;
          this.totalPage = res.data.total;
          this.showLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.showLoading = false;
        });
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
    }

    //设置状态列的样式
    // statusStyle(row, column) {
    //   console.log(row, column);
    //   return false
    // }
  },
  computed: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
//顶部
.add {
  margin: 35px 33px 20px 30px;
}
.add_btn {
  width: 110px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(134, 199, 255, 1) 0%,
    rgba(0, 118, 250, 1) 100%
  );
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.add_btn:hover {
  background: linear-gradient(90deg, #76b4ff, #0060d5);
}
.add_input {
  width: 260px;
  height: 44px;
}
.s_search {
  width: 78px;
  height: 40px;
  background: linear-gradient(
    90deg,
    rgba(134, 199, 255, 1) 0%,
    rgba(0, 118, 250, 1) 100%
  );
  border-radius: 4px;
  font-size: 18px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 40px;
  text-align: center;
  margin-right: 30px;
  cursor: pointer;
}
.s_search:hover {
  background: linear-gradient(90deg, #76b4ff, #0060d5);
}
// 下拉框
.drop_down {
  font-size: 16px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 31px;
}
.margin_l {
  line-height: 44px;
  margin-bottom: 30px;
}
.short {
  width: 95px;
}
.long {
  width: 111px;
}
.ml_30 {
  margin-left: 30px;
}
.ml_8 {
  margin-left: 8px;
}
//学生数量
.student_num {
  font-size: 16px;
  font-family: medium;
  font-weight: bold;
  color: rgba(0, 103, 228, 1);
  line-height: 24px;
  margin: 30px 0 40px 34px;
}
//表格
.tab_btn {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(0, 103, 228, 1);
  border-right: 2px solid rgba(233, 233, 233, 1);
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
}
.tab_btn_end_no {
  color: rgba(194, 194, 194, 1);
}
.tab_btn:hover {
  color: #0067e4;
}
.ml_10 {
  margin-left: 0px;
}
.tab_img {
  margin-top: 10px;
}
.status_word {
  width: 76px;
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  position: absolute;
  top: 27px;
  text-align: center;
}

//展开课程
.tab_open {
  background: rgba(230, 239, 255, 1);
  border-radius: 4px;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  padding: 20px 0px 20px 30px;
}
.open_box {
  padding: 20px 26px;
  position: relative;
}
.open_img {
  position: absolute;
  top: 28px;
  left: 22px;
}
.open_word {
  position: absolute;
  top: 68px;
  left: 52px;
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
//分页
.page {
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
}
.page_go {
  width: 42px;
  height: 28px;
  background: rgba(0, 103, 228, 1);
  border-radius: 4px;
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 28px;
  text-align: center;
  cursor: pointer;
}
// 弹框
.cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cover_box {
  width: 520px;
  height: 310px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}
.cover_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: medium;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
  padding: 25px 34px 24px 34px;
}
.cover_err {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  padding: 8px 45px 15px 0;
  font-size: 12px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 102, 102, 1);
  vertical-align: top;
}
.cover_password {
  font-size: 16px;
  font-family: medium;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 45px;
}
.cover_password2 {
  margin-top: 20px;
  margin-bottom: 31px;
}
.cover_input {
  width: 296px;
  height: 42px;
  border: 1px solid rgba(239, 239, 239, 1);
  border-radius: 4px;
}
.input_yes {
  border: 1px solid rgba(1, 255, 255, 1);
}
.cover_botton {
  display: flex;
  justify-content: flex-end;
  padding: 0px 32px 32px 0;
}
.cover_cancel {
  width: 78px;
  height: 42px;
  border: 1px solid rgba(226, 226, 226, 1);
  border-radius: 4px;
  font-size: 18px;
  font-family: medium;
  font-weight: 500;
  color: rgba(185, 185, 185, 1);
}
.cover_sure {
  width: 78px;
  height: 42px;
  background: linear-gradient(
    90deg,
    rgba(134, 199, 255, 1) 0%,
    rgba(0, 118, 250, 1) 100%
  );
  border-radius: 4px;
  font-size: 18px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
</style>
<style lang="scss">
//顶部输入框
.student_index .add .el-input__inner {
  height: 44px;
}
//卡片去掉paddin
.student_index .el-card__body {
  padding: 0;
}
//表格
.student_index .tab_header {
  height: 68px;
  font-size: 16px;
  font-family: medium;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  background: rgba(246, 247, 249, 1);
  padding: 0 31px;
}
.student_index .tab_row1 {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  height: 68px;
}
.student_index .tab_row2 {
  font-size: 14px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  height: 68px;
  background: rgba(246, 247, 249, 1);
}
.student_index .tab_cell {
  padding-left: 21px;
}
.student_index .tab_cell .cell.el-tooltip {
  width: 90px !important;
}

.student_index .el-table th,
.el-table tr {
  background: none;
}
.student_index .el-table__expand-icon > .el-icon {
  color: rgba(0, 0, 0, 0);
}
.student_index .el-table__expanded-cell[class*="cell"] {
  padding: 0;
}
.tab_shool .cell {
  padding-right: 35px;
}
.tab_area .cell {
  padding-right: 35px;
}
.cover .el-input--suffix .el-input__inner {
  border: none;
}
//缺省页高度问题
.student_index .el-table__empty-block {
  height: 100vh !important;
}
</style>
