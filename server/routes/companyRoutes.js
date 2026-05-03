// import express from 'express'
// import { ChangeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany , postJob, registerCompany} from '../controllers/companyController.js'
// import upload from '../config/multer.js';


// const router = express.Router()

// //register a company
// router.post('/register',upload.single('imageFile') , registerCompany)



// //company login
// router.post('/login', loginCompany)

// //get company data
// router.get('/company',getCompanyData)

// //post a job
// router.post('/post-job',postJob)

// //get applicants data from company
// router.get('/applicants',getCompanyJobApplicants)

// //get company jpb list
// router.get('/list-jobs',getCompanyPostedJobs)

// //change applicants status
// router.post('/change-status',ChangeJobApplicationStatus)

// //change application visibility
// router.post('/change-visibility',changeVisibility)

// export default router


import express from 'express'
import {
  ChangeJobApplicationStatus,
  changeVisibility,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany
} from '../controllers/companyController.js'

import upload from '../config/multer.js';

const router = express.Router()

// ✅ REGISTER (FIXED FIELD NAME)
router.post('/register', upload.single('file'), registerCompany)

//company login
router.post('/login', loginCompany)

//get company data
router.get('/company', getCompanyData)

//post a job
router.post('/post-job', postJob)

//get applicants data from company
router.get('/applicants', getCompanyJobApplicants)

//get company job list
router.get('/list-jobs', getCompanyPostedJobs)

//change applicants status
router.post('/change-status', ChangeJobApplicationStatus)

//change application visibility
router.post('/change-visibility', changeVisibility)

export default router