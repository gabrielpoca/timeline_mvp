<template>
  <div v-if="entry" class="entry">
    <div class="nav">
      <router-link :to="{ name: 'entryList' }">Back</router-link>
      <div class="title" v-if="entry.title">{{ entry.title.slice(0, 70) }}...</div>
      <a href="#" v-on:click="remove">Delete</a>
    </div>
    <div class="inside">
      <iframe
        importance="high"
        loading="eager"
        class="frame"
        :srcdoc="readable()"
        :src="entry.url"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ipcRenderer, shell } from "electron";

import sanitize from "./sanitize";
import readable from "./readable";

let memoizedContent;
let memoizedId;

export default {
  name: "entry",
  props: ["id"],
  computed: {
    entry() {
      return this.$store.getters.entry(this.id);
    }
  },
  mounted: function() {
    window.addEventListener("message", this.onClick);
  },
  beforeDestroy: function() {
    window.removeEventListener("message", this.onClick);
  },
  methods: {
    onClick: function(event) {
      const { type, url } = event.data;
      if (type === "iframeClick") {
        if (url && !url.includes("localhost")) shell.openExternal(url);
      }
    },
    remove: function() {
      ipcRenderer.send("delete", this.id);
      this.$router.push({ name: "entryList" });
    },
    parse: function(url, content) {
      const doc = new JSDOM(content, {
        url
      });
      const reader = new Readability(doc.window.document);
      const article = reader.parse();
      return sanitize(article.content);
    },
    readable() {
      if (memoizedId === this.entry.id) return memoizedContent;

      memoizedContent = readable(this.entry.url, this.entry.content);
      memoizedId = this.entry.id;
      return memoizedContent;
    }
  }
};
</script>

<style scoped>
.entry {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 24px 16px;
  margin-top: 40px;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 0;
}

.inside {
  flex: 1;
  flex-grow: 1;
  padding: 0 24px 24px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
