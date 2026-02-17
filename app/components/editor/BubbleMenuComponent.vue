<template>
  <BubbleMenu
    :editor="editor"
    :tippy-options="{ duration: 150, placement: 'top' }"
    v-if="editor"
  >
    <div class="bubble-menu">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        title="Bold (Ctrl+B)"
      >
        <Icon name="lucide:bold" size="16" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        title="Italic (Ctrl+I)"
      >
        <Icon name="lucide:italic" size="16" />
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
        title="Underline (Ctrl+U)"
      >
        <Icon name="lucide:underline" size="16" />
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        title="Strikethrough"
      >
        <Icon name="lucide:strikethrough" size="16" />
      </button>

      <span class="divider" />

      <button
        @click="editor.chain().focus().toggleHighlight().run()"
        :class="{ 'is-active': editor.isActive('highlight') }"
        title="Highlight"
      >
        <Icon name="lucide:highlighter" size="16" />
      </button>
      <button
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        title="Code"
      >
        <Icon name="lucide:code" size="16" />
      </button>

      <span class="divider" />

      <button
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
        title="Add Link"
      >
        <Icon name="lucide:link" size="16" />
      </button>
    </div>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

function setLink() {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('Enter URL:', previousUrl)

  if (url === null) return

  if (url === '') {
    props.editor.chain().focus().unsetLink().run()
    return
  }

  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>
