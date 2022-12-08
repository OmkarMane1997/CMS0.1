const{ StatusCodes } = require('http-status-codes')

const User = require('../model/userModel')

const userController ={
    getAll: async (req,res)=>{
        try {

            const users = await User.find({}).select('-password')

            const filteredUser = users.filter((item)=> item.role !== "superadmin")

            res.json({users:filteredUser , length: filteredUser.length})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    getCurrentUser: async (req,res)=>{
        try {

            const id = req.user.id

            const user = await User.findById({_id: id})
            res.json({ user})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    updateUser: async (req,res)=>{
        try {

            const {name,mobile,image,email}= req.body

            await User.findByIdAndUpdate({_id: req.user.id} , {name,mobile,image,email})
            res.status(StatusCodes.OK).json({msg:"User data Update Successfully"})

            // res.json({msg:'update user info'})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    deleteUser: async (req,res)=>{
        try {

             const id = req.params.id
             await User.findByIdAndDelete({_id:id})
            res.json({msg:'User data deleted successfully'})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },
    changeRole: async (req,res)=>{
        try {
            const id = req.params.id
                 const {role} = req.body;
                 await User.findByIdAndUpdate({_id:id},{role})

            res.json({msg:'Role Update successFully'})
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
        }
    },

    
}

module.exports = userController;