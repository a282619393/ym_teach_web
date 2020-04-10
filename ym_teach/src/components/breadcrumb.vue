<template>
  <div class="breadcrumb">
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">{{item.name}}</el-breadcrumb-item>  
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      levelList: [],
      show: false
    };
  },
  props: {},
  components: {},
  mounted() {},
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
    this.levelList = this.$route.meta.breadList  
    }
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    },
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb{
  height: 70px;
  background: $colorfff;
  margin: -20px -20px 0;
  padding: 25px 50px 0;
}
</style>
<style>
.breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
  color: #606266;
  font-size: 14px;
}
</style>