<template>
  <div id="app">
    <div id="nav">
      <el-button @click="dialogVisible = true" type="text">Open Dialog</el-button>
      <el-dialog :before-close="handleClose" :visible.sync="dialogVisible" title="Dialog" width="30%">
        <span>dialog message</span>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">cancel</el-button>
          <el-button @click="dialogVisible = false" type="primary">ok</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm('Sure to close？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
