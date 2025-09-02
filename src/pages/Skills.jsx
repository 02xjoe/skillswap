import React, { useEffect, useState } from "react";                // React + hooks
import {
  collection, addDoc, onSnapshot, query, where, orderBy,          // Firestore read/write APIs
  doc, deleteDoc, updateDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase.js";                      // your Firestore instance
import { useAuth } from "../context/AuthContext.jsx";              // current logged-in user

export default function Skills() {
  const { user } = useAuth();                                     // current user (or null)

  // ---- form state for creating a skill post
  const [title, setTitle] = useState("");                         // skill title (single input)
  const [description, setDescription] = useState("");             // optional short description

  // ---- list state + editing state
  const [skills, setSkills] = useState([]);                       // array of posts from Firestore
  const [editingId, setEditingId] = useState(null);               // id of the post being edited
  const [editingTitle, setEditingTitle] = useState("");           // edit buffer for title
  const [editingDescription, setEditingDescription] = useState(""); // edit buffer for description

  // ---- subscribe to Firestore (category = 'skills'), newest first
  useEffect(() => {
    const q = query(
      collection(db, "swaps"),                                    // collection path
      where("category", "==", "skills"),                          // only skills posts
      orderBy("createdAt", "desc")                                // newest first
    );
    const unsub = onSnapshot(q, (snap) => {                       // realtime updates
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() })); // map docs to objects
      setSkills(rows);                                            // push into state
    });
    return () => unsub();                                         // cleanup on unmount
  }, []);

  // ---- create a new skill post
  async function handleAdd(e) {
    e.preventDefault();                                           // stop page reload
    if (!title.trim()) return;                                    // ignore empty titles
    await addDoc(collection(db, "swaps"), {                       // write to Firestore
      title: title.trim(),
      description: description.trim(),
      category: "skills",                                         // future-proof category
      createdBy: user?.uid ?? null,                               // owner uid (or null)
      createdAt: serverTimestamp(),                               // server time for proper sort
    });
    setTitle("");                                                 // reset form
    setDescription("");
  }

  // ---- begin editing a post (prefill edit inputs)
  function startEdit(item) {
    setEditingId(item.id);
    setEditingTitle(item.title ?? "");
    setEditingDescription(item.description ?? "");
  }

  // ---- save the edited post
  async function saveEdit(id) {
    if (!editingTitle.trim()) return;                             // title is required
    await updateDoc(doc(db, "swaps", id), {                       // patch document
      title: editingTitle.trim(),
      description: editingDescription.trim(),
      updatedAt: serverTimestamp(),
    });
    setEditingId(null);                                           // exit edit mode
    setEditingTitle("");
    setEditingDescription("");
  }

  // ---- delete a post (owner only)
  async function handleDelete(id, ownerId) {
    if (!user || user.uid !== ownerId) {                          // guard: only author can delete
      return alert("You can only delete your own posts");
    }
    await deleteDoc(doc(db, "swaps", id));                        // remove document
  }

  return (
    // full-width section; add a subtle container padding
    <section className="w-full px-4 py-8">
      {/* page title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Skills</h1>

      {/* create form (visible only when logged in) */}
      {user ? (
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] mb-8">
          {/* single title input */}
          <input
            // title input is independent from description (prevents the “two bars mirror” bug)
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Skill title — e.g., Teach React basics"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* optional description */}
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* submit button with forced bg color to beat any overrides */}
          <button
            type="submit"
            className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:!bg-blue-700 transition"
          >
            Add Skill
          </button>
        </form>
      ) : (
        // message for logged-out users
        <p className="mb-8 text-sm text-gray-600">Log in to post a skill.</p>
      )}

      {/* list of skill posts */}
      <ul className="space-y-4">
        {skills.map((item) => (
          <li key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
            {editingId === item.id ? (
              // ----- edit mode -----
              <div className="space-y-2">
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edit title"
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edit description"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(item.id)}
                    type="button"
                    className="!bg-green-600 text-white px-3 py-1 rounded-lg hover:!bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    type="button"
                    className="border px-3 py-1 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // ----- view mode -----
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {item.createdBy === user?.uid ? "Posted by you" : "Posted"}
                  </p>
                </div>

                {/* owner-only actions */}
                {item.createdBy === user?.uid && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="border px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.createdBy)}
                      className=""
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}