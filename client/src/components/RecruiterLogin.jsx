// // import React, { useState , useEffect , useContext} from 'react'
// // import { assets } from '../assets/assets'   // ✅ FIX
// // import { AppContext } from '../context/AppContext'

// // const RecruiterLogin = () => {

// //   const [state, setState] = useState('Login')
// //   const [name, setName] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [email, setEmail] = useState('')
// //   const [image, setImage] = useState(false)
// //   const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

// //   const{setShowRecruiterLogin} = useContext(AppContext)

// //   const onSubmitHandler = async  (e) =>{
// //     e.preventDefault()

// //     if(state === "Sign Up" && !isTextDataSubmited ){
// //       setIsTextDataSubmited(true)
// //     }
// //   }

// //   useEffect(()=> {
// //         document.body.style.overflow = 'hidden'
// //         return () => {
// //               document.body.style.overflow = 'unset'
// //         }
// //   },[])

// //   return (
// //     <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'> {/* ✅ FIX */}
      
// //       <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
        
// //         <h1 className='text-center text-2xl text-neutral-700 font-medium'>
// //           Recruiter {state}
// //         </h1>

// //         <p className='text-sm'>
// //           Welcome back! Please sign in to continue
// //         </p>

// //         {state === "Sign Up" && isTextDataSubmited 
// //         ? (<>
        
// //         <div className='flex items-center gap-4 my-10'>
// //           <label htmlFor="image">
// //             <img className='w-16 rounded-full'  src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
// //             <input onChange={e=> setImage(e.target.files[0])} type="file" id="image" hidden />
// //           </label>
// //           <p>Upload Company <br/> logo </p>
// //         </div>
        
// //         </> 
// //   )
// //         :( <>
// //             {state !== 'Login' && (
// //               <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
// //                 <img src={assets.person_icon} alt="" />
// //                 <input
// //                   className='outline-none text-sm'
// //                   onChange={e => setName(e.target.value)}
// //                   value={name}
// //                   type="text"
// //                   placeholder='Company Name'
// //                   required
// //                 />
// //               </div>
// //             )}

// //             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
// //               <img src={assets.email_icon} alt="" />
// //               <input
// //                 className='outline-none text-sm'
// //                 onChange={e => setEmail(e.target.value)}
// //                 value={email}
// //                 type="email"
// //                 placeholder='Email Id'
// //                 required
// //               />
// //             </div>

// //             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
// //               <img src={assets.lock_icon} alt="" />
// //               <input
// //                 className='outline-none text-sm'
// //                 onChange={e => setPassword(e.target.value)}
// //                 value={password}
// //                 type="password"
// //                 placeholder='Password'
// //                 required
// //               />
// //             </div>
// //           </>
// //         ) 
// //         }

// //         {state === "Login" && <p className='text-sm text-blue-600 my-4 cursor-pointer'>
// //           Forgot Password?
// //         </p> } 

// //         <button type="submit" className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>
// //           {state === 'Login' ? 'login' : isTextDataSubmited ? 'create account' : 'next'}
// //         </button>

// //         {state === 'Login' ? (
// //           <p className='mt-5 text-center'>
// //             Don’t have an account
// //             <span
// //               className='text-blue-600 cursor-pointer'
// //               onClick={() => setState("Sign Up")}  // ✅ FIX
// //             >
// //               Sign Up
// //             </span>
// //           </p>
// //         ) : (
// //           <p className='mt-5 text-center'>
// //             Already have an account?
// //             <span
// //               className='text-blue-600 cursor-pointer'
// //               onClick={() => setState("Login")}
// //             >
// //               Login
// //             </span>
// //           </p>
// //         )}
// //          <img onClick={e => setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />
// //       </form>
// //     </div>
// //   )
// // }
// // export default RecruiterLogin
// import React, { useState, useEffect, useContext } from 'react'
// import { assets } from '../assets/assets'
// import { AppContext } from '../context/AppContext'

// const RecruiterLogin = () => {

//   const [state, setState] = useState('Login')
//   const [name, setName] = useState('')
//   const [password, setPassword] = useState('')
//   const [email, setEmail] = useState('')
//   const [image, setImage] = useState(null)
//   const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

//   const { setShowRecruiterLogin } = useContext(AppContext)

//   // 🔥 FIXED SUBMIT HANDLER
//   const onSubmitHandler = async (e) => {
//     e.preventDefault()

//     // Step 1 → go to image upload step
//     if (state === "Sign Up" && !isTextDataSubmited) {
//       setIsTextDataSubmited(true)
//       return
//     }

//     // Step 2 → final submit with image
//     if (state === "Sign Up" && isTextDataSubmited) {

//       const formData = new FormData()

//       formData.append("name", name)
//       formData.append("email", email)
//       formData.append("password", password)

//       // 🔥 IMPORTANT: must match backend → upload.single("file")
//       formData.append("file", image)

//       try {
//         const res = await fetch("http://localhost:5000/api/company/register", {
//           method: "POST",
//           body: formData
//         })

//         const data = await res.json()
//         console.log("SUCCESS:", data)

//         // close popup after success
//         setShowRecruiterLogin(false)

//       } catch (error) {
//         console.log("ERROR:", error)
//       }
//     }
//   }

//   useEffect(() => {
//     document.body.style.overflow = 'hidden'
//     return () => {
//       document.body.style.overflow = 'unset'
//     }
//   }, [])

//   return (
//     <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>

//       <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>

//         <h1 className='text-center text-2xl text-neutral-700 font-medium'>
//           Recruiter {state}
//         </h1>

//         <p className='text-sm'>
//           Welcome back! Please sign in to continue
//         </p>

