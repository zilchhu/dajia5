<template>
  <div>

    <el-row>

      <el-col :span="24">

        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="店铺">
            <el-select v-model="shopId" filterable placeholder="请选择店铺" @change="selectOne">

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

      <el-col :span="8">
        <div id="gotobedbar3"></div>
      </el-col>

      <el-col :span="8">
        <div id="gotobedbar4"></div>
      </el-col>

      <el-col :span="8">
        <div id="gotobedbar5"></div>
      </el-col>

      <el-col :span="8">
        <div id="gotobedbar6"></div>
      </el-col>

      <el-col :span="8">
        <div id="gotobedbar7"></div>
      </el-col>

      <el-col :span="8">
        <div id="gotobedbar8"></div>
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
const option = {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺评论',
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
    text: '美团店铺订单',
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
    text: '美团店铺评分',
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
const option3 = {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺推广消费',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['推广消费'],
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
    color: ['#1eff8f'],
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
const option4 = {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺营业额',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['营业额'],
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
const option5 = {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺客单价',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['客单价'],
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
const option6 = {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺曝光',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['曝光'],
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
    color: ['#1eff8f'],
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
const option7= {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺进店率',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['营业额'],
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
const option8 = {
  color: ['#70d1d5'],
  title: {
    text: '美团店铺下单率',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ['收入'],
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
  name: "orderData",
  data() {
    return {
      date: '',
      shopId: '',
      options: [],
    }
  },
  methods: {
    selectOne(item){
      window.sessionStorage.setItem("shop_info", item);
    },
    sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    },
    drawbar(id, option) {
      let o = document.getElementById(id);
      let height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = echarts.init(o, 'macarons');
      this.chart.setOption(option);
      this.chart.on('click', function (params) {
        // 控制台打印数据的名称
        debugger
        console.log(params.name);
      });
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

      dateSours = this.sortByKey(dateSours, 'date')
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
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option.series = [
        {
          name: '评论',
          type: 'line',
          tiled: '评论',
          areaStyle: {normal: {}},
          data: evaluate
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
          name: '订单',
          type: 'line',
          tiled: '订单',
          areaStyle: {normal: {}},
          data: order
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
          name: '评分',
          type: 'line',
          tiled: '评分',
          areaStyle: {normal: {}},
          data: bizscore
        },]


      option3.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option3.series = [
        {
          name: '推广消费',
          type: 'line',
          tiled: '推广消费  ',
          areaStyle: {normal: {}},
          data: moment
        },]

      option4.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option4.series = [
        {
          name: '营业额',
          type: 'line',
          tiled: '营业额',
          areaStyle: {normal: {}},
          data: turnover
        },]

      option5.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option5.series = [
        {
          name: '客单价',
          type: 'line',
          tiled: '客单价',
          areaStyle: {normal: {}},
          data: unitprice
        },]

      option6.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option6.series = [
        {
          name: '曝光',
          type: 'line',
          tiled: '曝光',
          areaStyle: {normal: {}},
          data: overview
        },]

      option7.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option7.series = [
        {
          name: '进店率',
          type: 'line',
          tiled: '进店率',
          areaStyle: {normal: {}},
          data: entryrate
        },]

      option8.xAxis = [
        {
          type: 'category',
          boundaryGap: true,
          data: lista
        }
      ]

      option8.series = [
        {
          name: '下单率',
          type: 'line',
          tiled: '下单率',
          areaStyle: {normal: {}},
          data: orderrate
        },]




      let drawbar1  =   this.drawbar('gotobedbar', option);
      let drawbar2  =  this.drawbar('gotobedbar1', option1);
      let drawbar3  =  this.drawbar('gotobedbar2', option2);
      let drawbar4  =   this.drawbar('gotobedbar3', option3);
      let drawbar5  =  this.drawbar('gotobedbar4', option4);
      let drawbar6  =  this.drawbar('gotobedbar5', option5);
      let drawbar7  =   this.drawbar('gotobedbar6', option6);
      let drawbar8  =  this.drawbar('gotobedbar7', option7);
      let drawbar9  =  this.drawbar('gotobedbar8', option8);
      // echarts.connect([drawbar1,drawbar2,drawbar3])
    },
    getAllShop() {
      this.$http.get(api.PB_NEW_SHOP_INFO)
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
                op.push({value: va.shopId, label: va.shopName})
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

[id*=gotobedbar] {
  min-height: 300px;
  margin-right: 15px;
  height: 300px !important;
}
</style>
