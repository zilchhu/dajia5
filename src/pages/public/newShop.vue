<template>
  <div>

    <el-row>

      <el-col :span="24">

        <el-form :inline="true" class="demo-form-inline">
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

var titles = ['评论','订单','评分','推广消费','营业额','客单价','曝光','进店率','下单率'];
const option = {
  title:[
    {
      text:'评论',
      left:'25%',
      top:'1%',
      textAlign:'center'
    },
    {
      text:'订单',
      left:'73%',
      top:'1%',
      textAlign:'center'
    },
    {
      text:'评分',
      left:'25%',
      top:'50%',
      textAlign:'center'
    },
    {
      text:'推广消费',
      left:'73%',
      top:'50%',
      textAlign:'center'
    }

  ],


  grid: [
    {x: '7%', y: '7%', width: '38%', height: '38%',containLabel:true},
    {x2: '7%', y: '7%', width: '38%', height: '38%',containLabel:true},
    {x: '7%', y2: '7%', width: '38%', height: '38%',containLabel:true},
    {x2: '7%', y2: '7%', width: '38%', height: '38%',containLabel:true},
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
    color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e','#1e90ff', '#22bb22', '#4b0082', '#d2691e','#d2691e'],
    feature: {
      mark: {show: true},
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

const option1 = {
  title:[
    {
      text:'营业额',
      left:'25%',
      top:'1%',
      textAlign:'center'
    },
    {
      text:'客单价',
      left:'73%',
      top:'1%',
      textAlign:'center'
    },
    {
      text:'曝光',
      left:'25%',
      top:'50%',
      textAlign:'center'
    },
    {
      text:'进店率',
      left:'73%',
      top:'50%',
      textAlign:'center'
    }

  ],


  grid: [
    {x: '7%', y: '7%', width: '38%', height: '38%',containLabel:true},
    {x2: '7%', y: '7%', width: '38%', height: '38%',containLabel:true},
    {x: '7%', y2: '7%', width: '38%', height: '38%',containLabel:true},
    {x2: '7%', y2: '7%', width: '38%', height: '38%',containLabel:true},
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
    color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e','#1e90ff', '#22bb22', '#4b0082', '#d2691e','#d2691e'],
    feature: {
      mark: {show: true},
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

const option2 = {
  title:[
    {
      text:'下单率',
      left:'25%',
      top:'1%',
      textAlign:'center'
    }
  ],


  grid: [
    {x: '7%', y: '7%', width: '38%', height: '38%',containLabel:true},
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
    color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e','#1e90ff', '#22bb22', '#4b0082', '#d2691e','#d2691e'],
    feature: {
      mark: {show: true},
      magicType: {show: true, type: ['line', 'bar'/*, 'stack', 'tiled'*/]},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  xAxis: [
    {gridIndex: 0, min: 0, max: 20},
  ],
  yAxis: [
    {gridIndex: 0, type: 'value',},
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
    drawbar(id,option) {
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
      let parm = "shopId=" + this.shopId
      this.$http.get(api.PB_NEW_SHOP + "?" + parm)
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
      let evaluate = [];
      let order = [];
      let bizscore = [];
      let moment = [];
      let turnover = [];
      let unitprice = [];
      let overview = [];
      let entryrate = [];
      let orderrate = [];
      dateSours.forEach(function (value) {
        lista.push(value['date'])
        evaluate.push(value['evaluate'])
        order.push(value['order'])
        bizscore.push(value['bizscore'])
        moment.push(value['moment'])
        turnover.push(value['turnover'])
        unitprice.push(value['unitprice'])
        overview.push(value['overview'])
        entryrate.push(value['entryrate'])
        orderrate.push(value['orderrate'])

      })

      option.xAxis = [
        {gridIndex: 0, data: lista},
        {gridIndex: 1, data: lista},
        {gridIndex: 2,data: lista},
        {gridIndex: 3, data: lista}
      ]

      option1.xAxis = [
        {gridIndex: 0, data: lista},
        {gridIndex: 1, data: lista},
        {gridIndex: 2,data: lista},
        {gridIndex: 3, data: lista}
      ]
      option2.xAxis = [
        {gridIndex: 0, data: lista},
      ]

      option.series = [
        {
          name: '评论',
          type: 'line',
          stack: '评论',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: evaluate,
        }, {
          name: '订单',
          type: 'line',
          stack: '订单',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: order,
        }, {
          name: '评分',
          type: 'line',
          stack: '评分',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: bizscore,
        }, {
          name: '推广消费',
          type: 'line',
          stack: '推广消费',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: moment,
        }, ]
      option1.series =[
        {
          name: '营业额',
          type: 'line',
          stack: '营业额',
          xAxisIndex: 4,
          yAxisIndex: 4,
          data: turnover,
        }, {
          name: '客单价',
          type: 'line',
          stack: '客单价',
          xAxisIndex: 5,
          yAxisIndex: 5,
          data: unitprice,
        }, {
          name: '曝光',
          type: 'line',
          stack: '曝光',
          xAxisIndex: 6,
          yAxisIndex: 6,
          data: overview,
        }, {
          name: '进店率',
          type: 'line',
          stack: '进店率',
          xAxisIndex: 7,
          yAxisIndex: 7,
          data: entryrate,
        }
      ]
      option2.series =[
        {
          name: '下单率',
          type: 'line',
          stack: '下单率',
          xAxisIndex: 8,
          yAxisIndex: 8,
          data: orderrate,
        }
      ]

      this.drawbar('gotobedbar',option1);
      // this.drawbar('gotobedbar1',option1);
      // this.drawbar('gotobedbar2',option2);
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
  /*min-height: 300px;*/
  /*margin-right: 15px;*/
}
</style>
