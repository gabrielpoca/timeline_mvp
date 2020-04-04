<template>
  <div class="home">
    <entry-list
      ref="list"
      :entries="entries"
      :onEdit="onEdit"
      :onRemove="onRemove"
      :onChangeDatetime="onChangeDatetime"
    />
    <entry-editor
      v-model="newContent"
      ref="editor"
      :type="newType"
      :onSubmit="onSubmit"
      :onCancel="onCancel"
      :onKeyDown="onKeyDown"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer, shell, remote } from "electron";

import EntryEditor from "./EntryEditor";
import EntryList from "./EntryList";

export default {
  name: "entries-page",
  components: {
    EntryEditor,
    EntryList,
  },
  computed: {
    entries: {
      get() {
        return this.$store.getters.entries;
      },
    },
    newContent: {
      get() {
        return this.$store.getters.newContent;
      },
      set(value) {
        this.$store.commit("updateContent", value);
      },
    },
    newType: {
      get() {
        return this.$store.getters.newType;
      },
    },
  },
  created() {
    window.addEventListener("keydown", this.onKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown);
  },
  updated() {
    this.scrollToEnd();
  },
  methods: {
    onEdit(entry) {
      this.$store.dispatch("edit", entry);
    },
    onRemove(entry) {
      this.$store.dispatch("remove", entry.id);
    },
    onChangeDatetime(entry) {
      this.$store.dispatch("update", entry);
    },
    onKeyDown(e) {
      if (e.target === window.document.body) {
        if (e.key === "i") {
          setTimeout(() => this.$refs.editor.focus(), 0);
        } else if (e.key === "e") {
          this.onEdit(this.entries[this.entries.length - 1]);
        } else {
        }
      }

      if (e.key === "Enter" && e.shiftKey) {
        e.stopPropagation();

        if (this.newType === "markdownNote") {
          this.$store.commit("changeType", "note");
        } else {
          this.$store.commit("changeType", "markdownNote");
        }

        Vue.nextTick(() => this.scrollToEnd());
      }

      if (e.key === "Escape") {
        this.onCancel();
        e.target.blur();
      }
    },
    onCancel() {
      this.$store.commit("cancel");
    },
    scrollToEnd: function () {
      this.$refs.list.scrollToEnd();
    },
    async onSubmit(e) {
      e.preventDefault();
      this.$store.dispatch("add");
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 40px 24px 24px;
}

.list {
  list-style-type: none;
  flex: 1;
  overflow-y: scroll;
}

.list-entry {
  overflow-x: hidden;
  margin-bottom: 32px;
}
</style>
