<template>
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
</template>

<script>
import EntryPreview from "./EntryPreview";

export default {
  props: ["entries", "onEdit", "onRemove", "onChangeDatetime"],
  components: {
    EntryPreview
  },
  methods: {
    scrollToEnd: function() {
      const content = this.$refs.list;
      content.scrollTop = content.scrollHeight;
    }
  }
};
</script>

<style scoped>
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