'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Square, Loader2 } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    recognition?: SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: { error: string }) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
  }
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    readonly [index: number]: SpeechRecognitionResult;
  }
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly [index: number]: SpeechRecognitionAlternative;
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
}

interface CreateNoteProps {
  onNoteCreated: () => void
}

export function CreateNote({ onNoteCreated }: CreateNoteProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const startRecording = () => {
    setIsRecording(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      
      setContent(transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
    return recognition
  }

  const handleStartRecording = () => {
    const recognition = startRecording()
    // Store recognition instance to stop it later
    window.recognition = recognition
  }

  const handleStopRecording = () => {
    if (window.recognition) {
      window.recognition.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          isAudio: isRecording
        })
      })

      if (!response.ok) throw new Error('Failed to create note')

      // Reset form
      setTitle('')
      setContent('')
      setIsRecording(false)
      
      // Refresh notes list
      onNoteCreated()
    } catch (error) {
      console.error('Error creating note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="fixed  left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl mt-10">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="relative">
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Start typing or recording your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-2 text-red-500">
                  <div className="animate-pulse">Recording</div>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div>
            {isRecording ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleStopRecording}
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleStartRecording}
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                Start Recording
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Note
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 