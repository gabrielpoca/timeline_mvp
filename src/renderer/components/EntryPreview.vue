<template>
  <div @mouseleave="hover = false" @mouseover="hover = true">
    <div class="date">
      {{ date() }}
      <button class="nav-btn" v-if="hover && isTextNote()" @click="onEdit(entry)">edit</button>
      <button class="nav-btn" v-if="hover" @click="onRemove(entry)">remove</button>
      <button @click="$refs.datetime.isOpen = true" class="nav-btn" v-if="hover">change date</button>
      <datetime
        input-class="hidden"
        ref="datetime"
        type="datetime"
        v-model="createdAt"
        v-on:close="updateDatetime"
      ></datetime>
    </div>
    <router-link
      v-if="entry.type === 'read'"
      :to="{ name: 'readLater', params: { id: entry.id } }"
      class="link"
    >{{ entry.title || entry.url }}</router-link>
    <button
      v-else-if="entry.type === 'link'"
      @click="openExternalLink(entry.url)"
      class="link"
    >{{ entry.url }}</button>
    <image-preview v-else-if="entry.type === 'img'" :entry="entry" />
    <span v-else>
      <vue-markdown :source="entry.content" />
    </span>
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
      this.onChangeDatetime({ ...this.enty, createdAt: this.createdAt });
    }
  }
};
</script>

<style>
.hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap; /* added line */
}

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
.nav-btn {
  background: none;
  border: none;
  font-style: italic;
  margin-left: 8px;
  cursor: pointer;
  text-decoration: underline;
}

.date {
  font-size: 12px;
  margin-bottom: 16px;
  font-style: italic;
  color: #3b3b3b;
}

.link {
  white-space: nowrap;
  background: none;
  border: 0;
  text-decoration: underline;
  cursor: pointer;
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
  background: #f0f0f0;
  padding: 16px;
  margin-left: 0px;
}
</style>
