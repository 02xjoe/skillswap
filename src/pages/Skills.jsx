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

export default function Skills(){
    const {user} = useAuth()          //this is the current logged-in user(may be null)
    //  if no user is logged in)
    const [skills, setSkills]= useState([]) //list is fectched from firestore
    const [title, setTitle] = useState('')   //new post title
    const [description, setDescription] = useState('') // new post descr
    const [editingId, setEditingId]= useState(null) //Id being edited
    const [editingTitle, setEditingTitle] = useState('') //
    const [editingDescription, setEditingDescription] = useState('') //

 //1. subscribe to Firestore 'swaps' where category == 'skill'

    useEffect(() =>{
        const q = query(
            collection(db, 'swaps'),
            where('category', '==', 'skills'),
            orderBy('createdAt', 'desc'),
        )
        const unsub = onSnapshot(q, (snap)=>{
            const items = snap.docs.map(d =>({
                id: d.id,
                ...d.data(),
            }))
            setSkills(items)
        })

        return() => unsub()
    },[])

//2. add new skill post
     async function handleAdd(e){
        e.preventDefault()
        if(!title.trim()) return
        try{
            await addDoc(collection(db, 'swaps'),{
                title: title.trim(),
                description:description.trim(),
                category:'skills',  //future-proofing (other categories like 'jobs' may be added later)
                createdBy: user? user.uid : null,
                createdAt: serverTimestamp(),
            })
            setTitle('')
            setDescription('')
        
        }   catch (err) {
            console.error('Add failed', err)
        }
     }

// 3) delete (only owner can delete)
    async function handleDelete(od, ownerId) {
        if (!user || user.uid !== ownerId){
            return alert ('You can only delete your own posts')
        }
         await deleteDoc(doc(db, 'swaps', id))
    }    
    
// 4 start editing (popular fields)
    function startEdit(item) {
        setEditingId(item.id)
        setEditingTitle(item.title ||'')
        setEditingDescription(item.description || '')
    }

// 5 save edit
   async function saveEdit(id) {
        if (!editingTitle.trim()) return
        await updateDoc(doc(db, 'swaps', id), {
        title:editingTitle.trim(),
        description:editingDescription.trim(),
        updatedAt: serverTimestamp(),
       })
       setEditingId(null)
       setEditingTitle('')
       setEditingDescription('')
    }

    return (
        <div className = 'p-6 bg-white rounded-lg shadow-md'>
            <h1 className='text-2xl font-bold mb-4'>Skills</h1>

            {/* Add form (only if user is logged in)*/}
            {user?(
                <form onSubmit={handleAdd} className='flex flex-col sm:flex-row gap-2 mb-6'>
                    <input 
                       className='flex-1 border rounded-lg px-3 py-2'
                       placeholder='Title- e.g. Teach React hooks'
                       value = {title}
                       onChange = {(e) => setTitle(e.target.value)}
                     />
                    <input
                        className = 'flex-1 border rounded-lg px-3 py-2'
                        placeholder='Short description(optional)'
                        value={title}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className='bg-blue-600 text-white px-4 py-2 rounded-lg'>
                        Add
                    </button>
                </form>
            ):(            
                <p className='mb-4 text-sm text-gray-600'>
                    Log in to post a skill.
                </p>
            )}

            {/* List */}
            <ul className='space-y-4'>
                {skills.map(item =>(                    
                    <li key={item.id} className='border p-4 rounded-md bg-gray-50'>
                        {editingId === item.id ? (

                    <>
                        <input
                         className="w-full border p-2 mb-2 rounded"
                         value={editingTitle}
                         onChange={(e) => setEditingTitle(e.target.value)}
                        />
                        <textarea
                        className="w-full border p-2 mb-2 rounded"
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        />
                        <div className="flex gap-2">
                        <button onClick={() => saveEdit(item.id)} className="bg-green-600 text-white px-3 py-1 rounded">
                        Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded border">
                         Cancel
                         </button>
                        </div>
                     </>
                   ):(
                        <div className="flex justify-between items-start">
                            <div>
                                 <h3 className="text-lg font-semibold">{item.title}</h3>
                                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                                <p className="text-xs text-gray-400 mt-2">
                                {item.createdBy === user?.uid ? 'Posted by you' : `Posted by ${item.createdBy ?? 'someone'}`}
                                 </p>
                            </div>

                           <div className="flex gap-2">
                               {item.createdBy === user?.uid && (
                             <>
                                <button onClick={() => startEdit(item)} className="px-3 py-1 border rounded">Edit</button>
                                <button onClick={() => handleDelete(item.id, item.createdBy)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                             </>
                               )}
                            </div>
                       </div>
                    )}
                   </li>
            ))}
           </ul>
        </div>
    )
}