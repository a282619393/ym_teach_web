<template>
  <div class='teaching_studyRecord'>
    <div class="black">
      <span v-text="text" class="text"></span>
    </div>
    <jvtable :tableType="'5'" :loading="loading" :imgIsShow="imgIsShow" :tableDataAll="tablePageData"></jvtable>
    <button class="goBack" @click.prevent="goback">
      <div class="gobackStyle" v-text="text1"></div>
    </button>
    <div class="alignSite evaAlignSite" v-show="isPagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10,20, 50, 200]"
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
  data() {
    return {
      // tablePageData:[],
      pageData:[],
      text:"知识点学习记录",
      text1:"返回",
      currentPage:1,
      pageSize:10,
      pageNum:1,
      total:0,
      // isPagination:true,
      loading:true,
      imgIsShow:false
    };
  },
  components:{
    jvtable
  },
  watch:{
  },
  created() {

  },
  mounted() { 
    this.newStudy()
  },
  methods: {
    tableList(){
      let start=(this.pageNum-1)*this.pageSize
      let end=this.pageNum*this.pageSize
      return this.pageData.slice(start,end)
    },
    newStudy(){
      let url="/teaching/getRecordCourse/?studentId="+JSON.parse(sessionStorage.getItem("editInfo")).userId
      this.$axios.get(url)
      .then(res=>{
        let rowsData=res.data
        if(rowsData.length!==0){
          this.total=rowsData.length
        }
        for(let item of rowsData){
          item.gradeSubject=`${item.grade==0?"小学":(item.grade==1?"初中":"高中")}${item.subject==0?"数学":(item.subject==1?"物理":"化学")}`
          item.isShow=true
        }
        this.pageData=rowsData
      })
      .catch(err=>console.log(err))
      .finally(()=>{
        this.loading=false;
        this.imgIsShow=true
      })
    },
    // 分页当前行方法
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
  },
  computed: {
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
}
</script>

<style lang="scss" scoped>
.teaching_studyRecord{
  font-family: "medium";
  .black{
    width:134px;
    height: 53px;
    background: #fff;
    border-radius: 12px  12px   0px  0px;
    background-image: url('../../assets/images/list_ic_top_blue.png');
    background-repeat:no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
      font-family:"bold";
      color: #222222;
    }
  }
  .evaAlignSite{
    background: #fff;
    padding-top:40px;
    padding-bottom: 40px;
  }
  .goBack{
    top:40px;
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
