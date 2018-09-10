<template>
 <div class="city-select">
   <el-col :span="7">
     <el-select v-model="selectedProvinceId" name="province" :disabled="disabled" :size='size' @change='provinceChange'>
      <el-option v-for="(item, index) in provinces" :value="item.areaId" :key='index' :label="item.areaName"></el-option>
    </el-select>
   </el-col>
   <el-col :span="1">&nbsp;</el-col>
   <el-col :span="7">
     <el-select v-model="selectedCityId" name="city" :disabled="disabled" :size='size' @change='cityChange'>
      <el-option v-for="(item, index) in cities" :key='index' :value="item.areaId" :label='item.areaName'></el-option>
    </el-select>
   </el-col>
   <el-col :span="1">&nbsp;</el-col>
    <el-select v-model="selectedCountyId" name="block" v-if='!noBlock' :disabled="disabled" :size='size'>
     <el-option v-for="(item, index) in blocks" :key='index' :value="item.areaId" :label="item.areaName"></el-option>
   </el-select> 
 </div>
</template>
<script>
/**
*  省 市 区/县城  三联动选择器
*/
import Vue from 'vue';
import LocalProvinceList from '../../static/provinceList.js';

export default {
  data() {
    return {
      selectedProvinceId: '',
      selectedCityId: '',
      selectedCountyId: '',
      provinces: [],
      cities: [],
      blocks: [],
      noBlock: false,
    };
  },
  props: {
    disabled: {
      type: Boolean,
      defalut: false,
    },
    size: {
      type: String,
      default: 'small',
    },
    provinceId: {
      type: Number,
    },
    cityId: {
      type: Number,
    },
    countyId: {
      type: Number,
    },
  },
  methods: {
    getAllArea() {
      this.$http.post(`${this.URL_PREFIX}/app/get/all/area/data`, {}).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.provinces = res.resData.pageList[0].childrenList;
          this.selectedProvinceId = this.provinceId || '';
          this.selectedCityId = this.cityId || '';
          this.selectedCountyId = this.countyId || '';
          this.init();
        }
      });
    },
    areaInit() {
      this.provinces = LocalProvinceList.pageList[0].childrenList;
      this.selectedProvinceId = this.provinceId || '';
      this.selectedCityId = this.cityId || '';
      this.selectedCountyId = this.countyId || '';
      this.init();
    },
    provinceChange(provinceId) {
      const province = this.provinces.find((item) => {
        return item.areaId === provinceId;
      });
      this.cities = province.childrenList || [];
      this.blocks = [];
      this.selectedCityId = '';
      this.selectedCountyId = '';
      this.noBlock = provinceId === 35;
    },
    cityChange(cityId) {
      const city = this.cities.find((item) => {
        return item.areaId === cityId;
      });
      this.blocks = city.childrenList || [];
      this.selectedCountyId = '';
    },
    init() {
      // 初始化省份列表
      const province = this.provinces.find((item) => {
        return item.areaId === this.selectedProvinceId;
      });
      this.cities = province ? province.childrenList : [];
      this.noBlock = this.selectedProvinceId === 35;
      // 初始化城市列表
      const city = this.cities.find((item) => {
        return item.areaId === this.selectedCityId;
      });
      this.blocks = city ? city.childrenList : [];
    },
    cancel(provinceId, cityId, countyId) {
      this.selectedProvinceId = this.provinceId || '';
      this.selectedCityId = this.cityId || '';
      this.selectedCountyId = this.countyId || '';
      this.init();
    },
    getSelectedInfo() {
      return {
        provinceId: this.selectedProvinceId,
        cityId: this.selectedCityId,
        countyId: this.selectedCountyId,
      };
    },
  },
  created() {
    this.areaInit();
  },
};
</script>
<style lang="scss" scoped>
 .city-select select{
   outline: 0;
 }
</style>