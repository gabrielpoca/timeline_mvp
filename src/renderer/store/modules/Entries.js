import { remote } from "electron";
import { filter, includes, debounce, findIndex } from "lodash";

const globalEntries = remote.getGlobal("entries");
window.globalEntries = globalEntries;

const state = {
  entries: [],
  selectedEntry: null,
  searchQuery: "",
  searchResults: null,
  entriesFilter: null,
  newContent: "",
  newType: "note",
  editing: null,
  mode: "normal",
};

function compare(a, b) {
  if (a.createdAt < b.createdAt) return -1;
  if (a.createdAt > b.createdAt) return 1;

  return 0;
}

const mutations = {
  selectedEntry(state, entry) {
    state.selectedEntry = entry.id;
  },
  loadAll(state, entries) {
    state.entries = entries.sort(compare);
  },
  changeType(state, newType) {
    const nextType = newType
      ? newType
      : state.newType === "note"
      ? "markdownNote"
      : "note";

    if (state.editing) state.editing.type = nextType;
    else state.newType = nextType;
  },
  updateContent(state, content) {
    if (state.editing) {
      state.editing.content = content;
    } else {
      state.newContent = content;
    }
  },
  searchQuery(state, query) {
    state.searchQuery = query;
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
    state.mode = "normal";
    state.entriesFilter = null;
  },
  reset(state) {
    state.editing = null;
    state.newContent = "";
    state.newType = "note";
  },
  searchResults(state, results) {
    state.searchResults = results;
  },
  mode(state, mode) {
    state.mode = mode;
  },
  entriesFilter(state, entriesFilter) {
    state.entriesFilter = entriesFilter;
  },
};

const actions = {
  selectUp({ state, commit, getters }) {
    if (state.mode !== "normal") return;

    if (!state.selectedEntry)
      return commit(
        "selectedEntry",
        getters.entries[getters.entries.length - 1]
      );

    const index = findIndex(getters.entries, { id: state.selectedEntry });
    const newSelectedEntry = getters.entries[Math.max(index - 1, 0)];
    commit("selectedEntry", newSelectedEntry);
  },
  selectDown({ state, commit, getters }) {
    if (state.mode !== "normal") return;

    if (!state.selectedEntry)
      return commit(
        "selectedEntry",
        getters.entries[getters.entries.length - 1]
      );

    const index = findIndex(getters.entries, { id: state.selectedEntry });
    const newSelectedEntry =
      getters.entries[Math.min(index + 1, getters.entries.length - 1)];
    commit("selectedEntry", newSelectedEntry);
  },
  async add({ commit, state }) {
    if (state.editing) {
      await globalEntries.update(state.editing);
      commit("loadAll", await globalEntries.loadAll());
      commit("reset");
    } else if (!!state.newContent) {
      await globalEntries.add({ content: state.newContent });
      commit("loadAll", await globalEntries.loadAll());
      commit("reset");
    }

    commit("mode", "normal");
  },
  async addFiles({ commit }, files) {
    await globalEntries.addFiles(Array.from(files));
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
  edit({ commit, state, getters }, entry) {
    if (state.mode !== "normal") return;

    commit("mode", "insert");

    if (entry) {
      commit("edit", { ...entry });
    } else if (state.selectedEntry) {
      const index = findIndex(getters.entries, { id: state.selectedEntry });
      commit("edit", { ...getters.entries[index] });
    } else {
      const editEntry = getters.entries[getters.entries.length - 1];
      commit("edit", { ...editEntry });
    }

    commit("changeType", "markdownNote");
  },
  search: debounce(
    async ({ commit }, searchQuery) => {
      commit("searchQuery", searchQuery);

      if (!searchQuery) {
        commit("mode", "normal");
        return commit("searchResults", null);
      }

      const results = await globalEntries.search(searchQuery);
      commit("searchResults", results);
    },
    200,
    { leading: false, trailing: true }
  ),
};

const getters = {
  selectedEntry: (state) => state.selectedEntry,
  newContent: (state) =>
    state.editing ? state.editing.content : state.newContent,
  newType: (state) => (state.editing ? state.editing.type : state.newType),
  searchQuery: (state) => state.searchQuery,
  entries: (state) => {
    let entries = state.entries;

    if (state.searchResults) {
      const ids = state.searchResults.map((r) => r.ref);
      entries = filter(entries, (entry) => includes(ids, entry.id));
    }

    if (state.entriesFilter === "tasks")
      return entries.filter((entry) => {
        if (entry.type !== "note" && entry.type !== "markdownNote")
          return false;

        return entry.content.match(/- ?\[[^\]]*?\]/);
      });

    return entries;
  },
  entry: (state) => (id) => {
    return state.entries.reduce((memo, entry) => {
      if (memo) return memo;
      if (entry.id === id) return entry;
      return null;
    }, null);
  },
  mode: (state) => state.mode,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
