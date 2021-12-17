var emailValidator = require('email-validator')
const UserModel = require("../models/userModel")
var jwt = require('jsonwebtoken')


// -------------------------------------------- VALIDATIONS FUNCTIONS------------------------------------------------------
const isValidRequestBody = function (requestBody) {
   return Object.keys(requestBody).length !== 0
}

const isValid = function (value) {
   if (typeof value === 'undefined' || value === null) return false
   if (typeof value === 'string' && value.trim().length === 0) return false
   return true;
}

const isValidTitle = function (title) {
   return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


// const isValidMobileNum = function (value) {
//    if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value))) {
//       return false
//    }
//    return true
// }
const pincodelen = function (value) {
   if (value.length != 6) {
      return false
   }
   return true
}
// ----------------------------------------------------FIRST(CREATE USER) API-------------------------------------------------------


const createUser = async function (req, res) {
   try {
      const requestBody = req.body
      if (!isValidRequestBody(requestBody)) {
         res.status(400).send({ status: false, message: 'value in request body is required' })
         return
      }

      const { title, name, phone, email, password, address } = requestBody


      if (!isValid(name)) {
         res.status(400).send({ status: false, message: 'name is not valid' })
         return
      }

      if (!isValid(phone)) {
         res.status(400).send({ status: false, message: 'phone is not valid' })
         return
      }

      if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone))) {
         res.status(400).send({ status: false, message: `phone is not valid` })
         return
      }


      if (!isValid(title)) {
         res.status(400).send({ status: false, message: 'title is required' })
         return
      }

      if (!isValidTitle(title)) {
         res.status(400).send({ status: false, message: 'title is not valid provid among mr,miss,mrs' })
         return
      }

      if (!isValid(password)) {
         res.status(400).send({ status: false, message: 'password must be casesensitive' })
         return

      }

      if (!isValid(email)) {
         res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
         return
      }

      if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
         res.status(400).send({ status: false, message: `Email should be a valid email address` })
         return
      }

      // if (!isValid(address)) {
      //    res.status(400).send({ status: false, message: 'address is not valid' })
      //    return
      // }
      
      // if (!pincodelen(address.pincode)){
         
      //    res.status(400).send({ status: false, message: 'pincode is not valid' })
      //    return
      // }

      const isEmailPresent = await UserModel.findOne({ email })

      if (isEmailPresent) {
         res.status(403).send({ status: false, message: `user whit this ${email} email Already eaist` })
         return
      }

      const isNumberPresent = await UserModel.findOne({ phone })

      if (isNumberPresent) {
         res.status(403).send({ status: false, message: `user whit this ${phone} phone Number Already eaist` })
         return
      }

      const userData = { title, name, phone, email, password, address }
      let saveduser = await UserModel.create(userData)
      res.status(201).send({ status: true, message: 'user created succesfully', data: saveduser })
   } catch (err) {
      res.status(500).send({ status: false, msg: err.message })
   }
}

// -----------------------------------------------SECOND(LOGIN) API-----------------------------------------------
const login = async function (req, res) {
   try {

      let loginBody = req.body
      let useremail = req.body.email
      let userpassword = req.body.password
      if (!isValidRequestBody(loginBody)) {
         return res.status(400).send({ status: false, msg: 'Invalid body, provide fields' })
      }

      if (!isValid(useremail)) {
         return res.status(400).send({ status: false, msg: "Enter appropiate email" })
      }
      if (!isValid(userpassword)) {
         return res.status(400).send({ status: false, msg: "Enter password" })
      }

      if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(useremail))) {
         res.status(400).send({ status: false, message: `Email should be a valid email address` })
         return
      }

      let email = await UserModel.findOne({email: useremail})
      if(!email){
         res.status(400).send({status: false, message: "incorrect email"})
         return
      }

      let pass = await UserModel.findOne({password: userpassword})
      if(!pass){
         res.status(400).send({ status: false, Msg: "incorrect Password" })
         return
      }

      let User = await UserModel.findOne({ email: useremail, password: userpassword })

      if (User) {
         const Token = jwt.sign({
            userId: User._id,
            iat: Math.floor(Date.now() / 1000),
            expiresIn: '30m'
         }, "secretkey")


         res.header('x-api-key', Token)

         res.status(200).send({ status: true, msg: "success", data: Token })
      } 

   }
   catch (err) {
      res.status(500).send({ status: false, message: err.message })
   }
}

//*export--->
module.exports = { login, createUser }