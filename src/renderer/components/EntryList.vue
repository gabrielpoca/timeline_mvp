<template>
  <div ref="list" class="container">
    <ul class="list">
      <li class="list-entry" v-for="entry in entries" :key="entry.id">
        <entry-preview
          :selected="entry.id === selectedEntry"
          :entry="entry"
          :onEdit="onEdit"
          :scrollToElement="scrollToElement"
          v-on:entry:loaded="scrollToEnd"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import { debounce } from "lodash";

import EntryPreview from "./EntryPreview";

export default {
  props: ["onEdit"],
  components: {
    EntryPreview
  },
  created() {
    this.scrollToEnd();
  },
  computed: {
    entries: {
      get() {
        return this.$store.getters.entries;
      }
    },
    selectedEntry: {
      get() {
        return this.$store.getters.selectedEntry;
      },
      set(value) {
        this.$store.commit("selectedEntry", value);
      }
    }
  },
  watch: {
    entries(entries, oldEntries) {
      if (entries.length > oldEntries.length) this.scrollToEnd();
    }
  },
  methods: {
    scrollToElement: debounce(
      function(el) {
        el.scrollIntoView({
          block: "end",
          inline: "nearest"
        });
      },
      10,
      {
        leading: false,
        trailing: true
      }
    ),
    scrollToEnd: debounce(
      function() {
        const content = this.$refs.list;
        content.scrollTop = content.scrollHeight;
      },
      200,
      { leading: false, trailing: true }
    )
  }
};
</script>

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.list {
  flex: 1;
  list-style-type: none;
  display: flex;
  flex-direction: column;
}

.list-entry {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
}

.list-entry:not(:last-child) {
  margin-bottom: 24px;
}
</style>
