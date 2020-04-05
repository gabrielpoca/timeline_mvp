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
    Titlebar,
  },
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

@font-face {
  font-family: "IBM Plex Sans";
  src: url(./assets/IBMPlexSans-Regular.ttf);
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
  line-height: 1.4em;
  font-family: "IBM Plex Sans";
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
  line-height: 1.4em;
}

button,
input {
  font-size: inherit;
  font-family: inherit;
}

input::placeholder {
  font-size: 16px;
}

.hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap; /* added line */
}
</style>
