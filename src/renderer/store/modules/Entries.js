import { remote } from "electron";

const globalEntries = remote.getGlobal("entries");

const state = {
  entries: []
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
  }
};

const actions = {
  async add({ commit }, entry) {
    await globalEntries.add(entry);
    commit("loadAll", await globalEntries.loadAll());
  },
  async update({ commit }, entry) {
    await globalEntries.update(entry);
    commit("loadAll", await globalEntries.loadAll());
  },
  async remove({ commit }, id) {
    await globalEntries.remove(id);
    commit("remove", id);
  }
};

const getters = {
  entries: state => {
    return state.entries;
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
