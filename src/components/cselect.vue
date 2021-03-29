<template>
  <div style="display: flex;">
    <div  v-for="tab in tabs" :key="tab.key" class="wrapper" :class="{ wrapperSelected: tab.key == ActiveKey }" @click="() => select(tab.key)">
      <span class="title" :class="{ titleSelected: tab.key == ActiveKey }" >{{tab.title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "cselect",
  props: ["activeKey", "tabs"],
  data() {
    return {
      ActiveKey: this.activeKey
    };
  },
  methods: {
    select(key) {
      this.ActiveKey = key
      this.$emit('change', key)
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 236px;
  height: 84px;
  padding: 20px 0 20px 20px;
  margin-right: 10px;
  box-shadow: 0 2px 10px rgb(63 65 86 / 8%);
  background: white;
}

.title {
  font-weight: bold;
  color: #3f4156;
}

.titleSelected {
  color: #f89800;
}

.wrapperSelected {
  border: 1px solid #f89800;
}
</style>
