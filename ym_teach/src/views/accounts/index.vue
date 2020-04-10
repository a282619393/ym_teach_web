<template>
  <div class='accounts_index callList'>

    <div class="accounts_seek">
      <router-link to="/accounts/pay" class="accounts_link">支付渠道</router-link>
      <router-link to="/accounts/buy" class="accounts_link" v-if="showBuy">购买帐号</router-link>
      <div class="clear  accounts_seek_time">
        <div class="accounts_val">
          账号:
          <div class="accounts_val_div">
            <el-input placeholder="请输入账号" v-model="accountName"></el-input>
          </div>
        </div>
        <div class="accounts_val">
          校区名称:
          <div class="accounts_val_div">
            <el-input placeholder="请输入校区名称" v-model="campusName"></el-input>
          </div>
        </div>
        <div class="accounts_val">
          操作人:
          <div class="accounts_val_div">
            <el-input placeholder="请输入操作人" v-model="updatePersonName"></el-input>
          </div>
        </div>
      </div>
      <div class="accounts_seek_time">
        <div class="accounts_seek_con">
          <span>状态:</span>
          <span class="inb" style="width: 120px;">
          <el-select v-model="statusVal" placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </span>
        </div>
        <div class="accounts_seek_con">
          <span>操作日期:</span>
          <el-date-picker v-model="startTime" type="date" placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerBeginDateBefore"
                          @change="changeTime">
          </el-date-picker>
          —
          <el-date-picker v-model="endTime" type="date" placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerBeginDateAfter">
          </el-date-picker>

        </div>
        <div class="accounts_seek_con">
          <div class="accounts_link" @click="accounts_seek">搜索</div>
        </div>
      </div>
      <div class="accounts_num">
        <span class="mr-20">账号总数量：{{count}}</span>
        <span>可用账号总数量：{{usable}}</span>
      </div>
    </div>
    <div class="table-bg">
      <el-table
        class="monitor-table"
        :data="monitorList"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        :header-cell-style="{background:'#F6F7F9',color:'#333333'}"
      >
        <el-table-column
          prop="accountName"
          label="账号"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="accountPas"
          label="密码"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="campusName"
          label="校区名称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span :class="scope.row.status==1?'accsucc':'accerr'">{{scope.row.status==1?'已使用':'未使用'}}</span>
          </template>
          <!-- 1可用  0未使用 -->
        </el-table-column>
        <el-table-column
          prop="purpose"
          label="用途"
          width="260"
        >
          <template slot-scope="scope">
            <span v-text="purposeSilce(scope.row.purpose)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentName"
          label="对应用户"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学生账号"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="updatePersonName"
          label="操作人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="操作时间"
          fixed="right"
        >
        </el-table-column>
        <template slot="empty">
          <img src="../../assets/images/default_pic_student_number.png" alt="">
        </template>
      </el-table>
      <div class="pageCon">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageNum"
          background
          right
          layout="total, sizes, prev, pager, next, jumper"
          :total="Total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAccountList} from "@/api/accounts"

  export default {
    data() {
      return {
        statusVal: '',
        status: [
          {id: "", name: "全部"},
          {id: "0", name: "未使用"},
          {id: "1", name: "已使用"}
        ],
        startTime: "",
        endTime: "",
        count:"",
        pickerBeginDateBefore: {
          disabledDate: (time) => {
            let beginDateVal = this.endTime;
            if (beginDateVal) {
              return time.getTime() > beginDateVal;
            }
          }
        },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.startTime;
            if (beginDateVal) {
              return time.getTime() < beginDateVal;
            }
          }
        },
        monitorList: [],
        pageSize: 1,
        pageNum: 10,
        Total: 0,
        usable: 0,
        accountName: "",
        campusName: "",
        updatePersonName: "",

        showBuy: true,//管理员不能看购买帐号
      };
    },
    created() {
      this.initGetAccountList();
      //管理员不能看购买帐号
      let role = sessionStorage.getItem("roleName")
      if (role == '管理员') {
        this.showBuy = false
      } else {
        this.showBuy = true
      }
    },
    mounted() {

    },
    methods: {
      initGetAccountList() {
        getAccountList(this.statusVal, this.startTime, this.endTime, this.accountName, this.campusName, this.updatePersonName, this.pageNum, this.pageSize).then(res => {
          this.monitorList = res.data.pageResult.rows;
          this.Total = res.data.pageResult.total;
          this.usable = res.data.usable;
          this.count = res.data.count;
        })
      },
      //选择开始时间，清空结束时间
      changeTime(date) {
        this.endTime = "";
        this.pickerBeginDateAfter = {
          disabledDate(time) {  //开始时间-结束时间
            return (time.getTime() < new Date(date).getTime());
          }
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
      },
      handleSizeChange(val) {
        this.pageNum = val
        this.initGetAccountList()
      },
      handleCurrentChange(val) {
        this.pageSize = val
        this.initGetAccountList()
      },
      accounts_seek() {
        this.initGetAccountList()
      },
      purposeSilce(str) {
        if (str != null) {
          return str.slice(0,2)+"“"+ str.slice(2)+"”"
        }
        return str;
      }
    },
    computed: {},
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .accounts_index {
    background: #fff;
    box-shadow: 0px 3px 9px 0px rgba(48, 51, 45, 0.15);
    border-radius: 6px;
    width: 100%;
    min-height: 500px;

    .accounts_seek {
      padding: 30px;
      position: relative;

      &_abs {
        width: 400px;
        position: absolute;
        right: 30px;
        top: 30px;
      }

      .accounts_val {
        display: inline-block;
        width: 300px;

        .accounts_val_div {
          display: inline-block;
          width: 220px;
        }
      }

      .accounts_seek_time {
        margin: 20px 0;
        position: relative;

        // span {
        // }
      }

      .accounts_num {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(0, 103, 228, 1);
      }

      .accounts_seek_con {
        display: inline-block;
        margin-right: 30px;
      }
    }

    .accounts_link {
      display: inline-block;
      width: 110px;
      height: 40px;
      line-height: 40px;
      background: linear-gradient(90deg, rgba(134, 199, 255, 1) 0%, rgba(0, 118, 250, 1) 100%);
      border-radius: 4px;
      text-align: center;
      color: #fff;
      margin-right: 30px;
      cursor: pointer;
    }
    .accounts_link:hover{
      background:linear-gradient(90deg,rgba(118,180,255,1) 0%,rgba(0,96,213,1) 100%);
    }
  }

  .accsucc {
    color: #009a12;
  }

  .accerr {
    color: #f22;
  }
</style>
<style lang="scss">
  .accounts_seek .el-input__icon,
  .accounts_seek .el-input__icon {
    line-height: 40px !important;
  }
</style>
