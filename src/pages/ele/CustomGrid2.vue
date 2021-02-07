<template>
  <div ref="container">
    <div class="select-wrapper">
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
      <el-button @click="reset" size="mini">重置</el-button>
      <el-switch
        v-model="dark_mode"
        @change="dark_switch"
        active-text="夜间"
        inactive-text="夜间模式"
      >
      </el-switch>
    </div>

    <VueDragResize
      v-for="chart in charts"
      :key="chart.id"
      :isActive="false"
      :w="chart.rect ? chart.rect.width : 0"
      :h="chart.rect ? chart.rect.height : 0"
      :x="chart.rect ? chart.rect.left : 0"
      :y="chart.rect ? chart.rect.top : 0"
      v-on:resizing="e => resize(e, chart.id)"
      v-on:dragging="e => resize(e, chart.id)"
    >
      <div :id="`chart${chart.id}`" class="canvas"></div>
    </VueDragResize>
  </div>
</template>

<script>
import * as echarts from "echarts5";
import merge from "deepmerge";
import VueDragResize from "vue-drag-resize";

export default {
  name: "custom-grid",
  components: {
    VueDragResize
  },
  data() {
    return {
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
            moveHandleSize: 0,
            xAxisIndex: [0]
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            moveHandleSize: 0,
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
      dark_mode: false
    };
  },
  computed: {
    ids() {
      return this.$route.params.ids;
    }
  },
  methods: {
    run() {
      this.charts = this.charts.map((v, i) => {
        let w = (this.$refs.container.clientWidth - 60) / 3;
        let h = (w / 16) * 9;
        let row = Math.floor(i / 3),
          col = i % 3;
        let rect = localStorage.getItem(`${this.ids}/rect:${v.id}`)
          ? JSON.parse(localStorage.getItem(`${this.ids}/rect:${v.id}`))
          : {
              left: (w + 20) * col + 20,
              top: (h + 20) * row + 80,
              width: w,
              height: h
            };
        return { ...v, rect };
      });
      console.log(this.charts);

      this.charts = this.charts.map(v => {
        let dates = this.pickedDates,
          shopId = this.selectedShop,
          realShop = this.selectedRealShop;
        let sql2 = eval(v.sql);
        return {
          ...v,
          sql2
        };
      });
      this.postCustoms();
    },
    draw() {
      console.log("draw");
      this.charts = this.charts.map(v => {
        let option = {},
          data = v.data;
        eval(v.option);
        let option2 = merge(this.baseOpt, option);
        return {
          ...v,
          option2
        };
      });

      for (let v of this.charts) {
        if (v.chart) v.chart.dispose();
        let o = document.getElementById(`chart${v.id}`);
        let chart = echarts.init(o, this.dark_mode ? "dark" : "light");
        chart.setOption(v.option2);
        chart.resize()
        v.chart = chart;
        v.debounce_resize = this.debounce(chart.resize);
      }
      console.log(this.charts);
    },
    dark_switch() {
      this.draw();
    },
    selectShop(value) {
      localStorage.setItem("selectedShop", value);
      this.run();
    },
    selectRealShop(value) {
      localStorage.setItem("selectedRealShop", value);
      this.run();
    },
    pickDates(value) {
      console.log(value);
      localStorage.setItem("pickedDates", value);
      this.run();
    },
    resize(rect, id) {
      const newCharts = [...this.charts];
      const target = newCharts.filter(item => id === item.id)[0];
      if (target) {
        target[rect] = rect;
        this.charts = newCharts;
        localStorage.setItem(
          `${this.ids}/rect:${target.id}`,
          JSON.stringify(rect)
        );
        if (target.debounce_resize) target.debounce_resize();
      }
    },
    reset() {
      localStorage.removeItem("selectedShop");
      localStorage.removeItem("selectedRealShop");
      localStorage.removeItem("pickedDates");
      this.charts.map(v => localStorage.removeItem(`${this.ids}/rect:${v.id}`));
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
    getCharts() {
      this.$http
        .get("http://192.168.3.3:9020/charts")
        .then(res => {
          if (res.data) {
            this.charts =
              this.ids == "-1"
                ? res.data
                : res.data.filter(v => this.ids.split(",").includes(v.id + ""));
            console.log(this.ids);
            this.run();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    postCustoms() {
      console.log(this.charts.map(v => ({ id: v.id, sql: v.sql2 })));
      this.$http
        .post("http://192.168.3.3:9020/customs2", {
          sqls: this.charts.map(v => ({ id: v.id, sql: v.sql2 }))
        })
        .then(res => {
          if (res.data && !res.data.e) {
            this.charts = this.charts.map(v => ({
              ...v,
              data: res.data.find(k => k.id == v.id).data
            }));
            this.draw();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    debounce(fn) {
      let timeout = null;
      return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, arguments), 600);
      };
    },
    init() {
      this.selectedShop = localStorage.getItem("selectedShop") || "";
      this.selectedRealShop = localStorage.getItem("selectedRealShop") || "";
      this.pickedDates = localStorage.getItem("pickedDates")
        ? localStorage.getItem("pickedDates").split(",")
        : "";

      this.getShops();
      this.getRealShops();
      this.getCharts();
    }
  },
  created() {
    // localStorage.clear();
    this.init();
  },
  watch: {
    $route(route) {
      if (route.name == "customGrid2") {
        this.init()
      }
    }
  }
};
</script>

<style>
.el-input--mini .el-input__inner {
  width: 240px;
}

.canvas-wrapper {
  margin-top: 20px;
}

.canvas {
  background: #fff8f299;
  width: 100%;
  height: 100%;
}

.drag-handle {
  width: 100%;
  height: 1.2em;
  background: #ffab70;
  opacity: 0.2;
}
</style>
