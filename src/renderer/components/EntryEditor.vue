<template>
  <form v-if="type === 'note'" class="form" @submit="onSubmit">
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      @keydown="onKeyDown"
      class="input"
      type="text"
      ref="input"
    />
    <my-button :onClick="onSubmit" :disabled="!value" type="submit">Save</my-button>
  </form>
  <notes-editor
    v-else
    :value="value"
    v-on:input="$emit('input', $event)"
    v-bind:onSubmit="onSubmit"
    v-bind:onCancel="onCancel"
    v-bind:keydown="onKeyDown"
    ref="input"
  ></notes-editor>
</template>

<script>
import MyButton from "./MyButton";
import NotesEditor from "./NotesEditor";

export default {
  props: ["value", "type", "onSubmit", "onKeyDown", "onCancel"],
  components: {
    MyButton,
    NotesEditor
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-basis: 32px;
  flex-shrink: 0;
  flex-grow: 0;
  margin-top: 24px;
}

.input {
  flex: 1;
  padding: 0 8px;
  background: transparent;
  color: inherit;
  border: 1px solid rgb(109, 109, 109);
}

.my-button {
  margin-left: 24px;
}
</style>
