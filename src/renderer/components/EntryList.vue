<template>
  <div class="home">
    <ul ref="list" class="list">
      <li class="list-entry" v-for="entry in entries" :key="entry.id">
        <entry-preview
          :entry="entry"
          :onEdit="onEdit"
          :onRemove="onRemove"
          :onChangeDatetime="onChangeDatetime"
        />
      </li>
    </ul>
    <entry-editor
      v-if="!editing"
      :type="type"
      v-model="newEntry"
      :onSubmit="onSubmit"
      :onCancel="onCancel"
      :onKeyDown="onKeyDown"
    />
    <entry-editor
      v-else
      v-model="editing.content"
      :type="editing.type"
      :onSubmit="onSubmit"
      :onCancel="onCancel"
      :onKeyDown="onKeyDown"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer, shell, remote } from "electron";
import { mapState } from "vuex";
import VueSimplemde from "vue-simplemde";

import EntryEditor from "./EntryEditor";
import EntryPreview from "./EntryPreview";
import MyButton from "./MyButton";
import NotesEditor from "./NotesEditor";

export default {
  name: "read-it-later",
  data: function() {
    return {
      newEntry: "",
      type: "note",
      editing: false
    };
  },
  components: {
    VueSimplemde,
    NotesEditor,
    MyButton,
    EntryPreview,
    EntryEditor
  },
  computed: {
    entries() {
      return this.$store.getters.entries;
    }
  },
  updated() {
    this.scrollToEnd();
  },
  methods: {
    onEdit(entry) {
      this.editing = { ...entry };
      this.changeType("markdownNote");
    },
    onRemove(entry) {
      this.$store.dispatch("remove", entry.id);
    },
    onChangeDatetime(entry) {
      this.$store.dispatch("update", entry);
    },
    onKeyDown(e) {
      if (e.key !== "Enter" || !e.shiftKey) return;

      if (this.type === "markdownNote") {
        this.changeType("note");
      } else {
        this.changeType("markdownNote");
      }

      Vue.nextTick(() => this.scrollToEnd());
    },
    scrollToEnd: function() {
      const content = this.$refs.list;
      content.scrollTop = content.scrollHeight;
    },
    changeType(type) {
      this.type = type;
      if (this.editing) this.editing.type = type;
    },
    onCancel() {
      this.editing = null;
      this.changeType("note");
    },
    async onSubmit(e) {
      e.preventDefault();

      if (this.editing) {
        this.$store.dispatch("update", this.editing);
      } else {
        this.$store.dispatch("add", {
          content: this.newEntry
        });
      }

      this.editing = null;
      this.newEntry = "";
      this.changeType("note");
    }
  }
};
</script>

<style scoped>
.home {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0px 24px 24px;
}

.list {
  list-style-type: none;
  flex: 1;
  overflow-y: scroll;
}

.list-entry {
  overflow-x: hidden;
  border-left: 4px solid #333;
  padding: 8px 16px;
  margin-bottom: 24px;
}
</style>
