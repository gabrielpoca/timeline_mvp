<template>
  <div
    :class="{ 'entry-preview': true, 'entry-selected': selected }"
    @mouseleave="hover = false"
    @mouseover="hover = true"
    ref="entryPreview"
  >
    <div class="date">
      {{ date() }}
      <button
        class="nav-btn"
        v-if="hover && isTextNote()"
        @click="onEdit(entry)"
      >
        edit
      </button>
      <button class="nav-btn" v-if="hover" @click="onRemove">remove</button>
      <button
        v-if="hover"
        @click="$refs.datetime.isOpen = true"
        class="nav-btn"
      >
        change date
      </button>
      <datetime
        tabindex="-1"
        input-class="hidden"
        ref="datetime"
        type="datetime"
        v-model="createdAt"
        v-on:close="updateDatetime"
      ></datetime>
    </div>
    <router-link
      v-if="entry.type === 'read'"
      class="link"
      :to="{ name: 'readLater', params: { id: entry.id } }"
      >{{ entry.title || entry.url }}</router-link
    >
    <div v-else-if="entry.type === 'files'">
      <image-preview
        v-for="file in entry.files"
        v-bind:key="file.id"
        v-on:entry:loaded="$emit('entry:loaded')"
        :file-name="file.fileName"
      />
    </div>
    <markdown-preview v-else :source="entry.content" />
  </div>
</template>

<script>
import { format, parseISO } from "date-fns";
import { Datetime } from "vue-datetime";

import "vue-datetime/dist/vue-datetime.css";

import MarkdownPreview from "./MarkdownPreview";
import ImagePreview from "./ImagePreview";

export default {
  props: ["entry", "onEdit", "selected", "scrollToElement"],
  components: {
    Datetime,
    ImagePreview,
    MarkdownPreview,
  },
  data: function() {
    return {
      hover: false,
      createdAt: this.entry.createdAt.toString(),
    };
  },
  watch: {
    selected: function() {
      this.scrollToElement(this.$refs.entryPreview);
    },
  },
  methods: {
    isTextNote() {
      return this.entry.type === "note" || this.entry.type === "markdownNote";
    },

    date() {
      return format(new Date(this.entry.createdAt), "H:M - dd/MM");
    },
    updateDatetime() {
      this.onChangeDatetime({ ...this.entry, createdAt: this.createdAt });
    },
    onChangeDatetime() {
      this.$store.dispatch("update", this.entry);
    },
    onRemove() {
      this.$store.dispatch("remove", this.entry.id);
    },
  },
};
</script>

<style>
.vdatetime-popup__header,
.vdatetime-calendar__month__day--selected > span > span,
.vdatetime-calendar__month__day--selected > span > span:hover {
  background: #333;
}

.vdatetime-time-picker__item {
  color: #333;
}

.vdatetime-popup,
.vdatetime-popup__actions__button {
  color: black;
}
</style>

<style scoped>
.entry-selected {
  border-color: #7c7c7c !important;
}

.entry-preview {
  padding: 0 11px;
  margin: 0 13px;
  border-left: 1px dashed transparent;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
}

.nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-style: italic;
  margin-left: 8px;
  text-decoration: underline;
}

.date {
  color: #3b3b3b;
  font-size: 12px;
  font-style: italic;
  line-height: 16px;
  margin-bottom: 8px;
}
</style>
