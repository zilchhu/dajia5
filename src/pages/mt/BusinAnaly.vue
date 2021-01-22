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
      <el-col :span="16">
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
    </el-row>
  </div>
</template>

<script>
import * as api from "../../api";
import { dateFormat } from "../../common/utils";
import echarts from "echarts";

const getBeforeDate = (n) => {
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

var titles = ["全部流量", "自然流量", "付费流量"];

const option = {
  title: {
    text: "全部流量-曝光",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["商家列表", "首页展位", "搜索", "其它", "频道页展位"],
    // orient: 'vertical',
    // left: 'right',
    // top: 'middle',//如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    // itemGap: 20
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  yAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  xAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "商家列表",
      type: "bar",
      tiled: "商家列表",
      label: {
        show: true,
        position: "insideRight",
      },
      stack: "流量",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "首页展位",
      type: "bar",
      tiled: "首页展位",
      stack: "总量",
      label: {
        show: true,
        position: "insideRight",
      },
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "搜索",
      type: "bar",
      tiled: "搜索",
      stack: "总量",
      label: {
        show: true,
        position: "insideRight",
      },
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "其它",
      type: "bar",
      stack: "总量",
      label: {
        show: true,
        position: "insideRight",
      },
      tiled: "其它",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "频道页展位",
      type: "bar",
      stack: "总量",
      label: {
        show: true,
        position: "insideRight",
      },
      tiled: "频道页展位",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};
const option1 = {
  title: {
    text: "自然流量-曝光",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["商家列表", "其它", "搜索", "首页展位", "频道页展位"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "商家列表",
      type: "bar",
      tiled: "商家列表",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "其它",
      type: "bar",
      tiled: "其它",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "搜索",
      type: "bar",
      tiled: "搜索",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "首页展位",
      type: "bar",
      tiled: "首页展位",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "频道页展位",
      type: "bar",
      tiled: "频道页展位",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};
const option2 = {
  title: {
    text: "付费流量-曝光",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["品牌展示", "点金推广", "揽客宝"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "品牌展示",
      type: "line",
      tiled: "品牌展示",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "点金推广",
      type: "line",
      tiled: "点金推广",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "揽客宝",
      type: "line",
      tiled: "揽客宝",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};

const option3 = {
  title: {
    text: "全部流量-点击率",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["商家列表", "首页展位", "搜索", "其它", "频道页展位"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "商家列表",
      type: "line",
      tiled: "商家列表",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "首页展位",
      type: "line",
      tiled: "首页展位",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "搜索",
      type: "line",
      tiled: "搜索",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "其它",
      type: "line",
      tiled: "其它",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "频道页展位",
      type: "line",
      tiled: "频道页展位",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};
const option4 = {
  title: {
    text: "自然流量-点击率",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["商家列表", "其它", "搜索", "首页展位", "频道页展位"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "商家列表",
      type: "line",
      tiled: "商家列表",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "其它",
      type: "line",
      tiled: "其它",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "搜索",
      type: "line",
      tiled: "搜索",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "首页展位",
      type: "line",
      tiled: "首页展位",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "频道页展位",
      type: "line",
      tiled: "频道页展位",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};
const option5 = {
  title: {
    text: "付费流量-点击率",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["品牌展示", "点金推广", "揽客宝"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "品牌展示",
      type: "line",
      tiled: "品牌展示",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "点金推广",
      type: "line",
      tiled: "点金推广",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "揽客宝",
      type: "line",
      tiled: "揽客宝",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "为你优选",
      type: "line",
      tiled: "为你优选",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};

const option6 = {
  title: {
    text: "曝光付费占比",
    left: "auto",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },

  legend: {
    data: ["比重"],
    orient: "vertical",
    left: "right",
    top: "middle", //如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
    itemGap: 20,
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
    color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"],
    feature: {
      mark: { show: true },
      // dataView: {show: true, readOnly: false},
      magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  dataZoom: [
    {
      type: "slider",
      show: true,
      xAxisIndex: [0],
    },
    {
      type: "slider",
      show: true,
      yAxisIndex: [0],
      left: "93%",
      start: 100,
      end: 1,
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: getBeforeDate(30),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "品牌展示",
      type: "line",
      tiled: "品牌展示",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "点金推广",
      type: "line",
      tiled: "点金推广",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "揽客宝",
      type: "line",
      tiled: "揽客宝",
      areaStyle: { normal: {} },
      data: [],
    },
    {
      name: "为你优选",
      type: "line",
      tiled: "为你优选",
      areaStyle: { normal: {} },
      data: [],
    },
  ],
};

export default {
  name: "BusinAnaly",
  data() {
    return {
      date: "",
      shopId: "",
      options: [],
    };
  },
  methods: {
    dateChange() {
      console.log("修改时间");
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit();
    },
    formtasdata(dateSours) {
      var list = [];

      dateSours.forEach(function (value) {
        let vl = parseFloat(value) < 0 ? 0 : parseFloat(value);
        if (isNaN(vl)) {
          vl = 0;
        }
        list.push(vl);
      });
      // console.log("格式数据", list);
      return list;
    },


    selectOne(item) {
      window.sessionStorage.setItem("shop_info", item);
      this.onSubmit();
    },
    drawbar(id, option) {
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
      if (this.date.length === 0 || this.shopId === "") {
        this.$message({
          showClose: true,
          message: "请检查输入条件",
          type: "warning",
        });
        return;
      }
      let times =
        "startTime=" +
        this.date[0] +
        "&endTime=" +
        this.date[1] +
        "&shopId=" +
        this.shopId;
      this.$http
        .get(api.MT_BUSIN_ANALY + "?" + times)
        .then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;
            if (res.data.code === 0) {
              this.$message("操作成功");
              window.sessionStorage.setItem("shop_info", this.shopId);
              this.updateBase(resData);
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch((e) => {
          // this.$message('数据异常请联系管理员')
        });
    },

    updateBase(dateSours) {
      let all_Clickrate = dateSours["Clickrate0"];
      let physic_Clickrate = dateSours["Clickrate1"];
      let Paid_Clickrate = dateSours["Clickrate2"];

      let all_Exposecnt = dateSours["Exposecnt0"];
      let physic_Exposecnt = dateSours["Exposecnt1"];
      let Paid_Exposecnt = dateSours["Exposecnt2"];

      let date = dateSours["date"]["商家列表"];

      let allList = [];
      let allExposecnt1 = this.formtasdata(all_Exposecnt["商家列表"]);
      let allExposecnt2 = this.formtasdata(all_Exposecnt["首页展位"]);
      let allExposecnt3 = this.formtasdata(all_Exposecnt["搜索"]);
      let allExposecnt4 = this.formtasdata(all_Exposecnt["其它"]);
      let allExposecnt5 = this.formtasdata(all_Exposecnt["频道页展位"]);
      let nu = allExposecnt1.length;
      console.log(1111111);
      console.log(allExposecnt1)
      for (let insex = 0; insex < nu; insex++) {
        console.log(allExposecnt1[insex]);
        let nu1 = isNaN(allExposecnt1[insex]) ? 0 : allExposecnt1[insex];
        let nu2 = isNaN(allExposecnt2[insex]) ? 0 : allExposecnt2[insex];
        let nu3 = isNaN(allExposecnt3[insex]) ? 0 : allExposecnt3[insex];
        let nu4 = isNaN(allExposecnt4[insex]) ? 0 : allExposecnt4[insex];
        let nu5 = isNaN(allExposecnt5[insex]) ? 0 : allExposecnt5[insex];
        allList.push(nu1 + nu2 + nu3 + nu4 + nu5);
      }
      console.log(nu);

      let Paidexposecnt1 = this.formtasdata(Paid_Exposecnt["品牌展示"]);
      let Paidexposecnt2 = this.formtasdata(Paid_Exposecnt["点金推广"]);
      let Paidexposecnt3 = this.formtasdata(Paid_Exposecnt["揽客宝"]);
      let Paidexposecnt4 = this.formtasdata(Paid_Exposecnt["铂金展位"]);

      let paidlist = [];
      let nu1 = Paidexposecnt1.length;
      for (let i = 0; i < nu1; i++) {
        let nu1 = isNaN(Paidexposecnt1[i]) ? 0 : Paidexposecnt1[i];
        let nu2 = isNaN(Paidexposecnt2[i]) ? 0 : Paidexposecnt2[i];
        let nu3 = isNaN(Paidexposecnt3[i]) ? 0 : Paidexposecnt3[i];
        let nu4 = isNaN(Paidexposecnt4[i]) ? 0 : Paidexposecnt4[i];
        paidlist.push(nu1 + nu2 + nu3 + nu4);
      }
      let aug = [];
      for (let i = 0; i < paidlist.length; i++) {
        if (allList[i] == 0) {
          aug.push(0);
        } else {
          aug.push((paidlist[i] / allList[i]).toFixed(4));
        }
      }

      option.yAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option.series = [
        {
          name: "商家列表",
          type: "bar",
          tiled: "商家列表",
          stack: "总量",
          label: {
            show: true,
            position: "insideRight",
          },
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Exposecnt["商家列表"]),
        },
        {
          name: "首页展位",
          type: "bar",
          tiled: "首页展位",
          stack: "总量",
          label: {
            show: true,
            position: "insideRight",
          },
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Exposecnt["首页展位"]),
        },
        {
          name: "搜索",
          type: "bar",
          tiled: "搜索",
          stack: "总量",
          label: {
            show: true,
            position: "insideRight",
          },
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Exposecnt["搜索"]),
        },
        {
          name: "其它",
          type: "bar",
          tiled: "其它",
          stack: "总量",
          label: {
            show: true,
            position: "insideRight",
          },
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Exposecnt["其它"]),
        },
        {
          name: "频道页展位",
          type: "bar",
          tiled: "频道页展位",
          stack: "总量",
          label: {
            show: true,
            position: "insideRight",
          },
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Exposecnt["频道页展位"]),
        },
      ];
      option1.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option1.series = [
        {
          name: "商家列表",
          type: "line",
          tiled: "商家列表",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Exposecnt["商家列表"]),
        },
        {
          name: "其它",
          type: "line",
          tiled: "其它",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Exposecnt["其它"]),
        },
        {
          name: "搜索",
          type: "line",
          tiled: "搜索",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Exposecnt["搜索"]),
        },
        {
          name: "首页展位",
          type: "line",
          tiled: "首页展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Exposecnt["首页展位"]),
        },
        {
          name: "频道页展位",
          type: "line",
          tiled: "频道页展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Exposecnt["频道页展位"]),
        },
      ];
      option2.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option2.series = [
        {
          name: "品牌展示",
          type: "line",
          tiled: "品牌展示",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Exposecnt["品牌展示"]),
        },
        {
          name: "点金推广",
          type: "line",
          tiled: "点金推广",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Exposecnt["点金推广"]),
        },
        {
          name: "揽客宝",
          type: "line",
          tiled: "揽客宝",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Exposecnt["揽客宝"]),
        },
        {
          name: "铂金展位",
          type: "line",
          tiled: "铂金展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Exposecnt["铂金展位"]),
        },
      ];

      option3.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option3.series = [
        {
          name: "商家列表",
          type: "line",
          tiled: "商家列表",
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Clickrate["商家列表"]),
        },
        {
          name: "首页展位",
          type: "line",
          tiled: "首页展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Clickrate["首页展位"]),
        },
        {
          name: "搜索",
          type: "line",
          tiled: "搜索",
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Clickrate["搜索"]),
        },
        {
          name: "其它",
          type: "line",
          tiled: "其它",
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Clickrate["其它"]),
        },
        {
          name: "频道页展位",
          type: "line",
          tiled: "频道页展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(all_Clickrate["频道页展位"]),
        },
      ];
      option4.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option4.series = [
        {
          name: "商家列表",
          type: "line",
          tiled: "商家列表",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Clickrate["商家列表"]),
        },
        {
          name: "其它",
          type: "line",
          tiled: "其它",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Clickrate["其它"]),
        },
        {
          name: "搜索",
          type: "line",
          tiled: "搜索",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Clickrate["搜索"]),
        },
        {
          name: "首页展位",
          type: "line",
          tiled: "首页展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Clickrate["首页展位"]),
        },
        {
          name: "频道页展位",
          type: "line",
          tiled: "频道页展位",
          areaStyle: { normal: {} },
          data: this.formtasdata(physic_Clickrate["频道页展位"]),
        },
      ];
      option5.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option5.series = [
        {
          name: "品牌展示",
          type: "line",
          tiled: "品牌展示",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Clickrate["品牌展示"]),
        },
        {
          name: "点金推广",
          type: "line",
          tiled: "点金推广",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Clickrate["点金推广"]),
        },
        {
          name: "揽客宝",
          type: "line",
          tiled: "揽客宝",
          areaStyle: { normal: {} },
          data: this.formtasdata(Paid_Clickrate["揽客宝"]),
        },
      ];
      option6.xAxis = [
        {
          type: "category",
          boundaryGap: true,
          data: date,
        },
      ];
      option6.series = [
        {
          name: "曝光收费占比",
          type: "line",
          tiled: "品牌展示",
          areaStyle: { normal: {} },
          data: aug,
        },
      ];
      this.drawbar("gotobedbar", option);
      this.drawbar("gotobedbar1", option1);
      this.drawbar("gotobedbar2", option2);
      this.drawbar("gotobedbar3", option3);
      this.drawbar("gotobedbar4", option4);
      this.drawbar("gotobedbar5", option5);
      this.drawbar("gotobedbar6", option6);
    },

    getAllShop() {
      let shop_all = window.sessionStorage.getItem("user-all-info");
      if (shop_all) {
        this.options = JSON.parse(shop_all);
        return;
      }
      this.$http
        .get(api.MT_ALL_SHOP)
        .then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;

            if (resData.length > 0) {
              this.$message("操作成功");
              let op = [
                {
                  value: -1,
                  label: "全部",
                },
              ];
              resData.forEach(function (va) {
                op.push({ value: va.wmpoiid, label: va.reptileType });
              });
              this.options = op;
              console.log(op);
              window.sessionStorage.setItem(
                "user-all-info",
                JSON.stringify(op)
              );
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch();
    },
  },

  mounted() {
    this.getAllShop();
    let shop_info = window.sessionStorage.getItem("shop_info");
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

    this.$nextTick(function () {
      // this.drawbar('gotobedbar');
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawbar("gotobedbar");
        }, 300);
      };
    });
    this.onSubmit();
  },
};
</script>

<style scoped>
[id*="gotobedbar"] {
  min-height: 300px;
  margin-right: 15px;
  height: 300px !important;
}
#gotobedbar {
  height: 500px !important;
}
</style>
