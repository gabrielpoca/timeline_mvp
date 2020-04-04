import { remote } from "electron";
import { sortBy } from "lodash";

const globalEntries = remote.getGlobal("entries");

const state = {
  entries: [],
  newContent: "",
  newType: "note",
  editing: null,
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
  remove(state, entryId) {
    state.entries = state.entries.filter(({ id }) => id !== entryId);
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
};

const actions = {
  async add({ commit, state, dispatch }, entry) {
    if (state.editing) {
      await globalEntries.update(state.editing);
    } else {
      await globalEntries.add({ content: state.newContent });
    }

    commit("loadAll", await globalEntries.loadAll());
    commit("reset");
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
};

const getters = {
  newContent: (state) =>
    state.editing ? state.editing.content : state.newContent,
  newType: (state) => (state.editing ? state.editing.type : state.newType),
  entries: (state) =>
    sortBy(state.entries, ({ createdAt }) => new Date(createdAt)),
  entry: (state) => (id) => {
    return state.entries.reduce((memo, entry) => {
      if (memo) return memo;
      if (entry.id === id) return entry;
      return null;
    }, null);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
