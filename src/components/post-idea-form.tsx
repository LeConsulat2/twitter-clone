import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // For Firestore
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For Storage
import { auth, db, storage } from "../firebase"; // Your Firebase initialized instances
import styles from "../styles/post-idea-form.module.css";

export default function PostIdeaForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      // Add more validation here (e.g., file size limit)
      const selectedFile = files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
          alert("File is too big! Max 5MB allowed.");
          setFile(null); // Clear the selected file if too large
          return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser; // Get current authenticated user

    if (!user || isLoading || (idea === "" && !file)) return; // Basic validation

    try {
      setIsLoading(true);
      let fileUrl = null;

      if (file) {
        // 1. Upload file to Firebase Storage
        const fileRef = ref(storage, `ideas/${user.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
      }

      // 2. Add tweet data to Firestore
      await addDoc(collection(db, "ideas"), {
        idea,
        createdAt: serverTimestamp(), // Firebase server timestamp
        userId: user.uid,
        username: user.displayName || "Anonymous", // Get username from Firebase Auth profile
        photo: user.photoURL, // Get user's profile photo
        fileUrl, // Store the URL of the uploaded file
      });

      // Reset form after successful post
      setIdea("");
      setFile(null);
    } catch (error) {
      console.error("Error posting tweet:", error);
      // Implement more user-friendly error handling (e.g., toast notification)
      alert("Failed to post tweet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.Form}> {/* Using form instead of Form from react-router-dom for simplicity here */}
      <textarea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={idea}
        placeholder="What is happening?!"
        className={styles.TextArea}
      />
      <label htmlFor="file" className={styles.AttachFileButton}>
        {file ? `Photo added: ${file.name.substring(0, 20)}... ✅` : "Add photo"}
      </label>
      {file && (
          <button type="button" onClick={() => setFile(null)} className={styles.AttachFileButton} style={{ marginLeft: '10px' }}>
              Remove Photo
          </button>
      )}
      <input
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
        className={styles.AttachFileInput}
      />
      <input
        type="submit"
        value={isLoading ? "Posting..." : "Post Idea"}
        className={styles.SubmitBtn}
        disabled={isLoading || (idea === "" && !file)}
      />
    </form>
  );
}