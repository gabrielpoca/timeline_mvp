<template>
  <div ref="list" class="container">
    <ul class="list">
      <li class="list-entry" v-for="entry in entries" :key="entry.id">
        <entry-preview
          :entry="entry"
          :onEdit="onEdit"
          :onRemove="onRemove"
          :onChangeDatetime="onChangeDatetime"
        />
      </li>
    </ul>
  </div>
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
