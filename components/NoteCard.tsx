'use client'

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clipboard, Trash2, Edit, Maximize2, Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"
// import { toast } from "@/components/ui/toast"

interface NoteCardProps {
  note: {
    id: string
    title: string
    content: string
    createdAt: string
    isAudio: boolean
    isFavorite: boolean
  }
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, content: string) => void
  onFavorite: (id: string) => void
}

export function NoteCard({ note, onDelete, onUpdate, onFavorite }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editContent, setEditContent] = useState(note.content)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content)
    toast({
      title: "Copied",
      description: "Note content copied to clipboard",
    })
  }

  const handleDelete = async () => {
    console.log("Deleting Note ID:", note.id); // Debugging log
  
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
      console.log("API Response:", data); // Debug response
  
      if (!res.ok) throw new Error(data.error || "Failed to delete note");
  
      onDelete(note.id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  
  
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdate(note.id, editTitle, editContent)
    setIsEditing(false)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  // const handleFavorite = async (noteId: string) => {
  //   try {
  //     console.log("Favoriting note:", noteId);
  //     const res = await fetch(`/api/favorite/${noteId}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });
  
  //     const data = await res.json();  // This line will fail if res is not JSON
  //     console.log("Response:", data);
  //   } catch (error) {
  //     console.error("Error in favoriting:", error);
  //   }
  // };
  // const handleFavoriteClick = () => {
  //   handleFavorite(note.id);
  // };
  

  return (
    <Card className={`${isFullscreen ? "fixed inset-0 z-50" : ""} transition-all duration-200 hover:shadow-lg`}>
      <CardHeader>
        {isEditing ? (
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-xl font-bold" />
        ) : (
          <CardTitle className="flex items-center justify-between">
            {note.title}
            {note.isAudio && <span className="text-sm text-muted-foreground">🎤 Voice Note</span>}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-32 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ) : (
          <p className="whitespace-pre-wrap">{note.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <small className="text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString()}
          </small>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" onClick={handleCopy}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={isEditing ? handleSave : handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          {/* <Button size="icon" variant="ghost" onClick={handleFavoriteClick}>
            <Star className={`h-4 w-4 ${note.isFavorite ? "fill-yellow-400" : ""}`} />
          </Button> */}
        </div>
      </CardFooter>
    </Card>
  )
}

