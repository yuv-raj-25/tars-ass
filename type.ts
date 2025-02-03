// src/types.ts
export type Note = {
    id: string;
    title: string;
    content: string;
    type: "text" | "audio";
    isFavorite: boolean;
    image?: string;
  };
  