<template>
  <form v-if="newType === 'note'" class="form" @submit="onSubmit">
    <div class="tick" v-bind:class="{ hidden: !focused && !newContent }">:</div>
    <input
      v-model="newContent"
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
    v-model="newContent"
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
    newContent: {
      get() {
        return this.$store.getters.newContent;
      },
      set(value) {
        this.$store.commit("updateContent", value);
      }
    },
    newType: {
      get() {
        return this.$store.getters.newType;
      }
    }
  },
  data: function() {
    return { focused: false };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    async onSubmit(e) {
      e.preventDefault();
      this.$store.dispatch("add");
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
