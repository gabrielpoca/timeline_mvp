<template>
  <div class="root">
    <form class="form" @submit="submit">
      <input class="input" v-model="newEntryURL" />
      <button :disabled="!newEntryURL" class="button" type="submit">Submit</button>
    </form>
    <div class="pane">
      <ul class="list">
        <li v-for="entry in entries" :key="entry.url">
          <button v-on:click="selected = entry">{{ entry.url }}</button>
        </li>
      </ul>
      <div class="selected" v-if="selected" v-html="sanitize(selected.content)" />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import Readability from "readability";
// import { JSDOM } from "jsdom";

import sanitize from "./sanitize";

export default {
  name: "read-it-later",
  data: function() {
    return {
      newEntryURL: "",
      selected: null
    };
  },
  computed: mapState({
    entries: state => state.Entries.entries
  }),
  components: {},
  methods: {
    sanitize: sanitize,
    submit: async function(e) {
      e.preventDefault();
      this.newEntry = "";
      ipcRenderer.send("add", this.newEntryURL);
    }
  }
};
</script>

<style scoped>
.root {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}

.form {
  display: flex;
  flex-basis: 48px;
}

.input {
  flex: 1;
}

.button {
  flex-basis: 100px;
  flex-grow: 0;
  flex-shrink: 0;
  margin-left: 16px;
}

.list {
  list-style-type: none;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 8px;
  align-content: flex-start;
  flex: 0.4;
}

.pane {
  display: flex;
  flex: 1;
}

.selected {
  flex: 1;
  overflow-y: scroll;
}

.selected >>> img {
  width: calc(100% - 4rem);
  margin: 2rem;
  border: 1px solid #333;
}

.selected >>> h1 {
  font-size: 2rem;
  margin: 1rem 0 0.5rem;
}

.selected >>> h2 {
  font-size: 1.8rem;
  margin: 1rem 0 0.5rem;
}

.selected >>> h3 {
  font-size: 1.6rem;
  margin: 1rem 0 0.5rem;
}

.selected >>> h4 {
  font-size: 1.4rem;
  margin: 1rem 0 0.5rem;
}

.selected >>> ul {
  list-style-type: circle;
}

.selected >>> p {
  margin-bottom: 0.5rem;
}
</style>
