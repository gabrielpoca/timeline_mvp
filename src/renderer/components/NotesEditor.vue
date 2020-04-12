<template>
  <div class="notes-editor">
    <vue-simplemde
      ref="editor"
      :configs="config"
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      @keydown="keydown"
    />
  </div>
</template>

<script>
import VueSimplemde from "vue-simplemde";

import MyButton from "./MyButton";

export default {
  props: ["value", "keydown"],
  components: {
    VueSimplemde,
    MyButton
  },
  data: function() {
    return {
      config: {
        autofocus: true,
        toolbar: false,
        toolbarTips: false,
        status: false,
        placeholder: "Type here..."
      }
    };
  },
  methods: {
    focus() {
      this.$refs.editor.simplemde.codemirror.focus();
    }
  }
};
</script>

<style scoped>
.notes-editor {
  flex-shrink: 1;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}
</style>

<style>
@import "~simplemde-theme-base/dist/simplemde-theme-base.min.css";

.vue-simplemde {
  border: 1px solid #eee;
  padding: 8px;
  overflow-y: scroll;
}

.CodeMirror {
  border: 0;
  padding: 0;
  height: 300px;
  overflow-y: scroll;
}
</style>
