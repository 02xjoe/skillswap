// src/pages/Dashboard.jsx
/* ===========================================================================
   Dashboard — Profile + Skills + Requests (UI/design adapted from old version)
   - UI and design matched to the old Dashboard.jsx: profile card, grid layout, skill form, my skills list, requests sections, request modal.
   - Functionality based on new version: Mix of EC2/S3 for uploads (profile pic and skill media via presigned URLs), Firestore for user info/skills/requests, localStorage for caching profile and skills for faster reloads.
   - Real-time listeners kept from old for skills and requests (onSnapshot).
   - Uploads: Replaced Firebase Storage with EC2 API for presigned S3 URLs; uploads directly to S3.
   - Caching: Profile and skills cached in localStorage; loaded from cache first, then Firestore; updated after changes.
   - Comments added for clarity.
   =========================================================================== */

import React, { useEffect, useRef, useState } from "react"; // React + hooks

/* ---------------------------
   Firebase imports (Firestore only, since Storage is replaced by S3)
   --------------------------- */
import { db } from "../services/firebase.js"; // Assuming this exports Firestore db

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
  getDoc, // Used to fetch users/{uid} doc once
} from "firebase/firestore";

/* Axios for API calls to EC2 backend */
import axios from "axios";

/* Custom auth context hook - returns { user } (assuming same as old) */
import { useAuth } from "../context/AuthContext.jsx";

/* ---------------------------
   Dashboard component
   --------------------------- */
