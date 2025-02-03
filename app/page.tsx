'use client'

import { useEffect, useState } from "react"
import { NoteCard } from '@/components/NoteCard'
import { CreateNote } from "@/components/CreateNote"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown } from "lucide-react" // Sort icon

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  isAudio: boolean
  isFavorite: boolean
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new") // Sorting state
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notes')
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      const data = await response.json()
      setNotes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching notes:', error)
      setNotes([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchNotes()
    }
  }, [session])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      setNotes(notes.filter(note => note._id !== id))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleUpdate = async (id: string, title: string, content: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      const updatedNote = await response.json()
      setNotes(notes.map(note => note._id === id ? updatedNote : note))
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleFavorite = async (id: string) => {
    try {
      const noteToUpdate = notes.find(note => note._id === id)
      if (!noteToUpdate) return

      const updatedNote = { ...noteToUpdate, isFavorite: !noteToUpdate.isFavorite }

      await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: updatedNote.isFavorite })
      })

      setNotes(notes.map(note => (note._id === id ? updatedNote : note)))
    } catch (error) {
      console.error('Error updating favorite status:', error)
    }
  }

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      return showFavorites ? (matchesSearch && note.isFavorite) : matchesSearch
    })
    .sort((a, b) => {
      return sortOrder === "new"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="relative min-h-screen pb-24">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background p-4 shadow-sm">
        <div className="flex gap-4 mb-4">
          {/* Search Bar */}
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          {/* Sort Button */}
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "new" ? "old" : "new")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "new" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {isLoading ? (
          <div>Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            {searchTerm ? "No notes found" : "No notes yet. Create one!"}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={{
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                isAudio: note.isAudio,
                isFavorite: note.isFavorite
              }}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onFavorite={handleFavorite}
            />
          ))
        )}
      </div>

      {/* Create Note Form */}
      <CreateNote onNoteCreated={fetchNotes} />
    </div>
  )
}
