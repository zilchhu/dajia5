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
          <el-button type="primary" @click="onSubmit">查询全部</el-button>
          <el-button
            type="primary"
            @click="filterTable('店铺满减|智能满减|智能满减（旧版）|百亿补贴')"
            >满减</el-button
          >
          <el-button type="primary" @click="filterTable('减配送费')"
            >减配</el-button
          >
          <el-button type="primary" @click="filterTable('下单返红包')"
            >下单返</el-button
          >
          <el-button
            type="primary"
            @click="filterTable('吃货红包|超级吃货红包')"
            >会员红包</el-button
          >
          <el-button type="primary" @click="filterTable('门店新客立减')"
            >新客减</el-button
          >
          <el-button type="primary" @click="filterTable('店铺满赠')"
            >满赠</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        stripe
        :default-sort="{ prop: 'insertDate', order: 'descending' }"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <!-- <el-table-column prop="id" label="ID" width="100"> </el-table-column> -->
        <el-table-column prop="shop_id" label="店铺id" width="120">
        </el-table-column>
        <el-table-column
          prop="title"
          label="活动名称"
          width="120"
          :filters="distinctActs"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <!-- <template slot-scope="scope">
            <el-tag
              :type="scope.row.tag === '家' ? 'primary' : 'success'"
              close-transition
              >{{ scope.row.tag }}</el-tag
            >
          </template> -->
        </el-table-column>
        <el-table-column prop="rule" label="活动描述"> </el-table-column>
        <el-table-column
          prop="insertDate"
          label="查询时间"
          width="100"
          sortable
        >
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

export default {
  name: "foodAmount",
  data() {
    return {
      tableData: [],
      originData: [],
      distinctActs: [],
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
      this.$http
        .post("http://192.168.3.112:9020/custom", {
          sql: `SELECT shop_id, title , rule ,  DATE_FORMAT(insert_date, '%Y%m%d') insertDate
                      FROM ele_activity_full_reduction  
                      WHERE descs = '进行中'  AND conflict_message IS NULL 
                      AND shop_id = ${this.shopId} 
                      AND DATE(insert_date) BETWEEN ${this.date[0]} AND ${this.date[1]}
                      ORDER BY insert_date DESC `
        })
        .then(res => {
          console.log(res);
          if (res.status === 200 && res.data) {
            let resData = res.data;
            if (resData.length > 0) {
              this.$message("操作成功");
              let dateList = [];
              this.tableData = resData;
              this.originData = resData;
              this.distinctActs = Array.from(
                new Set(resData.map(v => v.title))
              ).map(v => ({ text: v, value: v }));
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
    },
    filterTable(titles) {
      this.tableData = this.originData.filter(v =>
        titles.split("|").includes(v.title)
      );
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
