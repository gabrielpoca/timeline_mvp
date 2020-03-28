<template>
  <img class="img" :src="src" />
</template>

<script>
import { remote } from "electron";

const globalImages = remote.getGlobal("images");

export default {
  props: ["entry"],
  data: function() {
    return {
      src: null
    };
  },
  created() {
    this.loadImage();
  },
  methods: {
    async loadImage() {
      const buf = await globalImages.get(this.entry.fileName);
      this.src = "data:image/jpeg;base64," + buf.toString("base64");
    }
  }
};
</script>

<style scoped>
.img {
  max-width: 100%;
  width: 100%;
}
</style>