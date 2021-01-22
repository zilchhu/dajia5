<template>
  <div>
    <el-button @click="run" size="mini">run</el-button>
    <el-button @click="save" size="mini">save</el-button>
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
      v-model="selectedShop"
      @change="selectShop"
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
    <div style="display: flex;">
      <div style="flex-basis: 50%; margin-top: 20px;">
        <MonacoEditor
          width="100%"
          height="200px"
          theme="vs"
          language="sql"
          style="margin-bottom: 20px;"
          v-model="value"
        ></MonacoEditor>
        <MonacoEditor
          width="100%"
          height="600px"
          theme="vs"
          language="javascript"
          v-model="value2"
        ></MonacoEditor>
      </div>
      <div style="flex-grow: 1; margin-top: 20px; margin-left: 20px;">
        <div id="canvas" ref="canvas" height="400px"></div>
        <br />
        <p v-for="chart in charts" :key="chart.sql">
          {{ chart.sql }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from "monaco-editor-vue";
import echarts from "echarts";
import merge from "deepmerge";

export default {
  name: "custom",
  components: {
    MonacoEditor
  },
  data() {
    return {
      chart: null,
      value0: "",
      value: `\`SELECT * FROM foxx_operating_data 
  WHERE date BETWEEN \${dates[0]} AND \${dates[1]} 
    AND shop_id = \${shopId}\``,
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
            xAxisIndex: [0]
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            left: "93%"
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
      value2: `option = {
  title: {
    text: '单店收入'
  },
  xAxis: {
    data: data.map(v => v.date)
  },
  series: [
    { type: 'line', data: data.map(v => v.settlea) }
  ]
}`,
      shops: [],
      selectedShop: "",
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
          }
        ]
      }
    };
  },
  computed: {
    charts() {
      return localStorage.getItem("charts") || [];
    }
  },
  methods: {
    run() {
      let shopId = this.selectedShop;
      let dates = this.pickedDates;

      let sql = eval(this.value);

      this.postCustom(sql);
    },
    draw(d) {
      console.log(d);

      let option = {},
        data = d;

      eval(this.value2);

      console.log(merge(this.baseOpt, option));
      localStorage.setItem("value2", this.value2);
      this.chart.setOption(merge(this.baseOpt, option), true);
    },
    save() {
      let originCharts = localStorage.getItem("charts") || [];
      localStorage.setItem(
        "charts",
        JSON.stringify(originCharts.push({ sql: this.value, opt: this.value2 }))
      );
    },
    selectShop() {
      if (this.pickedDates) this.run();
    },
    pickDates() {
      if (this.selectedShop) this.run();
    },
    getShops() {
      this.$http
        .get("http://localhost:9020/shops")
        .then(res => {
          this.shops = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    postCustom(sql) {
      console.log(sql);
      this.$http
        .post("http://localhost:9020/custom", { sql })
        .then(res => {
          this.draw(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.canvas, "macarons");
    this.value2 = localStorage.getItem("value2") || this.value2;
    this.getShops();
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
  height: 400px;
}
.el-input--mini .el-input__inner {
  width: 260px;
}
</style>
