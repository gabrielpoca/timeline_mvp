<template>
  <div class="titlebar" />
</template>

<style scoped>
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
  width: 100%;
  height: var(--title-bar-height);
  background: black;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
