<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="时间">
            <div class="block">
              <el-date-picker
                @change="dateChange"
                v-model="date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyyMMdd"
                default-value="2010-10-01"
              >
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item label="店铺">
            <el-select
              v-model="shopId"
              filterable
              placeholder="请选择店铺"
              @change="selectOne"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
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

      <!-- <el-col :span="8">
        <div id="gotobedbar1"></div>
      </el-col> -->

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

      <el-col :span="8">
        <div id="gotobedbar9"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from "../../api";
import { dateFormat } from "../../common/utils";
import echarts from "echarts";

const getBeforeDate = n => {
  var list = [];
  var d = new Date(); // 这个算法能自动处理闰年和非闰年。2012年是闰年，所以2月有29号
  var s = "";
  var i = 0;
  while (i < n) {
    d.setDate(d.getDate() - 1);
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    list.push(
      year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
    );
    i++;
  }
  return list.reverse();
};

const option = {
  color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
  title: {
    text: "访问下单",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["访问", "下单", "下单转化率"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    },
    {
      type: "value"
    }
  ],
  series: []
};
const option1 = {
  color: ["#22bb22", "#4b0082", "#d2691e"],
  title: {
    text: "整体流量-下单人数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    data: ["整体流量-下单人数"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1efff4"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option2 = {
  title: {
    text: "整体流量-访问次数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1eff8f"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    }
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option3 = {
  title: {
    text: "整体流量-下单次数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option4 = {
  title: {
    text: "整体流量-下单转换率",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};

const option5 = {
  title: {
    text: "自然流量-访问次数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option6 = {
  title: {
    text: "自然流量-下单次数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option7 = {
  title: {
    text: "自然流量-下单转换率",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};

const option8 = {
  title: {
    text: "广告流量-访问次数",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};
const option9 = {
  title: {
    text: "广告流量-点击成本",
    left: "center"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },

  legend: {
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20
  },
  toolbox: {
    show: true,
    orient: "horizontal", // 布局方式，默认为水平布局，可选为：
    x: "right", // 水平安放位置，默认为全图右对齐，可选为：
    // 'center' ¦ 'left' ¦ 'right'
    // ¦ {number}（x坐标，单位px）
    y: "top", // 垂直安放位置，默认为全图顶端，可选为：
    // 'top' ¦ 'bottom' ¦ 'center'
    // ¦ {number}（y坐标，单位px）
    color: ["#1e1eff"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0]
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%"
    }
  ],

  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30)
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: []
};

export default {
  name: "exposures",
  data() {
    return {
      date: "",
      shopId: "",
      options: []
    };
  },
  methods: {
    dateChange() {
      console.log("修改时间");
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit();
    },
    selectOne(item) {
      window.sessionStorage.setItem("ele_shop_info", item);
      this.onSubmit();
    },
    drawbar(option, id) {
      let o = document.getElementById(id);
      let height = document.documentElement.clientHeight;
      height -= 120;
      o.style.height = height + "px";
      this.chart = echarts.init(o, "macarons");
      this.chart.setOption(option);
      return this.chart;
    },
    onSubmit() {
      console.log("date" + this.date);
      console.log("shopId" + this.shopId);
      //this.date = window.sessionStorage.getItem('changedate')
      if (this.date.length === 0 || this.shopId === "") {
        this.$message({
          showClose: true,
          message: "请检查输入条件",
          type: "warning"
        });
        return;
      }
      let times =
        "startTime=" +
        this.date[0] +
        "&endTime=" +
        this.date[1] +
        "&shopId=" +
        this.shopId +
        "&type" +
        1;
      this.$http
        .get(api.ELE_FLOW_DATE + "?" + times)
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              this.updateBase(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {
          // this.$message('数据异常请联系管理员')
        });
      this.$http
        .get(
          `http://localhost:9020/elm/flow/distribution?dates=${this.date[0]},${this.date[1]}&shop_id=${this.shopId}`
        )
        .then(res => res.data.r)
        .then(res => {
          console.log(res);
          let z = res.filter(v => v.flow_type == "整体流量");
          let y = Array.from(new Set(z.map(v => v.exposure_entrance)));
          option2.legend.data = y;
          option2.xAxis.data = Array.from(new Set(z.map(v => v.date)));
          option2.series = y.map(v => ({
            name: v,
            type: "line",
            tiled: "1",
            stack: "1",
            areaStyle: { normal: {} },
            data: z
              .filter(k => k.exposure_entrance == v)
              .map(k => k.visitorTimes || 0)
          }));
          this.drawbar(option2, "gotobedbar2");

          option3.legend.data = y;
          option3.xAxis.data = Array.from(new Set(z.map(v => v.date)));
          option3.series = y.map(v => ({
            name: v,
            type: "line",
            tiled: "2",
            stack: "2",
            areaStyle: { normal: {} },
            data: z
              .filter(k => k.exposure_entrance == v)
              .map(k => k.buyerTimes || 0)
          }));
          this.drawbar(option3, "gotobedbar3");

          option4.legend.data = y;
          option4.xAxis.data = Array.from(new Set(z.map(v => v.date)));
          option4.series = y.map(v => ({
            name: v,
            type: "line",
            tiled: "3",
            stack: "3",
            areaStyle: { normal: {} },
            data: z
              .filter(k => k.exposure_entrance == v)
              .map(k => k.buyerConvRate || 0)
          }));
          this.drawbar(option4, "gotobedbar4");

          let zz = res.filter(v => v.flow_type == "自然流量");
          let yy = Array.from(new Set(zz.map(v => v.exposure_entrance)));
          option5.legend.data = yy;
          option5.xAxis.data = Array.from(new Set(zz.map(v => v.date)));
          option5.series = yy.map(v => ({
            name: v,
            type: "line",
            tiled: "1",
            stack: "1",
            areaStyle: { normal: {} },
            data: zz
              .filter(k => k.exposure_entrance == v)
              .map(k => k.visitorTimes || 0)
          }));
          this.drawbar(option5, "gotobedbar5");

          option6.legend.data = yy;
          option6.xAxis.data = Array.from(new Set(zz.map(v => v.date)));
          option6.series = yy.map(v => ({
            name: v,
            type: "line",
            tiled: "2",
            stack: "2",
            areaStyle: { normal: {} },
            data: zz
              .filter(k => k.exposure_entrance == v)
              .map(k => k.buyerTimes || 0)
          }));
          this.drawbar(option6, "gotobedbar6");

          option7.legend.data = yy;
          option7.xAxis.data = Array.from(new Set(zz.map(v => v.date)));
          option7.series = yy.map(v => ({
            name: v,
            type: "line",
            tiled: "3",
            stack: "3",
            areaStyle: { normal: {} },
            data: zz
              .filter(k => k.exposure_entrance == v)
              .map(k => k.buyerConvRate || 0)
          }));
          this.drawbar(option7, "gotobedbar7");

          let zzz = res.filter(v => v.flow_type == "广告流量");
          let yyy = Array.from(new Set(zzz.map(v => v.exposure_entrance)));
          option8.legend.data = yyy;
          option8.xAxis.data = Array.from(new Set(zzz.map(v => v.date)));
          option8.series = yyy.map(v => ({
            name: v,
            type: "line",
            tiled: "1",
            stack: "1",
            areaStyle: { normal: {} },
            data: zzz
              .filter(k => k.exposure_entrance == v)
              .map(k => k.visitorTimes || 0)
          }));
          this.drawbar(option8, "gotobedbar8");

          option9.legend.data = yyy;
          option9.xAxis.data = Array.from(new Set(zzz.map(v => v.date)));
          option9.series = yyy.map(v => ({
            name: v,
            type: "line",
            tiled: "2",
            stack: "2",
            areaStyle: { normal: {} },
            data: zzz
              .filter(k => k.exposure_entrance == v)
              .map(k => k.cost || 0)
          }));
          this.drawbar(option9, "gotobedbar9");
        })
        .catch(e => console.error(e));
    },

    updateBase(dateSours) {
      let lista = [];
      let visitortimes = []; //
      let visitor = []; //整体流量-访问人数
      let buyertimes = []; //
      let buyer = []; //整体流量-下单人数
      let buyerconvrate = []; // 整体流量-下单转化率
      let advisitor = []; //广告-访问人数

      dateSours.forEach(function(value) {
        if (value["flowType"] === 1) {
          lista.push(value["date"]);
          visitortimes.push(value["visitortimes"]);
          visitor.push(value["visitor"]);
          buyertimes.push(value["buyertimes"]);
          buyer.push(value["buyer"]);
          buyerconvrate.push(value["buyerconvrate"]);
        }
        if (value["flowType"] === 3) {
          advisitor.push(value["visitor"]);
        }
      });
      let newadvisitor = advisitor.map((item, index) => {
        let tmp = visitor[index];
        return tmp > 0 ? item / tmp : 0;
      });
      console.log("newadvisitor :" + newadvisitor);

      option.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option.series = [
        {
          name: "访问",
          type: "bar",
          tiled: "访问",
          areaStyle: { normal: {} },
          data: visitor
        },
        {
          name: "下单",
          type: "bar",
          tiled: "下单",
          areaStyle: { normal: {} },
          data: buyer
        },
        {
          name: "下单转化率",
          type: "line",
          yAxisIndex: 1,
          // tiled: '下单转化率',
          // areaStyle: {normal: {}},
          data: buyerconvrate
        }
      ];

      option1.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: lista
        }
      ];

      option1.series = [
        {
          name: "整体流量-下单人数",
          type: "line",
          tiled: "整体流量-下单人数",
          areaStyle: { normal: {} },
          data: buyer
        }
      ];

      var Chart1 = this.drawbar(option, "gotobedbar");
      // var Chart2 = this.drawbar(option1, 'gotobedbar1');
      // var Chart3 = this.drawbar(option2, 'gotobedbar2');
      // var Chart3 = this.drawbar(option3, "gotobedbar3");
    },

    getAllShop() {
      let shop_all = window.sessionStorage.getItem("ele-user-all-info");
      if (shop_all) {
        this.options = JSON.parse(shop_all);
        return;
      }
      this.$http
        .get(api.ELE_ALL_SHOP)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              let op = [
                {
                  value: -1,
                  label: "全部"
                }
              ];
              resData.forEach(function(va) {
                op.push({ value: String(va.shopId), label: va.shopName });
              });
              this.options = op;
              console.log(op);
              window.sessionStorage.setItem(
                "ele-user-all-info",
                JSON.stringify(op)
              );
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch();
    }
  },

  mounted() {
    this.getAllShop();
    let shop_info = window.sessionStorage.getItem("ele_shop_info");
    let changedate = window.sessionStorage.getItem("changedate");

    this.shopId = -1;
    console.log(shop_info);
    if (shop_info) {
      this.shopId = shop_info;
    }
    if (changedate) {
      this.date = changedate.split(",");
    } else {
      let dt = new Date();
      let endDate = dateFormat("YYYYmmdd", dt);
      dt.setDate(dt.getDate() - 30);
      let statrDate = dateFormat("YYYYmmdd", dt);
      console.log([statrDate, endDate]);
      this.date = [statrDate, endDate];
      window.sessionStorage.setItem("changedate", this.date);
    }

    this.$nextTick(function() {
      // this.drawbar('gotobedbar');
      var that = this;
      var resizeTimer = null;
      window.onresize = function() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          that.drawbar("gotobedbar");
        }, 300);
      };
    });
    this.onSubmit();
  }
};
</script>

<style scoped>
[id*="gotobedbar"] {
  min-height: 300px;
  margin-right: 15px;
  height: 300px !important;
}
</style>
