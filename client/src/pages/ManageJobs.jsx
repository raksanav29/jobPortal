// import moment from 'moment'
// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { manageJobsData } from '../assets/assets'  


// const ManageJobs = () => {


//    const navigate = useNavigate()
//   return (
//     <div className='container p-4 max-w-5xl'>
//       <div className='overflow-x-auto'>
//         <table className='min-w-full bg-white border border-gray-200 max-sm:hidden'>
//           <thead>
//             <tr>
//               <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
//               <th className='py-2 px-4 border-b text-left'>Job Title</th>
//               <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
//               <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
//               <th className='py-2 px-4 border-b text-center'>Applicants</th>
//               <th className='py-2 px-4 border-b text-left'>Visible</th>
//             </tr>
//           </thead>
//           <tbody>
//             {manageJobsData.map((job,index)=>(
//               <tr key={index} className='text-gray-700'>
//                 <td className='py-2 px-4 border-b max-sm:hidden'>{index+1}</td>
//                 <td className='py-2 px-4 border-b'>{job.title}</td>
//                 <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
//                 <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
//                 <td className='py-2 px-4 border-b text-center'>{job.applicants}</td>
//                 <td className='py-2 px-4 border-b'>
//                   <input type="checkbox" className='scale-125 ml-4' />
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className='mt-4 flex justify-end '>
//           <button onClick={()=>navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>
//             Add New Job
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageJobs


import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ManageJobs = () => {
  const navigate = useNavigate()
  const { companyToken, BACKEND_URL } = useContext(AppContext)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCompanyJobs = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/list-jobs`, {
        headers: { token: companyToken }
      })
      const data = await res.json()
      if (data.success) setJobs(data.jobs)
      else toast.error(data.message)
    } catch (error) {
      toast.error('Failed to fetch jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVisibilityChange = async (jobId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/change-visibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: companyToken },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (data.success) {
        setJobs(prev => prev.map(job => job._id === jobId ? { ...job, visible: !job.visible } : job))
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to update visibility')
    }
  }

  useEffect(() => { if (companyToken) fetchCompanyJobs() }, [companyToken])

  if (isLoading) return <div className='p-8 text-gray-500'>Loading jobs...</div>

  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        {jobs.length === 0 ? (
          <div className='text-center py-16 text-gray-500'>
            <p className='text-lg'>No jobs posted yet.</p>
            <button onClick={() => navigate('/dashboard/add-job')} className='mt-4 bg-black text-white py-2 px-4 rounded'>Post Your First Job</button>
          </div>
        ) : (
          <table className='min-w-full bg-white border border-gray-200'>
            <thead>
              <tr>
                <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
                <th className='py-2 px-4 border-b text-left'>Job Title</th>
                <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
                <th className='py-2 px-4 border-b text-center'>Applicants</th>
                <th className='py-2 px-4 border-b text-left'>Visible</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={job._id} className='text-gray-700'>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                  <td className='py-2 px-4 border-b'>{job.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                  <td className='py-2 px-4 border-b text-center'>{job.applicants}</td>
                  <td className='py-2 px-4 border-b'>
                    <input type='checkbox' className='scale-125 ml-4 cursor-pointer'
                      checked={job.visible} onChange={() => handleVisibilityChange(job._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className='mt-4 flex justify-end'>
          <button onClick={() => navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add New Job</button>
        </div>
      </div>
    </div>
  )
}
export default ManageJobs