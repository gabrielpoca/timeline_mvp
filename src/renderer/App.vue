<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "read_later"
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: inherit;
}

body,
html {
  width: 100%;
  height: 100%;
  font-size: 16px;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
