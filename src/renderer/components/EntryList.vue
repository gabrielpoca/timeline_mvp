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
      ref="editor"
    />
    <entry-editor
      v-else
      v-model="editing.content"
      :type="editing.type"
      :onSubmit="onSubmit"
      :onCancel="onCancel"
      :onKeyDown="onKeyDown"
      ref="editor"
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

        if (this.type === "markdownNote") {
          this.changeType("note");
        } else {
          this.changeType("markdownNote");
        }

        Vue.nextTick(() => this.scrollToEnd());
      }

      if (e.key === "Escape") {
        if (this.editing) this.onCancel();
        e.target.blur();
      }
    },
    onCancel() {
      this.editing = null;
      this.changeType("note");
    },
    scrollToEnd: function() {
      const content = this.$refs.list;
      content.scrollTop = content.scrollHeight;
    },
    changeType(type) {
      this.type = type;
      if (this.editing) this.editing.type = type;
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
