/* src/pages/Skills.jsx
   Slimmed, commented Skills page:
   - pt-24 to clear fixed navbar
   - compact inputs and textarea without black borders
   - gradient buttons with no border artefacts
   - upload + realtime Firestore + request flow kept
*/

import React, { useEffect, useState, useRef } from "react"; /* core React + hooks */
import { Link } from "react-router-dom"; /* Link for navigation */

/* custom hook that returns { user } from your AuthProvider */
import { useAuth } from "../context/AuthContext.jsx";

/* Firestore APIs used in this page */
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";

/* Storage APIs for file uploads */
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/* your initialized firebase exports (db, storage) */
import { db, storage } from "../services/firebase.js";

/* small animation lib; optional - remove if you don't want it */
import { motion } from "framer-motion";

export default function Skills() {
  /* ---------- Auth & form state ---------- */
  const { user } = useAuth(); /* current logged-in Firebase user (or null) */

  const [title, setTitle] = useState(""); /* skill title */
  const [description, setDescription] = useState(""); /* short description */
  const [desiredSwap, setDesiredSwap] = useState(""); /* what you want in return */

  const [files, setFiles] = useState([]); /* selected files (images/videos) */
  const fileInputRef = useRef(null); /* ref to reset file input after upload */

  const [uploadProgress, setUploadProgress] = useState(0); /* aggregated upload progress % */

  /* ---------- listings & search ---------- */
  const [skills, setSkills] = useState([]); /* realtime skills list */
  const [loading, setLoading] = useState(true); /* loading flag for listings */
  const [search, setSearch] = useState(""); /* client-side search text */

  /* ---------- request-to-swap modal ---------- */
  const [requestOpen, setRequestOpen] = useState(false); /* whether modal is open */
  const [activeSkill, setActiveSkill] = useState(null); /* skill chosen for request */
  const [requestMessage, setRequestMessage] = useState(""); /* message for request */
  const [requestFiles, setRequestFiles] = useState([]); /* optional attachments for request */
  const requestFileRef = useRef(null); /* ref to clear request file input */

  /* ---------- Firestore collection refs ---------- */
  const skillsCollection = collection(db, "skills"); /* top-level skills collection */
  const requestsCollection = collection(db, "swapRequests"); /* swap requests collection */

  /* ---------- realtime listener for skills ---------- */
  useEffect(() => {
    /* Build query (newest first) */
    const q = query(skillsCollection, orderBy("createdAt", "desc"));

    /* Subscribe to realtime updates */
    const unsub = onSnapshot(
      q,
      (snap) => {
        /* map snapshot docs to simple objects */
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSkills(items); /* update state => triggers re-render */
        setLoading(false); /* hide loading */
      },
      (err) => {
        console.error("Failed to listen to skills:", err);
        setLoading(false);
      }
    );

    /* cleanup listener when component unmounts */
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); /* run once on mount */

  /* ---------- helper: upload files to Storage, return [{url,type}] ---------- */
  async function uploadFilesToStorage(fileList, folder = "skills", setProgress = null) {
    /* if nothing selected, return empty array */
    if (!fileList || fileList.length === 0) return [];

    const arr = Array.from(fileList); /* convert FileList to array */
    const totalBytes = arr.reduce((s, f) => s + f.size, 0); /* total bytes of all files */
    let uploadedBytes = 0; /* track completed bytes */

    /* upload each file and return promise that resolves to {url, type} */
    const uploads = arr.map((file) => {
      const ownerId = user ? user.uid : "anon"; /* folder by user */
      const stamp = Date.now();
      const safeName = file.name.replace(/\s+/g, "_"); /* sanitize filename */
      const path = `${folder}/${ownerId}/${stamp}_${safeName}`; /* storage path */

      const sRef = storageRef(storage, path); /* firebase storage reference */
      const task = uploadBytesResumable(sRef, file); /* start resumable upload */

      /* wrap the task in a promise */
      return new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            /* report coarse progress if callback provided */
            if (setProgress) {
              /* approx percent = (uploadedBytes + currentFileProgress) / totalBytes */
              const current = snap.bytesTransferred;
              const estimate = Math.round(((uploadedBytes + current) / totalBytes) * 100);
              setProgress(Math.min(100, estimate));
            }
          },
          (err) => {
            reject(err); /* upload error */
          },
          async () => {
            /* on complete get download URL */
            try {
              const url = await getDownloadURL(task.snapshot.ref);
              uploadedBytes += file.size; /* mark file as completed bytes */
              if (setProgress) {
                setProgress(Math.min(100, Math.round((uploadedBytes / totalBytes) * 100)));
              }
              resolve({ url, type: file.type }); /* return url + mime type */
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    });

    /* wait for all uploads and return results */
    const results = await Promise.all(uploads);
    return results; /* array of {url,type} */
  }

  /* ---------- handle add skill (form submit) ---------- */
  async function handleAddSkill(e) {
    e.preventDefault(); /* prevent page refresh on submit */

    /* require login to post */
    if (!user) {
      alert("Please sign up or log in to post a skill.");
      return;
    }

    /* require non-empty title */
    if (!title.trim()) {
      alert("Please add a title for your skill.");
      return;
    }

    try {
      setUploadProgress(0); /* reset progress UI */

      /* upload media, returns array of {url,type} */
      const media = await uploadFilesToStorage(files, "skills", setUploadProgress);

      /* build Firestore document */
      const docData = {
        title: title.trim(),
        description: description.trim(),
        desiredSwap: desiredSwap.trim(),
        media: media,
        ownerId: user.uid,
        ownerEmail: user.email || null,
        createdAt: serverTimestamp(),
      };

      /* add to Firestore */
      await addDoc(skillsCollection, docData);

      /* reset inputs + UI */
      setTitle("");
      setDescription("");
      setDesiredSwap("");
      setFiles([]);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = ""; /* clear file input element */
    } catch (err) {
      console.error("Post failed:", err);
      alert("Could not post skill. Check console.");
    }
  }

  /* ---------- handle delete skill (owner only) ---------- */
  async function handleDeleteSkill(skill) {
    /* only owner allowed */
    if (!user || user.uid !== skill.ownerId) {
      alert("Only the owner can delete this skill.");
      return;
    }
    if (!confirm("Delete this skill?")) return; /* confirm */

    try {
      /* delete Firestore doc; storage cleanup is best-effort */
      await deleteDoc(doc(db, "skills", skill.id));
      /* NOTE: deleting storage objects reliably requires storing their storage paths */
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete skill.");
    }
  }

  /* ---------- Request modal helpers ---------- */
  function openRequest(skill) {
    setActiveSkill(skill); /* set which skill user requests */
    setRequestMessage(""); /* reset message */
    setRequestFiles([]); /* reset attachments */
    if (requestFileRef.current) requestFileRef.current.value = ""; /* clear file input */
    setRequestOpen(true); /* show modal */
  }

  async function handleSendRequest(e) {
    e.preventDefault();

    /* require login to request */
    if (!user) {
      alert("Please log in to send requests.");
      return;
    }
    if (!activeSkill) return;

    try {
      setUploadProgress(0); /* reuse progress state visually */
      /* upload any request attachments */
      const attachments = await uploadFilesToStorage(requestFiles, "requests", setRequestUploadProgress);

      /* build request doc */
      const req = {
        skillId: activeSkill.id,
        skillTitle: activeSkill.title,
        fromUserId: user.uid,
        fromUserEmail: user.email || null,
        toUserId: activeSkill.ownerId,
        message: requestMessage.trim(),
        attachments,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      /* push request into Firestore */
      await addDoc(requestsCollection, req);

      /* reset modal */
      setRequestOpen(false);
      setActiveSkill(null);
      setRequestFiles([]);
      setRequestMessage("");
      setRequestUploadProgress(0);
      if (requestFileRef.current) requestFileRef.current.value = "";
      alert("Request sent.");
    } catch (err) {
      console.error("Request error:", err);
      alert("Could not send request.");
    }
  }

  /* ---------- owner request management (brief) ---------- */
  const [ownerRequests, setOwnerRequests] = useState([]); /* requests where current user is the recipient */
  const [showOwnerRequests, setShowOwnerRequests] = useState(false); /* toggle owner panel */

  useEffect(() => {
    /* if not logged in we stop */
    if (!user) {
      setOwnerRequests([]);
      return;
    }
    /* query requests where toUserId === current user */
    const q = query(requestsCollection, where("toUserId", "==", user.uid), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOwnerRequests(items);
      },
      (err) => {
        console.error("Owner requests listener error:", err);
      }
    );

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); /* re-run when user changes */

  /* ---------- accept/decline a request ---------- */
  async function handleUpdateRequestStatus(requestId, newStatus) {
    try {
      const rDoc = doc(db, "swapRequests", requestId);
      await updateDoc(rDoc, { status: newStatus, respondedAt: serverTimestamp() });
    } catch (err) {
      console.error("Update request failed:", err);
      alert("Could not update request.");
    }
  }

  /* ---------- client-side search filter ---------- */
  const filtered = skills.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.desiredSwap && s.desiredSwap.toLowerCase().includes(q)) ||
      (s.ownerEmail && s.ownerEmail.toLowerCase().includes(q))
    );
  });

  /* ---------- UI ---------- */
  return (
    /* outer wrapper; pt-24 ensures content sits below a fixed navbar */
    <div className="w-full min-h-screen bg-gray-50">
      {/* centered max-width container with top padding to clear navbar */ }
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* header row: title + search */ }
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* page title */ }
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Skills Market</h1>
            <p className="text-gray-600 mt-1 text-sm">Post a skill, find someone to swap with, simple and fast.</p>
          </div>

          {/* search input (compact) */ }
          <div className="w-full md:w-80">
            <input
              value={search} /* controlled input */
              onChange={(e) => setSearch(e.target.value)} /* update search text */
              placeholder="Search skills, people, swaps..."
              className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* owner requests toggle (small button) */ }
        <div className="flex items-center justify-end mb-6">
          {user && (
            <button
              onClick={() => setShowOwnerRequests((v) => !v)} /* toggle panel */
              className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm shadow-sm"
            >
              {showOwnerRequests ? "Hide requests" : `Requests (${ownerRequests.length})`}
            </button>
          )}
        </div>

        {/* owner requests panel (slim) */ }
        {showOwnerRequests && user && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="text-sm font-semibold mb-2">Requests for your listings</div>
            {ownerRequests.length === 0 ? (
              <div className="text-gray-500 text-sm">No requests yet.</div>
            ) : (
              <div className="space-y-3">
                {ownerRequests.map((r) => (
                  <div key={r.id} className="flex justify-between items-start border p-3 rounded">
                    <div>
                      <div className="text-sm font-medium">{r.skillTitle}</div>
                      <div className="text-xs text-gray-500">From: {r.fromUserEmail || "Anonymous"}</div>
                      <div className="text-sm mt-2">{r.message}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className={`text-sm font-semibold ${r.status === "pending" ? "text-yellow-600" : r.status === "accepted" ? "text-green-600" : "text-red-600"}`}>
                        {r.status}
                      </div>

                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateRequestStatus(r.id, "accepted")} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Accept</button>
                          <button onClick={() => handleUpdateRequestStatus(r.id, "declined")} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Decline</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* post form (compact card) */ }
        <div className="bg-white rounded-2xl shadow p-4 mb-8">
          <form onSubmit={handleAddSkill} className="space-y-3">
            {/* title - compact input */ }
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Skill title (e.g. React basics)"
              className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />

            {/* description - short textarea (rows=2) with light border */ }
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (what you teach, duration)"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={2}
            />

            {/* desired swap - compact */ }
            <input
              value={desiredSwap}
              onChange={(e) => setDesiredSwap(e.target.value)}
              placeholder="What do you want in return? (e.g. 'logo', '1 hour guitar lesson')"
              className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            {/* file input + progress + submit row */ }
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-md cursor-pointer text-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="hidden"
                />
                Attach media
              </label>

              {/* progress bar (small) */ }
              <div className="flex-1">
                <div className="text-xs text-gray-500">Upload: {uploadProgress}%</div>
                <div className="w-full h-2 bg-gray-200 rounded mt-1">
                  <div className="h-2 bg-blue-500 rounded" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>

              {/* submit button - rounded, no border so gradient edge is clean */ }
              <button
                type="submit"
                disabled={!user || !title.trim()}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white font-semibold shadow-md hover:opacity-95 focus:outline-none"
                title={!user ? "Sign up to post" : !title.trim() ? "Enter a title" : "Post skill"}
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* listings grid (compact cards) */ }
        <section>
          <h2 className="text-lg font-semibold mb-3">Recent Listings</h2>

          {loading ? (
            <div className="text-gray-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500">No skills found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((s) => (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md"
                >
                  {/* header row */ }
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-blue-600">{s.title}</h3>
                      <div className="text-xs text-gray-600 mt-1">{s.description}</div>
                      {s.desiredSwap && <div className="text-xs mt-2 text-gray-700"><strong>Wants:</strong> {s.desiredSwap}</div>}
                    </div>

                    <div className="text-right text-xs text-gray-500">
                      <div>{s.ownerEmail || "Anonymous"}</div>
                      <div className="mt-1">{s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : ""}</div>
                    </div>
                  </div>

                  {/* media preview (small) */ }
                  {s.media && s.media.length > 0 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {s.media.map((m, i) => (
                        <div key={i}>
                          {m.type && m.type.startsWith("image") ? (
                            <img src={m.url} alt={`media-${i}`} className="w-full h-32 object-cover rounded" />
                          ) : (
                            <video src={m.url} controls className="w-full h-36 object-cover rounded" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* action row */ }
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* request button (hidden to owner) */ }
                      {(!user || user.uid !== s.ownerId) && (
                        <button onClick={() => openRequest(s)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Request</button>
                      )}

                      {/* view link */ }
                      <Link to={`/skills/${s.id}`} className="text-xs text-gray-600 hover:underline">View</Link>
                    </div>

                    {/* owner actions (delete) */ }
                    {user && user.uid === s.ownerId && (
                      <button onClick={() => handleDeleteSkill(s)} className="text-xs text-red-500">Delete</button>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ===== Request Modal (compact) ===== */ }
      {requestOpen && activeSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold mb-2">Request Swap — {activeSkill.title}</h3>
            <form onSubmit={handleSendRequest} className="space-y-3">
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Write a short message about your offer..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
                rows={3}
                required
              />

              <div className="flex items-center gap-3">
                <label className="px-3 py-1 bg-gray-100 rounded cursor-pointer text-sm">
                  <input ref={requestFileRef} type="file" accept="image/*,video/*" multiple onChange={(e) => setRequestFiles(Array.from(e.target.files))} className="hidden" />
                  Attach (optional)
                </label>

                <div className="flex-1 text-xs text-gray-600">Files: {requestFiles.length}</div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setRequestOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white rounded-full">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}