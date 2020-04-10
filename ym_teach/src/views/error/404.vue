<template>
  <div class>
    <img src="../../assets/images/default_pic_404.png" class="default_pic" alt />
    <div class="btnStyle">
      <el-button type="primary" @click.native="CheckParsing">返回首页</el-button>

    </div>
  </div>
</template>

<script>
import { addRouter } from "@/api/login";
export default {
  name: "",
  data() {
    return {
      btnText: "返回首页"
    };
  },
  props: {},
  components: {},
  mounted() {},
  methods: {
    CheckParsing() {
      let limit = this.$store.state.limit;
      let addLimit = addRouter(limit);
      let homeUrl = addLimit[0].path;
      this.$router.push(homeUrl);
    }
  }
};
</script>

<style lang="scss" scoped>
.default_pic {
  display: block;
  margin: 30px auto 0;
}
</style>

