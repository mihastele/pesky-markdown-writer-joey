import { defineStore } from 'pinia'

export interface Workspace {
    id: string
    name: string
    icon: string
    owner_id: string
    created_at: string
    updated_at: string
}

export interface WorkspaceMember {
    workspace_id: string
    user_id: string
    role: 'owner' | 'editor' | 'viewer'
    created_at: string
}

export const useWorkspaceStore = defineStore('workspaces', () => {
    const workspaces = ref<Workspace[]>([])
    const currentWorkspace = ref<Workspace | null>(null)
    const members = ref<WorkspaceMember[]>([])
    const loading = ref(false)

    const client = useSupabaseClient()
    const user = useSupabaseUser()

    async function fetchWorkspaces() {
        loading.value = true
        try {
            const { data, error } = await client
                .from('workspaces')
                .select('*')
                .order('created_at')

            if (error) throw error
            workspaces.value = data || []

            // Auto-select first workspace if none selected
            if (!currentWorkspace.value && workspaces.value.length > 0) {
                currentWorkspace.value = workspaces.value[0]
            }
        } catch (err) {
            console.error('Failed to fetch workspaces:', err)
        } finally {
            loading.value = false
        }
    }

    async function createWorkspace(name: string) {
        if (!user.value) return null
        try {
            const { data, error } = await client
                .from('workspaces')
                .insert({
                    name,
                    icon: '📝',
                    owner_id: user.value.id,
                })
                .select()
                .single()

            if (error) throw error
            if (data) {
                workspaces.value.push(data)
                currentWorkspace.value = data
            }
            return data
        } catch (err) {
            console.error('Failed to create workspace:', err)
            return null
        }
    }

    async function fetchMembers(workspaceId: string) {
        try {
            const { data, error } = await client
                .from('workspace_members')
                .select('*, profiles:user_id(display_name, avatar_url)')
                .eq('workspace_id', workspaceId)

            if (error) throw error
            members.value = data || []
        } catch (err) {
            console.error('Failed to fetch members:', err)
        }
    }

    async function inviteMember(workspaceId: string, email: string, role: 'editor' | 'viewer' = 'editor') {
        // In a real implementation, this would send an invitation email
        // For now, we look up the user by email and add them directly
        try {
            const { data: profile } = await client
                .from('profiles')
                .select('id')
                .eq('display_name', email)
                .single()

            if (!profile) throw new Error('User not found')

            const { error } = await client
                .from('workspace_members')
                .insert({
                    workspace_id: workspaceId,
                    user_id: profile.id,
                    role,
                })

            if (error) throw error
            await fetchMembers(workspaceId)
        } catch (err) {
            console.error('Failed to invite member:', err)
            throw err
        }
    }

    // Local-only mode
    function createLocalWorkspace(): Workspace {
        const ws: Workspace = {
            id: 'local',
            name: 'My Workspace',
            icon: '📝',
            owner_id: 'local-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        workspaces.value = [ws]
        currentWorkspace.value = ws
        return ws
    }

    return {
        workspaces,
        currentWorkspace,
        members,
        loading,
        fetchWorkspaces,
        createWorkspace,
        fetchMembers,
        inviteMember,
        createLocalWorkspace,
    }
})
