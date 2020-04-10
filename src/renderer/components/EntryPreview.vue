<template>
  <div class="entry-preview" @mouseleave="hover = false" @mouseover="hover = true">
    <div class="date">
      {{ date() }}
      <button class="nav-btn" v-if="hover && isTextNote()" @click="onEdit(entry)">edit</button>
      <button class="nav-btn" v-if="hover" @click="onRemove(entry)">remove</button>
      <button v-if="hover" @click="$refs.datetime.isOpen = true" class="nav-btn">change date</button>
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
    >{{ entry.title || entry.url }}</router-link>
    <button
      v-else-if="entry.type === 'link'"
      class="link"
      @click="openExternalLink(entry.url)"
    >{{ entry.url }}</button>
    <image-preview v-else-if="entry.type === 'img'" :entry="entry" />
    <vue-markdown v-else :source="entry.content" />
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import { shell } from "electron";
import { format, parseISO } from "date-fns";
import { Datetime } from "vue-datetime";

import "vue-datetime/dist/vue-datetime.css";

import ImagePreview from "./ImagePreview";

export default {
  props: ["entry", "onEdit", "onRemove", "onChangeDatetime"],
  components: {
    VueMarkdown,
    Datetime,
    ImagePreview
  },
  data: function() {
    return {
      hover: false,
      createdAt: this.entry.createdAt.toString()
    };
  },
  methods: {
    openExternalLink(url) {
      shell.openExternal(url);
    },
    isTextNote() {
      return this.entry.type === "note" || this.entry.type === "markdownNote";
    },

    date() {
      return format(new Date(this.entry.createdAt), "H:M - dd/MM");
    },
    updateDatetime() {
      this.onChangeDatetime({ ...this.entry, createdAt: this.createdAt });
    }
  }
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
.entry-preview {
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

.link {
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  white-space: nowrap;
}

>>> h1 {
  font-size: 1.5rem;
}

>>> h2 {
  font-size: 1.2rem;
}

>>> h3 {
  font-size: 1.1rem;
}

>>> h4 {
  font-size: 1rem;
}

>>> h1:not(:last-child),
>>> h2:not(:last-child),
>>> h3:not(:last-child),
>>> h4:not(:last-child),
>>> h5:not(:last-child),
>>> ul:not(:last-child),
>>> ol:not(:last-child),
>>> h1:not(:last-child),
>>> h2:not(:last-child),
>>> h3:not(:last-child),
>>> p:not(:last-child),
>>> pre:not(:last-child) {
  margin-bottom: 16px;
}

>>> pre {
  background: #f7f7f7;
  padding: 16px;
  margin: 0px;
  white-space: normal;
}
</style>
