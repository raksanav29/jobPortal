// import React from 'react'
// import { assets, viewApplicationsPageData } from '../assets/assets'

// const ViewApplications = () => {
//   return (
//     <div className='container mx-auto p-4'>
//       <div>
//         <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          
//           <thead>
//             <tr className='border-b'>
//               <th className='py-2 px-4 text-left'>#</th>
//               <th className='py-2 px-4 text-left'>User name</th>
//               <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
//               <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
//               <th className='py-2 px-4 text-left'>Resume</th>  
//               <th className='py-2 px-4 text-left'>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {Array.isArray(viewApplicationsPageData) &&
//               viewApplicationsPageData.map((applicant, index) => (
//                 <tr key={index} className='text-gray-700'>
                  
//                   <td className='py-2 px-4 border-b text-center'>
//                     {index + 1}
//                   </td>

//                   <td className='py-2 px-4 border-b flex items-center gap-2'>
//                     <img
//                       className='w-10 h-10 rounded-full max-sm:hidden'
//                       src={applicant.imgSrc}
//                       alt=""
//                     />
//                     <span>{applicant.name}</span>
//                   </td>

//                   <td className='py-2 px-4 border-b max-sm:hidden'>
//                     {applicant.jobTitle}
//                   </td>

//                   <td className='py-2 px-4 border-b max-sm:hidden'>
//                     {applicant.location}
//                   </td>

//                   <td className='py-2 px-4 border-b'>
//                     <a
//                       href={applicant.resume || "#"}
//                       target='_blank'
//                       rel="noopener noreferrer"
//                       className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'
//                     >
//                       Resume
//                       <img src={assets.resume_download_icon} alt="" />
//                     </a>
//                   </td>

//                   <td className='py-2 px-4 border-b relative'>
//                     <div className='relative inline-block text-left group'>
                      
//                       <button className='text-gray-500'>...</button>

//                       <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
//                         <button className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>
//                           Accept
//                         </button>
//                         <button className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>
//                           Reject
//                         </button>
//                       </div>

//                     </div>
//                   </td>

//                 </tr>
//               ))}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   )
// }

// export default ViewApplications

import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ViewApplications = () => {
  const { companyToken, BACKEND_URL } = useContext(AppContext)
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/applicants`, {
        headers: { token: companyToken }
      })
      const data = await res.json()
      if (data.success) setApplications(data.applications)
      else toast.error(data.message)
    } catch (error) {
      toast.error('Failed to fetch applicants')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (applicationId, status) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/change-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token: companyToken },
        body: JSON.stringify({ applicationId, status }),
      })
      const data = await res.json()
      if (data.success) {
        setApplications(prev => prev.map(app => app._id === applicationId ? { ...app, status } : app))
        toast.success(`Application ${status.toLowerCase()}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  useEffect(() => { if (companyToken) fetchApplicants() }, [companyToken])

  if (isLoading) return <div className='p-8 text-gray-500'>Loading applications...</div>

  return (
    <div className='container mx-auto p-4'>
      {applications.length === 0 ? (
        <div className='text-center py-16 text-gray-500'><p className='text-lg'>No applications received yet.</p></div>
      ) : (
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User Name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                <td className='py-2 px-4 border-b flex items-center gap-2'>
                  <img className='w-10 h-10 rounded-full max-sm:hidden object-cover' src={app.userId?.image || assets.profile_img} alt='' />
                  <span>{app.userId?.name || 'Unknown'}</span>
                </td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{app.jobId?.title || 'N/A'}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{app.jobId?.location || 'N/A'}</td>
                <td className='py-2 px-4 border-b'>
                  {app.resume ? (
                    <a href={app.resume} target='_blank' rel='noopener noreferrer'
                      className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'>
                      Resume <img src={assets.resume_download_icon} alt='' />
                    </a>
                  ) : <span className='text-gray-400 text-sm'>No resume</span>}
                </td>
                <td className='py-2 px-4 border-b relative'>
                  {app.status === 'Pending' ? (
                    <div className='relative inline-block text-left group'>
                      <button className='text-gray-500 font-bold px-2'>...</button>
                      <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                        <button onClick={() => handleStatusChange(app._id, 'Accepted')} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                        <button onClick={() => handleStatusChange(app._id, 'Rejected')} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                      </div>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded text-sm font-medium ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {app.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
export default ViewApplications