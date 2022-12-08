const { StatusCodes} =require('http-status-codes')
const User = require('../model/userModel')

const userAuth = async(req,res,next)=>{
    try {
        // res.json({adminAuth :req.user})
        const id = req.user.id 

        const extUser = await User.findById({_id:id})
        // res.json({adminAuth :extUser})

        //validation role

        if(extUser.role === "superadmin" )
             return  res.status(StatusCodes.BAD_REQUEST).json({msg:"Update restricted for Admin.."})
             next();

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
}

module.exports = userAuth;