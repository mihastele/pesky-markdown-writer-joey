import { defineStore } from 'pinia'

export interface Document {
    id: string
    workspace_id: string
    parent_id: string | null
    title: string
    content: object
    icon: string
    cover_url: string | null
    is_archived: boolean
    created_by: string | null
    updated_at: string
    created_at: string
    position: number
    children?: Document[]
}

export const useDocumentStore = defineStore('documents', () => {
    const documents = ref<Document[]>([])
    const currentDocument = ref<Document | null>(null)
    const loading = ref(false)

    // Build a tree structure from flat documents
    const documentTree = computed(() => {
        const map = new Map<string, Document & { children: Document[] }>()
        const roots: (Document & { children: Document[] })[] = []

        // Create nodes with children arrays
        for (const doc of documents.value) {
            map.set(doc.id, { ...doc, children: [] })
        }

        // Link children to parents
        for (const doc of documents.value) {
            const node = map.get(doc.id)!
            if (doc.parent_id && map.has(doc.parent_id)) {
                map.get(doc.parent_id)!.children.push(node)
            } else {
                roots.push(node)
            }
        }

        // Sort by position
        const sortChildren = (items: (Document & { children: Document[] })[]) => {
            items.sort((a, b) => a.position - b.position)
            items.forEach(item => sortChildren(item.children))
        }
        sortChildren(roots)

        return roots
    })

    const client = useSupabaseClient()

    async function fetchDocuments(workspaceId: string) {
        loading.value = true
        try {
            const { data, error } = await client
                .from('documents')
                .select('*')
                .eq('workspace_id', workspaceId)
                .eq('is_archived', false)
                .order('position')

            if (error) throw error
            documents.value = data || []
        } catch (err) {
            console.error('Failed to fetch documents:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchDocument(id: string) {
        try {
            const { data, error } = await client
                .from('documents')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            currentDocument.value = data
            return data
        } catch (err) {
            console.error('Failed to fetch document:', err)
            return null
        }
    }

    async function createDocument(workspaceId: string, parentId: string | null = null) {
        const user = useSupabaseUser()
        try {
            const { data, error } = await client
                .from('documents')
                .insert({
                    workspace_id: workspaceId,
                    parent_id: parentId,
                    title: 'Untitled',
                    content: { type: 'doc', content: [{ type: 'paragraph' }] },
                    icon: '📄',
                    created_by: user.value?.id,
                    position: documents.value.filter(d => d.parent_id === parentId).length,
                })
                .select()
                .single()

            if (error) throw error
            if (data) {
                documents.value.push(data)
            }
            return data
        } catch (err) {
            console.error('Failed to create document:', err)
            return null
        }
    }

    async function updateDocument(id: string, updates: Partial<Document>) {
        try {
            const { data, error } = await client
                .from('documents')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            if (data) {
                const idx = documents.value.findIndex(d => d.id === id)
                if (idx !== -1) documents.value[idx] = data
                if (currentDocument.value?.id === id) {
                    currentDocument.value = data
                }
            }
            return data
        } catch (err) {
            console.error('Failed to update document:', err)
            return null
        }
    }

    async function archiveDocument(id: string) {
        return updateDocument(id, { is_archived: true })
    }

    async function deleteDocument(id: string) {
        try {
            const { error } = await client
                .from('documents')
                .delete()
                .eq('id', id)

            if (error) throw error
            documents.value = documents.value.filter(d => d.id !== id)
            if (currentDocument.value?.id === id) {
                currentDocument.value = null
            }
        } catch (err) {
            console.error('Failed to delete document:', err)
        }
    }

    // Local-only mode for when Supabase is not connected
    function createLocalDocument(parentId: string | null = null): Document {
        const doc: Document = {
            id: crypto.randomUUID(),
            workspace_id: 'local',
            parent_id: parentId,
            title: 'Untitled',
            content: { type: 'doc', content: [{ type: 'paragraph' }] },
            icon: '📄',
            cover_url: null,
            is_archived: false,
            created_by: null,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            position: documents.value.filter(d => d.parent_id === parentId).length,
        }
        documents.value.push(doc)
        return doc
    }

    function updateLocalDocument(id: string, updates: Partial<Document>) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx !== -1) {
            documents.value[idx] = { ...documents.value[idx], ...updates, updated_at: new Date().toISOString() }
            if (currentDocument.value?.id === id) {
                currentDocument.value = documents.value[idx]
            }
        }
    }

    return {
        documents,
        currentDocument,
        loading,
        documentTree,
        fetchDocuments,
        fetchDocument,
        createDocument,
        updateDocument,
        archiveDocument,
        deleteDocument,
        createLocalDocument,
        updateLocalDocument,
    }
})
