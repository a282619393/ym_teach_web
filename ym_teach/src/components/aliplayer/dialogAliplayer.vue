<template>
  <el-dialog title="视频讲解" :visible.sync="centerDialogVisible" :before-close="DialogVisibleCenter"  center  width="80%"  height="80%" >
    <slot ></slot>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="DialogVisibleCenter ">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
 
export default {
  name: "",
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //数据存放
    return {};
  },
  components: {
     
  },
  mounted() {},
  methods: {
    DialogVisibleCenter() {
      this.$emit("update:visible", false);
      
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
