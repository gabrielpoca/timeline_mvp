<template>
  <div ref="home" class="home">
    <entry-list ref="list" :onEdit="onEdit" />
    <entry-editor
      v-if="mode === 'insert'"
      ref="editor"
      :onKeyDown="onKeyDown"
    />
    <search-editor
      v-else-if="mode === 'search'"
      v-model="searchQuery"
      ref="search"
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
    SearchEditor,
  },
  computed: {
    searchQuery: {
      get() {
        return this.$store.getters.searchQuery;
      },
      set(value) {
        this.$store.dispatch("search", value);
      },
    },
    mode: {
      get() {
        return this.$store.getters.mode;
      },
      set(value) {
        this.$store.commit("mode", value);
      },
    },
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

    this.$refs.home.ondrop = (e) => {
      e.preventDefault();
      this.$store.dispatch("addFiles", e.dataTransfer.files);
      return false;
    };
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown);
  },
  methods: {
    onEdit(entry) {
      this.$store.dispatch("edit", entry);
    },
    onKeyDown(e) {
      if (e.target === window.document.body) {
        if (e.key === "i") {
          this.mode = "insert";
          e.preventDefault();
        } else if (e.key === "/") {
          this.mode = "search";
          e.preventDefault();
        } else if (e.key === "e") {
          this.onEdit();
        } else if (e.key === "j" || e.key === "ArrowDown") {
          this.$store.dispatch("selectDown");
        } else if (e.key === "k" || e.key === "ArrowUp") {
          this.$store.dispatch("selectUp");
        } else if (e.key === "t") {
          this.$store.commit("entriesFilter", "tasks");
        }
      }

      if (this.mode === "insert") {
        if (e.key === "Enter" && e.shiftKey) {
          e.stopPropagation();
          this.$store.commit("changeType");
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
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 40px 0 24px;
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
