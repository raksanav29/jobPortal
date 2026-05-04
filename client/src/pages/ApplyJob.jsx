// import React, { useContext, useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'
// import Loading from '../components/Loading'
// import Navbar from '../components/Navbar'
// import { assets } from '../assets/assets'
// import kconvert from 'k-convert';
// import moment from 'moment'
// import JobCard from '../components/JobCard'
// import Footer from '../components/Footer'

// const ApplyJob = () => {

// const {id} = useParams()

// const[JobData,setJobData] = useState()
// const { jobs } = useContext(AppContext)

// const fetchJob = async ()=> {
//      const data = jobs.filter(job => job._id === id )
//      if(data.length !== 0)
//      {
//       setJobData(data[0])
//       console.log(data[0])
//      }
// }

// useEffect(()=>{
//   if(jobs.length > 0){
//     fetchJob()
//   }
// },[id,jobs])

//   return JobData ?(
//     <>
//      <Navbar />
//      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
//       <div className='bg-white text-black rounded-lg w-full'>
//         <div className='flex justify-centre md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
//           <div className='flex flex-col md:flex-row items-center '>
//             <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={JobData.companyId.image} alt="" />
//             <div className='text-center md:text-left text-neutral-700'>
//               <h1 className='text-2xl sm:text-4xl font-medium'>
//                 {JobData.title}
//               </h1>
//               <div className='flex flex-row flex-wrap max-md:justify_center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
//                 <span className='flex items-center gap-1'>
//                   <img src={assets.suitcase_icon} alt="" />
//                   {JobData.companyId.name}
//                 </span>
//                 <span className='flex items-center gap-1'>
//                   <img src={assets.location_icon} alt="" />
//                   {JobData.location_icon}
//                 </span>
//                 <span className='flex items-center gap-1'>
//                   <img src={assets.person_icon} alt="" />
//                   {JobData.level}
//                 </span>
//                 <span className='flex items-center gap-1'>
//                   <img src={assets.money_icon} alt="" />
//                   CTC: {kconvert.convertTo(JobData.salary)}
//                 </span>
//               </div>
//             </div>
//           </div>
//            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center '>
//             <button className='bg-blue-600 p-2.5 px-10 text-white rounded '>Apply Now</button>
//             <p className='mt-1 text-gray-600'>
//               Posted {moment(JobData.date).fromNow()}
//             </p>
//            </div>
//         </div>

//         <div className='flex flex-col lg:flex-row justify-between items-start'>
//           <div className='w-full lg:w-2/3'>
//            <h2 className='font-bold text-2xl mb-4'>Job Description</h2>

// <div>
//   {JobData?.description && (
//     <div className='rich-text' dangerouslySetInnerHTML={{ __html: JobData.description }} />
//   )}
// </div>

// <button className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10'>
//   Apply Now
// </button>
//           </div>

//     {/* right section more jobs */}   
//    <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
//   <h2>
//     More Jobs From {JobData?.companyId?.name || "Company"}
//   </h2>

//   {Array.isArray(jobs) &&
//     jobs
//       .filter(
//         job =>
//           job?._id !== JobData?._id &&
//           job?.companyId?._id === JobData?.companyId?._id
//       )
//       .slice(0, 4)
//       .map((job) => (
//         <JobCard key={job._id} job={job} />
//       ))}
// </div>
//         </div>
//       </div>
//      </div>
//      <Footer />
//     </>
//   ) :
// (
//   <Loading />
// )
// }

// export default ApplyJob

import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import { useUser } from '@clerk/react'

const ApplyJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const [jobData, setJobData] = useState(null)
  const [isApplied, setIsApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const {
    jobs,
    userApplications,
    fetchUserApplications,
    userData,
    getToken,
    BACKEND_URL,
  } = useContext(AppContext)

  // Find this job from context
  useEffect(() => {
    if (jobs.length > 0) {
      const found = jobs.find(job => job._id === id)
      if (found) setJobData(found)
    }
  }, [id, jobs])

  // Check if already applied
  useEffect(() => {
    if (userApplications.length > 0) {
      const alreadyApplied = userApplications.some(
        app => app.jobId?._id === id || app.jobId === id
      )
      setIsApplied(alreadyApplied)
    }
  }, [userApplications, id])

  const handleApply = async () => {
    // Must be logged in
    if (!user) {
      toast.error('Please log in to apply for jobs')
      return
    }

    // Must have a resume
    if (!userData?.resume) {
      toast.error('Please upload your resume first in the Applications page')
      navigate('/applications')
      return
    }

    if (isApplied) {
      toast.info('You have already applied for this job')
      return
    }

    setIsApplying(true)
    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/users/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify({ jobId: id }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Application submitted successfully! 🎉')
        setIsApplied(true)
        await fetchUserApplications()  // refresh applications list
      } else {
        toast.error(data.message || 'Application failed')
      }
    } catch (error) {
      toast.error('Server error. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  if (!jobData) return <Loading />

  return (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>

          {/* Job header */}
          <div className='flex justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img
                className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border'
                src={jobData.companyId?.image}
                alt=''
              />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{jobData.title}</h1>
                <div className='flex flex-row flex-wrap gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt='' />
                    {jobData.companyId?.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt='' />
                    {jobData.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt='' />
                    {jobData.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt='' />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button
                onClick={handleApply}
                disabled={isApplied || isApplying}
                className={`p-2.5 px-10 text-white rounded transition-colors ${
                  isApplied
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-70`}
              >
                {isApplying ? 'Applying...' : isApplied ? 'Applied ✓' : 'Apply Now'}
              </button>
              <p className='mt-1 text-gray-600'>
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            {/* Job description */}
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
              {jobData?.description && (
                <div
                  className='rich-text'
                  dangerouslySetInnerHTML={{ __html: jobData.description }}
                />
              )}
              <button
                onClick={handleApply}
                disabled={isApplied || isApplying}
                className={`p-2.5 px-10 text-white rounded mt-10 transition-colors ${
                  isApplied
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-70`}
              >
                {isApplying ? 'Applying...' : isApplied ? 'Applied ✓' : 'Apply Now'}
              </button>
            </div>

            {/* More jobs from same company */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2 className='font-bold text-lg'>
                More Jobs From {jobData?.companyId?.name || 'Company'}
              </h2>
              {jobs
                .filter(job =>
                  job._id !== jobData._id &&
                  job.companyId?._id === jobData.companyId?._id
                )
                .slice(0, 4)
                .map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default ApplyJob