// src/pages/Dashboard.jsx
/* ===========================================================================
   Live Dashboard — Profile + Skills + Requests (fixed avatar persistence + debug)
   - Uses Firestore 'users', 'skills', 'swapRequests' collections
   - Uploads media to Firebase Storage and stores URLs + paths in Firestore
   - Real-time listeners for "my skills" and requests
   - Ensures avatar & displayName are loaded from users/{uid} (single source of truth)
   - Adds debug console.logs in key handlers so you can see what's happening
   =========================================================================== */

import React, { useEffect, useRef, useState } from "react"; // React + hooks

/* ---------------------------
   Firebase imports (modular v9+)
   - auth, db, storage should be exported from your src/services/firebase.js
   --------------------------- */
import { auth, db, storage } from "../services/firebase.js";

/* updateProfile updates the Firebase Auth user object */
import { updateProfile } from "firebase/auth";

/* Firestore helpers */
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc, // <-- used to fetch users/{uid} doc once
} from "firebase/firestore";

/* Storage helpers (note we alias ref => storageRef) */
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

/* small animation lib (optional) */
import { motion } from "framer-motion";

/* Custom auth context hook - returns { user } */
import { useAuth } from "../context/AuthContext.jsx";

/* ---------------------------
   Dashboard component
   --------------------------- */
