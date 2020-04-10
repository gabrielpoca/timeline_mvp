<template>
  <div>
    <img @click="modal = true" class="img" :src="src" />
    <div v-if="modal === true" @click="modal = false" class="modal">
      <img class="bigImage" :src="src" />
    </div>
  </div>
</template>

<script>
import { remote } from "electron";

const globalImages = remote.getGlobal("images");

export default {
  props: ["entry"],
  data: function() {
    return {
      src: null,
      modal: false
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
  cursor: pointer;
  max-height: 400px;
  max-width: 100%;
  object-fit: contain;
  object-position: left;
}

.modal {
  cursor: pointer;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.bigImage {
  max-width: 100%;
  max-height: 100%;
}
</style>