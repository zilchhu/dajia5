<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="时间">
          <div class="block">
            <el-date-picker
              onchange="dateChange"
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
          <el-button type="primary" @click="onSubmit"
            >查询全部</el-button
          ></el-form-item
        >
      </el-form>
    </el-col>

    <el-col :span="24">
      <el-table :data="tableData" border style="width: 100%" 
        max-height="540" stripe>
        <el-table-column fixed prop="name" label="名称" width="120">
        </el-table-column>

        <el-table-column
          v-for="item in colunmName"
          :key="item"
          :label="item.substring(4)"
          :prop="item"
          sortable
          align="center"
          width="60"
        >
          <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
          <template slot-scope="scope">
            <span>{{ scope.row[item] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!-- <el-col :span="8">
      <div id="gotobedbar"></div>
    </el-col>

    <el-col :span="8">
      <div id="gotobedbar1"></div>
    </el-col> -->
  </el-row>
</template>

<script>
import * as api from "../../api";
import { dateFormat } from "../../common/utils";

import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default {
  name: "foodAmount",
  data() {
    return {
      tableData: [],
      distinctFoods: [],
      colunmName: [],
      date: "",
      options: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 2924399,
          label: "古御贡茶•手抓饼•小吃（大芬信和店）"
        },
        {
          value: 4799060,
          label: "古御贡茶•手抓饼•小吃（龙岗罗马公元店）"
        },
        {
          value: 6119122,
          label: "古御贡茶•手抓饼•小吃（龙岗爱联店）"
        },
        {
          value: 6434760,
          label: "喜三德甜品•手工芋圆（龙岗爱联店）"
        },
        {
          value: 6914754,
          label: "古御贡茶•手抓饼•小吃（横岗店）"
        }
      ],
      shopId: -1
    };
  },
  methods: {
    dateChange() {
      console.log("修改时间");
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit();
    },

    selectOne(item) {
      window.sessionStorage.setItem("shop_info", item);
    },
    onSubmit() {
      if (this.date.length === 0 || this.shopId === "") {
        this.$message({
          showClose: true,
          message: "请检查输入条件",
          type: "warning"
        });
        return;
      }
      const range = moment.range(
        moment(this.date[0], "YYYYMMDD"),
        moment(this.date[1], "YYYYMMDD")
      );
      const days = Array.from(range.by("day"))
        .map(v => v.format("YYYYMMDD"))
        .reverse();
      this.colunmName = days;
      this.$http
        .post("http://192.168.3.3:9020/custom", {
          sql: `SELECT 
                    shop_id,
                    item_name ,
                    sales_num ,
                    date
                  FROM ele_food_sales_info 
                  WHERE 
                    shop_id = ${this.shopId}
                    AND date BETWEEN ${this.date[0]} AND ${this.date[1]}
                  ORDER BY date DESC`
        })
        .then(res => {
          // console.log(res);
          if (res.status === 200 ) {
            let resData = res.data;
            if (resData.length > 0) {
              this.$message("操作成功");
              let dateList = [];
              let dfs = Array.from(new Set(resData.map(v => v.item_name)));
              this.distinctFoods = dfs.map(v => ({ text: v, value: v }));
              this.tableData = dfs.map(v => {
                let keys = days.reduce(
                  (c, k) => ({
                    ...c,
                    [k]: resData.find(l => l.item_name == v && l.date == k) ? resData.find(l => l.item_name == v && l.date == k).sales_num : ''
                  }),
                  {}
                );
                return {
                  name: v,
                  ...keys
                };
              });
              
              console.log(this.tableData)
            } else {
              this.$message("数据为空");
            }
          }
        })
        .catch(e => {});
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
    },
    formatDates(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
    formatdiscount() {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      if (data === "2") {
        return "是";
      } else {
        return "否";
      }
    },
    filterTag(value, row) {
      return row.title === value;
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
          // that.drawbar("gotobedbar");
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

.el-table__row {
  height: 1em;
}
</style>