//         {/* 🔥 IMAGE STEP */}
//         {state === "Sign Up" && isTextDataSubmited ? (
//           <>
//             <div className='flex items-center gap-4 my-10'>
//               <label htmlFor="image">
//                 <img
//                   className='w-16 rounded-full cursor-pointer'
//                   src={image ? URL.createObjectURL(image) : assets.upload_area}
//                   alt=""
//                 />
//                 <input
//                   onChange={e => {
//                     const file = e.target.files[0]
//                     console.log("FILE:", file) // ✅ debug
//                     setImage(file)
//                   }}
//                   type="file"
//                   id="image"
//                   hidden
//                   required
//                 />
//               </label>
//               <p>Upload Company <br /> logo</p>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* COMPANY NAME */}
//             {state !== 'Login' && (
//               <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
//                 <img src={assets.person_icon} alt="" />
//                 <input
//                   className='outline-none text-sm'
//                   onChange={e => setName(e.target.value)}
//                   value={name}
//                   type="text"
//                   placeholder='Company Name'
//                   required
//                 />
//               </div>
//             )}

//             {/* EMAIL */}
//             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
//               <img src={assets.email_icon} alt="" />
//               <input
//                 className='outline-none text-sm'
//                 onChange={e => setEmail(e.target.value)}
//                 value={email}
//                 type="email"
//                 placeholder='Email Id'
//                 required
//               />
//             </div>

//             {/* PASSWORD */}
//             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
//               <img src={assets.lock_icon} alt="" />
//               <input
//                 className='outline-none text-sm'
//                 onChange={e => setPassword(e.target.value)}
//                 value={password}
//                 type="password"
//                 placeholder='Password'
//                 required
//               />
//             </div>
//           </>
//         )}

//         {/* BUTTON */}
//         <button type="submit" className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>
//           {state === 'Login'
//             ? 'Login'
//             : isTextDataSubmited
//               ? 'Create Account'
//               : 'Next'}
//         </button>

//         {/* SWITCH */}
//         {state === 'Login' ? (
//           <p className='mt-5 text-center'>
//             Don’t have an account?
//             <span
//               className='text-blue-600 cursor-pointer ml-1'
//               onClick={() => setState("Sign Up")}
//             >
//               Sign Up
//             </span>
//           </p>
//         ) : (
//           <p className='mt-5 text-center'>
//             Already have an account?
//             <span
//               className='text-blue-600 cursor-pointer ml-1'
//               onClick={() => setState("Login")}
//             >
//               Login
//             </span>
//           </p>
//         )}

//         {/* CLOSE BUTTON */}
//         <img
//           onClick={() => setShowRecruiterLogin(false)}
//           className='absolute top-5 right-5 cursor-pointer'
//           src={assets.cross_icon}
//           alt=""
//         />

//       </form>
//     </div>
//   )
// }

// export default RecruiterLogin


import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState(null)
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setShowRecruiterLogin, setCompanyToken, setCompanyData, BACKEND_URL } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (state === 'Sign Up' && !isTextDataSubmited) {
      setIsTextDataSubmited(true)
      return
    }
    setIsSubmitting(true)
    try {
      if (state === 'Login') {
        const res = await fetch(`${BACKEND_URL}/api/company/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (data.success) {
          setCompanyToken(data.token)
          setCompanyData(data.company)
          setShowRecruiterLogin(false)
          toast.success(`Welcome back, ${data.company.name}!`)
        } else {
          toast.error(data.message || 'Login failed')
        }
      } else {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        if (image) formData.append('file', image)
        const res = await fetch(`${BACKEND_URL}/api/company/register`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          setCompanyToken(data.token)
          setCompanyData(data.company)
          setShowRecruiterLogin(false)
          toast.success(`Welcome, ${data.company.name}!`)
        } else {
          toast.error(data.message || 'Registration failed')
        }
      }
    } catch (error) {
      toast.error('Server error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
        <p className='text-sm'>Welcome back! Please sign in to continue</p>

        {state === 'Sign Up' && isTextDataSubmited ? (
          <div className='flex items-center gap-4 my-10'>
            <label htmlFor='image' className='cursor-pointer'>
              <img className='w-16 h-16 rounded-full object-cover'
                src={image ? URL.createObjectURL(image) : assets.upload_area} alt='' />
              <input onChange={e => setImage(e.target.files[0])} type='file' id='image' hidden accept='image/*' />
            </label>
            <p>Upload Company <br /> Logo</p>
          </div>
        ) : (
          <>
            {state !== 'Login' && (
              <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.person_icon} alt='' />
                <input className='outline-none text-sm' onChange={e => setName(e.target.value)}
                  value={name} type='text' placeholder='Company Name' required />
              </div>
            )}
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.email_icon} alt='' />
              <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)}
                value={email} type='email' placeholder='Email Id' required />
            </div>
            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.lock_icon} alt='' />
              <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)}
                value={password} type='password' placeholder='Password' required />
            </div>
          </>
        )}

        <button type='submit' disabled={isSubmitting}
          className='bg-blue-600 w-full text-white py-2 rounded-full mt-4 disabled:opacity-60'>
          {isSubmitting ? 'Please wait...' : state === 'Login' ? 'Login' : isTextDataSubmited ? 'Create Account' : 'Next'}
        </button>

        {state === 'Login' ? (
          <p className='mt-5 text-center'>Don't have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign Up')}>Sign Up</span>
          </p>
        ) : (
          <p className='mt-5 text-center'>Already have an account?{' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}>Login</span>
          </p>
        )}
        <img onClick={() => setShowRecruiterLogin(false)}
          className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt='close' />
      </form>
    </div>
  )
}
export default RecruiterLogin