<template>
  <div class="inputImgParentPosition">
    <input v-model="content"
      :type="textType" 
      :placeholder="placeholder"
      class="v_input"
    >
    <button 
      class="inputImgChildPositon logoBtn"
      @mouseover="mouseOver"
      @mouseleave="mouseLeave"
      @click="myClick"
    >
      <img  :src=icSearchUrl alt="">
    </button>
  </div>
</template>
<script>
export default {
   data(){
    return {
      icSearchUrl:require('../assets/images/ic_search_nor.png'),
      img_active:1,
      content:""
    }
  },
  props:{
    // 占位符内容
    placeholder:{
      type:String,
      default:""
    },
    // 输入框类型
    textType:{
      type:String,
      default:"text"
    }
  },
  watch:{
    content(val){
      this.$emit("input",val)
    }
  },
  methods:{
    myClick(){
      this.$emit("search")
    },
    // 鼠标移入搜索框触发事件
    mouseOver(){
      this.icSearchUrl=require('../assets/images/ic_search_pre.png')
    },
    // 鼠标移出搜索框触发事件
    mouseLeave(){
      this.icSearchUrl=require('../assets/images/ic_search_nor.png')
    }
  },
}
</script>
<style lang="scss" scoped>
$placeholderColor:#c2c2c2;
$btnBorder:1px solid #E1E1E1;
$btnBorder2:1px solid #327cff;
$inputColor:#333;
$fontFamily1:"medium";  //中等字体
$fontFamily2:"bold";  //加粗字体
input::-webkit-input-placeholder { 
  color:  $placeholderColor;
}
/* Mozilla Firefox 4 to 18 */
:-moz-placeholder { 
   color: $placeholderColor;
}
/* Mozilla Firefox 19+ */
::-moz-placeholder { 
  color: $placeholderColor;
}
/* Internet Explorer 10-11 */
input:-ms-input-placeholder { 
  color: $placeholderColor;
}
/* Microsoft Edge */
input::-ms-input-placeholder {
  color: $placeholderColor;
}
.inputImgParentPosition{
  width: 420px;
  height: 40px;
  position: relative;
  .inputImgChildPositon{
    position: absolute;
    left: 82%;
    top:18%;
  }
}
.v_input{
  width:400px;
  font-family: $fontFamily1;
  font-size:14px;
  padding:11.5px 0 11.5px 18px;
  border:$btnBorder;
  color:$inputColor;
  border-radius: 4px;
  outline: 0;
  &:hover{
    border:$btnBorder2;
  }
  &:active{
    border:$btnBorder2;
  }
}
.logoBtn{
  height:35px;
  width:50px;
  padding:0;
  margin:0;
  border:0;
  outline: 0;
  background: #fff;
  cursor: pointer;
}
</style>
