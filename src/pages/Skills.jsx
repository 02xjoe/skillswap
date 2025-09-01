import React,{useState, useEffect} from 'react'
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    doc,
    deleteDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore'
import {db} from '../services/firebase.js'
import {useAuth} from '../context/AuthContext.jsx'

export default function Skills() {
    const {user} = useAuth()          //this is the current logged-in user(may be null)
    //  if no user is logged in)
    const [skills, setSkills]= useState([]) //list is fectched from firestore
    const [newSkill, setNewSkill] = useState('') //for new skill input field
    const [editingIndex, setEditingIndex] = useState(null) //
    const [editValue, setEditValue] = useState('') //

 //1. subscribe to Firestore 'swaps' where category == 'skill'

      // ✅ Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    setSkills([...skills, newSkill]);
    setNewSkill(""); // clear input after adding
  };

  // ✅ Enable editing
  const handleEditSkill = (index) => {
    setEditingIndex(index);
    setEditValue(skills[index]);
  };

  // ✅ Save edited skill
  const handleSaveEdit = (index) => {
    const updated = [...skills];
    updated[index] = editValue;
    setSkills(updated);
    setEditingIndex(null);
    setEditValue("");
  };

   // ✅ Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Skills</h2>

      {/* Input box + add button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Skill
        </button>
      </div>

      {/* Skills list */}
      <ul className="space-y-3">
        {skills.length === 0 && (
          <p className="text-gray-500">No skills added yet. Try adding one!</p>
        )}

        {skills.map((skill, index) => (
          <li
            key={index}
            className="flex items-center justify-between border p-3 rounded-lg shadow-sm"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSaveEdit(index)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-lg">{skill}</span>
                <button
                  onClick={() => handleEditSkill(index)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}