<template>
  <div id="grid-container" ref="container">
    <el-select
      v-model="selectedChart"
      @change="selectChart"
      size="mini"
      filterable
      styele="width: 300px;"
    >
      <el-option
        v-for="chart in charts"
        :key="chart.id"
        :label="chart.title"
        :value="chart.id"
      >
        <span style="float: left">{{ chart.title }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          chart.id
        }}</span>
      </el-option>
    </el-select>
    <el-button @click="run" size="mini">run</el-button>
    <el-button
      @click="save"
      :disabled="selectedChart == 1 || selectedChart == 10"
      size="mini"
      >save</el-button
    >
    <el-button @click="add" size="mini">new</el-button>
    <el-date-picker
      v-model="pickedDates"
      @change="pickDates"
      type="daterange"
      align="right"
      unlink-panels
      value-format="yyyyMMdd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      size="mini"
    >
    </el-date-picker>
    <el-select
      id="shop-select"
      v-model="selectedShop"
      @change="selectShop"
      placeholder="请选择门店"
      size="mini"
      filterable
      styele="width: 300px;"
    >
      <el-option
        v-for="shop in shops"
        :key="shop.id"
        :label="shop.shopName"
        :value="shop.shopId"
      >
        <span style="float: left">{{ shop.shopName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          shop.platform
        }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="selectedRealShop"
      @change="selectRealShop"
      placeholder="请选择物理店"
      size="mini"
      filterable
      styele="width: 160px;"
    >
      <el-option
        v-for="realShop in realShops"
        :key="realShop.real_shop_name"
        :label="realShop.real_shop_name"
        :value="realShop.real_shop_name"
      >
        <span style="float: left">{{ realShop.real_shop_name }}</span>
      </el-option>
    </el-select>
    <el-switch
      v-model="dark_mode"
      @change="dark_switch"
      active-text="夜间"
      inactive-text="夜间模式"
    >
    </el-switch>
    <div style="display: flex;">
      <div style="flex-basis: 50%; margin-top: 20px;">
        <MonacoEditor
          width="100%"
          height="20px"
          :theme="editor_theme"
          language="text"
          style="margin-bottom: 20px;"
          v-model="value0"
        ></MonacoEditor>
        <MonacoEditor
          width="100%"
          height="300px"
          :theme="editor_theme"
          language="javascript"
          style="margin-bottom: 20px;"
          v-model="value"
        ></MonacoEditor>
        <MonacoEditor
          width="100%"
          height="400px"
          :theme="editor_theme"
          language="javascript"
          :modelOptions="{ tabSize: 2 }"
          v-model="value2"
          style="resize: both"
        ></MonacoEditor>
      </div>
      <VueDragResize
        :isActive="false"
        :w="width"
        :h="height"
        v-on:resizing="resize"
        v-on:dragging="resize"
        :y="88"
        :x="x"
      >
        <div id="canvas" ref="canvas"></div>
      </VueDragResize>
    </div>
  </div>
</template>

<script>
import MonacoEditor from "monaco-editor-vue";
import * as echarts from "echarts5";
import merge from "deepmerge";
import VueDragResize from "vue-drag-resize";

export default {
  name: "custom",
  components: {
    MonacoEditor,
    VueDragResize
  },
  data() {
    return {
      chart: null,
      value0: "",
      value: "",
      baseOpt: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        toolbox: {
          show: true,
          orient: "horizontal",
          color: ["#1e1eff"],
          feature: {
            mark: { show: true },
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
            moveHandleSize: 10,
            xAxisIndex: [0]
          },
          {
            type: "slider",
            show: true,
            moveHandleSize: 10,
            yAxisIndex: [0],
            left: "93%"
          },
          {
            type: "inside"
          }
        ],
        legend: {
          orient: "vertical",
          left: "right",
          top: "middle",
          itemGap: 20
        },
        yAxis: {
          type: "value"
        },
        title: {
          text: "图",
          left: "center"
        }
      },
      value2: "",
      shops: [],
      selectedShop: "",
      realShops: [],
      selectedRealShop: "",
      pickedDates: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      charts: [],
      selectedChart: 1,
      newId: -1,
      width: 400,
      height: 300,
      top: 0,
      left: 0,
      x: 0,
      dark_mode: false,
      editor_theme: "vs"
    };
  },
  methods: {
    run() {
      let shopId = this.selectedShop;
      let dates = this.pickedDates;
      let realShop = this.selectedRealShop;

      let sql = eval(this.value);

      this.postCustom(sql);
    },
    draw(d) {
      console.log(d);

      let option = {},
        data = d;

      eval(this.value2);

      console.log(option);
      console.log(merge(this.baseOpt, option, { arrayMerge: (_, source) => source }));

      this.chart.clear()
      this.chart.setOption(merge(this.baseOpt, option, { arrayMerge: (_, source) => source }), true)
    },
    save() {
      this.saveChart();
    },
    selectShop() {
      this.run();
    },
    selectRealShop() {
      this.run();
    },
    selectChart(chartId) {
      let c = this.charts.find(v => v.id == chartId);
      if (c) {
        this.value0 = c.title;
        this.value = c.sql;
        this.value2 = c.option;
      }
    },
    add() {
      this.charts = [
        ...this.charts,
        {
          id: this.newId,
          title: `无标题${-this.newId}`,
          sql: "``",
          option: "option = {}"
        }
      ];
      this.selectedChart = this.newId;
      this.selectChart(this.newId);
      this.newId -= 1;
    },
    pickDates() {
      this.isVarBinded();
      this.run();
    },
    dark_switch(mode) {
      this.editor_theme = mode ? "vs-dark" : "vs";
      this.chart.dispose();
      let o = document.getElementById("canvas");
      this.chart = echarts.init(o, mode ? "dark" : "light");
      this.run();
    },
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
      this.chart.resize();
    },
    getShops() {
      this.$http
        .get("http://192.168.3.3:9020/shops")
        .then(res => {
          this.shops = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    getRealShops() {
      this.$http
        .get("http://192.168.3.3:9020/shops/real")
        .then(res => {
          this.realShops = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    postCustom(sql) {
      console.log(sql);
      this.$http
        .post("http://192.168.3.3:9020/custom", { sql })
        .then(res => {
          this.draw(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    },
    getCharts() {
      this.$http
        .get("http://192.168.3.3:9020/charts")
        .then(res => {
          console.log(res.data);
          this.charts = res.data;
          this.selectChart(this.selectedChart);
        })
        .catch(err => {
          console.error(err);
        });
    },
    saveChart() {
      let chart = { title: this.value0, sql: this.value, option: this.value2 };
      let id = this.selectedChart;
      if (id < 0) {
        this.addChart();
        return;
      }
      this.$http
        .post("http://192.168.3.3:9020/chart/update", {
          id,
          chart
        })
        .then(res => {
          this.$message({
            message: JSON.stringify(res.data),
            type: "success"
          });
          if (res.data) {
            this.getCharts();
          }
        })
        .catch(err => {
          this.$message.error("save failed" + JSON.stringify(err));
        });
    },
    addChart() {
      let chart = { title: this.value0, sql: this.value, option: this.value2 };
      this.$http
        .post("http://192.168.3.3:9020/chart/add", { chart })
        .then(res => {
          this.$message({
            message: JSON.stringify(res.data),
            type: "success"
          });
          if (res.data) {
            this.getCharts();
            this.selectedChart = res.data[0];
            this.selectChart(res.data[0]);
          }
        })
        .catch(err => {
          this.$message.error("add failed" + JSON.stringify(err));
        });
    }
  },
  mounted() {
    let o = document.getElementById("canvas");
    this.chart = echarts.init(o, "light");
    this.x = this.$refs.container.clientWidth / 2 + 40;
    this.width = (this.$refs.container.clientWidth - 60) / 2;
    this.height = (this.width / 16) * 9;

    this.getShops();
    this.getRealShops();
    this.getCharts();
  }
};

// --color-scale-black: #1b1f23;
//     --color-scale-white: #fff;
//     --color-scale-gray-0: #fafbfc;
//     --color-scale-gray-1: #f6f8fa;
//     --color-scale-gray-2: #e1e4e8;
//     --color-scale-gray-3: #d1d5da;
//     --color-scale-gray-4: #959da5;
//     --color-scale-gray-5: #6a737d;
//     --color-scale-gray-6: #586069;
//     --color-scale-gray-7: #444d56;
//     --color-scale-gray-8: #2f363d;
//     --color-scale-gray-9: #24292e;
//     --color-scale-blue-0: #f1f8ff;
//     --color-scale-blue-1: #dbedff;
//     --color-scale-blue-2: #c8e1ff;
//     --color-scale-blue-3: #79b8ff;
//     --color-scale-blue-4: #2188ff;
//     --color-scale-blue-5: #0366d6;
//     --color-scale-blue-6: #005cc5;
//     --color-scale-blue-7: #044289;
//     --color-scale-blue-8: #032f62;
//     --color-scale-blue-9: #05264c;
//     --color-scale-green-0: #f0fff4;
//     --color-scale-green-1: #dcffe4;
//     --color-scale-green-2: #bef5cb;
//     --color-scale-green-3: #85e89d;
//     --color-scale-green-4: #34d058;
//     --color-scale-green-5: #28a745;
//     --color-scale-green-6: #22863a;
//     --color-scale-green-7: #176f2c;
//     --color-scale-green-8: #165c26;
//     --color-scale-green-9: #144620;
//     --color-scale-yellow-0: #fffdef;
//     --color-scale-yellow-1: #fffbdd;
//     --color-scale-yellow-2: #fff5b1;
//     --color-scale-yellow-3: #ffea7f;
//     --color-scale-yellow-4: #ffdf5d;
//     --color-scale-yellow-5: #ffd33d;
//     --color-scale-yellow-6: #f9c513;
//     --color-scale-yellow-7: #dbab09;
//     --color-scale-yellow-8: #b08800;
//     --color-scale-yellow-9: #735c0f;
//     --color-scale-orange-0: #fff8f2;
//     --color-scale-orange-1: #ffebda;
//     --color-scale-orange-2: #ffd1ac;
//     --color-scale-orange-3: #ffab70;
//     --color-scale-orange-4: #fb8532;
//     --color-scale-orange-5: #f66a0a;
//     --color-scale-orange-6: #e36209;
//     --color-scale-orange-7: #d15704;
//     --color-scale-orange-8: #c24e00;
//     --color-scale-orange-9: #a04100;
//     --color-scale-red-0: #ffeef0;
//     --color-scale-red-1: #ffdce0;
//     --color-scale-red-2: #fdaeb7;
//     --color-scale-red-3: #f97583;
//     --color-scale-red-4: #ea4a5a;
//     --color-scale-red-5: #d73a49;
//     --color-scale-red-6: #cb2431;
//     --color-scale-red-7: #b31d28;
//     --color-scale-red-8: #9e1c23;
//     --color-scale-red-9: #86181d;
//     --color-scale-purple-0: #f5f0ff;
//     --color-scale-purple-1: #e6dcfd;
//     --color-scale-purple-2: #d1bcf9;
//     --color-scale-purple-3: #b392f0;
//     --color-scale-purple-4: #8a63d2;
//     --color-scale-purple-5: #6f42c1;
//     --color-scale-purple-6: #5a32a3;
//     --color-scale-purple-7: #4c2889;
//     --color-scale-purple-8: #3a1d6e;
//     --color-scale-purple-9: #29134e;
//     --color-scale-pink-0: #ffeef8;
//     --color-scale-pink-1: #fedbf0;
//     --color-scale-pink-2: #f9b3dd;
//     --color-scale-pink-3: #f692ce;
//     --color-scale-pink-4: #ec6cb9;
//     --color-scale-pink-5: #ea4aaa;
//     --color-scale-pink-6: #d03592;
//     --color-scale-pink-7: #b93a86;
//     --color-scale-pink-8: #99306f;
//     --color-scale-pink-9: #6d224f;
</script>

<style>
#canvas {
  background: #fff8f2;
  width: 100%;
  height: 100%;
}
.drag-handle {
  width: 100%;
  height: 1.2em;
  background: #ffab70;
}
.el-input--mini .el-input__inner {
  width: 240px;
}
</style>
