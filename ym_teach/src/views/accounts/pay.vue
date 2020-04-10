<template>
  <div class='accounts_pay'>
    <div class="backTo backToAbs" @click="routerback">
      <img src="../../assets/images/ic_back_blue.png" alt="">
      <span>返回</span>
    </div>
    <img src="../../assets/images/number_ic_flsh_middle.png" alt="">
    <div class="accounts_pay_con">
      <div class="pay_con_flex">
        <p>拉卡拉</p>
        <img src="../../assets/images/_20191211113145.png"  class="pay_con_img" alt=""></div>
      <div class="pay_con_flex">
        <p>银联</p>
        <img src="../../assets/images/1_20191211113208.png" class="pay_con_img" alt=""></div>
      <div class="pay_con_flex ">
        <p>对公转账</p>
        <div class="pay_con_flex_test">
          <p >开户行账号： </p>
          <p> 招商银行深圳龙华支行769906793910201</p>
        </div>
      </div>
    </div>
    <div class="accounts_pay_tel">
      <img src="../../assets/images/number_ic_phone.png" alt="">
      <span>财务联系电话：0755-21072448</span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    created() {

    },
    mounted() {

    },
    methods: {
      routerback(){
        this.$router.push("/accounts/index")
      }
    },
    computed: {},
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .accounts_pay {
    position: relative;
    height: 90%;
    width: 100%;
    border-radius: 8px;
    margin-top: 10px;
    padding-top: 5%;
    background: url(../../assets/images/number_bg_pic.png) no-repeat center center;
    background-size: 100% 100%;
    text-align: center;

    .backToAbs {
      position: absolute;
      right: 40px;
      top: -70px;
    }

    .accounts_pay_con {
      width: 70%;
      margin: 120px auto;
      display: flex;

      position: relative;
      justify-content: space-around;
      .pay_con_flex{
        margin: 0 50px;
        .pay_con_flex_test{
          text-align: left;
          line-height: 25px;
          margin-top: 40px;
        }
      }
      .pay_con_img{
        display: block;
        width: 150px;
        height: 150px;
      }
    }
    .accounts_pay_tel{
      font-size:16px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(0,103,228,1);
      img{
        vertical-align: -3px;
      }
    }
  }
</style>
