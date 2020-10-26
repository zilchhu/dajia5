<template>
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
              default-value="2010-10-01">
            </el-date-picker>
          </div>
        </el-form-item>

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

    <el-col :span="24">
      <el-table
        :data="tableData"
        border
        max-height="540"
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="name"
          label="名称"
          width="120"
        >
        </el-table-column>

        <el-table-column v-for="(item) in colunmName" :key="item" :label="item.substring(4)" :prop="item" sortable
                         align="center" width="60">
          <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
          <template slot-scope="scope">
            <span>{{ scope.row[item] }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import * as api from "../../api";
import {dateFormat} from "../../common/utils";


export default {
  name: "foodAmount",
  data() {
    return {
      tableData: [],
      colunmName: [],
      date: '',
      options: [{
        value: -1,
        label: '全部'
      }, {
        value: 2924399,
        label: '古御贡茶•手抓饼•小吃（大芬信和店）'
      }, {
        value: 4799060,
        label: '古御贡茶•手抓饼•小吃（龙岗罗马公元店）'
      }, {
        value: 6119122,
        label: '古御贡茶•手抓饼•小吃（龙岗爱联店）'
      }, {
        value: 6434760,
        label: '喜三德甜品•手工芋圆（龙岗爱联店）'
      }, {
        value: 6914754,
        label: '古御贡茶•手抓饼•小吃（横岗店）'
      }],
      shopId: -1,
    }
  },
  methods: {
    dateChange() {
      console.log('修改时间');
      window.sessionStorage.setItem("changedate", this.date);
      this.onSubmit()
    },
    selectOne(item) {
      window.sessionStorage.setItem("shop_info", item);
      this.onSubmit()
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
      this.$http.get(api.MT_FOODAMOUNT + "?" + times)
        .then(res => {
          console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            let resData = res.data.data;
            if (res.data.code === 0) {
              this.$message('操作成功');
              let dateList = resData['dateList']
              let ListMap = resData['ListMap']
              let li = []
/*              dateList.forEach(function (va) {
                let temp  = String(va)
                li.push(temp.substring(4))
              })*/
              this.colunmName = dateList.sort(function (a, b) { //callback
                if (a < b) { // a b 分别是Arr中的 56 21
                  return 1  //返回正数 ，b排列在a之前
                } else {
                  return -1 //返回负数 ，a排列在b之前
                }
              })
              this.tableData = ListMap
            } else {
              this.$message('数据为空')
            }
          }
        }).catch(e => {
        // this.$message('数据异常请联系管理员')
      })
    },
    getAllShop() {
      let shop_all = window.sessionStorage.getItem("user-all-info")
      if (shop_all) {
        this.options = JSON.parse(shop_all)
        return
      }
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
              window.sessionStorage.setItem("user-all-info", JSON.stringify(op));
            } else {
              this.$message('数据为空')
            }
          }
        }).catch(
      )
    },

    formatDates(row, column) {
      // 获取单元格数据
      let data = row[column.property]
      if (data == null) {
        return null
      }
      let dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
    },
    formatdiscount() {
      // 获取单元格数据
      let data = row[column.property]
      if (data == null) {
        return null
      }
      if (data === "2") {
        return "是"
      } else {
        return "否"
      }
    }

  },
  mounted() {
    this.getAllShop()
    let shop_info = window.sessionStorage.getItem("shop_info")
    let changedate = window.sessionStorage.getItem("changedate")

    this.shopId = -1
    console.log(shop_info)
    if (shop_info) {
      this.shopId = shop_info
    }
    if (changedate) {
      this.date = changedate.split(",")
    } else {
      let dt = new Date();
      let endDate = dateFormat("YYYYmmdd", dt)
      dt.setDate(dt.getDate() - 30)
      let statrDate = dateFormat("YYYYmmdd", dt)
      console.log([statrDate, endDate])
      this.date = [statrDate, endDate]
      window.sessionStorage.setItem("changedate", this.date);
    }

    this.$nextTick(function () {
      this.drawbar('gotobedbar');
      var that = this;
      var resizeTimer = null;
      window.onresize = function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          that.drawbar('gotobedbar');
        }, 300);
      }
    });
    this.onSubmit()
  },
}
</script>

<style scoped>
[id*=gotobedbar] {
  min-height: 300px;
  margin-right: 15px;
  height: 300px !important;
}
</style>
