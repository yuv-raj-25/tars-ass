import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (assumes you have a user model)
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'audio', 'image'],
    default: 'text',
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);