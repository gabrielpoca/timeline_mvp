import { remote } from "electron";
import { filter, includes, debounce, findIndex } from "lodash";

const globalEntries = remote.getGlobal("entries");
window.globalEntries = globalEntries;

const state = {
  entries: [],
  selectedEntry: {},
  searchQuery: "",
  searchResults: null,
  entriesFilter: null,
  mode: "normal",
};

function compare(a, b) {
  if (a.createdAt < b.createdAt) return -1;
  if (a.createdAt > b.createdAt) return 1;

  return 0;
}

const mutations = {
  selectedEntry(state, { entry, scrollIntoView }) {
    if (entry) state.selectedEntry = { id: entry.id, scrollIntoView };
    else state.selectedEntry = {};
  },
  loadAll(state, entries) {
    state.entries = entries.sort(compare);
  },
  searchQuery(state, query) {
    state.searchQuery = query;
  },
  remove(state, entryId) {
    state.entries = state.entries.filter(({ id }) => id !== entryId);
  },
  cancel(state) {
    state.mode = "normal";
    state.entriesFilter = null;
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

    if (!state.selectedEntry.id)
      return commit("selectedEntry", {
        entry: getters.entries[getters.entries.length - 1],
        scrollIntoView: true,
      });

    const index = findIndex(getters.entries, { id: state.selectedEntry.id });
    const newSelectedEntry = getters.entries[Math.max(index - 1, 0)];
    commit("selectedEntry", { entry: newSelectedEntry, scrollIntoView: true });
  },
  selectDown({ state, commit, getters }) {
    if (state.mode !== "normal") return;

    if (!state.selectedEntry.id)
      return commit("selectedEntry", {
        entry: getters.entries[getters.entries.length - 1],
        scrollIntoView: true,
      });

    const index = findIndex(getters.entries, { id: state.selectedEntry.id });
    const newSelectedEntry =
      getters.entries[Math.min(index + 1, getters.entries.length - 1)];
    commit("selectedEntry", { entry: newSelectedEntry, scrollIntoView: true });
  },
  async add({ commit }, entry) {
    await globalEntries.add(entry);
    commit("loadAll", await globalEntries.loadAll());
    commit("cancel");
    commit("mode", "normal");
  },
  async addFiles({ commit }, files) {
    await globalEntries.addFiles(Array.from(files));
    commit("loadAll", await globalEntries.loadAll());
  },
  async update({ commit }, entry) {
    await globalEntries.update(entry);
    commit("loadAll", await globalEntries.loadAll());
    commit("mode", "normal");
  },
  async remove({ commit }, id) {
    await globalEntries.remove(id);
    commit("remove", id);
  },
  edit({ commit, state, getters }, entry) {
    if (state.mode !== "normal") return;

    commit("mode", "insert");

    if (entry) {
      commit("Editor/edit", { ...entry });
    } else if (state.selectedEntry.id) {
      const index = findIndex(getters.entries, { id: state.selectedEntry.id });
      commit("Editor/edit", { ...getters.entries[index] });
    } else {
      const editEntry = getters.entries[getters.entries.length - 1];
      commit("Editor/edit", { ...editEntry });
    }
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
