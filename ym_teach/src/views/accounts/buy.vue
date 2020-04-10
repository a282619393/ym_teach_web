<template>
  <div class="accounts_pay">
    <div class="backTo backToAbs" @click="$router.back(-1)">
      <img src="../../assets/images/ic_back_blue.png" alt="">
      <span>返回</span>
    </div>
    <div class="buy_con">
      <img src="../../assets/images/number_pic_cat_blue.png" class="buy_con_cat_img" alt />
      <div class="buy_con_div">
        <div class="buy_title" >
          <span>购买帐号</span>
        </div>
        <div class="pt20">
          价格：
          <em>￥{{price}}</em>(30天×6个账号)
        </div>
        <div class="pt20">
          总格：
          <em>￥{{total}}</em>
        </div>
        <div class="pt20">
          请选择需要购买的数量：
          <el-select v-model="buyNubVal" placeholder="请选择" size="mini" @change="getBuyNub">
            <el-option v-for="item in buyNub" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="pt30">
          <p>提交订单后，请在支付渠道的转账备注中输入您的校区名称+购买的账号数量，</p>
          <p>财务审核并通过后系统会自动将对应数量的账号添加至您的可用账号数量中</p>
        </div>
        <div class="pay_btn" @click="pay_btn_open">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { createOrder } from "@/api/accounts";
export default {
  data() {
    return {
      buyNubVal: 120,
      buyNub: [
        { id: 120, name: "120个" },
        { id: 240, name: "240个" },
        { id: 360, name: "360个" },
        { id: 480, name: "480个" },
        { id: 600, name: "600个" }
      ],
      buyNubName: 120, //购买数量
      price: 500, //单价，6个帐号30天
      total: 10000 //总价
    };
  },
  created() {},
  mounted() {},
  methods: {
    pay_btn_open() {
      const h = this.$createElement;
      this.$msgbox({
        title: "确认订单",
        message: h("div", { style: "text-align: center" }, [
          h("p", { style: "margin-bottom:10px" }, "是否确定提交订单？ "),
          h("p", null, `订单数量:${this.buyNubName}个`),
          h("p", null, `订单金额:${this.total}元`)
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            let addressCode = sessionStorage.getItem("addressCode");
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            createOrder(this.buyNubName, addressCode)
              .then(res => {
                this.$message({
                  message: "购买成功",
                  type: "success"
                });
                done();
                instance.confirmButtonLoading = false;
                setTimeout(()=>{this.$router.push("/accounts/pay")},500)

              })
              .catch(err => {
                // console.log(err);
                instance.confirmButtonLoading = false;
                done();
              });
            // setTimeout(() => {
            //   done();

            //   setTimeout(() => {
            //     instance.confirmButtonLoading = false;
            //   }, 300);
            // }, 3000);
          } else {
            done();
          }
        }
      }).then(action => {});
    },
    getBuyNub(val) {
      this.buyNubName = this.buyNubVal;
      this.total = (this.buyNubName / 6) * this.price;

      //   let obj = {};
      //   obj = this.buyNub.find((item)=>{
      //     return item.id === val;
      //   });
      //   this.buyNubName = obj.name;
    }
  },
  computed: {
    // total(){
    //   return (this.buyNubName/6)*this.price
    // }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.accounts_pay {
  position: relative;
  height: 90%;
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
  padding-top: 7%;
  background: url(../../assets/images/number_bg_pic.png) no-repeat center center;
  background-size: 100% 100%;
  text-align: center;
  .backToAbs {
    position: absolute;
    right: 40px;
    top: -70px;
  }
  .buy_con {
    width: 942px;
    height: 536px;
    margin: 0 auto;
    position: relative;
    box-shadow: 0px 8px 29px 0px rgba(27, 80, 223, 0.4);
    .buy_con_cat_img {
      position: absolute;
      display: block;
      width: 90px;
      right: 126px;
      top: -68px;
      z-index: 9;
    }
    &_div {
      height: 100%;
      width: 100%;
      background: linear-gradient(
        0deg,
        rgba(2, 215, 244, 1) 0%,
        rgba(28, 75, 222, 1) 100%
      );
      color: #fff;
      em {
        font-weight: bold;
        font-size: 20px;
        margin-right: 8px;
      }
      .buy_title {
        padding: 40px 0;
        font-size: 20px;
        display: inline-block;
        position: relative;
        &:before {
          content: "";
          display: block;
          width: 100%;
          height: 8px;
          background: rgba(255, 170, 59, 1);
          border-radius: 4px;
          position: absolute;
          left: 0;
          bottom: 40px;
          z-index: 1;
        }
        span {
          position: relative;
          z-index: 99;
        }
      }
      .pay_btn {
        width: 130px;
        height: 35px;
        line-height: 35px;
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 4px;
        margin: 50px auto 0;
        cursor: pointer;
      }
    }
  }
  .pt30{
    padding-top: 30px;
  }
  .pt20{
    padding-top: 20px;
  }
}
</style>
