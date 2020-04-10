<template>
  <div class="layout">
    <el-container style=" height:100vh">
      <!-- 侧边栏 -->
      <el-aside :style="`width:${open?'102px':'204px'}`">
        <!-- 侧边栏的顶顶部 -->
        <div class="aside_top" :style="`width:${open?'102px':'204px'}`" v-if="!open">
          <img src="../assets/images/top_ic_logo.png" alt="logo" />
          <span class="top_word">Alpha喵</span>
        </div>
        <div class="aside_top" :style="`width:${open?'102px':'204px'}`" v-else>
          <img src="../assets/images/top_ic_logo.png" alt="logo" />
        </div>
        <!-- 侧边栏的中部 -->
        <div style="flex:1">
          <ul>
            <li
              :style="`width:${open?'102px':'204px'}`"
              :class="!(item.meta.title === select)?'':'select'"
              class="middle pointer"
              v-show="item.hidden"
              v-for="(item,index) in routes"
              :key="index"
            >
              <img
                :src="item.meta.title === select?item.meta&&item.meta.iconY:item.meta&&item.meta.iconN"
                alt="logo"
                @click="selecting(index,item.path)"
                v-if="open"
                class="hiddle_img"
              />
              <div @click="selecting(index,item.path)" v-else>
                <div class="middle_open">
                  <img
                    :src="item.meta.title === select?item.meta&&item.meta.iconY:item.meta&&item.meta.iconN"
                    class="hiddle_img"
                    alt="logo"
                  />
                  <div
                    :class="!(item.meta.title === select)?'middle_word':'middle_word1'"
                  >{{item.meta&&item.meta.title}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-container class="rel">
        <!-- 顶部 -->
        <el-header height="85px">
          <!-- 顶部的左边 -->
          <div class="left">
            <img src="../assets/images/top_ic_line.png" class="pointer" @click="aside" alt="logo" />
            <span class="left_word">Alpha喵人工智能教学管理系统</span>
          </div>
          <!-- 顶部的右边 -->
          <div class="right">
            <div class="centerLayout">
              <img src="../assets/images/top_ic_avatar.png" alt="logo" />
              <div class="right_word">
                <div>欢迎您！</div>
                <div class="name">{{name}}</div>
              </div>
              <div class="right_line"></div>
            </div>
            <el-dropdown trigger="click" class="centerLayout" @command="commandLogout">
              <img src="../assets/images/top_ic_dropout.png" alt="logo" class="pointer" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <!-- 子组件显示区 -->
        <el-main class="position" id="back-top">
          <div class="main_top flex jc-sb rel">
              <!-- 面包屑 -->
            <div class="flex rel" :class="changeBC?'':showPrint?'b_box':'b_box'" v-if="showBC">
              <div
                class="line"
                :class="changeBC?'':'repot_line'"
                :style="showPrint?'background: rgba(255, 255, 255, 1);':''"
              ></div>
              <breadcrumb
                :id="changeBC?'layout_breadcrumb':showPrint?'print_breadcrumb':'repot_breadcrumb'"
                ref="mychild"
              ></breadcrumb>
            </div>



            <!-- 返回 -->
            <!-- <div class="clear">
              <div class="backTo fr back" @click="$router.back(-1)" style="margin:0 50px;">
                <img src="../assets/images/ic_back_blue.png" alt />
                <span>返回</span>
              </div>
            </div>-->
          </div>

          <router-view @jump="changeSelect" />
          <!-- <study/> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { routes } from "@/router/index";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { logout, addRouter } from "@/api/login"; //从login.js导入login方法
export default {
  data() {
    return {
      routes,
      name: "王小虎",
      headImage: "",
      limit: [],
      open: false, //是否打开侧边栏
      select: 0, //侧边栏选中谁
      showBC: true, //是否显示面包屑
      changeBC: true, //改变面包屑样式
      showPrint: false
    };
  },
  created() {
    let store = this.$store.state;
    this.name = store.name;
    this.headImage = store.headImage;
    this.limit = store.limit;
    //渲染侧边栏
    this.routes = addRouter(this.limit);
    this.select = this.routes[0].meta.title;
    // this.$router.addRoutes(this.routes);
    // 头像
    if (this.headImage) {
      this.headImage = headImage;
    } else {
      this.headImage = require("../assets/images/top_ic_avatar.png");
    }

    // 绑定页面刷新前页面
    window.addEventListener("beforeunload", e => this.saveData(e));
    //如果有layout，就获取，防刷新数据掉失
    let data = sessionStorage.getItem("layout");
    if (data) {
      let layout = JSON.parse(data);
      this.open = layout.open;
      this.select = layout.select;
      this.showBC = layout.showBC;
      this.changeBC = layout.changeBC;
    }
  },

  mounted() {},
  methods: {
    //点击导航，显示和隐藏，侧边栏
    aside() {
      this.open = !this.open;
    },

    //点击侧边栏选项按钮
    selecting(select, path) {
      // this.select = select;
      // this.open = false;
      this.$router.push(path);
    },

    //跳转，改变侧边栏选中情况
    changeSelect(who) {
      if (who == "teacher") {
        this.select = 2;
      } else if (who == "student") {
        this.select = 4;
      }
    },

    //退出登录
    commandLogout() {
      this.$confirm("确定要退出登录?", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          logout(getToken())
            .then(res => {
              removeToken();
              sessionStorage.clear();
              this.$router.push("/login");
            })
            .catch(err => {
              // console.log(err);
            });
        })
        .catch(() => {});
    },

    //页面刷新，存数据进本地
    saveData(e) {
  
      let select = this.select;
      let showBC = this.showBC;
      let open = this.open;
      let changeBC = this.changeBC;
      let data = { select, showBC, open, changeBC };
      let layout = JSON.stringify(data);
      sessionStorage.setItem("layout", layout);
      //判断添加路由
      sessionStorage.setItem("addRouter", 1);

      //禁用F5刷新
      document.onkeydown = function(e) {
        e = window.event || e;
        var keycode = e.keyCode || e.which;
        if ((keycode = 116)) {
          if (window.event) {
            // ie
            try {
              e.keyCode = 0;
            } catch (e) {}
            e.returnValue = false;
          } else {
            // ff
            e.preventDefault();
          }
        }
      };
    }
  },
  computed: {},
  watch: {
    //监听路由
    $route(to, from) {
      //到了404就不显示面包屑
      if (to.path === "/404") {
        this.showBC = false;
      } else {
        this.showBC = true;
      }
      //到了报告或记录，页面包屑改变样式
      if (to.path === "/teaching/record" || to.path === "/teaching/report") {
        this.changeBC = false;
      } else if (
        to.path.includes( "/teaching/appraisal_report") ||
        to.path.includes("/teaching/appraisal_record") 
      ) {
        //到了测评的报告或记录，页面包屑改变样式
        this.changeBC = false;
        this.showPrint = true;
      } else {
        this.changeBC = true;
        this.showPrint = false;
      }


      //选中侧边栏
      this.select = to.matched[0].meta.title;
    }
  }
};
</script>

