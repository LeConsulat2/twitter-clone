// src/components/idea.tsx (renamed from tweet.tsx)
import { Link } from "react-router-dom"; // For linking to user profile later
import { auth, db, storage } from "../firebase"; // Assuming these are initialized
import type { IIdea } from "../lib/types"; // Import your type definition
import { doc, deleteDoc } from "firebase/firestore"; // Firestore delete functions
import { ref, deleteObject } from "firebase/storage"; // Storage delete function
import { useState } from "react";
import ideaStyles from "../styles/idea.module.css"; // We'll create this CSS module

// Define props for the Idea component
interface IdeaProps {
  idea: IIdea;
}

export default function Idea({ idea }: IdeaProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const user = auth.currentUser; // Get the currently logged-in user

  // Function to handle idea deletion
  const onDelete = async () => {
    if (!user || user.uid !== idea.userId) {
      // Basic client-side check: ensure user is logged in and is the owner
      alert("You don't have permission to delete this idea.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this idea?");
    if (!confirmDelete) {
      return;
    }

    try {
      setIsDeleting(true);

      // 1. Delete the image from Firebase Storage if it exists
      if (idea.fileUrl) {
        const fileRef = ref(storage, idea.fileUrl); // Use the URL to create a ref
        await deleteObject(fileRef);
      }

      // 2. Delete the document from Firestore
      const docRef = doc(db, "ideas", idea.id); // 'ideas' is your collection name
      await deleteDoc(docRef);

    } catch (error) {
      console.error("Error deleting idea:", error);
      alert("Failed to delete idea. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Convert Firebase timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp); // Firebase timestamp is usually milliseconds
    return date.toLocaleString(); // Adjust formatting as needed
  };

  return (
    <div className={ideaStyles.ideaContainer}>
      {/* Optional: Link to user's profile, if you build one */}
      <div className={ideaStyles.header}>
        {idea.photo && (
          <img src={idea.photo} alt={idea.username} className={ideaStyles.userPhoto} />
        )}
        <div className={ideaStyles.userInfo}>
          <Link to={`/profile/${idea.userId}`} className={ideaStyles.username}>
            {idea.username}
          </Link>
          <span className={ideaStyles.timestamp}>
            {formatDate(idea.createdAt)}
          </span>
        </div>
        {user && user.uid === idea.userId && ( // Only show delete button if current user is the owner
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={ideaStyles.deleteButton}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <p className={ideaStyles.ideaContent}>{idea.idea}</p>

      {idea.fileUrl && (
        <img src={idea.fileUrl} alt="Idea attachment" className={ideaStyles.ideaImage} />
      )}

      {/* You'd add reply/like buttons here later */}
    </div>
  );
}