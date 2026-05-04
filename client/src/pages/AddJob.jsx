// import React, { useEffect, useRef, useState } from 'react'
// import Quill from 'quill'
// import { JobCategories, JobLocations } from '../assets/assets'

// const AddJob = () => {
   
//    const [title, setTitle] = useState('');
//    const[location, setLocation] = useState('Banglore');
//    const[category, setCategory] = useState('Programming');
//    const[level, setLevel] = useState('Beginner Level');
//    const[salary, setSalary] = useState(0);

//    const editorRef = useRef(null)
//    const quillRef = useRef(null)
//    useEffect(() => {
//      // initiate quill only once
//      if(!quillRef.current && editorRef.current)
//      {
//         quillRef.current = new Quill(editorRef.current,{
//             theme:'snow',
//         })
//      }

//    },[])

 
//   return (
//     <form className='container p-4 flex flex-col w-full items-start gap-3'>
//     <div className='w-full'>
//         <p className='mb-2'>Job Title</p>
//         <input type="text" placeholder='Type here'
//         onChange={e => setTitle(e.target.value)} value={title}
//         required 
//         className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
//     </div>
//     <div className='w-full max-w-lg'>
//         <p className='my-2 '>
//             Job Description
//         </p>
//         <div ref={editorRef}>
         
//         </div>
//     </div>
//     <div className='flex flex-col sm:flex-row  gap-2 w-full sm:gap-8'>
//         <div>
//             <p className='mb-2'>
//               Job Category  
//             </p>
//             <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e=> setCategory(e.target.value)}>
//                 {JobCategories.map((category,index)=>(
//                     <option key={index} value={category}>{category}</option>
//                 ))}
//             </select>
//         </div>

//         <div>
//             <p className='mb-2'>
//               Job Location  
//             </p>
//             <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e=> setLocation(e.target.value)}>
//                 {JobLocations.map((location,index)=>(
//                     <option key={index} value={location}>{location}</option>
//                 ))}
//             </select>
//         </div>

//         <div>
//             <p className='mb-2'>
//               Job Level  
//             </p>
//             <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e=> setLevel(e.target.value)}>
//                <option value="Beginner level">Beginner level</option>
//                <option value="Intermediate level">Intermediate level</option>
//                <option value="Senior level">Senior level</option>
//             </select>
//         </div>


//     </div>
//     <div>
//         <p className='mb-2'>Job Salary</p>
//         <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]' onChange={e => setSalary(e.target.value)} type="Number" placeholder='2500'  />
//     </div>
//     <button className='w-28 py-3 mt-4 bg-black text-white rounded '>ADD</button>
//     </form>
//   )
// }

// export default AddJob


import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddJob = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner Level')
  const [salary, setSalary] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const navigate = useNavigate()
  const { companyToken, BACKEND_URL } = useContext(AppContext)

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const description = quillRef.current?.root.innerHTML
    if (!description || description === '<p><br></p>') {
      toast.error('Please enter a job description')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/post-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: companyToken },
        body: JSON.stringify({ title, description, location, jobType: category, level, salary }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Job posted successfully!')
        setTitle('')
        setSalary(0)
        quillRef.current.root.innerHTML = ''
        navigate('/dashboard/manage-jobs')
      } else {
        toast.error(data.message || 'Failed to post job')
      }
    } catch (error) {
      toast.error('Server error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
      <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input type='text' placeholder='Type here' onChange={e => setTitle(e.target.value)}
          value={title} required className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' />
      </div>
      <div className='w-full max-w-lg'>
        <p className='my-2'>Job Description</p>
        <div ref={editorRef}></div>
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Job Category</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)}>
            {JobCategories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <p className='mb-2'>Job Location</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
            {JobLocations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div>
          <p className='mb-2'>Job Level</p>
          <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLevel(e.target.value)}>
            <option value='Beginner Level'>Beginner Level</option>
            <option value='Intermediate Level'>Intermediate Level</option>
            <option value='Senior Level'>Senior Level</option>
          </select>
        </div>
      </div>
      <div>
        <p className='mb-2'>Job Salary</p>
        <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]'
          onChange={e => setSalary(e.target.value)} type='number' placeholder='2500' />
      </div>
      <button type='submit' disabled={isSubmitting} className='w-28 py-3 mt-4 bg-black text-white rounded disabled:opacity-60'>
        {isSubmitting ? 'Posting...' : 'ADD'}
      </button>
    </form>
  )
}
export default AddJob