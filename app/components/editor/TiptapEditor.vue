<template>
  <div class="editor-wrapper" v-if="editor">
    <EditorBubbleMenuComponent :editor="editor" />
    <EditorContent :editor="editor" class="editor-content" />
    <EditorSlashCommandMenu
      v-if="showSlashMenu"
      :items="filteredSlashItems"
      :selected-index="slashSelectedIndex"
      :position="slashMenuPosition"
      @select="handleSlashSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { common, createLowlight } from 'lowlight'

const props = defineProps<{
  modelValue?: object
}>()

const emit = defineEmits<{
  'update:modelValue': [value: object]
}>()

const lowlight = createLowlight(common)

// Slash command state
const showSlashMenu = ref(false)
const slashMenuPosition = ref({ top: 0, left: 0 })
const slashQuery = ref('')
const slashSelectedIndex = ref(0)
const slashRange = ref<any>(null)

const slashItems = [
  { title: 'Heading 1', description: 'Large section heading', icon: 'H1', command: (editor: any) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2', description: 'Medium section heading', icon: 'H2', command: (editor: any) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { title: 'Heading 3', description: 'Small section heading', icon: 'H3', command: (editor: any) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  { title: 'Bullet List', description: 'Create an unordered list', icon: '•', command: (editor: any) => editor.chain().focus().toggleBulletList().run() },
  { title: 'Numbered List', description: 'Create an ordered list', icon: '1.', command: (editor: any) => editor.chain().focus().toggleOrderedList().run() },
  { title: 'Task List', description: 'Create a to-do checklist', icon: '☑', command: (editor: any) => editor.chain().focus().toggleTaskList().run() },
  { title: 'Quote', description: 'Capture a quote', icon: '❝', command: (editor: any) => editor.chain().focus().toggleBlockquote().run() },
  { title: 'Code Block', description: 'Syntax-highlighted code', icon: '⟨⟩', command: (editor: any) => editor.chain().focus().toggleCodeBlock().run() },
  { title: 'Divider', description: 'Visual separation line', icon: '—', command: (editor: any) => editor.chain().focus().setHorizontalRule().run() },
  { title: 'Image', description: 'Upload or embed an image', icon: '🖼', command: (editor: any) => {
    const url = prompt('Enter image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }},
  { title: 'Table', description: 'Insert a table', icon: '▦', command: (editor: any) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
]

const filteredSlashItems = computed(() => {
  if (!slashQuery.value) return slashItems
  return slashItems.filter(item =>
    item.title.toLowerCase().includes(slashQuery.value.toLowerCase())
  )
})

const editor = useEditor({
  content: props.modelValue || { type: 'doc', content: [{ type: 'paragraph' }] },
  extensions: [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Placeholder.configure({
      placeholder: "Type '/' for commands, or start writing...",
    }),
    Highlight.configure({ multicolor: true }),
    Typography,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlight.configure({ lowlight }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'editor-link',
      },
    }),
    TiptapImage.configure({
      inline: false,
      allowBase64: true,
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    TextStyle,
    Color,
  ],
  editorProps: {
    attributes: {
      class: 'tiptap',
    },
    handleKeyDown: (view, event) => {
      if (showSlashMenu.value) {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          slashSelectedIndex.value = (slashSelectedIndex.value + 1) % filteredSlashItems.value.length
          return true
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          slashSelectedIndex.value = (slashSelectedIndex.value - 1 + filteredSlashItems.value.length) % filteredSlashItems.value.length
          return true
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          handleSlashSelect(filteredSlashItems.value[slashSelectedIndex.value])
          return true
        }
        if (event.key === 'Escape') {
          showSlashMenu.value = false
          return true
        }
      }
      return false
    },
  },
  onUpdate: ({ editor: ed }) => {
    emit('update:modelValue', ed.getJSON())

    // Handle slash command detection
    const { state } = ed
    const { from } = state.selection
    const textBefore = state.doc.textBetween(
      Math.max(0, from - 50),
      from,
      '\n'
    )

    const slashMatch = textBefore.match(/\/([a-zA-Z]*)$/)
    if (slashMatch) {
      slashQuery.value = slashMatch[1]
      slashSelectedIndex.value = 0

      // Get position for menu
      const coords = ed.view.coordsAtPos(from)
      slashMenuPosition.value = {
        top: coords.top + 24,
        left: coords.left,
      }
      showSlashMenu.value = true
      slashRange.value = {
        from: from - slashMatch[0].length,
        to: from,
      }
    } else {
      showSlashMenu.value = false
    }
  },
})

function handleSlashSelect(item: typeof slashItems[0]) {
  if (!editor.value || !slashRange.value) return

  // Delete the slash command text
  editor.value.chain()
    .focus()
    .deleteRange(slashRange.value)
    .run()

  // Execute the command
  item.command(editor.value)
  showSlashMenu.value = false
}

watch(() => props.modelValue, (val) => {
  if (!editor.value) return
  const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(val)
  if (!isSame && val) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.editor-wrapper {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 0;
}

.editor-content {
  min-height: 60vh;
}
</style>
