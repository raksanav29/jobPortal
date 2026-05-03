// update test.mjs with this:
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: 'dqrm4luxk',
  api_key: '356757965592391',
  api_secret: 'eYh9HdwjTWB_FCvZKWmjWibKfLE'
})

const fileBuffer = fs.readFileSync('./uploads/1776079037294-company_icon.png')
const base64 = `data:image/png;base64,${fileBuffer.toString('base64')}`

const result = await cloudinary.uploader.upload(base64, {
  resource_type: "image"
})
console.log("RESULT:", result.secure_url)