<style lang="scss" scoped>
.layout {
  background: #f9f9f9;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 1);
  padding: 0 50px 0 34px;
}
.left {
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.left_word {
  font-size: 22px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 20px;
  margin-top: -2px;
}
.right {
  display: flex;
  vertical-align: top;
  text-align: 47px;
  color: white;
  font-size: 14px;
}
.right_word {
  width: 80px;
  font-size: 16px;
  font-family: medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 25px;
  margin-right: 30px;
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.right_line {
  width: 1px;
  height: 30px;
  background: rgba(9, 124, 250, 1);
}

.centerLayout {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
}
.el-dropdown-link {
  color: white;
  font-size: 14px;
  display: inline;
  text-align: center;
  margin-right: 12px;
}
.el-aside {
  color: #333;
  transition: all 0.1s ease-in-out;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.middle {
  width: 204px;
  height: 56px;
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.middle_word {
  height: 24px;
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 550;
  color: rgba(51, 51, 51, 1);
  line-height: 24px;
}
.middle_word1 {
  height: 24px;
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 550;
  color: rgba(50, 124, 255, 1);
  line-height: 24px;
}
.middle_open {
  display: flex;
  width: 122px;
  height: 24px;
  border-radius: 17px;
  padding-left: 5px;
}
.select {
  background: rgba(230, 239, 255, 1);
  color: red;
}
.hiddle_img {
  width: 24px;
  height: 24px;
}
.aside_top {
  height: 85px;
  padding: 16.5px 0;
  background: linear-gradient(
    0deg,
    rgba(42, 129, 253, 1) 0%,
    rgba(66, 84, 248, 1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  overflow: hidden;
}
.top_word {
  font-size: 18px;
  font-family: medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin-left: -55px;
}
.position {
  position: relative;
  left: 0;
  top: 0;
}
.pointer {
  cursor: pointer;
}
//layout的背景色
.el-container.is-vertical {
  background: rgba(240, 243, 247, 1);
}
</style>
<style>
/* 面包屑 */
.layout #print_breadcrumb {
  margin-left: -35px;
  background: rgba(0, 0, 0, 0);
}
.layout #print_breadcrumb .el-breadcrumb .is-link {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 24px;
}
.layout
  #print_breadcrumb
  .el-breadcrumb__item:last-child
  .el-breadcrumb__inner {
  color: rgba(255, 255, 255, 1);
}
.layout #print_breadcrumb .el-breadcrumb .el-breadcrumb__separator {
  color: rgba(255, 255, 255, 1);
}

.layout #layout_breadcrumb {
  margin-left: -35px;
  background: rgba(0, 0, 0, 0);
}
.layout #repot_breadcrumb {
  margin-left: -35px;
  background: rgba(0, 0, 0, 0);
}
.b_box {
  position: absolute !important;
  top: 0px;
  left: 0px;
  z-index: 10;
}
.layout #layout_breadcrumb .el-breadcrumb .is-link {
  font-size: 16px;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 24px;
}
.layout #layout_breadcrumb .el-breadcrumb .el-breadcrumb__separator {
  color: rgba(34, 34, 34, 1);
}

.layout #repot_breadcrumb .el-breadcrumb .is-link {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 24px;
}
.layout
  #repot_breadcrumb
  .el-breadcrumb__item:last-child
  .el-breadcrumb__inner {
  color: rgba(0, 103, 228, 1);
}
.layout #repot_breadcrumb .el-breadcrumb .el-breadcrumb__separator {
  color: rgba(255, 255, 255, 1);
}
.layout .line {
  width: 4px;
  height: 20px;
  background: rgba(0, 99, 224, 1);
  border-radius: 0px 4px 4px 0px;
  position: absolute;
  top: 7px;
  left: 0px;
}
.layout .repot_line {
  background: rgba(255, 255, 255, 1);
}
/* 退出登录，下拉框 */
.el-dropdown-menu__item {
  padding: 0 20px !important;
}
/* 内容主体，加34的padding */
.layout .el-main {
  padding: 20px 34px;
}
/* 输入框的字体大小 */
.el-input__inner {
  font-family: "medium";
  font-size: 16px;
}
/* 输入框的样式 */
.el-input__inner:hover,
.el-input__inner:active {
  border: 1px solid #327cff;
}
/* 分页样式 */
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #fff;
  border: 1px solid #dddddd;
  border-radius: 4px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #1f83ff;
  color: #fff;
}
</style>

