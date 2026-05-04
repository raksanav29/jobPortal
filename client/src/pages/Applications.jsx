
// import React, { useState } from 'react'
// import Navbar from '../components/Navbar'
// import { assets, jobsApplied } from '../assets/assets'
// import moment from 'moment'
// import Footer from '../components/Footer'

// const Applications = () => {

//   const [isEdit, setIsEdit] = useState(false)
//   const [resume, setResume] = useState(null)

//   return (
//     <>
//       <Navbar />

//       <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

//         <h2 className='text-xl font-semibold'>Your Resume</h2>

//         <div className='flex gap-2 mb-6 mt-3'>
//           {isEdit ? (
//             <>
//               <label className='flex items-center' htmlFor='resumeUpload'>
//                 <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
//                   Select Resume
//                 </p>

//                 <input
//                   id='resumeUpload'
//                   type="file"
//                   accept='application/pdf'
//                   className="hidden"
//                   onChange={e => setResume(e.target.files[0])}
//                 />

//                 <img src={assets.profile_upload_icon} alt="" />
//               </label>

//               <button
//                 onClick={() => setIsEdit(false)}
//                 className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'
//               >
//                 Save
//               </button>
//             </>
//           ) : (
//             <div className='flex gap-2'>
//               <a className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href="">
//                 Resume
//               </a>

//               <button
//                 onClick={() => setIsEdit(true)}
//                 className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
//               >
//                 Edit
//               </button>
//             </div>
//           )}
//         </div>

//         <h2 className='text-xl font-semibold mb-4'>Job Applied</h2>

//         <table className='min-w-full bg-white border rounded-lg'>
//           <thead>
//             <tr>
//               <th className='py-3 px-4 border-b text-left'>Company</th>
//               <th className='py-3 px-4 border-b text-left'>Job Title</th>
//               <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
//               <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
//               <th className='py-3 px-4 border-b text-left'>Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {Array.isArray(jobsApplied) &&
//               jobsApplied.map((job, index) => (
//                 <tr key={index}>
//                   <td className='py-3 px-4 flex items-center gap-2 border-b'>
//                     <img className='w-8 h-8' src={job.logo || assets.profile_upload_icon} alt="" />
//                     {job.company}
//                   </td>

//                   <td className='py-2 px-4 border-b'>{job.title}</td>

//                   <td className='py-2 px-4 border-b max-sm:hidden'>
//                     {job.location}
//                   </td>

//                   <td className='py-2 px-4 border-b max-sm:hidden'>
//                     {job.date ? moment(job.date).format('ll') : "N/A"}
//                   </td>

//                   <td className='py-2 px-4 border-b'>
//                     <span
//                       className={`${
//                         job.status?.toLowerCase() === 'accepted'
//                           ? 'bg-green-100'
//                           : job.status?.toLowerCase() === 'rejected'
//                           ? 'bg-red-100'
//                           : 'bg-blue-100'
//                       } px-4 py-1.5 rounded`}
//                     >
//                       {job.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>

//       </div>

//       <Footer />
//     </>
//   )
// }

// export default Applications

import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    userData,
    fetchUserData,
    userApplications,
    fetchUserApplications,
    getToken,
    BACKEND_URL,
  } = useContext(AppContext)

  // Upload resume
  const handleResumeUpload = async () => {
    if (!resume) {
      toast.error('Please select a PDF file')
      return
    }

    setIsUploading(true)

    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('resume', resume)

      const res = await fetch(`${BACKEND_URL}/api/users/update-resume`, {
        method: 'POST',
        headers: { token },
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Resume uploaded successfully!')
        await fetchUserData()
        setIsEdit(false)
        setResume(null)
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (error) {
      toast.error('Server error. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    fetchUserApplications()
  }, [])

  return (
    <>
      <Navbar />

      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>

        {/* Resume Section */}
        <h2 className='text-xl font-semibold'>Your Resume</h2>

        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit ? (
            <>
              <label className='flex items-center' htmlFor='resumeUpload'>
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 cursor-pointer'>
                  {resume ? resume.name : 'Select Resume (PDF)'}
                </p>

                <input
                  id='resumeUpload'
                  type='file'
                  accept='application/pdf'
                  className='hidden'
                  onChange={(e) => setResume(e.target.files[0])}
                />

                <img src={assets.profile_upload_icon} alt='' />
              </label>

              <button
                onClick={handleResumeUpload}
                disabled={isUploading}
                className='bg-green-100 border border-green-400 rounded-lg px-4 py-2 disabled:opacity-60'
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </button>

              <button
                onClick={() => {
                  setIsEdit(false)
                  setResume(null)
                }}
                className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
              >
                Cancel
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              
              {/* ✅ FIXED PART */}
              {userData?.resume ? (
                <a
                  className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'
                  href={userData.resume}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Resume
                </a>
              ) : (
                <span className='text-gray-400 px-4 py-2'>
                  No resume uploaded
                </span>
              )}

              <button
                onClick={() => setIsEdit(true)}
                className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
              >
                {userData?.resume ? 'Update' : 'Upload'}
              </button>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>

        {userApplications.length === 0 ? (
          <div className='text-center py-16 text-gray-500'>
            <p>You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <table className='min-w-full bg-white border rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b text-left'>Company</th>
                <th className='py-3 px-4 border-b text-left'>Job Title</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b text-left'>Status</th>
              </tr>
            </thead>

            <tbody>
              {userApplications.map((app, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b'>
                    <img
                      className='w-8 h-8 rounded object-cover'
                      src={app.jobId?.companyId?.image || assets.company_icon}
                      alt=''
                    />
                    {app.jobId?.companyId?.name || 'Company'}
                  </td>

                  <td className='py-2 px-4 border-b'>
                    {app.jobId?.title || 'N/A'}
                  </td>

                  <td className='py-2 px-4 border-b max-sm:hidden'>
                    {app.jobId?.location || 'N/A'}
                  </td>

                  <td className='py-2 px-4 border-b max-sm:hidden'>
                    {app.date ? moment(app.date).format('ll') : 'N/A'}
                  </td>

                  <td className='py-2 px-4 border-b'>
                    <span
                      className={`px-4 py-1.5 rounded text-sm font-medium ${
                        app.status === 'Accepted'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </>
  )
}

export default Applications