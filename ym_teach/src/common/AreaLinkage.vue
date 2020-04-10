<template>
  <div>
    <el-select v-model="province" class="coopState" placeholder="选择省" clearable @change="gainProvinceID">
      <el-option :label="item.province" :value="item.provinceID"  v-for="(item,i) of provinceData" :key='`pr${i}`'></el-option>
    </el-select>
    <el-select v-model="city" class="coopState" placeholder="选择市" clearable @change="gainCityID">
      <el-option :label="item.city" :value="item.cityID" v-for="(item,i) of cityData" :key='`city${i}`'></el-option>
    </el-select>
    <el-select v-model="area" class="coopState" clearable placeholder="选择区">
      <el-option :label="item.area" :value="item.areaID" v-for="(item,i) of areaData" :key='`area${i}`'></el-option>
    </el-select>

  </div>
</template>
<script>
import {getProvinceList,getCityList,getAreaList} from '../api/student'
export default {
  data(){
    return {
      provinceData:[],
      cityData:[],
      areaData:[],
      oldprovince:'',
      oldcity:'',
      province:"",
      city:"",
      area:""
    }
  },
  watch:{
    province:{
      handler(val){
        let arr=this.getValueByCode('province',val);
        this.$emit("province",arr)
      },
      immediate:true
    },
    city:{
      handler(val){
        let arr=this.getValueByCode('city',val);
        this.$emit("city",arr)
      },
      immediate:true
    },
    area:{
      handler(val){
        let arr=this.getValueByCode('area',val);
        this.$emit("area",arr)
      },
      immediate:true
    },
  },
  mounted(){
    this.gainProvinceData()
  },
  methods:{
    //通过code获取具体某个省市区
    getValueByCode(type,code){
      if(!code)return ['',''];
      let arr=[];
      let keyName="",valueName="";
      if(type==="province"){
        arr=this.provinceData;
        keyName="provinceID";
        valueName="province";
      }else if(type==="city"){
        arr=this.cityData;
        keyName="cityID";
        valueName="city";
      }else{
        arr=this.areaData;
        keyName="areaID";
        valueName="area";
      }
      for(let obj of arr){
        if(obj[keyName]===code)
          return [obj[keyName],obj[valueName]];
      }
      return ['',''];
    },
    //给省市区赋值
    setValueForProCityArea(province,city,area){
      let se=setInterval(()=>{
        if(this.areaData.length){
          this.province=province;
          this.oldprovince=province;
          this.city=city;
          this.oldcity=city;
          this.area=area;
          clearInterval(se);
        }
      },100);
     
    },
    // 获取省份
    gainProvinceData(){
      getProvinceList().then(res=>{
        this.provinceData=res.data
      })
    },
    // 获取城市
    gainProvinceID(e){
      if(this.oldprovince==""){
        this.oldprovince=this.province
      }else if(this.province!==this.oldprovince){
        this.city=""
        this.area=""
        this.areaData=[]
        this.oldprovince=this.province
      }
      if(e==""){
        this.city=""
        this.area=""
        this.cityData=[]
      }else if(e!==""){
        getCityList(e).then(res=>{
          this.cityData=res.data
        })
      }
    },
    // 获取地区
    gainCityID(e){
      if(this.oldcity==""){
        this.oldcity=this.city
      }else if(this.city!==this.oldcity){
        this.area=""
        this.oldcity=this.city
      }
      if(e==""){
        this.area=""
        this.areaData=[]
      }else if(e!==""){
        getAreaList(e).then(res=>{
          this.areaData=res.data
        })
      }
    },
  } 
}
</script>
<style>
  .el-input__inner{
    height:36px
  }
</style>