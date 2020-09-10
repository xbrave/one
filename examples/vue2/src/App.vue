<template>
  <div id="app">
    <div class="home">
      <h2>Vue.js Demo</h2>
      <p>vue version: {{ vueVersion }}, element-ui version: {{ elementVersion }}</p>
      <el-button @click="dialogVisible = true" type="text">click me</el-button>
       <hr></hr>
      <el-dialog :visible.sync="dialogVisible" title="测试弹框" width="30%">
        <span>测试测试</span>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">cancel</el-button>
          <el-button @click="dialogVisible = false" type="primary">ok</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import ElementUI from 'element-ui';
import Vue from 'vue';
export default {
  data() {
    return {
      dialogVisible: false,
      vueVersion: Vue.version,
      elementVersion: ElementUI.version,
    };
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding-bottom: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