export default function Dashboard() {
  /* ---------------------------
     Auth / user info
     --------------------------- */
  const { user } = useAuth(); // current logged-in user from context
  const uid = user?.uid || null; // convenience uid (null if not logged in)

  /* ---------------------------
     PROFILE STATE
     - displayName: editable name shown to others
     - avatarPreview: URL or local preview dataURL for avatar image
     - avatarInputRef: file input ref (hidden)
     --------------------------- */
  const [displayName, setDisplayName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const avatarInputRef = useRef(null);
  const [profileStatus, setProfileStatus] = useState(""); // shows uploading/saved messages

  /* ---------------------------
     SKILL STATES (posting + list)
     --------------------------- */
  const [mySkills, setMySkills] = useState([]); // realtime list of user's skills
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [desiredSwap, setDesiredSwap] = useState("");
  const [skillFiles, setSkillFiles] = useState([]); // File[]
  const skillFileRef = useRef(null);
  const [skillUploadProgress, setSkillUploadProgress] = useState(0);
  const [postingSkill, setPostingSkill] = useState(false);

  /* ---------------------------
     REQUEST STATES
     --------------------------- */
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [activeSkillToRequest, setActiveSkillToRequest] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestFiles, setRequestFiles] = useState([]);
  const requestFileRef = useRef(null);
  const [requestUploadProgress, setRequestUploadProgress] = useState(0);
  const [sendingRequest, setSendingRequest] = useState(false);

  /* =========================
     Helper: uploadFiles
     - Upload an array of File objects to Storage under a folder
     - Returns array of { url, type, path } results
     - Calls setProgress(percent) if provided so caller can show an aggregated progress bar
     ========================= */
  async function uploadFiles(filesArray, folder = "skills", setProgress = null) {
    if (!filesArray || filesArray.length === 0) return [];

    const files = Array.from(filesArray);
    const totalBytes = files.reduce((s, f) => s + f.size, 0);
    let uploadedBytes = 0;

    const promises = files.map((file) => {
      /* create unique path to avoid collisions */
      const path = `${folder}/${uid || "anon"}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const sRef = storageRef(storage, path); // storage ref
      const task = uploadBytesResumable(sRef, file); // starts upload

      return new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) => {
            /* report aggregated progress if callback provided */
            if (setProgress) {
              const current = snapshot.bytesTransferred;
              const percent = Math.round(((uploadedBytes + current) / totalBytes) * 100);
              setProgress(Math.min(100, percent));
            }
          },
          (err) => reject(err),
          async () => {
            /* on complete get the download URL and resolve */
            const url = await getDownloadURL(task.snapshot.ref);
            uploadedBytes += file.size;
            if (setProgress) setProgress(Math.min(100, Math.round((uploadedBytes / totalBytes) * 100)));
            resolve({ url, type: file.type, path });
          }
        );
      });
    });

    return Promise.all(promises);
  }

  /* =========================
     LOAD PROFILE from Firestore users/{uid}
     - Important: this makes Firestore the single source-of-truth for avatar & name.
     - Ensures avatar doesn't "disappear" when Auth object is stale.
     ========================= */
  useEffect(() => {
    if (!uid) {
      setDisplayName("");
      setAvatarPreview("");
      return;
    }

    (async () => {
      try {
        // fetch users/{uid} doc once
        const userDocRef = doc(db, "users", uid);
        const snap = await getDoc(userDocRef);

        if (snap && snap.exists()) {
          const data = snap.data();
          /* prefer Firestore values; fallback to Auth fields */
          setDisplayName(data.displayName ?? user?.displayName ?? user?.email?.split?.("@")?.[0] ?? "");
          setAvatarPreview(data.avatar ?? user?.photoURL ?? "");
          console.log("Loaded profile from users/{uid} doc:", { uid, data });
        } else {
          /* no doc found -> use auth defaults */
          setDisplayName(user?.displayName ?? user?.email?.split?.("@")?.[0] ?? "");
          setAvatarPreview(user?.photoURL ?? "");
          console.log("No users/{uid} doc found — using auth defaults.");
        }
      } catch (err) {
        console.error("Error loading users/{uid} doc:", err);
        setDisplayName(user?.displayName ?? "");
        setAvatarPreview(user?.photoURL ?? "");
      }
    })();
    // rerun when uid or user changes
  }, [uid, user]);

  /* =========================
     PROFILE: handle avatar selection + upload
     - shows a quick preview immediately
     - uploads to Storage, saves URL to users/{uid} and updates Auth profile photoURL
     - lots of console logs for debugging
     ========================= */
  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !uid) return;

    /* quick local preview (Data URL) for instant UI feedback */
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    try {
      console.log("Attempting avatar upload:", { uid, fileName: file.name });
      setProfileStatus("Uploading avatar...");

      /* upload + get url */
      const uploads = await uploadFiles([file], "avatars", (p) => setProfileStatus(`Uploading avatar... ${p}%`));
      const first = uploads[0];

      if (!first || !first.url) throw new Error("Upload did not return a URL");

      /* update Firebase Auth profile (so auth.currentUser.photoURL is set) */
      await updateProfile(auth.currentUser, { photoURL: first.url });
      /* save a users/{uid} doc with avatar & displayName (merge so we don't overwrite) */
      await setDoc(doc(db, "users", uid), { displayName: displayName || null, avatar: first.url }, { merge: true });

      /* set final preview URL and status */
      setAvatarPreview(first.url);
      setProfileStatus("Avatar uploaded.");
      console.log("Avatar uploaded and saved to users/{uid}:", first.url);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setProfileStatus("Avatar upload failed.");
    } finally {
      /* clear status after a moment so UI is tidy */
      setTimeout(() => setProfileStatus(""), 1500);
    }
  }

  /* =========================
     PROFILE: save display name (persist to Auth + users/{uid})
     ========================= */
  async function handleSaveDisplayName(e) {
    e.preventDefault();
    if (!uid) return;
    try {
      console.log("Saving displayName for uid:", uid, "newName:", displayName);
      setProfileStatus("Saving name...");
      /* update auth profile so user.displayName is kept in sync */
      await updateProfile(auth.currentUser, { displayName: displayName || null });
      /* also persist in Firestore users/{uid} */
      await setDoc(doc(db, "users", uid), { displayName: displayName || null, avatar: avatarPreview || null }, { merge: true });
      setProfileStatus("Profile saved.");
      console.log("Display name saved to Auth + users/{uid}:", displayName);
    } catch (err) {
      console.error("Save name failed:", err);
      setProfileStatus("Could not save profile.");
    } finally {
      setTimeout(() => setProfileStatus(""), 1200);
    }
  }

  /* =========================
     MY SKILLS: realtime listener (ownerId == uid)
     - existing working logic; kept intact and robust
     ========================= */
  useEffect(() => {
    if (!uid) {
      setMySkills([]);
      setLoadingSkills(false);
      return;
    }

    const q = query(collection(db, "skills"), where("ownerId", "==", uid), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMySkills(items);
        setLoadingSkills(false);
      },
      (err) => {
        console.error("My skills listener error:", err);
        setLoadingSkills(false);
      }
    );

    return () => unsub();
  }, [uid]);

  /* =========================
     POST SKILL: upload media then add Firestore doc
     - keeps the compact inputs you like
     ========================= */
  async function handlePostSkill(e) {
    e.preventDefault();
    if (!uid) {
      alert("Please sign in to post a skill.");
      return;
    }
    if (!title.trim()) {
      alert("Please add a title.");
      return;
    }

    try {
      setPostingSkill(true);
      setSkillUploadProgress(0);

      console.log("Posting skill:", { title, shortDesc, desiredSwap, filesCount: skillFiles.length });

      /* upload media files (if any) */
      const media = await uploadFiles(skillFiles, "skills", setSkillUploadProgress);

      /* build payload and save */
      const payload = {
        title: title.trim(),
        shortDesc: shortDesc.trim(),
        desiredSwap: desiredSwap.trim(),
        media: media,
        ownerId: uid,
        ownerEmail: user?.email || null,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "skills"), payload);

      /* reset the form */
      setTitle("");
      setShortDesc("");
      setDesiredSwap("");
      setSkillFiles([]);
      if (skillFileRef.current) skillFileRef.current.value = "";
      setSkillUploadProgress(0);

      console.log("Skill posted successfully.");
    } catch (err) {
      console.error("Post skill failed:", err);
      alert("Could not post skill; check console for details.");
    } finally {
      setPostingSkill(false);
    }
  }

  /* =========================
     DELETE SKILL: owner removes skill doc and storage files (best-effort)
     ========================= */
  async function handleDeleteSkill(skill) {
    if (!skill || !skill.id) return;
    if (!confirm("Delete this skill?")) return;

    try {
      await deleteDoc(doc(db, "skills", skill.id));

      /* best-effort delete of storage objects (if path stored) */
      if (skill.media && Array.isArray(skill.media)) {
        for (const m of skill.media) {
          try {
            if (m.path) {
              await deleteObject(storageRef(storage, m.path));
            }
          } catch (err) {
            console.warn("Could not delete storage object:", err);
          }
        }
      }
      console.log("Deleted skill:", skill.id);
    } catch (err) {
      console.error("Delete skill failed:", err);
      alert("Could not delete skill.");
    }
  }

  /* =========================
     REQUEST LISTENERS (incoming & outgoing)
     ========================= */
  useEffect(() => {
    if (!uid) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setRequestsLoading(false);
      return;
    }

    const inQ = query(collection(db, "swapRequests"), where("toUserId", "==", uid), orderBy("createdAt", "desc"));
    const outQ = query(collection(db, "swapRequests"), where("fromUserId", "==", uid), orderBy("createdAt", "desc"));

    const unsubIn = onSnapshot(inQ, (snap) => setIncomingRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubOut = onSnapshot(outQ, (snap) => setOutgoingRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));

    setRequestsLoading(false);

    return () => {
      unsubIn();
      unsubOut();
    };
  }, [uid]);

  /* =========================
     OPEN request modal (prepares state)
     ========================= */
  function openRequestModal(skill) {
    setActiveSkillToRequest(skill);
    setRequestMessage("");
    setRequestFiles([]);
    if (requestFileRef.current) requestFileRef.current.value = "";
    setRequestModalOpen(true);
  }

  /* =========================
     SEND REQUEST: upload attachments -> add swapRequests doc
     ========================= */
  async function handleSendRequest(e) {
    e.preventDefault();
    if (!uid || !activeSkillToRequest) {
      alert("Please sign in and select a skill.");
      return;
    }
    if (!requestMessage.trim()) {
      alert("Please write a short message describing what you offer.");
      return;
    }

    try {
      setSendingRequest(true);
      setRequestUploadProgress(0);

      console.log("Sending request for skill:", activeSkillToRequest.id);

      const attachments = await uploadFiles(requestFiles, "requests", setRequestUploadProgress);

      const payload = {
        skillId: activeSkillToRequest.id,
        skillTitle: activeSkillToRequest.title,
        fromUserId: uid,
        fromUserEmail: user?.email || null,
        toUserId: activeSkillToRequest.ownerId,
        message: requestMessage.trim(),
        attachments: attachments,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "swapRequests"), payload);

      setRequestModalOpen(false);
      setActiveSkillToRequest(null);
      setRequestFiles([]);
      if (requestFileRef.current) requestFileRef.current.value = "";
      setRequestUploadProgress(0);
      alert("Request sent.");
      console.log("Request saved:", payload);
    } catch (err) {
      console.error("Send request failed:", err);
      alert("Could not send request.");
    } finally {
      setSendingRequest(false);
    }
  }

  /* =========================
     RESPOND TO REQUEST (owner) & CANCEL OUTGOING
     ========================= */
  async function handleRespondRequest(requestId, newStatus) {
    try {
      await updateDoc(doc(db, "swapRequests", requestId), { status: newStatus, respondedAt: serverTimestamp() });
      console.log("Updated request:", requestId, newStatus);
    } catch (err) {
      console.error("Respond request failed:", err);
      alert("Could not update request.");
    }
  }

  async function handleCancelOutgoing(requestId) {
    try {
      await deleteDoc(doc(db, "swapRequests", requestId));
      console.log("Cancelled outgoing request:", requestId);
    } catch (err) {
      console.error("Cancel request failed:", err);
      alert("Could not cancel request.");
    }
  }

  /* =========================
     small helper to format Firestore timestamps
     ========================= */
  function niceTime(ts) {
    try {
      if (!ts) return "";
      return ts.toDate().toLocaleString();
    } catch {
      return "";
    }
  }

  /* =========================
     RENDER UI
     - pt-24 accounts for a fixed navbar sitting at the top
     - sections are separated; not wrapped in a single huge div
     ========================= */
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* PROFILE CARD */}
        <section className="bg-white rounded-2xl shadow p-4 mb-6 flex items-center gap-4">
          {/* avatar area (click to open file dialog) */}
          <div className="flex-shrink-0">
            <label className="cursor-pointer">
              <img
                src={avatarPreview || user?.photoURL || "https://via.placeholder.com/120?text=Avatar"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
              />
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>

          {/* name + email */}
          <div className="flex-1">
            <div className="text-sm text-gray-500">Welcome</div>
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-gray-800">{user?.displayName || user?.email}</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{user?.email}</div>
          </div>

          {/* inline form to edit display name */}
          <form onSubmit={handleSaveDisplayName} className="flex items-center gap-2">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="h-9 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
            <button type="submit" className="px-3 py-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white rounded-full text-sm shadow-sm">
              Save
            </button>
          </form>
        </section>

        {/* MAIN GRID: left -> post skill & my skills, right -> requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Post skill + My Skills */}
          <div className="lg:col-span-2 space-y-4">
            {/* Post skill */}
            <section className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Add a Skill</h3>
              <form onSubmit={handlePostSkill} className="space-y-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (eg. React basics)" className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm" required />

                <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Short description (one or two lines)" rows={2} className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm resize-none" />

                <input value={desiredSwap} onChange={(e) => setDesiredSwap(e.target.value)} placeholder="What do you want in return? (eg. logo, 1-hour lesson)" className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm" />

                <div className="flex items-center gap-3">
                  <label className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm cursor-pointer">
                    <input ref={skillFileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => setSkillFiles(Array.from(e.target.files))} />
                    Attach media
                  </label>

                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Upload: {skillUploadProgress}%</div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                      <div className="h-2 bg-blue-500 rounded" style={{ width: `${skillUploadProgress}%` }} />
                    </div>
                  </div>

                  <button type="submit" disabled={postingSkill} className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white text-sm shadow-sm">
                    {postingSkill ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </section>

            {/* My Skills list */}
            <section className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">My Skills</h3>

              {loadingSkills ? (
                <div className="text-sm text-gray-500">Loading your skills…</div>
              ) : mySkills.length === 0 ? (
                <div className="text-sm text-gray-500">You haven't posted any skills yet.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {mySkills.map((s) => (
                    <div key={s.id} className="border rounded-md p-3 flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                            <div className="text-xs text-gray-500">{s.shortDesc}</div>
                            {s.desiredSwap && <div className="text-xs text-gray-700 mt-1">Wants: {s.desiredSwap}</div>}
                          </div>
                          <div className="text-xs text-gray-400">{niceTime(s.createdAt)}</div>
                        </div>

                        {s.media && s.media.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {s.media.slice(0, 2).map((m, i) => (
                              <div key={i} className="w-full h-20 overflow-hidden rounded">
                                {m.type && m.type.startsWith("image") ? <img src={m.url} alt={`m-${i}`} className="w-full h-full object-cover" /> : <video src={m.url} className="w-full h-full object-cover" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleDeleteSkill(s)} className="text-xs text-red-500">Delete</button>
                        <button onClick={() => openRequestModal(s)} className="text-xs text-blue-600">View / Requests</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: Requests */}
          <aside className="space-y-4">
            {/* Incoming */}
            <section className="bg-white rounded-2xl shadow p-4">
              <h4 className="text-md font-semibold mb-2">Incoming Requests</h4>
              {requestsLoading ? (
                <div className="text-sm text-gray-500">Loading…</div>
              ) : incomingRequests.length === 0 ? (
                <div className="text-sm text-gray-500">No incoming requests.</div>
              ) : (
                <div className="space-y-2">
                  {incomingRequests.map((r) => (
                    <div key={r.id} className="border rounded p-2 text-sm">
                      <div className="font-medium">{r.skillTitle}</div>
                      <div className="text-xs text-gray-500">From: {r.fromUserEmail || "Anonymous"}</div>
                      <div className="mt-1 text-sm">{r.message}</div>
                      <div className="mt-2 flex gap-2">
                        {r.status === "pending" ? (
                          <>
                            <button onClick={() => handleRespondRequest(r.id, "accepted")} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Accept</button>
                            <button onClick={() => handleRespondRequest(r.id, "declined")} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Decline</button>
                          </>
                        ) : (
                          <div className={`text-xs ${r.status === "accepted" ? "text-green-600" : "text-red-600"}`}>{r.status}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Outgoing */}
            <section className="bg-white rounded-2xl shadow p-4">
              <h4 className="text-md font-semibold mb-2">Outgoing Requests</h4>
              {outgoingRequests.length === 0 ? (
                <div className="text-sm text-gray-500">No outgoing requests.</div>
              ) : (
                <div className="space-y-2">
                  {outgoingRequests.map((r) => (
                    <div key={r.id} className="border rounded p-2 text-sm flex justify-between items-start">
                      <div>
                        <div className="font-medium">{r.skillTitle}</div>
                        <div className="text-xs text-gray-500">To: {r.toUserEmail || "User"}</div>
                        <div className="mt-1 text-sm">{r.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{niceTime(r.createdAt)}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className={`text-xs ${r.status === "pending" ? "text-yellow-600" : r.status === "accepted" ? "text-green-600" : "text-red-600"}`}>{r.status}</div>
                        {r.status === "pending" && <button onClick={() => handleCancelOutgoing(r.id)} className="text-xs text-gray-600">Cancel</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>

        {/* REQUEST MODAL */}
        {requestModalOpen && activeSkillToRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold">Request swap for: {activeSkillToRequest.title}</h3>
              <form onSubmit={handleSendRequest} className="mt-3 space-y-3">
                <textarea value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} placeholder="Short message describing your offer" className="w-full px-3 py-2 border border-gray-200 rounded-md resize-none" rows={3} required />
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md cursor-pointer text-sm">
                    <input ref={requestFileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => setRequestFiles(Array.from(e.target.files))} />
                    Attach (optional)
                  </label>
                  <div className="flex-1 text-xs text-gray-500">Files: {requestFiles.length} • Progress: {requestUploadProgress}%</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setRequestModalOpen(false)} className="px-3 py-1 border rounded text-sm">Cancel</button>
                    <button type="submit" disabled={sendingRequest} className="px-4 py-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white rounded-full text-sm">
                      {sendingRequest ? "Sending..." : "Send Request"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main> 
    </div>
  );
}

/* -------------------------
   Helper: niceTime to format Firestore timestamps safely
   ------------------------- */
function niceTime(ts) {
  try {
    if (!ts) return "";
    return ts.toDate().toLocaleString();
  } catch {
    return "";
  }
}