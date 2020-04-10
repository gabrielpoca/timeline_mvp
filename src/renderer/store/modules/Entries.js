import { remote } from "electron";
import { sortBy, filter, includes } from "lodash";

const globalEntries = remote.getGlobal("entries");
window.globalEntries = globalEntries;

const state = {
  entries: [],
  searchResults: null,
  newContent: "",
  newType: "note",
  editing: null
};

function compare(a, b) {
  if (a.createdAt < b.createdAt) return -1;
  if (a.createdAt > b.createdAt) return 1;

  return 0;
}

const mutations = {
  loadAll(state, entries) {
    state.entries = entries.sort(compare);
  },
  changeType(state, newType) {
    if (state.editing) state.editing.type = newType;
    else state.newType = newType;
  },
  updateContent(state, content) {
    if (state.editing) {
      state.editing.content = content;
    } else {
      state.newContent = content;
    }
  },
  remove(state, entryId) {
    state.entries = state.entries.filter(({ id }) => id !== entryId);
  },
  edit(state, entry) {
    state.editing = entry;
  },
  cancel(state) {
    state.editing = null;
    state.newType = "note";
  },
  reset(state) {
    state.editing = null;
    state.newContent = "";
    state.newType = "note";
  },
  searchResults(state, results) {
    state.searchResults = results;
  }
};

const actions = {
  async add({ commit, dispatch, state }) {
    if (state.editing) {
      await globalEntries.update(state.editing);
      commit("loadAll", await globalEntries.loadAll());
      commit("reset");
    } else if (!!state.newContent) {
      if (state.newContent.startsWith("/")) {
        dispatch("search", state.newContent.replace("/", ""));
      } else {
        await globalEntries.add({ content: state.newContent });
        commit("loadAll", await globalEntries.loadAll());
        commit("reset");
      }
    }
  },
  async addFiles({ commit }, files) {
    for (let file of files) {
      await globalEntries.addFile(file);
    }
    commit("loadAll", await globalEntries.loadAll());
  },
  async update({ commit }, entry) {
    await globalEntries.update(entry);
    commit("loadAll", await globalEntries.loadAll());
  },
  async remove({ commit }, id) {
    await globalEntries.remove(id);
    commit("remove", id);
  },
  edit({ commit }, entry) {
    commit("edit", { ...entry });
    commit("changeType", "markdownNote");
  },
  async search({ commit }, query) {
    if (!query) {
      return commit("searchResults", null);
    }

    const results = await globalEntries.search(query);
    commit("searchResults", results);
  }
};

const getters = {
  newContent: state =>
    state.editing ? state.editing.content : state.newContent,
  newType: state => (state.editing ? state.editing.type : state.newType),
  entries: state => {
    let entries = state.entries;

    if (state.searchResults) {
      const ids = state.searchResults.map(r => r.ref);
      entries = filter(entries, entry => includes(ids, entry.id));
    }

    return sortBy(entries, ({ createdAt }) => new Date(createdAt));
  },
  entry: state => id => {
    return state.entries.reduce((memo, entry) => {
      if (memo) return memo;
      if (entry.id === id) return entry;
      return null;
    }, null);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
