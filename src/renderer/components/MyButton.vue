<template>
  <button class="my-button" v-bind="$attrs" @click="onClick">
    <slot>Button</slot>
  </button>
</template>

<script>
export default {
  props: {
    onClick: {
      type: Function,
      required: true
    }
  }
};
</script>

<style scoped>
.my-button {
  background: none;
  border-radius: 4px;
  border: 1px solid rgb(82, 82, 82);
  min-width: 100px;
  color: inherit;
}
</style>