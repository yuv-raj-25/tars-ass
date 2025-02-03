import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/lib/models/notes.models';
import mongoose from 'mongoose';




export async function DELETE(
    req: Request,
    context: { params: { id: string } } // Fix: Use 'context' to await params
  ) {
    try {
      await connectToDatabase();
  
      // Fix: Await context.params before using it
      const { id } = await context.params;
      console.log("Received ID:", id);
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
  
      const deletedNote = await Note.findByIdAndDelete(id);
      if (!deletedNote) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }