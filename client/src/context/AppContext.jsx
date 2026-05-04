// import { createContext, useEffect, useState } from 'react'
// import { jobsData } from '../assets/assets'   

// export const AppContext = createContext()

// export const AppContextProvider = (props) => {
//   const [searchFilter, setSearchFilter] = useState({
//     title: '',
//     location: '',
//   })

//   const [isSearched, setIsSearched] = useState(false)

// const[jobs, setJobs] = useState([])

// const[showRecruiterLogin ,setShowRecruiterLogin] = useState(false)

// //function to fetch job data
// const fetchJobs = async() =>
// {
// setJobs(jobsData)
// }
// useEffect (()=>{
//   fetchJobs()
// },[])


//   const value = {
//     searchFilter,
//     setSearchFilter,
//     isSearched,
//     setIsSearched,
//     jobs,
//     setJobs,
//     showRecruiterLogin ,
//     setShowRecruiterLogin
//   }

//   return (
//     <AppContext.Provider value={value}>
//       {props.children}
//     </AppContext.Provider>
//   )
// }

import { createContext, useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/react'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export const AppContextProvider = (props) => {

  const { user } = useUser()
  const { getToken } = useAuth()

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
  const [searchFilter, setSearchFilter] = useState({ title: '', location: '' })
  const [isSearched, setIsSearched] = useState(false)

  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem('companyToken') || null
  )
  const [companyData, setCompanyData] = useState(null)

  const [userData, setUserData] = useState(null)
  const [userApplications, setUserApplications] = useState([])

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/jobs`)
      const data = await res.json()
      if (data.success) {
        setJobs(data.jobs)
      } else {
        toast.error('Failed to load jobs')
      }
    } catch (error) {
      toast.error('Error connecting to server')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCompanyData = useCallback(async () => {
    if (!companyToken) return
    try {
      const res = await fetch(`${BACKEND_URL}/api/company/company`, {
        headers: { token: companyToken }
      })
      const data = await res.json()
      if (data.success) {
        setCompanyData(data.company)
      } else {
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
      }
    } catch (error) {
      console.error('fetchCompanyData error:', error)
    }
  }, [companyToken])

  const fetchUserData = useCallback(async () => {
    if (!user) return
    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/users/user`, {
        headers: { token }
      })
      const data = await res.json()
      if (data.success) setUserData(data.user)
    } catch (error) {
      console.error('fetchUserData error:', error)
    }
  }, [user, getToken])

  const fetchUserApplications = useCallback(async () => {
    if (!user) return
    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/users/applications`, {
        headers: { token }
      })
      const data = await res.json()
      if (data.success) setUserApplications(data.applications)
    } catch (error) {
      console.error('fetchUserApplications error:', error)
    }
  }, [user, getToken])

  const logoutCompany = () => {
    setCompanyToken(null)
    setCompanyData(null)
    localStorage.removeItem('companyToken')
    toast.success('Logged out successfully')
  }

  useEffect(() => { fetchJobs() }, [fetchJobs])

  useEffect(() => {
    if (companyToken) {
      localStorage.setItem('companyToken', companyToken)
      fetchCompanyData()
    }
  }, [companyToken, fetchCompanyData])

  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchUserApplications()
    }
  }, [user, fetchUserData, fetchUserApplications])

  const value = {
    BACKEND_URL,
    searchFilter, setSearchFilter,
    isSearched, setIsSearched,
    jobs, setJobs,
    isLoading,
    fetchJobs,
    showRecruiterLogin, setShowRecruiterLogin,
    companyToken, setCompanyToken,
    companyData, setCompanyData,
    fetchCompanyData,
    logoutCompany,
    userData, setUserData,
    fetchUserData,
    userApplications, setUserApplications,
    fetchUserApplications,
    getToken,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}