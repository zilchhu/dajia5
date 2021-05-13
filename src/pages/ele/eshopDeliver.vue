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

    <el-table
      :data="tableData"
      border
      :style="`width: 100%; margin-top: ${this.bottomPos}px;`"
      stripe
      :default-sort="{ prop: '日期', order: 'descending' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <!-- <el-table-column prop="id" label="ID" width="100"> </el-table-column> -->
      <el-table-column prop="合作方案" label="合作方案" width="120">
      </el-table-column>
      <el-table-column prop="抽佣服务费" label="抽佣服务费" width="80">
      </el-table-column>
      <el-table-column prop="抽佣保底价" label="抽佣保底价" width="80">
      </el-table-column>
      <el-table-column prop="物流系统费" label="物流系统费" width="80">
      </el-table-column>
      <el-table-column prop="时段加价" label="时段加价">
      </el-table-column>
      <el-table-column prop="距离加价" label="距离加价">
      </el-table-column>
      <el-table-column prop="价格加价" label="价格加价">
      </el-table-column>
      <el-table-column prop="日期" label="日期" width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as echarts from "echarts5";
import merge from "deepmerge";
import VueDragResize from "vue-drag-resize";
import { menuList } from "../../services/sys";

export default {
  name: "eshopDeliver",
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
            moveHandleSize: 6,
            xAxisIndex: [0]
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: [0],
            moveHandleSize: 6,
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
      shops: [],
      selectedShop: "",
      realShops: [],
      selectedRealShop: "",
      pickedDates: "20210301至20210303",
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
      dark_mode: false,
      platform: "饿了么",
      ids: "19,20,21",
      tableData: [],
      bottomPos: 400
    };
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
        this.bottomPos = rect.top + rect.height
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
        let option2 = merge(this.baseOpt, option, {
          arrayMerge: (_, source) => source
        });
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
        chart.resize();
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
      let shop = this.shops.find(v => v.shopId == value);
      shop.platform == "美团"
        ? window.sessionStorage.setItem("shop_info", value)
        : window.sessionStorage.setItem("ele_shop_info", value);
      this.run();
    },
    selectRealShop(value) {
      localStorage.setItem("selectedRealShop", value);
      this.run();
    },
    pickDates(value) {
      console.log(value);
      window.sessionStorage.setItem("changedate", value.join(","));
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
        .get("http://192.168.3.112:9020/shops")
        .then(res => {
          this.shops = res.data;
          if (/美团|饿了么/.test(this.platform))
            this.shops = this.shops.filter(v => v.platform == this.platform);
        })
        .catch(err => {
          console.error(err);
        });
    },
    getRealShops() {
      this.$http
        .get("http://192.168.3.112:9020/shops/real")
        .then(res => {
          this.realShops = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    getCharts() {
      this.$http
        .get("http://192.168.3.112:9020/charts")
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
        .post("http://192.168.3.112:9020/customs2", {
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
    onSubmit() {
      if (this.pickedDates.length === 0 || this.selectedShop === "") {
        this.$message({
          showClose: true,
          message: "请检查输入条件",
          type: "warning"
        });
        return;
      }
      this.$http
        .post("http://192.168.3.112:9020/custom", {
          sql: `SELECT
                    packName 合作方案, 
                    chargeRate 抽佣服务费,
                    basePrice 抽佣保底价, 
                    servicePrice 物流系统费, 
                    timeAdditionalPrices 时段加价,
                    distanceAdditionalPrices 距离加价,
                    costAdditionalPrice 价格加价, 
                    DATE_FORMAT(insert_date, "%Y%m%d") 日期
                    FROM
                    ele_packs_contract_service
                    WHERE
                    shop_id = ${this.selectedShop}
                    AND DATE_FORMAT(insert_date, "%Y%m%d") BETWEEN ${this.pickedDates[0]} AND ${this.pickedDates[1]} 
                    ORDER BY
                    insert_date DESC`
        })
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data) {
            let resData = res.data;
            if (resData.length > 0) {
              this.$message("操作成功");
              let dateList = [];
              this.tableData = resData;
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {});
    },
    init() {
      if (/美团|饿了么/.test(this.platform))
        this.shops = this.shops.filter(v => v.platform == this.platform);
      this.selectedShop =
        (this.platform == "饿了么"
          ? window.sessionStorage.getItem("ele_shop_info")
          : window.sessionStorage.getItem("shop_info")) || "";

      this.selectedRealShop = localStorage.getItem("selectedRealShop") || "";
      this.pickedDates = window.sessionStorage.getItem("changedate")
        ? window.sessionStorage.getItem("changedate").split(",")
        : "";

      this.getShops();
      this.getRealShops();
      this.getCharts();
      this.onSubmit();
    }
  },
  created() {
    // localStorage.clear();
    this.init();
  },
  watch: {
    selectedShop() {
      this.init()
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
