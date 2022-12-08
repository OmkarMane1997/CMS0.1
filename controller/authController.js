const { StatusCodes} = require('http-status-codes')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const { createAccessToken } = require('../util/token')
const jwt = require('jsonwebtoken')

const regTemplate = require('../template/regTemplate')
const sendMail = require('../middleware/mail')


const authController={
    register: async (req,res)=>{
        try {

            const {name,email,mobile,password} = req.body;
            const encPassword = await bcrypt.hash(password,10);
            const newUser = await User.create({
                name,
                email,
                mobile,
                password:encPassword
            })
                      const template = regTemplate(name,email)

                      const subject = `Confirmation of registration wit CSM-v1.0`;
                      await sendMail(email,subject,template)


            // res.json({,   data:newUser})
            res.status(StatusCodes.OK).json({msg:"User Registered Successfully" ,data:newUser})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    login: async (req,res)=>{
        try {
            const {email,password}= req.body;

            // user email exist or not
            const extUser = await User.findOne({email})
            if(!extUser)
              return res.status(StatusCodes.NOT_FOUND).json({msg: "user doesn't exists.."})

                    //   compare the  password

                    const isMatch = await bcrypt.compare(password ,extUser.password)
                      if(!isMatch)
                           return res.status(StatusCodes.BAD_REQUEST).json({msg:"password aren't match."})

                           // generate token 
               const accessToken = createAccessToken({_id: extUser._id})

            //     save token in cookies

            // refreshToken=> is the cookie name 

            res.cookie('refreshToken', accessToken ,{
                httpOnly : true,
                signed: true,
                path : '/api/v1/auth/refreshToken',
                maxAge: 1 * 2 * 60 * 60 * 1000

            })





            res.json({msg:"Login successful" , accessToken})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    logout: async (req,res)=>{
        try {

            res.clearCookie('refreshToken',{path:'/api/v1/auth/refreshToken'})

            res.json({msg:'logout successful'})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    refreshToken: async (req,res)=>{
        try {
            const rf = req.signedCookies.refreshToken;
            if(!rf)   
                return res.status(StatusCodes.BAD_REQUEST).json({msg: "Session Expired , Login Again.."})
           

            jwt.verify(rf,process.env.TOKEN_SECRET,(err,user)=>{
              if(err)
              return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid access token.. Login again"})

              // valid token
              const accessToken = createAccessToken({id:user._id})
              res.json({accessToken})
            })
            // res.json({ rf})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    resetPassword: async (req,res)=>{
        try {
            // res.json({msg:'resetPassword'})
             const id = req.user.id;
               const {oldPassword , newPassword} = req.body

               // read user data

               const extUser = await User.findById({_id:id})
                  if(!extUser)
                      return res.status(StatusCodes.NOT_FOUND).json({msg:"User doesn't exists."})

            // compare password
            const isMatch = await bcrypt.compare(oldPassword ,extUser.password)
            if(!isMatch)
                 return res.status(StatusCodes.BAD_REQUEST).json({msg:"Old password aren't match."})

               const passwordHash = await bcrypt.hash(newPassword,10)
               //update logic
               const output=  await User.findByIdAndUpdate({_id:id},{password:passwordHash })
               //output response

               res.json({msg: "user Password rest success",output})

      

            // res.json({passwordHash})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
}

module.exports= authController;