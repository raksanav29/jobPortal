// import Company from "../models/Company.js";
// import bcrypt from 'bcrypt'
// import { v2 as cloudinary }  from 'cloudinary'
// import generateToken from "../utils/generateToken.js";
// import { registerCompany } from '../controllers/companyController.js'


// //register a new company
// const registerCompany = async(req,res) => {

//    const {name , email ,password} = req.body
//    const imageFile = req.file;

//    if(!name || !email || !password || !imageFile){
//     return res.json({success:false , message: "missing details"})

//     try{
//         const companyExists = await Company.findOne({email})

//         if(companyExists)
//         {
//            return res.json({success:false, message:'company already registered'}) 
//         }

//         const salt = await bcrypt.genSalt(10)
//         const hashPassword = await bcrypt.hash(password, salt)
        
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)

//         const company = await Company.create({
//          name,
//          email,
//          password:hashPassword,
//          image:imageUpload.secure_url
//         })

//         res.json({
//          success:true,
//          company: {
//             _id: company._id,
//             name : company.name,
//             email:company.email,
//             image:company.image
//          },
//          token : generateToken(company._id)

//         })

//     }
//     catch(error)
//     {
//         res.json({success:false , message : error.message})
//    }

//    }

// }

// // company login
// export const loginCompany = async () => {

// }

// //get company data
// export const getCompanyData = async() =>{

// }

// // post a new job
// export const postJob = async (req,res) => {

// }

// export const getCompanyJobApplicants = async (req,res) => {

// }

// //get company posted jobs

// export const getCompanyPostedJobs = async (req,res) =>
// {

// }

// //change job application status
// export const ChangeJobApplicationStatus = async (req,res) =>
// {

// }

// // change job visibility
// export const changeVisibility = async (req,res) =>
// {

// }

import Company from "../models/Company.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";

// ✅ register a new company
export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageFile = req.file;


    if (!name || !email || !password || !imageFile) {
      return res.json({ success: false, message: "Missing details" });
    }

    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({ success: false, message: "Company already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

   const imageUpload = await cloudinary.uploader.upload(imageFile.path.replace(/\\/g, '/'));
//    const imageUpload = await new Promise((resolve, reject) => {
//   cloudinary.uploader.upload_stream(
//     { resource_type: "image" },
//     (error, result) => {
//       if (error) reject(error);
//       else resolve(result);
//     }
//   ).end(imageFile.buffer);  // ← use .buffer not .path
// });



    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {








 console.log("FULL ERROR:", JSON.stringify(error, null, 2))









    res.json({ success: false, message: error.message });
  }
};


// company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (company && await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image
        },
        token: generateToken(company._id)
      });
    } else {
      res.json({ success: false, message: 'invalid email or password' });
    }

  } catch (error) {   // ✅ now correct
    res.json({ success: false, message: error.message });
  }
};


// get company data
export const getCompanyData = async (req, res) => {
  res.json({ message: "company data API" });
};

// post job
export const postJob = async (req, res) => {
  res.json({ message: "post job API" });
};

// applicants
export const getCompanyJobApplicants = async (req, res) => {
  res.json({ message: "applicants API" });
};

// job list
export const getCompanyPostedJobs = async (req, res) => {
  res.json({ message: "jobs list API" });
};

// change status
export const ChangeJobApplicationStatus = async (req, res) => {
  res.json({ message: "status updated" });
};

// change visibility
export const changeVisibility = async (req, res) => {
  res.json({ message: "visibility changed" });
};