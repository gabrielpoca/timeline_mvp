<template>
  <div ref="home" class="home">
    <entry-list
      ref="list"
      :entries="entries"
      :onEdit="onEdit"
      :onRemove="onRemove"
      :onChangeDatetime="onChangeDatetime"
    />
    <entry-editor
      v-if="mode === 'insert'"
      v-model="newContent"
      ref="editor"
      :type="newType"
      :onSubmit="onSubmit"
      :onKeyDown="onKeyDown"
    />
    <search-editor
      v-else-if="mode === 'search'"
      v-model="searchQuery"
      ref="search"
      :onSubmit="onSearch"
      :onKeyDown="onKeyDown"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer, shell, remote } from "electron";

import EntryEditor from "./EntryEditor";
import SearchEditor from "./SearchEditor";
import EntryList from "./EntryList";

export default {
  name: "entries-page",
  components: {
    EntryEditor,
    EntryList,
    SearchEditor
  },
  computed: {
    entries: {
      get() {
        return this.$store.getters.entries;
      }
    },
    searchQuery: {
      get() {
        return this.$store.getters.searchQuery;
      },
      set(value) {
        // this.$store.commit("searchQuery", value);
        this.$store.dispatch("search", value);
      }
    },
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
    },
    mode: {
      get() {
        return this.$store.getters.mode;
      },
      set(value) {
        this.$store.commit("mode", value);
      }
    }
  },
  created() {
    window.addEventListener("keydown", this.onKeyDown);
  },
  mounted() {
    this.$refs.home.ondragover = () => {
      return false;
    };

    this.$refs.home.ondragleave = () => {
      return false;
    };

    this.$refs.home.ondragend = () => {
      return false;
    };

    this.$refs.home.ondrop = e => {
      e.preventDefault();
      this.$store.dispatch("addFiles", e.dataTransfer.files);
      return false;
    };
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
    onSearch(e) {
      e.preventDefault();
      this.$store.dispatch("search");
    },
    onKeyDown(e) {
      if (e.target === window.document.body) {
        if (e.key === "i") {
          this.mode = "insert";
          setTimeout(() => this.$refs.editor.focus(), 0);
        } else if (e.key === "/") {
          this.mode = "search";
          setTimeout(() => this.$refs.search.focus(), 0);
        } else if (e.key === "e") {
          this.mode = "insert";
          this.onEdit(this.entries[this.entries.length - 1]);
        }
      }

      if (this.mode === "insert") {
        if (e.key === "Enter" && e.shiftKey) {
          e.stopPropagation();

          if (this.newType === "markdownNote") {
            this.$store.commit("changeType", "note");
          } else {
            this.$store.commit("changeType", "markdownNote");
          }

          Vue.nextTick(() => this.scrollToEnd());
        }

        if (e.key === "Enter" && e.metaKey) {
          this.$store.dispatch("add");
        }
      }

      if (e.key === "Escape") {
        this.$store.commit("cancel");
        e.target.blur();
      }
    },
    scrollToEnd: function() {
      this.$refs.list.scrollToEnd();
    },
    async onSubmit(e) {
      e.preventDefault();
      this.$store.dispatch("add");
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
