<template>
  <aside class="sidebar" :class="{ collapsed: !isOpen }">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <span class="brand-icon">🐝</span>
        <span class="brand-name" v-show="isOpen">Pesky Writer</span>
      </div>
      <button class="sidebar-toggle" @click="toggle" :title="isOpen ? 'Collapse sidebar' : 'Expand sidebar'">
        <Icon :name="isOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" size="18" />
      </button>
    </div>

    <div class="sidebar-content" v-show="isOpen">
      <!-- Quick Actions -->
      <div class="sidebar-section">
        <button class="sidebar-action" @click="handleSearch">
          <Icon name="lucide:search" size="16" />
          <span>Search</span>
          <kbd>⌘K</kbd>
        </button>
        <button class="sidebar-action" @click="handleNewPage">
          <Icon name="lucide:plus" size="16" />
          <span>New Page</span>
        </button>
      </div>

      <!-- Page Tree -->
      <div class="sidebar-section">
        <div class="sidebar-section-header">
          <span>Pages</span>
        </div>
        <div class="page-tree">
          <SidebarPageTreeItem
            v-for="doc in documentTree"
            :key="doc.id"
            :document="doc"
            :depth="0"
            @select="handleSelectDocument"
            @new-child="handleNewChild"
          />
          <div v-if="documentTree.length === 0" class="empty-tree">
            <p>No pages yet</p>
            <button class="btn-ghost" @click="handleNewPage">
              <Icon name="lucide:plus" size="14" />
              Create your first page
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="sidebar-footer" v-show="isOpen">
      <button class="sidebar-action" @click="handleTrash">
        <Icon name="lucide:trash-2" size="16" />
        <span>Trash</span>
      </button>
      <button class="sidebar-action" @click="toggleDarkMode">
        <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" size="16" />
        <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const isOpen = useState('sidebarOpen', () => true)
const isDark = useState('isDark', () => false)
const router = useRouter()

const documentStore = useDocumentStore()
const workspaceStore = useWorkspaceStore()

const { documentTree } = storeToRefs(documentStore)

function toggle() {
  isOpen.value = !isOpen.value
}

function toggleDarkMode() {
  isDark.value = !isDark.value
}

function handleSearch() {
  // TODO: implement search modal
}

function handleNewPage() {
  const doc = documentStore.createLocalDocument(null)
  router.push(`/document/${doc.id}`)
}

function handleNewChild(parentId: string) {
  const doc = documentStore.createLocalDocument(parentId)
  router.push(`/document/${doc.id}`)
}

function handleSelectDocument(id: string) {
  router.push(`/document/${id}`)
}

function handleTrash() {
  router.push('/trash')
}

// Initialize with a local workspace if needed
onMounted(() => {
  if (workspaceStore.workspaces.length === 0) {
    workspaceStore.createLocalWorkspace()
  }
  if (documentStore.documents.length === 0) {
    // Create a welcome document
    const doc = documentStore.createLocalDocument(null)
    documentStore.updateLocalDocument(doc.id, {
      title: 'Welcome to Pesky Writer',
      icon: '👋',
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Welcome to Pesky Writer 🐝' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'A beautiful, Notion-like collaborative markdown editor. Start typing or use ' }, { type: 'text', marks: [{ type: 'code' }], text: '/' }, { type: 'text', text: ' to insert blocks.' }] },
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Features' }] },
          { type: 'taskList', content: [
            { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rich text editing with slash commands' }] }] },
            { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Dark mode support' }] }] },
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Image and video embedding' }] }] },
            { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Real-time collaboration' }] }] },
          ]},
        ]
      }
    })
  }
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
  z-index: 50;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 48px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  min-height: 52px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.brand-icon {
  font-size: 1.3em;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.sidebar-section {
  margin-bottom: 8px;
}

.sidebar-section-header {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  padding: 8px 8px 4px;
}

.sidebar-action {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.sidebar-action:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-action kbd {
  margin-left: auto;
  font-size: 0.72rem;
  padding: 1px 5px;
  border: 1px solid var(--border-default);
  border-radius: 3px;
  color: var(--text-tertiary);
  background: var(--bg-primary);
}

.page-tree {
  min-height: 40px;
}

.empty-tree {
  text-align: center;
  padding: 20px;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

.empty-tree p {
  margin-bottom: 8px;
}

.empty-tree .btn-ghost {
  font-size: 0.82rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sidebar-footer {
  padding: 8px;
  border-top: 1px solid var(--border-default);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar:not(.collapsed) {
    transform: translateX(0);
    box-shadow: var(--shadow-lg);
  }
}
</style>
