<template>
  <div class='teaching_evaluating'>
    <div class="textStyle">
      <span v-text="text2"></span>
      <span v-text="text3"></span>
    </div>
    <jvtable :tableType="'6'" :loading="loading" :tableDataAll="tablePageData"></jvtable>
    <button class="goBack" @click.prevent="goback">
      <div class="gobackStyle" v-text="text1"></div>
    </button>
    <!-- 分页位置 -->
    <div class="alignSite evaAlignSite" v-show="isPagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 200]"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import jvtable from '../../common/TableData';
export default {
  data(){
    return{
      text1:"返回",
      pageData:[],
      currentPage:1,
      loading:true,
      text2:"学生姓名：",
      pageSize:10,
      pageNum:1,
      total:0,
      text3:JSON.parse(sessionStorage.getItem("editInfo")).name
    }
  },
  components:{
    jvtable
  },
   watch:{

  },
  computed:{
    tablePageData(){
      if(this.pageData.length!==0){
        return this.tableList()
      }else {
        return []
      }
    },
    isPagination(){
      if (this.tablePageData.length==0){
        return false
      }else{
        return true
      }
    }
  },
  mounted(){
    this.evaluatingData()
  },
  methods:{
    tableList(){
      let start=(this.pageNum-1)*this.pageSize
      let end=this.pageNum*this.pageSize
      return this.pageData.slice(start,end)
    },
    evaluatingData(){
      let url=`/evaluate/getRecordCourse?studentId=${JSON.parse(sessionStorage.getItem("editInfo")).userId}`
      this.$axios.get(url).then(res=>{
        let arr=res.data
        for(let item of arr){
          item.gradeName=item.grade==0?'小学':(item.grade==1?"初中":"高中")
          item.subjectName=item.subject==0?'数学':(item.subject==1?"物理":"化学")
          item.endTimeName=item.endTime.replace('T',' ')
          item.textbook=item.textbook==1?"人教版":item.textbook
          item.isShow=true
        }
        this.total=arr.length
        this.pageData=arr
      })
      .finally(()=>{
        this.loading=false;
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
    },
    // 分页当前页方法
    handleCurrentChange(val) {
      this.pageNum=val
    },
    goback(){
      this.$router.push("/teaching/index")
    }
  }
}
</script>
<style lang="scss" scoped>
.teaching_evaluating{
  font-family: "medium";
  .textStyle{
    font-family: 'bold';
    color:#0067E4;
    font-size: 18px;
    margin:25px 0 40px 30px;
  }
  .evaAlignSite{
    background: #fff;
    padding-top:40px;
    padding-bottom: 40px;
  }
  .goBack{
    top:76px;
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
}
</style>