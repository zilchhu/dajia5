<template lang="pug">
  el-row
    el-col(:span="24")
      el-table(:data = "ytTable")
        el-table-column(prop="" label="")
</template>

<script>
import { YT } from "../../api";
export default {
  data() {
    return {
      ytTable: []
    };
  },
  mounted() {
    this.fetchYtTable();
  },
  methods: {
    fetchYtTable() {
      this.$http
        .get("http://localhost:9002/yt")
        .then(res => res.data)
        .then(res => (this.ytTable = res));
    }
  }
};
</script>

<style scoped>
  .yt-table-container {
    width: 100%;
    overflow: scroll;
  }

  el-table {
    width: 100%;
  }
</style>
