<template>
  <form class="form" @submit="onSearch">
    <div class="tick" v-bind:class="{ hidden: !focused && !value }">/</div>
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
      @keydown="onKeyDown"
      @focus="focused = true"
      @blur="focused = false"
      class="input"
      type="text"
      ref="input"
    />
  </form>
</template>

<script>
export default {
  props: ["value", "onKeyDown"],
  data: function() {
    return { focused: false };
  },
  mounted() {
    this.$refs.input.focus();
  },
  methods: {
    onSearch(e) {
      e.preventDefault();
      this.$store.dispatch("search");
    }
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-basis: 32px;
  flex-shrink: 0;
  flex-grow: 0;
  padding: 16px 24px 0;
  flex-basis: 40px;
  align-items: center;
}

.tick {
  flex-grow: 0;
  flex-shrink: 0;
}

.input {
  flex: 1;
  padding: 0;
  margin-left: 2px;
  background: transparent;
  outline: none;
  color: inherit;
  border: 0;
}
</style>
