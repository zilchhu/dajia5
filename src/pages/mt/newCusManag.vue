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
      <el-col :span="8">
        <div id="gotobedbar"></div>
      </el-col>

      <el-col :span="8">
        <div id="gotobedbar1"></div>
      </el-col>

      <el-col :span="8">
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

var titles = ['下单总人数','新客人数','老客人数','新客占比','老客占比','商圈下单人数排名'];
const option = {
  color: ['#70d1d5'],
  title: {
    text: '下单总人数',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['评论'],
    orient: 'vertical',
    left: 'right',
    top: 'middle',//如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
    x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                               // 'center' ¦ 'left' ¦ 'right'
                               // ¦ {number}（x坐标，单位px）
    y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                               // 'top' ¦ 'bottom' ¦ 'center'
                               // ¦ {number}（y坐标，单位px）
    color: ['#1e1eff'],
    feature: {
      mark: {show: true},
      // dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
    },
  ],


  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: []
}
const option1 = {
  color: ['#70d1d5'],
  title: {
    text: '老客占比',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['订单'],
    orient: 'vertical',
    left: 'right',
    top: 'middle',//如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
    x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                               // 'center' ¦ 'left' ¦ 'right'
                               // ¦ {number}（x坐标，单位px）
    y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                               // 'top' ¦ 'bottom' ¦ 'center'
                               // ¦ {number}（y坐标，单位px）
    color: ['#70d1d5'],
    feature: {
      mark: {show: true},
      // dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
    },
  ],


  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: []
}
const option2 = {
  color: ['#70d1d5'],
  title: {
    text: '商圈下单人数排名',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['评分'],
    orient: 'vertical',
    left: 'right',
    top: 'middle',//如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
    x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                               // 'center' ¦ 'left' ¦ 'right'
                               // ¦ {number}（x坐标，单位px）
    y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                               // 'top' ¦ 'bottom' ¦ 'center'
                               // ¦ {number}（y坐标，单位px）
    color: ['#70d1d5'],
    feature: {
      mark: {show: true},
      // dataView: {show: true, readOnly: false},
      magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
    },
  ],


  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: []
}
export default {
  name: "newCusManag",
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
      return this.chart
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
      this.$http.get(api.MT_CUSMANAG + "?" + times)
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
      let allsingle = [];
      let newsingle = [];
      let oldsingle = [];
      let newpercent = [];
      let oldpercent = [];
      let allavg = [];
      dateSours.forEach(function (value) {
        lista.push(value['date'])
        allsingle.push(value['allsingle'])
        newsingle.push(value['newsingle'])
        oldsingle.push(value['oldsingle'])
        newpercent.push(value['newpercent'])
        oldpercent.push(value['oldpercent'])
        allavg.push(value['allavg'])
      })


      option1.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option.series = [
        {
          name: '下单总人数',
          type: 'bar',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: allsingle
        },]

      option1.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option1.series = [
        {
          name: '老客占比',
          type: 'bar',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: oldpercent
        },]

      option2.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option2.series = [
        {
          name: '商圈下单人数排名',
          type: 'bar',
          tiled: '总量',
          areaStyle: {normal: {}},
          data: allavg
        },]



      this.drawbar('gotobedbar',option);
      this.drawbar('gotobedbar1',option1);
      this.drawbar('gotobedbar2',option2);
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
  width: 100%;
  min-height: 300px;
  margin-right: 15px;
}
</style>
