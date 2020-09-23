<template>
  <div>

    <el-row>

      <el-col :span="24">

        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="时间">
            <div class="block">
              <el-date-picker
                v-model="date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyyMMdd"
                default-value="2010-10-01">
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item label="店铺">
            <el-select v-model="shopId" filterable placeholder="请选择店铺">

              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>

        </el-form>


      </el-col>
      <el-col :span="24">
        <div id="gotobedbar"></div>
      </el-col>

      <el-col :span="24">
        <div id="gotobedbar1"></div>
      </el-col>

      <el-col :span="24">
        <div id="gotobedbar2"></div>
      </el-col>
      <el-col :span="24">
        <div id="gotobedbar3"></div>
      </el-col>
      <el-col :span="24">
        <div id="gotobedbar4"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import * as api from "../../api";
import {dateFormat} from "../../common/utils";
import echarts from "echarts";

const getBeforeDate = (n) => {
  var list = [];
  var d = new Date(); // 这个算法能自动处理闰年和非闰年。2012年是闰年，所以2月有29号
  var s = '';
  var i = 0;
  while (i < n) {
    d.setDate(d.getDate() - 1);
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    list.push(year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day));
    i++;
  }
  return list.reverse();
}

var titles = ['营业额','收入','订单','活动补贴'];
const option = {
  title:[
    {
      text:titles[0],
      left:'25%',
      top:'1%',
      textAlign:'center'
    },
    {
      text:titles[1],
      left:'73%',
      top:'1%',
      textAlign:'center'
    },
    {
      text:titles[2],
      left:'25%',
      top:'50%',
      textAlign:'center'
    },
    {
      text:titles[3],
      left:'73%',
      top:'50%',
      textAlign:'center'
    }

  ],


  grid: [
    {x: '7%', y: '7%', width: '38%', height: '38%'},
    {x2: '7%', y: '7%', width: '38%', height: '38%'},
    {x: '7%', y2: '7%', width: '38%', height: '38%'},
    {x2: '7%', y2: '7%', width: '38%', height: '38%'}

  ],
  tooltip: [
    {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    }
  ],
  toolbox: {
    show: true,
    orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
    x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                               // 'center' ¦ 'left' ¦ 'right'
                               // ¦ {number}（x坐标，单位px）
    y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                               // 'top' ¦ 'bottom' ¦ 'center'
                               // ¦ {number}（y坐标，单位px）
    color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
    feature: {
      mark: {show: true},
      // dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar'/*, 'stack', 'tiled'*/]},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  xAxis: [
    {gridIndex: 0, min: 0, max: 20},
    {gridIndex: 1, min: 0, max: 20},
    {gridIndex: 2, min: 0, max: 20},
    {gridIndex: 3, min: 0, max: 20}],
  yAxis: [
    {gridIndex: 0, type: 'value',},
    {gridIndex: 1, type: 'value',},
    {gridIndex: 2, type: 'value',},
    {gridIndex: 3, type: 'value',}
  ],
  series: []
}
export default {
  name: "orderData",
  data() {
    return {
      date: '',
      shopId: '',
      options: [],
    }
  },
  methods: {
    drawbar(id) {
      let o = document.getElementById(id);
      let height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = echarts.init(o, 'macarons');
      this.chart.setOption(option);
    },
    onSubmit() {
      console.log('date' + this.date);
      console.log('shopId' + this.shopId);
      if (this.date.length === 0 || this.shopId === '') {
        this.$message({
          showClose: true,
          message: '请检查输入条件',
          type: 'warning'
        });
        return
      }
      let times = "startTime=" + this.date[0] + "&endTime=" + this.date[1] + "&shopId=" + this.shopId
      this.$http.get(api.MT_BUS_DATE + "?" + times)
        .then(res => {
          console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message('操作成功');
              this.updateBase(resData)
            } else {
              this.$message('数据为空')
            }
          }

        }).catch(e => {
        // this.$message('数据异常请联系管理员')
      })
    },

    updateBase(dateSours) {

      let lista = [];
      let turnovers = [];
      let effectiveorders = [];
      let settleacc = [];
      let actsubs = [];
      dateSours.forEach(function (value) {
        lista.push(value['date'])
        turnovers.push(value['turnover'])
        effectiveorders.push(value['effectiveorders'])
        settleacc.push(value['settleacc'])
        actsubs.push(value['actsub'])
      })

      option.xAxis = [
        {gridIndex: 0, data: lista},
        {gridIndex: 1, data: lista},
        {gridIndex: 2,data: lista},
        {gridIndex: 3, data: lista}
      ]

      option.series = [
        {
          name: '营业额',
          type: 'line',
          stack: '营业额',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: turnovers,
        }, {
          name: '收入',
          type: 'line',
          stack: '收入',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: settleacc,
        }, {
          name: '订单',
          type: 'line',
          stack: '订单',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: effectiveorders,
        }, {
          name: '活动补贴',
          type: 'line',
          stack: '活动补贴',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: actsubs,
        }]
      debugger
      this.drawbar('gotobedbar');
    },

    getAllShop() {
      this.$http.get(api.MT_ALL_SHOP)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message('操作成功');
              let op = [{
                value: -1,
                label: '全部'
              }]
              resData.forEach(function (va) {
                op.push({value: va.wmpoiid, label: va.reptileType})
              });
              this.options = op
              console.log(op)
            } else {
              this.$message('数据为空')
            }
          }
        }).catch(
      )
    },
  },

  mounted() {
    this.getAllShop()
    this.shopId = -1
    let dt = new Date();
    let endDate = dateFormat("YYYYmmdd", dt)
    dt.setDate(dt.getDate() - 30)
    let statrDate = dateFormat("YYYYmmdd", dt)
    console.log([statrDate, endDate])
    this.date = [statrDate, endDate]

    this.$nextTick(function () {
      // this.drawbar('gotobedbar');
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawbar('gotobedbar');
        }, 300);
      }
    });
  }
}
</script>

<style scoped>

#gotobedbar {
  /*width: 100%;*/
  min-height: 300px;
  margin-right: 15px;
}
</style>
