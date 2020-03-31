<template>
  <div id="app">
    <titlebar />
    <router-view></router-view>
  </div>
</template>

<script>
import Titlebar from "./components/Titlebar";

export default {
  name: "read_it_later",
  components: {
    Titlebar
  }
};
</script>

<style>
@font-face {
  font-family: Merriweather;
  src: url(./assets/Merriweather-Regular.ttf);
}

@font-face {
  font-family: "Zilla Slab";
  src: url(./assets/Merriweather-Regular.ttf);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: inherit;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

body,
html {
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: "Zilla Slab";
  color: #333;
  overflow: hidden;
}

ul,
ol {
  list-style-position: inside;
}

ul {
  list-style-type: disc;
}

a {
  color: #333;
  font-size: inherit;
  text-decoration: underline;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: bold;
  font-family: Merriweather;
}

button,
input {
  font-size: inherit;
  font-family: inherit;
}

input::placeholder {
  font-size: 16px;
}
</style>
