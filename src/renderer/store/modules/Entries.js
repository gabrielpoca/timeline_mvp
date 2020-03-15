const state = {
  entries: [{ url: 'test', content: '<div>test</div>' }],
  loading: false
}

const mutations = {
  loadAll(state, entries) {
    state.entries = entries;
  },
  setLoading(state, loading) {
    state.loading = loading;
  }
}

const actions = {
  add({ commit }) {
    commit('setLoading', true);
    // commit('loadAll', [{ url: 'test 2', content: '<div>test 2</div>' }])
    commit('setLoading', false);
  },
}

export default {
  state,
  mutations,
  actions
}
