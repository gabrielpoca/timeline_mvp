<template>
  <div v-html="html"></div>
</template>

<script>
import showdown from "showdown";

const tags = {};

showdown.extension("tag", () => {
  return [
    {
      type: "lang",
      regex: /\@[^ \b\n]+/g,
      replace: (match) => {
        tags[match] = tags[match] || Object.keys(tags).length;

        return `<span class="highlight-${tags[match]}">${match}</span>`;
      },
    },
  ];
});

const converter = new showdown.Converter({ extensions: ["tag"] });
converter.setOption("tasklists", true);

export default {
  props: ["source"],
  computed: {
    html() {
      return converter.makeHtml(this.source);
    },
  },
};
</script>

<style scoped>
>>> .task-list-item {
  display: flex;
}

>>> input[type="checkbox"] {
  align-self: center;
  margin: 0 !important;
  margin-right: 8px !important;
}

>>> h1 {
  font-size: 1.5rem;
}

>>> h2 {
  font-size: 1.2rem;
}

>>> h3 {
  font-size: 1.1rem;
}

>>> h4 {
  font-size: 1rem;
}

>>> h1:not(:last-child),
>>> h2:not(:last-child),
>>> h3:not(:last-child),
>>> h4:not(:last-child),
>>> h5:not(:last-child),
>>> ul:not(:last-child),
>>> ol:not(:last-child),
>>> h1:not(:last-child),
>>> h2:not(:last-child),
>>> h3:not(:last-child),
>>> p:not(:last-child),
>>> pre:not(:last-child) {
  margin-bottom: 16px;
}

>>> pre {
  background: #f7f7f7;
  padding: 16px;
  margin: 0px;
  white-space: normal;
}

>>> .highlight-0 {
  color: #c9883f !important;
}

>>> .highlight-1 {
  color: #aa2b2b !important;
}

>>> .highlight-2 {
  color: #1815c5 !important;
}

>>> .highlight-3 {
  color: #6eb468 !important;
}

>>> .highlight-4 {
  color: #53838f !important;
}

>>> .highlight-5 {
  color: #95a0ff !important;
}

>>> .highlight-6 {
  color: #ed95ff !important;
}

>>> [class^="highlight-"] {
  font-weight: bold;
  font-size: inherit;
  line-height: inherit;
  color: rgb(196, 196, 196);
}
</style>
