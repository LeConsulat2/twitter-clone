// src/lib/types.ts (or add to an existing types file)
export interface IIdea {
    id: string; // The Firestore document ID
    idea: string; // Renaming this to 'content' or 'ideaText' in Firestore would be better
    createdAt: number; // Firestore timestamp will be a number
    userId: string;
    username: string;
    photo?: string; // User's profile photo URL
    fileUrl?: string; // URL of the uploaded image
}