export default function Dashboard() {
  /* ---------------------------
     Auth / user info
     --------------------------- */
  const { user } = useAuth(); // Current logged-in user from context
  const uid = user?.uid || null; // Convenience uid (null if not logged in)

  /* ---------------------------
     PROFILE STATE
     - displayName: editable name shown to others
     - avatarPreview: URL or local preview dataURL for avatar image
     - profileStatus: shows uploading/saved messages
     - Loading state for profile
     --------------------------- */
  const [displayName, setDisplayName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profileStatus, setProfileStatus] = useState(""); // Shows uploading/saved messages
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* ---------------------------
     SKILL STATES (posting + list)
     --------------------------- */
  const [mySkills, setMySkills] = useState([]); // Realtime list of user's skills
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [desiredSwap, setDesiredSwap] = useState("");
  const [skillFiles, setSkillFiles] = useState([]); // File[] for skill media
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
     Helper: uploadFiles to S3 via EC2 presigned URLs
     - Adapted from new version: Requests presigned URLs from EC2, uploads directly to S3.
     - Handles multiple files, aggregates progress.
     - Returns array of { url, type } (no path, since S3 doesn't need deleteObject like Firebase).
     - Progress callback for UI feedback.
     ========================= */
  async function uploadFiles(filesArray, folder = "skills", setProgress = null) {
    if (!filesArray || filesArray.length === 0) return [];

    const files = Array.from(filesArray);
    const totalBytes = files.reduce((s, f) => s + f.size, 0);
    let uploadedBytes = 0;

    const promises = files.map(async (file) => {
      try {
        // Request presigned URL from EC2 backend
        const { data } = await axios.post("http://YOUR_EC2_IP:4000/get-presigned-url", {
          fileName: `${folder}/${uid || "anon"}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`,
          fileType: file.type,
        });

        const { uploadURL, fileURL } = data;

        // Upload directly to S3 with progress tracking
        await axios.put(uploadURL, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (progressEvent) => {
            if (setProgress) {
              const current = progressEvent.loaded;
              const percent = Math.round(((uploadedBytes + current) / totalBytes) * 100);
              setProgress(Math.min(100, percent));
            }
          },
        });

        uploadedBytes += file.size;
        if (setProgress) setProgress(Math.min(100, Math.round((uploadedBytes / totalBytes) * 100)));

        return { url: fileURL, type: file.type };
      } catch (err) {
        console.error("File upload failed:", err);
        throw err;
      }
    });

    return Promise.all(promises);
  }

  /* =========================
     LOAD PROFILE from localStorage first, then Firestore users/{uid}
     - Caching for faster reloads: Load from localStorage if available, then fetch/update from Firestore.
     - Single source-of-truth is Firestore, but cache speeds up initial load.
     ========================= */
  useEffect(() => {
    if (!uid) {
      setDisplayName("");
      setAvatarPreview("");
      setLoadingProfile(false);
      return;
    }

    const cachedProfile = localStorage.getItem(`profile_${uid}`);
    if (cachedProfile) {
      const { displayName: cachedName, avatar: cachedAvatar } = JSON.parse(cachedProfile);
      setDisplayName(cachedName ?? user?.displayName ?? user?.email?.split?.("@")?.[0] ?? "");
      setAvatarPreview(cachedAvatar ?? user?.photoURL ?? "");
      setLoadingProfile(false);
      console.log("Loaded profile from localStorage cache.");
    }

    (async () => {
      try {
        const userDocRef = doc(db, "users", uid);
        const snap = await getDoc(userDocRef);

        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.displayName ?? user?.displayName ?? user?.email?.split?.("@")?.[0] ?? "");
          setAvatarPreview(data.avatar ?? user?.photoURL ?? "");
          // Update cache
          localStorage.setItem(`profile_${uid}`, JSON.stringify({ displayName: data.displayName, avatar: data.avatar }));
          console.log("Loaded/updated profile from Firestore:", data);
        } else {
          // Fallback to auth defaults and cache
          const fallbackName = user?.displayName ?? user?.email?.split?.("@")?.[0] ?? "";
          const fallbackAvatar = user?.photoURL ?? "";
          setDisplayName(fallbackName);
          setAvatarPreview(fallbackAvatar);
          localStorage.setItem(`profile_${uid}`, JSON.stringify({ displayName: fallbackName, avatar: fallbackAvatar }));
          console.log("No Firestore doc; using/caching auth defaults.");
        }
      } catch (err) {
        console.error("Error loading profile from Firestore:", err);
        // Fallback to auth if error
        setDisplayName(user?.displayName ?? "");
        setAvatarPreview(user?.photoURL ?? "");
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [uid, user]);

  /* =========================
     PROFILE: handle avatar selection + upload to S3 via EC2
     - Shows local preview immediately.
     - Uploads using uploadFiles helper (presigned URLs).
     - Updates Firestore users/{uid} with URL (no Auth update, assuming new version doesn't use Firebase Auth profile).
     - Updates localStorage cache.
     ========================= */
  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !uid) return;

    // Quick local preview
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    try {
      console.log("Uploading avatar to S3 via EC2:", { uid, fileName: file.name });
      setProfileStatus("Uploading avatar...");

      // Upload to S3
      const uploads = await uploadFiles([file], "avatars", (p) => setProfileStatus(`Uploading... ${p}%`));
      const first = uploads[0];

      if (!first || !first.url) throw new Error("Upload did not return a URL");

      // Update Firestore
      await setDoc(doc(db, "users", uid), { displayName: displayName || null, avatar: first.url }, { merge: true });

      // Update state and cache
      setAvatarPreview(first.url);
      localStorage.setItem(`profile_${uid}`, JSON.stringify({ displayName, avatar: first.url }));
      setProfileStatus("Avatar uploaded.");
      console.log("Avatar uploaded and cached:", first.url);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setProfileStatus("Upload failed.");
    } finally {
      setTimeout(() => setProfileStatus(""), 1500);
    }
  }

  /* =========================
     PROFILE: save display name (persist to Firestore + update cache)
     - No Auth update, matching new version's simplicity.
     ========================= */
  async function handleSaveDisplayName(e) {
    e.preventDefault();
    if (!uid) return;
    try {
      console.log("Saving displayName:", displayName);
      setProfileStatus("Saving name...");

      // Update Firestore
      await setDoc(doc(db, "users", uid), { displayName: displayName || null, avatar: avatarPreview || null }, { merge: true });

      // Update cache
      localStorage.setItem(`profile_${uid}`, JSON.stringify({ displayName, avatar: avatarPreview }));
      setProfileStatus("Profile saved.");
      console.log("Display name saved and cached.");
    } catch (err) {
      console.error("Save name failed:", err);
      setProfileStatus("Save failed.");
    } finally {
      setTimeout(() => setProfileStatus(""), 1200);
    }
  }

  /* =========================
     MY SKILLS: realtime listener + localStorage cache
     - Load from cache first for fast reload, then set up onSnapshot for real-time updates.
     - Update cache whenever skills change.
     ========================= */
  useEffect(() => {
    if (!uid) {
      setMySkills([]);
      setLoadingSkills(false);
      return;
    }

    // Load from cache first
    const cachedSkills = localStorage.getItem(`skills_${uid}`);
    if (cachedSkills) {
      setMySkills(JSON.parse(cachedSkills));
      setLoadingSkills(false);
      console.log("Loaded skills from localStorage cache.");
    }

    // Set up real-time listener
    const q = query(collection(db, "skills"), where("ownerId", "==", uid), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMySkills(items);
        // Update cache
        localStorage.setItem(`skills_${uid}`, JSON.stringify(items));
        setLoadingSkills(false);
        console.log("Skills updated from Firestore snapshot.");
      },
      (err) => {
        console.error("Skills listener error:", err);
        setLoadingSkills(false);
      }
    );

    return () => unsub();
  }, [uid]);

  /* =========================
     POST SKILL: upload media to S3 then add Firestore doc
     - Uses uploadFiles for S3 uploads.
     - Cache updated via onSnapshot listener.
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

      // Upload media to S3
      const media = await uploadFiles(skillFiles, "skills", setSkillUploadProgress);

      // Build and save payload to Firestore
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

      // Reset form (cache updates via listener)
      setTitle("");
      setShortDesc("");
      setDesiredSwap("");
      setSkillFiles([]);
      if (skillFileRef.current) skillFileRef.current.value = "";
      setSkillUploadProgress(0);

      console.log("Skill posted; cache will update via listener.");
    } catch (err) {
      console.error("Post skill failed:", err);
      alert("Could not post skill.");
    } finally {
      setPostingSkill(false);
    }
  }

  /* =========================
     DELETE SKILL: remove Firestore doc (no S3 delete, as new version doesn't handle deletion)
     - Cache updates via onSnapshot.
     - Note: For full S3 cleanup, add delete logic if needed (requires storing S3 keys).
     ========================= */
  async function handleDeleteSkill(skill) {
    if (!skill || !skill.id) return;
    if (!confirm("Delete this skill?")) return;

    try {
      await deleteDoc(doc(db, "skills", skill.id));
      console.log("Deleted skill; cache will update via listener.");
    } catch (err) {
      console.error("Delete skill failed:", err);
      alert("Could not delete skill.");
    }
  }

  /* =========================
     REQUEST LISTENERS (incoming & outgoing) + caching
     - Similar to skills: Load from cache first, then onSnapshot.
     - Separate caches for incoming/outgoing.
     ========================= */
  useEffect(() => {
    if (!uid) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setRequestsLoading(false);
      return;
    }

    // Load incoming from cache
    const cachedIncoming = localStorage.getItem(`incoming_requests_${uid}`);
    if (cachedIncoming) {
      setIncomingRequests(JSON.parse(cachedIncoming));
    }

    // Load outgoing from cache
    const cachedOutgoing = localStorage.getItem(`outgoing_requests_${uid}`);
    if (cachedOutgoing) {
      setOutgoingRequests(JSON.parse(cachedOutgoing));
    }

    setRequestsLoading(false);

    // Incoming listener
    const inQ = query(collection(db, "swapRequests"), where("toUserId", "==", uid), orderBy("createdAt", "desc"));
    const unsubIn = onSnapshot(inQ, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setIncomingRequests(items);
      localStorage.setItem(`incoming_requests_${uid}`, JSON.stringify(items));
    });

    // Outgoing listener
    const outQ = query(collection(db, "swapRequests"), where("fromUserId", "==", uid), orderBy("createdAt", "desc"));
    const unsubOut = onSnapshot(outQ, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOutgoingRequests(items);
      localStorage.setItem(`outgoing_requests_${uid}`, JSON.stringify(items));
    });

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
     SEND REQUEST: upload attachments to S3 -> add swapRequests doc
     ========================= */
  async function handleSendRequest(e) {
    e.preventDefault();
    if (!uid || !activeSkillToRequest) {
      alert("Please sign in and select a skill.");
      return;
    }
    if (!requestMessage.trim()) {
      alert("Please write a short message.");
      return;
    }

    try {
      setSendingRequest(true);
      setRequestUploadProgress(0);

      console.log("Sending request for skill:", activeSkillToRequest.id);

      // Upload attachments to S3
      const attachments = await uploadFiles(requestFiles, "requests", setRequestUploadProgress);

      // Build and save payload to Firestore
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

      // Reset (cache updates via listener)
      setRequestModalOpen(false);
      setActiveSkillToRequest(null);
      setRequestFiles([]);
      if (requestFileRef.current) requestFileRef.current.value = "";
      setRequestUploadProgress(0);
      alert("Request sent.");
      console.log("Request sent; cache will update.");
    } catch (err) {
      console.error("Send request failed:", err);
      alert("Could not send request.");
    } finally {
      setSendingRequest(false);
    }
  }

  /* =========================
     RESPOND TO REQUEST (owner) & CANCEL OUTGOING
     - Updates Firestore; cache via listener.
     ========================= */
  async function handleRespondRequest(requestId, newStatus) {
    try {
      await updateDoc(doc(db, "swapRequests", requestId), { status: newStatus, respondedAt: serverTimestamp() });
      console.log("Updated request; cache will update.");
    } catch (err) {
      console.error("Respond failed:", err);
      alert("Could not update request.");
    }
  }

  async function handleCancelOutgoing(requestId) {
    try {
      await deleteDoc(doc(db, "swapRequests", requestId));
      console.log("Cancelled request; cache will update.");
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Could not cancel request.");
    }
  }

  /* =========================
     Helper: format Firestore timestamps
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
     - Matches old version: pt-24 for navbar, max-w-6xl, sections with rounded-2xl shadow.
     - Grid for skills + requests.
     - Loading states integrated.
     ========================= */
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        {/* PROFILE CARD */}
        {loadingProfile ? (
          <div className="text-center text-gray-500">Loading profile...</div>
        ) : (
          <section className="bg-white rounded-2xl shadow p-4 mb-6 flex items-center gap-4">
            {/* Avatar area (click to upload) */}
            <div className="flex-shrink-0">
              <label className="cursor-pointer">
                <img
                  src={avatarPreview || user?.photoURL || "https://via.placeholder.com/120?text=Avatar"}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>

            {/* Name + email */}
            <div className="flex-1">
              <div className="text-sm text-gray-500">Welcome</div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-gray-800">{displayName || user?.email}</div>
              </div>
              <div className="text-xs text-gray-400 mt-1">{user?.email}</div>
            </div>

            {/* Edit display name form */}
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

            {/* Status message */}
            {profileStatus && <div className="text-sm text-gray-500 ml-4">{profileStatus}</div>}
          </section>
        )}

        {/* MAIN GRID: left -> post skill & my skills, right -> requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Post skill + My Skills */}
          <div className="lg:col-span-2 space-y-4">
            {/* Post skill */}
            <section className="bg-white rounded-2xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Add a Skill</h3>
              <form onSubmit={handlePostSkill} className="space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title (eg. React basics)"
                  className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  required
                />

                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Short description (one or two lines)"
                  rows={2}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm resize-none"
                />

                <input
                  value={desiredSwap}
                  onChange={(e) => setDesiredSwap(e.target.value)}
                  placeholder="What do you want in return? (eg. logo, 1-hour lesson)"
                  className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                />

                <div className="flex items-center gap-3">
                  <label className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm cursor-pointer">
                    <input
                      ref={skillFileRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setSkillFiles(Array.from(e.target.files))}
                    />
                    Attach media
                  </label>

                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Upload: {skillUploadProgress}%</div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                      <div className="h-2 bg-blue-500 rounded" style={{ width: `${skillUploadProgress}%` }} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={postingSkill}
                    className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white text-sm shadow-sm"
                  >
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
                                {m.type.startsWith("image") ? (
                                  <img src={m.url} alt={`m-${i}`} className="w-full h-full object-cover" />
                                ) : (
                                  <video src={m.url} className="w-full h-full object-cover" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleDeleteSkill(s)} className="text-xs text-red-500">
                          Delete
                        </button>
                        <button onClick={() => openRequestModal(s)} className="text-xs text-blue-600">
                          View / Requests
                        </button>
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
                            <button
                              onClick={() => handleRespondRequest(r.id, "accepted")}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRespondRequest(r.id, "declined")}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <div className={`text-xs ${r.status === "accepted" ? "text-green-600" : "text-red-600"}`}>
                            {r.status}
                          </div>
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
                        <div
                          className={`text-xs ${r.status === "pending" ? "text-yellow-600" : r.status === "accepted" ? "text-green-600" : "text-red-600"}`}
                        >
                          {r.status}
                        </div>
                        {r.status === "pending" && (
                          <button onClick={() => handleCancelOutgoing(r.id)} className="text-xs text-gray-600">
                            Cancel
                          </button>
                        )}
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
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Short message describing your offer"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md resize-none"
                  rows={3}
                  required
                />
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md cursor-pointer text-sm">
                    <input
                      ref={requestFileRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setRequestFiles(Array.from(e.target.files))}
                    />
                    Attach (optional)
                  </label>
                  <div className="flex-1 text-xs text-gray-500">
                    Files: {requestFiles.length} • Progress: {requestUploadProgress}%
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(false)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingRequest}
                      className="px-4 py-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-500 text-white rounded-full text-sm"
                    >
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