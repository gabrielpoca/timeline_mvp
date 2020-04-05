<template>
  <form v-if="type === 'note'" class="form" @submit="onSubmit">
    <div class="tick" v-bind:class="{ hidden: !focused && !value }">:</div>
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      @keydown="onKeyDown"
      @focus="focused = true"
      @blur="focused = false"
      class="input"
      type="text"
      ref="input"
    />
  </form>
  <notes-editor
    v-else
    :value="value"
    v-on:input="$emit('input', $event)"
    v-bind:keydown="onKeyDown"
    ref="input"
  ></notes-editor>
</template>

<script>
import MyButton from "./MyButton";
import NotesEditor from "./NotesEditor";

export default {
  props: ["value", "type", "onSubmit", "onKeyDown"],
  components: {
    MyButton,
    NotesEditor,
  },
  data: function () {
    return { focused: false };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-basis: 32px;
  flex-shrink: 0;
  flex-grow: 0;
  padding-top: 16px;
  flex-basis: 40px;
  align-items: center;
}

.tick {
  flex-grow: 0;
  flex-shrink: 0;
}

.input {
  flex: 1;
  padding: 0;
  margin-left: 2px;
  background: transparent;
  outline: none;
  color: inherit;
  border: 0;
}
</style>
