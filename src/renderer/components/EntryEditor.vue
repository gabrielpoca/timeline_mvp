<template>
  <form v-if="type === 'note'" class="form" @submit="onSubmit">
    <div class="tick" v-bind:class="{ hidden: !focused && !content }">:</div>
    <input
      v-model="content"
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
    v-model="content"
    v-bind:keydown="onKeyDown"
    ref="input"
  ></notes-editor>
</template>

<script>
import MyButton from "./MyButton";
import NotesEditor from "./NotesEditor";

export default {
  props: ["onKeyDown"],
  components: {
    MyButton,
    NotesEditor
  },
  computed: {
    content: {
      get() {
        return this.$store.state.Editor.content;
      },
      set(value) {
        this.$store.commit("Editor/content", value);
      }
    },
    type() {
      return this.$store.state.Editor.type;
    }
  },
  data: function() {
    return { focused: false };
  },
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.$store.dispatch("Editor/save");
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
  padding: 16px 24px 0;
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
