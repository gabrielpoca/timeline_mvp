import { pick } from "lodash";

const initialState = {
  id: null,
  content: null,
  type: "note",
  files: [],
};

const state = { ...initialState };

const mutations = {
  edit(state, entry) {
    state.id = entry.id;
    state.content = entry.content;
    state.type = "markdownNote";
  },
  content(state, content) {
    state.content = content;
  },
  type(state, type) {
    state.type = type;
  },
  changeType(state) {
    state.type = state.type === "note" ? "markdownNote" : "note";
  },
};

const actions = {
  save({ state, dispatch }) {
    if (!state.content) return;

    if (state.id) {
      dispatch("update", pick(state, ["id", "content", "files"]), {
        root: true,
      });
    } else {
      dispatch("add", pick(state, ["content", "files"]), { root: true });
    }

    state = { ...initialState };
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
